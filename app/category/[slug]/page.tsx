
"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";

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
  lastWeek?: number;
  lastMonth?: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets?: Market[];
}

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const categoryEmojis: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🫙",
  sobji: "🥬",
  mach: "🐟",
  mangsho: "🍗",
  "dim-murgi": "🥚",
  moshla: "🌶️",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    dozen: "প্রতি ডজন",
  };

  return units[unit?.toLowerCase()] || `প্রতি ${unit || "একক"}`;
}

function getProductEmoji(product: Product) {
  const image = product.image?.trim();

  if (image && !/^https?:\/\//i.test(image)) {
    return image;
  }

  return (
    product.categoryIcon ||
    categoryEmojis[product.category] ||
    "🛒"
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false);

  const image = product.image?.trim() || "";
  const isImageUrl = /^https?:\/\//i.test(image);

  const changeColor =
    product.change?.dir === "up"
      ? "bg-red-50 text-red-600"
      : product.change?.dir === "down"
        ? "bg-green-50 text-green-700"
        : "bg-gray-100 text-gray-500";

  const changeIcon =
    product.change?.dir === "up"
      ? "▲"
      : product.change?.dir === "down"
        ? "▼"
        : "—";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-xl border border-[#e3eae3] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f0f5f0] text-2xl">
          {isImageUrl && !imageFailed ? (
            <img
              src={image}
              alt={product.nameBn}
              className="h-full w-full object-contain"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span>{getProductEmoji(product)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-[#202a22]">
            {product.nameBn}
          </h2>

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
          {changeIcon} {formatPrice(product.change?.pct ?? 0)}%
        </span>
      </div>
    </Link>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Products could not be loaded");
        }

        const data: Product[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid product data");
        }

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Category API error:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.category?.toLowerCase() === slug?.toLowerCase()
      ),
    [products, slug]
  );

  const sortedProducts = useMemo(() => {
    const result = [...categoryProducts];

    if (sortBy === "asc") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortBy === "desc") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [categoryProducts, sortBy]);

  const categoryName =
    categoryProducts[0]?.categoryNameBn || "";

  const categoryIcon =
    categoryProducts[0]?.categoryIcon ||
    categoryEmojis[slug] ||
    "🛒";

  return (
    <main className="min-h-screen bg-[#f0f5f0]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <>
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-red-600">
              পণ্যের তথ্য পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              API থেকে তথ্য আনা যায়নি। আবার চেষ্টা করুন।
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 cursor-pointer rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="text-4xl">🔎</div>

            <h1 className="mt-4 text-xl font-extrabold text-[#202a22]">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              অন্য ক্যাটাগরি দেখুন অথবা হোম পেজে ফিরে যান।
            </p>

            <Link
              href="/"
              className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm text-green-700">
                  বাজার দর / {categoryName}
                </p>

                <h1 className="mt-2 text-3xl font-extrabold text-[#202a22]">
                  {categoryIcon} {categoryName}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  এই ক্যাটাগরির{" "}
                  {formatPrice(sortedProducts.length)}টি পণ্য
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm text-gray-600"
                >
                  সাজান:
                </label>

                <select
                  id="sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="asc">দাম: কম থেকে বেশি</option>
                  <option value="desc">দাম: বেশি থেকে কম</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
