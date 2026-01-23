export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  stateCode: string;
  countryCode: string;
  zip: string;
}

export interface OrderItem {
  variantId: number;
  variantName: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface Order {
  id: string;
  userId?: string;
  userEmail?: string;
  checkoutId: string;
  printfulOrderId?: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  shipping: ShippingAddress;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  printfulStatus?: string;
}

export interface CreateOrderRequest {
  checkoutId: string;
  variantId: number;
  variantName: string;
  price: number;
  currency: string;
  shipping: ShippingAddress;
  userId?: string;
  userEmail?: string;
}
