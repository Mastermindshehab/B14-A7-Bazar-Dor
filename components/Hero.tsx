
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-5">
      <div className="grid items-center gap-6 rounded-2xl border border-[#e1e9e1] bg-[#fbfdfb] p-6 sm:p-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            বাজারদর, এক জায়গায়
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#202a22] sm:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারদরভিত্তিক বিস্তারিত তথ্য, সব, সর্বশেষ-সর্বাধিক
            এবং বাজারের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="#সব-পণ্য"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            সব পণ্য দেখুন ↓
          </Link>
        </div>

        <div className="flex min-h-44 items-center justify-center">
          <Image
            src="/images/bazar-hero.png"
            alt="বাজারের পণ্যের ঝুড়ি"
            width={300}
            height={300}
            priority
            className="h-44 w-44 object-contain sm:h-56 sm:w-56"
          />
        </div>
      </div>
    </section>
  );
}
