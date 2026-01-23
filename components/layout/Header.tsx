"use client";

import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-black uppercase tracking-tighter text-white transition-colors group-hover:text-lime-400">
            BITJUNK
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-wide text-zinc-400 transition-colors hover:text-white"
          >
            Shop
          </Link>
          <AuthButton />
        </div>
      </nav>
    </header>
  );
}
