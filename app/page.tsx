
"use client";

import { useEffect, useState } from "react";
import PriceTicker from "@/components/PriceTicker";
import Hero from "@/components/Hero";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
}

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("bn-BD").format(price);
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    dozen: "প্রতি ডজন",
  };

  return units[unit.toLowerCase()] || `প্রতি ${unit}`;
}

function ProductCard({ product }: { product: Product }) {
  const changeColor =
    product.change.dir === "up"
      ? "bg-red-50 text-red-600"
      : product.change.dir === "down"
        ? "bg-green-50 text-green-700"
        : "bg-gray-100 text-gray-500";

  const changeIcon =
    product.change.dir === "up"
      ? "▲"
      : product.change.dir === "down"
        ? "▼"
        : "—";

  return (
    <a
      href={`/product/${product.slug}`}
      className="block rounded-xl border border-[#e3eae3] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0f5f0] text-2xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[#202a22]">
            {product.nameBn}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {getUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className="mt-1 font-extrabold text-[#202a22]">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${changeColor}`}
        >
          {changeIcon} {formatPrice(product.change.pct)}%
        </span>
      </div>
    </a>
  );
}

function ProductSection({
  title,
  icon,
  products,
}: {
  title: string;
  icon?: string;
  products: Product[];
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#202a22]">
        {icon && <span>{icon}</span>}
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য আনা যায়নি।");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Product API error:", err);
        setError(
          "পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const risers = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f0f5f0]">
      <PriceTicker />
      <Hero />

      <div className="mx-auto max-w-6xl px-4 pb-12">
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />
            পণ্যের তথ্য লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-white p-6 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <>
            <ProductSection
              title="আজ দাম বেড়েছে"
              icon="▲"
              products={risers}
            />

            <ProductSection
              title="আজ দাম কমেছে"
              icon="▼"
              products={fallers}
            />

            <section
              id="সব-পণ্য"
              className="mt-10 scroll-mt-5"
            >
              <h2 className="text-xl font-extrabold text-[#202a22]">
                সব পণ্য
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ দাম দেখুন।
              </p>

              {products.length === 0 ? (
                <p className="mt-5 rounded-xl bg-white p-6 text-center text-gray-500">
                  কোনো পণ্য পাওয়া যায়নি।
                </p>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
