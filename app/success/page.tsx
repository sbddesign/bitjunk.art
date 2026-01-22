"use client";

import { useEffect, useState, useCallback } from "react";
import { useCheckoutSuccess } from "@moneydevkit/nextjs";
import Link from "next/link";
import { ShippingAddress } from "@/types/order";

const STORAGE_KEY = "bitjunk_shipping";

interface OrderResult {
  id: string;
  status: string;
}

export default function SuccessPage() {
  const { isCheckoutPaidLoading, isCheckoutPaid, metadata } = useCheckoutSuccess();
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const createOrder = useCallback(async () => {
    if (!metadata) return;

    const savedShipping = localStorage.getItem(STORAGE_KEY);
    let shipping: ShippingAddress | null = null;

    if (savedShipping) {
      try {
        shipping = JSON.parse(savedShipping);
      } catch {
        // Fall back to metadata
      }
    }

    if (!shipping && metadata.shippingEmail) {
      shipping = {
        name: metadata.shippingName as string,
        email: metadata.shippingEmail as string,
        phone: metadata.shippingPhone as string,
        address1: metadata.shippingAddress1 as string,
        address2: (metadata.shippingAddress2 as string) || "",
        city: metadata.shippingCity as string,
        stateCode: metadata.shippingStateCode as string,
        countryCode: metadata.shippingCountryCode as string,
        zip: metadata.shippingZip as string,
      };
    }

    if (!shipping) {
      setOrderError("Shipping information not found");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutId: metadata.checkoutId || "unknown",
          variantId: parseInt(metadata.variantId as string, 10),
          variantName: metadata.variantName as string,
          price: parseInt(metadata.price as string, 10),
          currency: (metadata.currency as string) || "USD",
          shipping,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
      setOrderResult(data.order);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : "Failed to create order");
    }
  }, [metadata]);

  useEffect(() => {
    if (isCheckoutPaid && !orderCreated && metadata) {
      setOrderCreated(true);
      createOrder();
    }
  }, [isCheckoutPaid, orderCreated, metadata, createOrder]);

  if (isCheckoutPaidLoading || isCheckoutPaid === null) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-lime-400 border-t-transparent" />
          <p className="mt-6 text-xl text-zinc-400">Verifying payment...</p>
        </div>
      </main>
    );
  }

  if (!isCheckoutPaid) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-500">
            <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mb-4 text-3xl font-black uppercase text-white">Payment Not Confirmed</h1>
          <p className="mb-8 text-zinc-400">
            We couldn&apos;t verify your payment. Please try again or contact support.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-lime-400 px-8 py-4 font-bold uppercase tracking-wide text-black transition-colors hover:bg-lime-300"
          >
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-4 border-lime-400">
          <svg className="h-10 w-10 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-black uppercase text-white md:text-4xl">
          Payment Confirmed!
        </h1>

        <p className="mb-8 text-lg text-zinc-400">
          Thanks for your order. Your item will be printed and shipped soon.
        </p>

        {orderError && (
          <div className="mb-8 border-2 border-red-500/50 bg-red-500/10 px-6 py-4 text-left">
            <p className="text-sm text-red-400">
              Note: Payment received, but there was an issue processing your order.
              Please contact support with your payment confirmation.
            </p>
          </div>
        )}

        {orderResult && (
          <div className="mb-8 border-2 border-zinc-800 bg-zinc-900 p-6 text-left">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Order Details
            </h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-zinc-400">Order ID</dt>
                <dd className="font-mono text-sm text-white">{orderResult.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-400">Status</dt>
                <dd className="font-bold uppercase text-lime-400">{orderResult.status}</dd>
              </div>
              {metadata?.variantName && (
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Item</dt>
                  <dd className="text-white">{metadata.variantName}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-lime-400 px-8 py-4 font-bold uppercase tracking-wide text-black transition-colors hover:bg-lime-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 border-2 border-zinc-700 px-8 py-4 font-bold uppercase tracking-wide text-white transition-colors hover:border-lime-400"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
