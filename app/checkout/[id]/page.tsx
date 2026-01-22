"use client";

import { use } from "react";
import { Checkout } from "@moneydevkit/nextjs";
import Link from "next/link";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500 transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Cancel
        </Link>

        <h1 className="mb-8 text-3xl font-black uppercase tracking-tight text-white">
          Complete Payment
        </h1>

        <div className="overflow-hidden rounded border-2 border-zinc-800 bg-zinc-900">
          <Checkout id={id} />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Powered by Lightning Network
        </p>
      </div>
    </main>
  );
}
