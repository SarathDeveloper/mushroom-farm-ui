"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Loader2, Lock, Mail, Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Could not create account.");
        return;
      }

      toast.success("Account created! Signing you in...");
      const signInResult = await signIn("credentials", {
        redirect: false,
        phone: form.phone,
        password: form.password,
      });

      if (signInResult?.error) {
        toast.success("Account created. Please sign in.");
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-secondary py-16 px-4">
      <FadeIn className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-border p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full ring-1 ring-[var(--color-primary-dark)]/20">
              <Image
                src="/gallery/brand-logo.png"
                alt="Sri Amman Mushroom Farms"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">Create Your Account</h1>
            <p className="text-[var(--color-body)] mt-1 text-sm sm:text-base">Join us for fresh mushrooms, delivered.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="h-11 pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="h-11 pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 93855 26105"
                  className="h-11 pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="h-11 pl-9"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full rounded-full h-12 mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--color-body)] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
