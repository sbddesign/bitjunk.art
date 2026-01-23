"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { User } from "@auth0/nextjs-auth0/types";

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-2 rounded border-2 border-zinc-700 px-3 text-sm font-medium text-white transition-colors hover:border-lime-400"
      >
        <span className="max-w-[120px] truncate">
          {user.name || user.email}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded border border-zinc-700 bg-zinc-900 py-1 shadow-xl">
          <Link
            href="/account"
            className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            My Orders
          </Link>
          <hr className="my-1 border-zinc-700" />
          <a
            href="/auth/logout"
            className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Sign Out
          </a>
        </div>
      )}
    </div>
  );
}
