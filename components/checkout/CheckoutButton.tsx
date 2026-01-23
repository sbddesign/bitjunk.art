"use client";

import { useState } from "react";
import { useCheckout } from "@moneydevkit/nextjs";
import { NormalizedVariant } from "@/types/printful";
import { ShippingAddress } from "@/types/order";

const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === "true";
const TEST_PRICE_CENTS = 5; // $0.05

interface CheckoutButtonProps {
  variant: NormalizedVariant;
  productName: string;
  shipping: ShippingAddress | null;
  onShippingRequired: () => void;
}

export default function CheckoutButton({
  variant,
  productName,
  shipping,
  onShippingRequired,
}: CheckoutButtonProps) {
  const { createCheckout, isLoading } = useCheckout();
  const [error, setError] = useState<string | null>(null);

  const checkoutPrice = TEST_MODE ? TEST_PRICE_CENTS : variant.price;

  const handleCheckout = async () => {
    setError(null);

    if (!shipping) {
      onShippingRequired();
      return;
    }

    const result = await createCheckout({
      type: "AMOUNT",
      title: TEST_MODE ? `[TEST] ${productName}` : productName,
      description: `${variant.name} - ${variant.options.size || ""} ${variant.options.color || ""}`.trim(),
      amount: checkoutPrice,
      currency: "USD",
      successUrl: "/success",
      metadata: {
        testMode: TEST_MODE ? "true" : "false",
        variantId: String(variant.id),
        variantName: variant.name,
        productName: productName,
        originalPrice: String(variant.price),
        price: String(checkoutPrice),
        currency: variant.currency,
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingPhone: shipping.phone,
        shippingAddress1: shipping.address1,
        shippingAddress2: shipping.address2 || "",
        shippingCity: shipping.city,
        shippingStateCode: shipping.stateCode,
        shippingCountryCode: shipping.countryCode,
        shippingZip: shipping.zip,
      },
      customer: {
        name: shipping.name,
        email: shipping.email,
      },
      requireCustomerData: ["name", "email"],
    });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    window.location.href = result.data.checkoutUrl;
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="space-y-4">
      {TEST_MODE && (
        <div className="border-2 border-yellow-500 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-500">
          <strong>TEST MODE:</strong> Checkout is $0.05. Printful orders require
          manual approval.
        </div>
      )}

      {error && (
        <div className="border-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-lime-400 py-4 text-lg font-black uppercase tracking-wide text-black transition-all hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          <>
            Pay {formatPrice(checkoutPrice)} with Lightning
            {TEST_MODE && (
              <span className="ml-2 text-xs">(was {formatPrice(variant.price)})</span>
            )}
          </>
        )}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Secure payment via Lightning Network
      </p>
    </div>
  );
}
