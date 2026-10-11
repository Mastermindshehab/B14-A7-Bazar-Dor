
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#f0f5f0] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#e3eae3] bg-white p-8 text-center shadow-sm">
        <div className="text-7xl font-extrabold text-green-700">
          404
        </div>

        <div className="mt-4 text-5xl">🔎</div>

        <h1 className="mt-5 text-2xl font-extrabold text-[#202a22]">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যাচ্ছে না।
          ঠিকানা ভুল হতে পারে অথবা পেজটি আর উপলব্ধ নেই।
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
