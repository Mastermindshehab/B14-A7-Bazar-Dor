
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const categories = [
  { name: "চাল", slug: "chal", emoji: "🍚" },
  { name: "ডাল", slug: "dal", emoji: "🫘" },
  { name: "তেল", slug: "tel", emoji: "🫙" },
  { name: "সবজি", slug: "sobji", emoji: "🥬" },
  { name: "মাছ", slug: "mach", emoji: "🐟" },
  { name: "মাংস", slug: "mangsho", emoji: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dui", emoji: "🥚" },
  { name: "মসলা", slug: "mosla", emoji: "🌶️" },
];

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [today, setToday] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    setToday(formattedDate);
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(
          error.message || "লগআউট করা যায়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      toast.success("সফলভাবে লগআউট হয়েছে!");

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoggingOut(false);
    }
  }

  const user = session?.user;

  return (
    <header className="border-b border-[#e3eae3] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700 p-1.5">
            <Image
              src="/images/logo-icon.png"
              alt="বাজার দর Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-[#202a22]">
              বাজার দর
            </h1>

            <p className="text-xs text-gray-500">
              বাংলাদেশ{today ? `, ${today}` : ""}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <>
              <Link
                href="/profile"
                title="আমার প্রোফাইল"
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-green-50"
              >
                <span>👤</span>

                <span className="max-w-28 truncate sm:max-w-40">
                  {user.name || user.email}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="cursor-pointer rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 py-3 text-sm whitespace-nowrap">
          <Link href="/" className="font-bold text-green-700">
            🏠 সব পণ্য
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="text-gray-600 transition hover:text-green-700"
            >
              {category.emoji} {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
