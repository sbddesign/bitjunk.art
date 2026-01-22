import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { getOrdersByEmail } from "@/lib/orders";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/auth/login?returnTo=/account");
  }

  const orders = session.user.email
    ? await getOrdersByEmail(session.user.email)
    : [];

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "text-yellow-400";
      case "shipped":
        return "text-blue-400";
      case "delivered":
        return "text-lime-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-zinc-400";
    }
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            My Account
          </h1>
          <p className="text-zinc-400">{session.user.email}</p>
        </div>

        <section>
          <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="border-2 border-zinc-800 bg-zinc-900 py-16 text-center">
              <p className="mb-4 text-lg text-zinc-400">No orders yet</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lime-400 hover:underline"
              >
                Start shopping
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-zinc-800 bg-zinc-900 p-6"
                >
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-zinc-500">{order.id}</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold uppercase ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium text-white">{item.variantName}</p>
                          <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-lime-400">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
                    <span className="text-sm text-zinc-400">Total</span>
                    <span className="text-lg font-black text-white">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  {order.shipping && (
                    <div className="mt-4 border-t border-zinc-800 pt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Shipping to
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {order.shipping.name}, {order.shipping.address1},{" "}
                        {order.shipping.city}, {order.shipping.stateCode}{" "}
                        {order.shipping.zip}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <a
            href="/auth/logout"
            className="text-sm font-bold uppercase tracking-wide text-zinc-500 transition-colors hover:text-red-400"
          >
            Sign Out
          </a>
        </div>
      </div>
    </main>
  );
}
