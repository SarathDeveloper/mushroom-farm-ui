"use client";

import { useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { Calendar, Loader2, Sparkles, Users } from "lucide-react";
import toast from "react-hot-toast";
import type { TrainingProgram } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const levelColor: Record<TrainingProgram["level"], string> = {
  Beginner: "bg-[var(--color-success)]",
  Intermediate: "bg-primary",
  Advanced: "bg-[var(--color-primary-dark)]",
};

export function TrainingCard({ program }: { program: TrainingProgram }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Interest registered! We'll contact you with next steps.");
    }, 800);
  };

  const startDate = new Date(program.startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out">
        <div className="relative h-48 overflow-hidden">
          <SafeImage
            src={program.image}
            alt={program.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide ${levelColor[program.level]}`}>
            {program.level}
          </span>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-xl text-foreground mb-2 font-heading">{program.title}</h3>
          <p className="text-sm text-[var(--color-body)] mb-4 line-clamp-2">{program.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {startDate}</span>
            <span className="flex items-center gap-1.5"><Sparkles size={14} /> {program.duration}</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> {program.seatsLeft} seats left</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-bold text-primary">₹{program.fee.toLocaleString("en-IN")}</span>
            <Button
              onClick={() => {
                setOpen(true);
                setSubmitted(false);
              }}
              className="rounded-full px-5 h-10"
            >
              Register Interest
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles size={26} />
              </div>
              <DialogTitle className="text-center mb-2">You&apos;re on the list!</DialogTitle>
              <p className="text-sm text-[var(--color-body)]">
                Thanks for your interest in <span className="font-semibold">{program.title}</span>. Our team will reach out with payment and batch details.
              </p>
              <Button onClick={() => setOpen(false)} className="mt-6 w-full rounded-full">
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{program.title}</DialogTitle>
                <DialogDescription>
                  Fill in your details and our team will contact you to confirm your seat.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`name-${program.id}`}>Full Name</Label>
                  <Input id={`name-${program.id}`} required placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`email-${program.id}`}>Email</Label>
                  <Input id={`email-${program.id}`} type="email" required placeholder="you@example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`phone-${program.id}`}>Phone Number</Label>
                  <Input id={`phone-${program.id}`} type="tel" required placeholder="+91 98765 43210" />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm Interest"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
