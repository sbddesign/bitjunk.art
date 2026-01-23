import { supabase } from "./supabase";
import { Order, CreateOrderRequest, OrderItem, ShippingAddress } from "@/types/order";
import { printfulClient } from "./printful";

interface DbOrder {
  id: string;
  user_id: string | null;
  user_email: string | null;
  checkout_id: string;
  printful_order_id: number | null;
  status: string;
  items: OrderItem[];
  shipping: ShippingAddress;
  total_amount: number;
  currency: string;
  printful_status: string | null;
  created_at: string;
  updated_at: string;
}

function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  const orderId = generateOrderId();
  const now = new Date().toISOString();

  const items: OrderItem[] = [
    {
      variantId: data.variantId,
      variantName: data.variantName,
      quantity: 1,
      price: data.price,
      currency: data.currency,
    },
  ];

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      user_id: data.userId || null,
      user_email: data.userEmail || null,
      checkout_id: data.checkoutId,
      status: "pending",
      items: items,
      shipping: data.shipping,
      total_amount: data.price,
      currency: data.currency,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return mapDbOrderToOrder(order as DbOrder);
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select()
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbOrderToOrder(data as DbOrder);
}

export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.status) updateData.status = updates.status;
  if (updates.printfulOrderId) updateData.printful_order_id = updates.printfulOrderId;
  if (updates.printfulStatus) updateData.printful_status = updates.printfulStatus;

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbOrderToOrder(data as DbOrder);
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as DbOrder[]).map(mapDbOrderToOrder);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select()
    .eq("user_email", email)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as DbOrder[]).map(mapDbOrderToOrder);
}

export async function fulfillOrder(orderId: string): Promise<Order | null> {
  const order = await getOrder(orderId);
  if (!order || order.status !== "pending") return null;

  try {
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
  } catch (error) {
    console.error("Failed to create Printful order:", error);
    return null;
  }
}

function mapDbOrderToOrder(dbOrder: DbOrder): Order {
  return {
    id: dbOrder.id,
    userId: dbOrder.user_id || undefined,
    userEmail: dbOrder.user_email || undefined,
    checkoutId: dbOrder.checkout_id,
    printfulOrderId: dbOrder.printful_order_id || undefined,
    status: dbOrder.status as Order["status"],
    items: dbOrder.items,
    shipping: dbOrder.shipping,
    totalAmount: dbOrder.total_amount,
    currency: dbOrder.currency,
    printfulStatus: dbOrder.printful_status || undefined,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
  };
}
