import {
  PrintfulSyncProduct,
  PrintfulSyncProductWithVariants,
  PrintfulOrderRequest,
  PrintfulOrderResponse,
  NormalizedProduct,
  NormalizedProductDetail,
  NormalizedVariant,
} from "@/types/printful";

const PRINTFUL_API_URL = "https://api.printful.com";

class PrintfulClient {
  private get apiToken(): string {
    const token = process.env.PRINTFUL_API_TOKEN;
    if (!token) {
      throw new Error("PRINTFUL_API_TOKEN is not set");
    }
    return token;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Printful API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.result;
  }

  async getSyncProducts(): Promise<PrintfulSyncProduct[]> {
    return this.fetch<PrintfulSyncProduct[]>("/store/products");
  }

  async getSyncProduct(id: number): Promise<PrintfulSyncProductWithVariants> {
    return this.fetch<PrintfulSyncProductWithVariants>(`/store/products/${id}`);
  }

  async createOrder(
    orderData: PrintfulOrderRequest
  ): Promise<PrintfulOrderResponse> {
    return this.fetch<PrintfulOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: number): Promise<PrintfulOrderResponse> {
    return this.fetch<PrintfulOrderResponse>(`/orders/${id}`);
  }
}

export const printfulClient = new PrintfulClient();

export function normalizeProduct(product: PrintfulSyncProduct): NormalizedProduct {
  return {
    id: product.id,
    externalId: product.external_id,
    name: product.name,
    thumbnailUrl: product.thumbnail_url,
    variantCount: product.variants,
    priceRange: {
      min: 0,
      max: 0,
      currency: "USD",
    },
  };
}

export function normalizeProductWithVariants(
  data: PrintfulSyncProductWithVariants
): NormalizedProductDetail {
  const variants = data.sync_variants.map(normalizeVariant);
  const prices = variants.map((v) => v.price);

  return {
    id: data.sync_product.id,
    externalId: data.sync_product.external_id,
    name: data.sync_product.name,
    thumbnailUrl: data.sync_product.thumbnail_url,
    variantCount: data.sync_variants.length,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
      currency: variants[0]?.currency || "USD",
    },
    variants,
  };
}

export function normalizeVariant(
  variant: PrintfulSyncProductWithVariants["sync_variants"][0]
): NormalizedVariant {
  const sizeOption = variant.options.find((o) => o.id === "size");
  const colorOption = variant.options.find((o) => o.id === "color");

  const imageUrl =
    variant.files.find((f) => f.type === "preview")?.preview_url ||
    variant.product.image;

  return {
    id: variant.id,
    externalId: variant.external_id,
    name: variant.name,
    price: parseFloat(variant.retail_price) * 100,
    currency: variant.currency,
    sku: variant.sku,
    imageUrl,
    options: {
      size: sizeOption?.value,
      color: colorOption?.value,
    },
  };
}

export async function getProducts(): Promise<NormalizedProduct[]> {
  const products = await printfulClient.getSyncProducts();
  return products.map(normalizeProduct);
}

export async function getProduct(
  id: number
): Promise<NormalizedProductDetail | null> {
  try {
    const product = await printfulClient.getSyncProduct(id);
    return normalizeProductWithVariants(product);
  } catch {
    return null;
  }
}
