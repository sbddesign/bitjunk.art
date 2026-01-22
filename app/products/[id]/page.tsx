"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { NormalizedProductDetail, NormalizedVariant } from "@/types/printful";
import { ShippingAddress } from "@/types/order";
import VariantSelector from "@/components/products/VariantSelector";
import ShippingForm from "@/components/checkout/ShippingForm";
import CheckoutButton from "@/components/checkout/CheckoutButton";

const STORAGE_KEY = "bitjunk_shipping";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<NormalizedProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<NormalizedVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shipping, setShipping] = useState<ShippingAddress | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/printful/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
        if (data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();

    const savedShipping = localStorage.getItem(STORAGE_KEY);
    if (savedShipping) {
      try {
        setShipping(JSON.parse(savedShipping));
      } catch {
        // Ignore
      }
    }
  }, [id]);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="animate-pulse">
            <div className="mb-8 h-4 w-24 bg-zinc-800" />
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="aspect-square bg-zinc-800" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-zinc-800" />
                <div className="h-6 w-1/4 bg-zinc-800" />
                <div className="h-4 w-full bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="py-24 text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">
              {error || "Product not found"}
            </h1>
            <Link
              href="/"
              className="text-lime-400 hover:underline"
            >
              Back to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShipping(address);
    setShowShippingForm(false);
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to shop
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden bg-zinc-900">
            {selectedVariant?.imageUrl ? (
              <Image
                src={selectedVariant.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : product.thumbnailUrl ? (
              <Image
                src={product.thumbnailUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-zinc-600">No image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              {product.name}
            </h1>

            <p className="mb-8 text-3xl font-black text-lime-400">
              {selectedVariant ? formatPrice(selectedVariant.price) : "Select variant"}
            </p>

            <div className="mb-8">
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>

            {selectedVariant && (
              <div className="mt-auto space-y-6">
                {showShippingForm ? (
                  <div className="border-2 border-zinc-800 p-6">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
                      Shipping Address
                    </h3>
                    <ShippingForm
                      onSubmit={handleShippingSubmit}
                      initialValues={shipping || undefined}
                    />
                  </div>
                ) : shipping ? (
                  <div className="border-2 border-zinc-800 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                          Ship to
                        </p>
                        <p className="mt-1 text-sm text-white">{shipping.name}</p>
                        <p className="text-sm text-zinc-400">
                          {shipping.address1}, {shipping.city}, {shipping.stateCode}{" "}
                          {shipping.zip}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowShippingForm(true)}
                        className="text-xs font-bold uppercase text-lime-400 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ) : null}

                <CheckoutButton
                  variant={selectedVariant}
                  productName={product.name}
                  shipping={shipping}
                  onShippingRequired={() => setShowShippingForm(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
