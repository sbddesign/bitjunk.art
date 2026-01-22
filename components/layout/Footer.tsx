import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-xl font-black uppercase tracking-tighter text-white">
              BITJUNK
            </span>
            <p className="text-sm text-zinc-500">
              Pay with Lightning. Wear the future.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium uppercase tracking-wide text-zinc-400 transition-colors hover:text-lime-400"
            >
              Shop
            </Link>
            <Link
              href="/account"
              className="text-sm font-medium uppercase tracking-wide text-zinc-400 transition-colors hover:text-lime-400"
            >
              Account
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-8 text-center">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Bitjunk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
