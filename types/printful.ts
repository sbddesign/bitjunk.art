export interface PrintfulFile {
  id: number;
  type: string;
  hash: string;
  url: string | null;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number | null;
  status: string;
  created: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
  is_temporary: boolean;
}

export interface PrintfulProduct {
  variant_id: number;
  product_id: number;
  image: string;
  name: string;
}

export interface PrintfulSyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  main_category_id: number;
  warehouse_product_variant_id: number | null;
  retail_price: string;
  sku: string;
  currency: string;
  is_ignored: boolean;
  product: PrintfulProduct;
  files: PrintfulFile[];
  options: Array<{
    id: string;
    value: string;
  }>;
}

export interface PrintfulSyncProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface PrintfulSyncProductWithVariants {
  sync_product: PrintfulSyncProduct;
  sync_variants: PrintfulSyncVariant[];
}

export interface NormalizedProduct {
  id: number;
  externalId: string;
  name: string;
  thumbnailUrl: string;
  variantCount: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface NormalizedProductDetail extends NormalizedProduct {
  variants: NormalizedVariant[];
}

export interface NormalizedVariant {
  id: number;
  externalId: string;
  name: string;
  price: number;
  currency: string;
  sku: string;
  imageUrl: string;
  options: {
    size?: string;
    color?: string;
  };
}

export interface PrintfulRecipient {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  phone: string;
  email: string;
}

export interface PrintfulOrderItem {
  sync_variant_id: number;
  quantity: number;
}

export interface PrintfulOrderRequest {
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  confirm?: boolean;
}

export interface PrintfulOrderResponse {
  id: number;
  external_id: string | null;
  store: number;
  status: string;
  shipping: string;
  shipping_service_name: string;
  created: number;
  updated: number;
  recipient: PrintfulRecipient;
  items: Array<{
    id: number;
    external_id: string | null;
    variant_id: number;
    sync_variant_id: number;
    external_variant_id: string;
    warehouse_product_variant_id: number | null;
    product_template_id: number | null;
    quantity: number;
    price: string;
    retail_price: string;
    name: string;
    product: PrintfulProduct;
    files: PrintfulFile[];
    options: Array<{ id: string; value: string }>;
    sku: string | null;
    discontinued: boolean;
    out_of_stock: boolean;
  }>;
  costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    digitization: string;
    additional_fee: string;
    fulfillment_fee: string;
    retail_delivery_fee: string;
    tax: string;
    vat: string;
    total: string;
  };
}
