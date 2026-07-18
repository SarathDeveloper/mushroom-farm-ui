"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      toast.success("You're subscribed! Watch your inbox for fresh updates.");
      setEmail("");
      setLoading(false);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-full px-6"
        required
      />
      <Button
        type="submit"
        disabled={loading}
        className="h-12 rounded-full bg-white text-primary hover:bg-secondary px-8 font-bold"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
