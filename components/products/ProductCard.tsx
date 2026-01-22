import Image from "next/image";
import Link from "next/link";
import { NormalizedProduct } from "@/types/printful";

interface ProductCardProps {
  product: NormalizedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const priceDisplay =
    product.priceRange.min === product.priceRange.max
      ? formatPrice(product.priceRange.min)
      : `${formatPrice(product.priceRange.min)} - ${formatPrice(product.priceRange.max)}`;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <span className="text-zinc-600">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-lime-400 py-3 text-center transition-transform duration-300 group-hover:translate-y-0">
          <span className="text-sm font-bold uppercase tracking-wide text-black">
            View Product
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
          {product.name}
        </h3>
        <p className="text-lg font-black text-lime-400">
          {product.priceRange.min > 0 ? priceDisplay : "Loading..."}
        </p>
        {product.variantCount > 1 && (
          <p className="text-xs text-zinc-500">
            {product.variantCount} variants
          </p>
        )}
      </div>
    </Link>
  );
}
