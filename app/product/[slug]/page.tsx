"use client";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { useEffect, useState } from "react";

import PriceTicker from "@/components/PriceTicker";

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

  markets: Market[];

}

const API_URL =

  "https://api.abcz.workers.dev/api/bazardor/products";

const CATEGORY_EMOJIS: Record<string, string> = {

  chal: "🍚",

  dal: "🫘",

  tel: "🫙",

  sobji: "🥬",

  mach: "🐟",

  mangsho: "🍗",

  "dim-murgi": "🥚",

  moshla: "🌶️",

};

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

  return units[unit?.toLowerCase()] || `প্রতি ${unit}`;

}

function getEmoji(product: Product) {

  const image = product.image?.trim() || "";

  if (image && !/^https?:\/\//i.test(image)) {

    return image;

  }

  return (

    product.categoryIcon ||

    CATEGORY_EMOJIS[product.category] ||

    "🛒"

  );

}

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      const callbackUrl = `/product/${slug}`;
      router.replace(
        `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
    }
  }, [isPending, session, slug, router]);

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {

    let cancelled = false;

    async function fetchProduct() {

      setLoading(true);

      setError(false);

      setProduct(null);

      try {

        const response = await fetch(API_URL);

        if (!response.ok) {

          throw new Error("Failed to fetch products");

        }

        const data: Product[] = await response.json();

        if (!Array.isArray(data)) {

          throw new Error("Invalid product data");

        }

        const foundProduct = data.find(

          (item) =>

            String(item.slug).toLowerCase() ===

            String(slug).toLowerCase()

        );

        if (!cancelled) {

          if (foundProduct) {

            setProduct(foundProduct);

          } else {

            setError(true);

          }

        }

      } catch (err) {

        console.error("Product details error:", err);

        if (!cancelled) {

          setError(true);

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    }

    if (slug && !isPending && session) {

      fetchProduct();

    }

    return () => {

      cancelled = true;

    };

  }, [slug, isPending, session]);

  const markets = product?.markets ?? [];

  const minimumPrice =

    markets.length > 0

      ? Math.min(...markets.map((market) => market.min))

      : product?.today ?? 0;

  const maximumPrice =

    markets.length > 0

      ? Math.max(...markets.map((market) => market.max))

      : product?.today ?? 0;

  const averagePrice =

    markets.length > 0

      ? Math.round(

          markets.reduce(

            (total, market) =>

              total + (market.min + market.max) / 2,

            0

          ) / markets.length

        )

      : product?.today ?? 0;

  if (isPending || !session) {

    return (

      <main className="flex min-h-[65vh] items-center justify-center bg-[#f0f5f0] px-4">

        <p className="text-sm text-gray-600">সেশন যাচাই হচ্ছে...</p>

      </main>

    );

  }

  return (

    <>

      <PriceTicker />

      <main className="min-h-screen bg-[#f0f5f0] px-4 py-8">

        <div className="mx-auto max-w-6xl">

          <Link

            href="/"

            className="mb-6 inline-block text-sm font-semibold text-green-700 hover:underline"

          >

            ← হোম পেজে ফিরে যান

          </Link>

          {loading ? (

            <div className="space-y-5">

              <div className="h-44 animate-pulse rounded-2xl bg-white" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {[1, 2, 3].map((item) => (

                  <div

                    key={item}

                    className="h-28 animate-pulse rounded-xl bg-white"

                  />

                ))}

              </div>

            </div>

          ) : error || !product ? (

            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

              <div className="text-4xl">🔎</div>

              <h1 className="mt-4 text-xl font-extrabold text-[#202a22]">

                পণ্যটি পাওয়া যায়নি

              </h1>

              <p className="mt-2 text-sm text-gray-500">

                পণ্যের তথ্য পাওয়া যায়নি অথবা লোড করা সম্ভব হয়নি।

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

              <section className="rounded-2xl border border-[#e3eae3] bg-white p-6 sm:p-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f0] text-5xl">

                    {getEmoji(product)}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-green-700">

                      বাজার দর / {product.categoryNameBn}

                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-[#202a22]">

                      {product.nameBn}

                    </h1>

                    <p className="mt-2 text-sm text-gray-500">

                      {getUnit(product.unit)} · বাজারভিত্তিক দামের বিবরণ

                    </p>

                    <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

                      {product.categoryIcon} {product.categoryNameBn}

                    </span>

                  </div>

                  <div className="rounded-xl bg-[#f0f5f0] p-5 sm:min-w-44">

                    <p className="text-sm text-gray-500">

                      আজকের দাম

                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-[#202a22]">

                      {formatPrice(product.today)} টাকা

                    </p>

                    <p

                      className={`mt-2 text-sm font-bold ${

                        product.change.dir === "up"

                          ? "text-red-600"

                          : product.change.dir === "down"

                            ? "text-green-700"

                            : "text-gray-500"

                      }`}

                    >

                      {product.change.dir === "up"

                        ? "▲"

                        : product.change.dir === "down"

                          ? "▼"

                          : "—"}{" "}

                      {formatPrice(product.change.pct)}%

                    </p>

                  </div>

                </div>

              </section>

              <section className="mt-6">

                <h2 className="mb-4 text-xl font-extrabold text-[#202a22]">

                  দামের সারসংক্ষেপ

                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div className="rounded-xl border border-[#e3eae3] bg-white p-5">

                    <p className="text-sm text-gray-500">

                      সর্বনিম্ন দাম

                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-green-700">

                      {formatPrice(minimumPrice)} টাকা

                    </p>

                  </div>

                  <div className="rounded-xl border border-[#e3eae3] bg-white p-5">

                    <p className="text-sm text-gray-500">

                      সর্বোচ্চ দাম

                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-red-600">

                      {formatPrice(maximumPrice)} টাকা

                    </p>

                  </div>

                  <div className="rounded-xl border border-[#e3eae3] bg-white p-5">

                    <p className="text-sm text-gray-500">

                      গড় দাম

                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-[#202a22]">

                      {formatPrice(averagePrice)} টাকা

                    </p>

                  </div>

                </div>

              </section>

              <section className="mt-8">

                <h2 className="text-xl font-extrabold text-[#202a22]">

                  বাজারভিত্তিক আজকের দাম

                </h2>

                <p className="mt-1 text-sm text-gray-500">

                  বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম দেখুন।

                </p>

                {markets.length === 0 ? (

                  <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">

                    এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।

                  </div>

                ) : (

                  <div className="mt-4 overflow-x-auto rounded-xl border border-[#e3eae3] bg-white">

                    <table className="w-full min-w-[520px] text-left text-sm">

                      <thead className="bg-[#e8f1e8] text-[#202a22]">

                        <tr>

                          <th className="px-5 py-4">বাজার</th>

                          <th className="px-5 py-4">বিভাগ</th>

                          <th className="px-5 py-4">সর্বনিম্ন দাম</th>

                          <th className="px-5 py-4">সর্বোচ্চ দাম</th>

                        </tr>

                      </thead>

                      <tbody>

                        {markets.map((market, index) => (

                          <tr

                            key={`${market.market}-${index}`}

                            className="border-t border-gray-100"

                          >

                            <td className="px-5 py-4 font-semibold text-[#202a22]">

                              {market.market}

                            </td>

                            <td className="px-5 py-4 text-gray-600">

                              {market.division}

                            </td>

                            <td className="px-5 py-4 font-semibold text-green-700">

                              {formatPrice(market.min)} টাকা

                            </td>

                            <td className="px-5 py-4 font-semibold text-red-600">

                              {formatPrice(market.max)} টাকা

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>

            </>

          )}

        </div>

      </main>

    </>

  );

}
