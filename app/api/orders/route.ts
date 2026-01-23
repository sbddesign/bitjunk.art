import { NextResponse } from "next/server";
import { createOrder, fulfillOrder, getOrdersByEmail } from "@/lib/orders";
import { CreateOrderRequest } from "@/types/order";
import { auth0 } from "@/lib/auth0";

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json();

    if (
      !body.checkoutId ||
      !body.variantId ||
      !body.shipping ||
      !body.shipping.email
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await createOrder(body);

    const fulfilledOrder = await fulfillOrder(order.id);

    return NextResponse.json({
      order: fulfilledOrder || order,
      message: fulfilledOrder
        ? "Order created and sent to Printful"
        : "Order created, awaiting fulfillment",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getOrdersByEmail(session.user.email);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
