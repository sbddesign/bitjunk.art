"use client";

import { useUser } from "@auth0/nextjs-auth0";
import UserMenu from "./UserMenu";

export default function AuthButton() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-10 w-20 animate-pulse rounded bg-zinc-800" />
    );
  }

  if (user) {
    return <UserMenu user={user} />;
  }

  return (
    <a
      href="/auth/login"
      className="inline-flex h-10 items-center justify-center rounded border-2 border-lime-400 px-4 text-sm font-bold uppercase tracking-wide text-lime-400 transition-all hover:bg-lime-400 hover:text-black"
    >
      Login
    </a>
  );
}
