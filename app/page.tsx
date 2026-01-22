import { getProducts } from "@/lib/printful";
import ProductGrid from "@/components/products/ProductGrid";
import { NormalizedProduct } from "@/types/printful";

export const revalidate = 300;

export default async function HomePage() {
  let products: NormalizedProduct[] = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products";
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <section className="mb-16">
          <h1 className="mb-4 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
            BITJUNK
          </h1>
          <p className="max-w-xl text-lg text-zinc-400">
            Premium streetwear. Pay with Lightning. No banks, no bullshit.
          </p>
        </section>

        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              All Products
            </h2>
            <span className="text-xs text-zinc-600">
              {products.length} item{products.length !== 1 ? "s" : ""}
            </span>
          </div>

          {error ? (
            <div className="rounded border-2 border-red-500/50 bg-red-500/10 py-12 text-center">
              <p className="text-red-400">{error}</p>
              <p className="mt-2 text-sm text-zinc-500">
                Make sure your Printful API token is configured.
              </p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </div>
    </main>
  );
}
