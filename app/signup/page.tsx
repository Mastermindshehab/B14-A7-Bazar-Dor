
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      const message = "দুটি পাসওয়ার্ড মিলছে না।";
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        const message =
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।";

        setError(message);
        toast.error(message);
        return;
      }

      const message = "অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন।";

      setSuccess(message);
      toast.success(message);

      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch {
      const message = "সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(
    provider: "google" | "github"
  ) {
    setError("");
    setSuccess("");
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        newUserCallbackURL: "/signin?registered=true",
        errorCallbackURL: "/signup",
      });

      if (error) {
        const message =
          error.message || "সোশ্যাল লগইন করা যায়নি।";

        setError(message);
        toast.error(message);
        setSocialLoading("");
      }
    } catch {
      const message = "লগইন করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
      setSocialLoading("");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-800";

  return (
    <main className="min-h-[65vh] bg-[#f0f6f0] px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-2 text-sm text-gray-700">
            নিরাপদে সাইন আপ করে বাজারদরের তথ্য দেখুন।
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="name" className={labelClass}>
              নাম
            </label>

            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={labelClass}
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার পাসওয়ার্ড লিখুন"
              className={inputClass}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
              : "অ্যাকাউন্ট তৈরি করুন"}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">অথবা</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading || !!socialLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
            >
              <FcGoogle size={19} />

              {socialLoading === "google"
                ? "Google খুলছে..."
                : "Google দিয়ে চালিয়ে যান"}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={loading || !!socialLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
            >
              <FaGithub size={19} />

              {socialLoading === "github"
                ? "GitHub খুলছে..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-700">
            অ্যাকাউন্ট আছে?{" "}
            <a
              href="/signin"
              className="font-semibold text-green-700 hover:underline"
            >
              সাইন ইন করুন
            </a>
          </p>
        </form>

        <div className="mt-5 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-green-700"
          >
            ← হোম পেজে ফিরে যান
          </a>
        </div>
      </div>
    </main>
  );
}
