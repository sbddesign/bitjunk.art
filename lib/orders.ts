import { kv } from "@vercel/kv";
import { Order, CreateOrderRequest } from "@/types/order";
import { printfulClient } from "./printful";

function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  const orderId = generateOrderId();
  const now = new Date().toISOString();

  const order: Order = {
    id: orderId,
    userId: data.userId,
    userEmail: data.userEmail,
    checkoutId: data.checkoutId,
    status: "pending",
    items: [
      {
        variantId: data.variantId,
        variantName: data.variantName,
        quantity: 1,
        price: data.price,
        currency: data.currency,
      },
    ],
    shipping: data.shipping,
    totalAmount: data.price,
    currency: data.currency,
    createdAt: now,
    updatedAt: now,
  };

  await kv.set(`order:${orderId}`, order);

  if (data.userId) {
    await kv.sadd(`user:${data.userId}:orders`, orderId);
  }
  if (data.userEmail) {
    await kv.sadd(`email:${data.userEmail}:orders`, orderId);
  }

  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  return kv.get<Order>(`order:${orderId}`);
}

export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const order = await getOrder(orderId);
  if (!order) return null;

  const updatedOrder: Order = {
    ...order,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(`order:${orderId}`, updatedOrder);
  return updatedOrder;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const orderIds = await kv.smembers<string[]>(`user:${userId}:orders`);
  if (!orderIds || orderIds.length === 0) return [];

  const orders = await Promise.all(
    orderIds.map((id) => kv.get<Order>(`order:${id}`))
  );

  return orders
    .filter((o): o is Order => o !== null)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const orderIds = await kv.smembers<string[]>(`email:${email}:orders`);
  if (!orderIds || orderIds.length === 0) return [];

  const orders = await Promise.all(
    orderIds.map((id) => kv.get<Order>(`order:${id}`))
  );

  return orders
    .filter((o): o is Order => o !== null)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function fulfillOrder(orderId: string): Promise<Order | null> {
  const order = await getOrder(orderId);
  if (!order || order.status !== "pending") return null;

  const printfulOrder = await printfulClient.createOrder({
    recipient: {
      name: order.shipping.name,
      address1: order.shipping.address1,
      address2: order.shipping.address2,
      city: order.shipping.city,
      state_code: order.shipping.stateCode,
      country_code: order.shipping.countryCode,
      zip: order.shipping.zip,
      phone: order.shipping.phone,
      email: order.shipping.email,
    },
    items: order.items.map((item) => ({
      sync_variant_id: item.variantId,
      quantity: item.quantity,
    })),
    confirm: false,
  });

  return updateOrder(orderId, {
    printfulOrderId: printfulOrder.id,
    printfulStatus: printfulOrder.status,
    status: "processing",
  });
}
