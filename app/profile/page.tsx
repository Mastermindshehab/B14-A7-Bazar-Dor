
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session?.user?.name]);

  async function handleUpdateName(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("নাম লিখুন।");
      return;
    }

    if (updatedName.length > 100) {
      toast.error("নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।");
      return;
    }

    if (updatedName === session?.user.name) {
      toast.info("আপনার নামের কোনো পরিবর্তন হয়নি।");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
      });

      if (error) {
        toast.error(error.message || "নাম আপডেট করা যায়নি।");
        return;
      }

      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f6f0] px-4">
        <p className="text-sm text-gray-600">
          প্রোফাইল লোড হচ্ছে...
        </p>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-[65vh] bg-[#f0f6f0] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl">
              👤
            </div>

            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              আমার প্রোফাইল
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              আপনার অ্যাকাউন্টের তথ্য দেখুন ও নাম আপডেট করুন।
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">বর্তমান নাম</p>
              <p className="mt-1 font-semibold text-gray-900">
                {user.name || "নাম দেওয়া নেই"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">ইমেইল</p>
              <p className="mt-1 break-all font-semibold text-gray-900">
                {user.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                নতুন নাম
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                autoComplete="name"
                placeholder="আপনার নতুন নাম লিখুন"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full cursor-pointer rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "নাম আপডেট করুন"}
            </button>
          </form>

          <div className="mt-6">
            <Link
              href="/"
              className="block rounded-lg border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
