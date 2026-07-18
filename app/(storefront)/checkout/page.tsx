"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Script from "next/script";
import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Loader2,
  LocateFixed,
  MapPin,
  PartyPopper,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Timer,
  Truck,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  indianMobileError,
  isValidIndianMobile,
  normalizeIndianMobile,
} from "@/lib/phone";
import { useCartStore } from "@/lib/store";
import { useHasMounted } from "@/lib/useHasMounted";
import { cn, formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: () => void) => void;
    };
  }
}

type CheckoutStep = 0 | 1 | 2;
type PaymentMethod = "cod" | "online";

const STEPS = ["Address", "Payment", "Confirm"] as const;

const validCoupons: Record<
  string,
  { discount: number; isPercent: boolean; minOrder: number }
> = {
  FRESH10: { discount: 10, isPercent: true, minOrder: 200 },
  WELCOME50: { discount: 50, isPercent: false, minOrder: 300 },
  MUSHROOM15: { discount: 15, isPercent: true, minOrder: 500 },
};

export default function CheckoutPage() {
  const mounted = useHasMounted();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [step, setStep] = useState<CheckoutStep>(0);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [phoneVerifiedToken, setPhoneVerifiedToken] = useState<string | null>(
    null,
  );
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  const phoneVerified = Boolean(
    phoneVerifiedToken && verifiedPhone === phone && isValidIndianMobile(phone),
  );

  useEffect(() => {
    if (session?.user?.name && !fullName) {
      setFullName(session.user.name);
    }
  }, [session?.user?.name, fullName]);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setOtpCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  const handlePhoneChange = (value: string) => {
    const next = normalizeIndianMobile(value);
    setPhone(next);
    setPhoneError("");
    setOtpMsg("");
    if (verifiedPhone && verifiedPhone !== next) {
      setPhoneVerifiedToken(null);
      setVerifiedPhone(null);
      setOtpSent(false);
      setOtp("");
    }
  };

  const sendOtp = async () => {
    const err = indianMobileError(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setOtpBusy(true);
    setOtpMsg("");
    setPhoneError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpMsg(data.message ?? "Failed to send OTP.");
        if (data.cooldownMs) {
          setOtpCooldown(Math.ceil(Number(data.cooldownMs) / 1000));
        }
        return;
      }
      setOtpSent(true);
      setOtpCooldown(Math.max(45, Math.ceil(Number(data.cooldownMs ?? 45000) / 1000)));
      setOtpMsg(
        data.devOtp
          ? `OTP sent to your mobile. Dev code: ${data.devOtp}`
          : (data.message ?? "OTP sent to your mobile."),
      );
    } catch {
      setOtpMsg("Failed to send OTP. Please try again.");
    } finally {
      setOtpBusy(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp) && otp !== "1234") {
      setOtpMsg("Enter the 6-digit OTP.");
      return;
    }
    setOtpBusy(true);
    setOtpMsg("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpMsg(data.message ?? "OTP verification failed.");
        return;
      }
      setPhoneVerifiedToken(data.phoneVerifiedToken);
      setVerifiedPhone(phone);
      setOtpMsg("Mobile number verified.");
    } catch {
      setOtpMsg("OTP verification failed. Please try again.");
    } finally {
      setOtpBusy(false);
    }
  };

  const autofillCurrentAddress = () => {
    setLocationMsg("");
    if (!navigator.geolocation) {
      setLocationMsg("Location is not supported on this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/api/geocode/reverse?lat=${latitude}&lon=${longitude}`,
          );
          if (!res.ok) throw new Error("geocode failed");
          const data = (await res.json()) as {
            display_name?: string;
            address?: {
              house_number?: string;
              road?: string;
              neighbourhood?: string;
              suburb?: string;
              village?: string;
              town?: string;
              city?: string;
              county?: string;
              state_district?: string;
              state?: string;
              postcode?: string;
            };
          };
          const a = data.address ?? {};
          const streetParts = [
            a.house_number,
            a.road,
            a.neighbourhood,
            a.suburb,
          ].filter(Boolean);
          setAddress(
            streetParts.length > 0
              ? streetParts.join(", ")
              : (data.display_name ?? ""),
          );
          setCity(a.city || a.town || a.village || a.county || a.state_district || "");
          if (a.state) setState(a.state);
          if (a.postcode) {
            setPincode(a.postcode.replace(/\D/g, "").slice(0, 6));
          }
          setLocationMsg("Address filled from your current location. Please review.");
        } catch {
          setLocationMsg("Could not fetch address from location. Enter it manually.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setLocationMsg(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Enable it in browser settings."
            : "Unable to get your location. Enter the address manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 49;
  const discount = appliedCoupon?.discount ?? 0;
  const gst = 0;
  const total = subtotal + shipping + gst - discount;
  const email = session?.user?.email ?? "";
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shelfDays = items
    .map((i) => i.shelfLifeDays)
    .filter((d): d is number => d != null && d > 0);
  const minShelfLife = shelfDays.length > 0 ? Math.min(...shelfDays) : null;

  const applyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase().trim();
    const coupon = validCoupons[code];
    if (!coupon) {
      setCouponError("Oops! That doesn't look like a valid coupon code.");
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`You need to spend ${formatCurrency(coupon.minOrder)} to use this coupon.`);
      return;
    }
    const discountAmt = coupon.isPercent
      ? Math.round((subtotal * coupon.discount) / 100)
      : coupon.discount;
    setAppliedCoupon({ code, discount: discountAmt });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const openRazorpay = useCallback(
    (data: {
      razorpayOrderId: string;
      amount: number;
      currency: string;
      key: string;
      orderId: string;
    }) => {
      const options: Record<string, unknown> = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Sri Amman Mushroom Farms",
        description: `Order #${data.orderId.slice(0, 8).toUpperCase()}`,
        order_id: data.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const res = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const result = await res.json();
            if (res.ok) {
              clear();
              setOrderId(result.orderId);
            } else {
              setErrorMsg(result.message ?? "Payment verification failed.");
            }
          } catch {
            setErrorMsg("Payment verification failed. Please contact support.");
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: fullName,
          email,
          contact: phone,
        },
        theme: { color: "hsl(var(--primary))" },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [fullName, email, phone, clear],
  );

  const goToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const err = indianMobileError(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    if (!phoneVerified) {
      setErrorMsg("Verify your mobile number with OTP before continuing.");
      return;
    }
    setStep(1);
  };

  const goToReview = () => {
    setErrorMsg("");
    setStep(2);
  };

  const placeOrder = async () => {
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          fullName,
          phone,
          phoneVerifiedToken,
          address,
          city,
          state,
          pincode,
          couponCode: appliedCoupon?.code ?? undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message ?? "Failed to create order.");
        setSubmitting(false);
        return;
      }

      if (paymentMethod === "cod") {
        clear();
        setOrderId(data.orderId);
        setSubmitting(false);
        return;
      }

      openRazorpay(data);
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }
  if (authStatus === "unauthenticated") {
    router.push("/login?callbackUrl=/checkout");
    return null;
  }

  if (orderId) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center px-4 py-24 text-center">
        <FadeIn>
          <div className="w-20 h-20 rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] flex items-center justify-center mx-auto mb-6">
            <PartyPopper size={36} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3">
            Order Placed Successfully!
          </h1>
            <p className="text-base text-[hsl(var(--foreground))] max-w-md mx-auto mb-2">
            Thank you for your order. Your order ID is:
          </p>
          <p className="text-xl font-bold text-primary mb-2">
            #{orderId.slice(0, 8).toUpperCase()}
          </p>
          {paymentMethod === "cod" && (
            <p className="text-sm text-[hsl(var(--foreground))] mb-8">
              Please keep ${formatCurrency(total)} ready for cash on delivery.
            </p>
          )}
          {paymentMethod !== "cod" && <div className="mb-8" />}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href={`/track-order?id=${orderId}`}>Track My Order</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8"
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center text-center px-4 py-24">
        <ShoppingBag size={36} className="text-muted-foreground mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-2">
          Nothing to checkout
        </h1>
        <p className="text-base text-[hsl(var(--foreground))] mb-6">
          Your cart is empty. Add some products first.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <PageHero
        eyebrow="Checkout"
        title="Almost There"
        image="https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <FadeIn className="mb-10">
            <div className="flex items-center justify-center gap-2 text-base">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
                      i < step
                        ? "bg-primary text-white"
                        : i === step
                          ? "bg-primary text-white"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {i < step ? <CheckCircle2 size={14} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden sm:inline",
                      i <= step
                        ? "text-foreground font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      className={cn(
                        "w-8 h-px",
                        i < step ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            <FadeIn direction="right" className="lg:col-span-2 order-2 lg:order-1">
              {/* Step 0: Address */}
              {step === 0 && (
                <form onSubmit={goToPayment}>
                  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                      <MapPin size={20} className="text-primary" />
                      Delivery Address
                    </h2>

                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        required
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-primary">*</span>
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="phone"
                            type="tel"
                            required
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={10}
                            placeholder="10-digit mobile (6–9…)"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            aria-invalid={Boolean(phoneError) || undefined}
                            className={cn(phoneVerified && "pr-10")}
                          />
                          {phoneVerified && (
                            <CheckCircle2
                              size={16}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-success)]"
                              aria-label="Verified"
                            />
                          )}
                        </div>
                        {!phoneVerified && (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full h-11 px-5 shrink-0"
                            disabled={otpBusy || otpCooldown > 0 || !phone}
                            onClick={sendOtp}
                          >
                            {otpBusy && !otpSent ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : otpCooldown > 0 ? (
                              `Resend in ${otpCooldown}s`
                            ) : otpSent ? (
                              "Resend OTP"
                            ) : (
                              "Send OTP"
                            )}
                          </Button>
                        )}
                      </div>
                      {phoneError && (
                        <p className="text-sm text-[var(--color-error)]">{phoneError}</p>
                      )}
                      {!phoneError && !phoneVerified && (
                        <p className="text-sm text-muted-foreground">
                          Must be 10 digits and start with 6, 7, 8, or 9. OTP verification is required.
                        </p>
                      )}
                      {phoneVerified && (
                        <p className="text-sm text-[hsl(var(--success))] flex items-center gap-1">
                          <CheckCircle2 size={16} /> Mobile number verified
                        </p>
                      )}

                      {otpSent && !phoneVerified && (
                        <div className="mt-2 rounded-xl border border-border bg-secondary/40 p-3 space-y-2">
                          <Label htmlFor="otp">
                            Enter OTP <span className="text-primary">*</span>
                          </Label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              id="otp"
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              maxLength={6}
                              placeholder="OTP"
                              value={otp}
                              onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                              }
                            />
                            <Button
                              type="button"
                              className="rounded-full h-11 px-5 shrink-0"
                              disabled={otpBusy || (otp.length !== 6 && otp !== "1234")}
                              onClick={verifyOtp}
                            >
                              {otpBusy ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                      {otpMsg && (
                        <p
                          className={cn(
                            "text-sm",
                            phoneVerified
                              ? "text-[hsl(var(--success))]"
                              : "text-[hsl(var(--foreground))]",
                          )}
                        >
                          {otpMsg}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="address">
                          Street Address <span className="text-primary">*</span>
                        </Label>
                        <button
                          type="button"
                          onClick={autofillCurrentAddress}
                          disabled={locating}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline disabled:opacity-60"
                        >
                          {locating ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <LocateFixed size={13} />
                          )}
                          {locating ? "Detecting…" : "Use current location"}
                        </button>
                      </div>
                      <textarea
                        id="address"
                        required
                        rows={3}
                        placeholder="House/flat, street, area"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-lg md:text-base outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 resize-none placeholder:text-muted-foreground"
                      />
                      {locationMsg && (
                        <p className="text-sm text-muted-foreground">{locationMsg}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="city">
                          City <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="city"
                          required
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="pincode">
                          PIN Code <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="pincode"
                          required
                          pattern="[0-9]{6}"
                          maxLength={6}
                          placeholder="6-digit PIN"
                          value={pincode}
                          onChange={(e) =>
                            setPincode(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <p className="text-base text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 rounded-xl px-4 py-3">
                        {errorMsg}
                      </p>
                    )}

                    <Button type="submit" size="lg" className="rounded-full h-12 px-8">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" />
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={cn(
                        "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          paymentMethod === "cod"
                            ? "border-primary"
                            : "border-muted-foreground",
                        )}
                      >
                        {paymentMethod === "cod" && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Banknote size={16} className="text-primary" />
                          Cash On Delivery
                        </p>
                        <p className="text-base text-muted-foreground mt-0.5">
                          Pay with cash when your order arrives
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={cn(
                        "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                        paymentMethod === "online"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          paymentMethod === "online"
                            ? "border-primary"
                            : "border-muted-foreground",
                        )}
                      >
                        {paymentMethod === "online" && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <CreditCard size={16} className="text-primary" />
                          Pay Online
                        </p>
                        <p className="text-base text-muted-foreground mt-0.5">
                          UPI, cards &amp; net banking via Razorpay
                        </p>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === "online" && (
                    <div className="rounded-2xl border border-border bg-secondary/50 p-4 flex items-center gap-3 text-base text-[hsl(var(--foreground))]">
                      <ShieldCheck size={18} className="text-primary shrink-0" />
                      Secure payment powered by Razorpay. Your card details are
                      never stored on our servers.
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="rounded-full h-12 px-6"
                      onClick={() => setStep(0)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      className="rounded-full h-12 px-8 flex-1"
                      onClick={goToReview}
                    >
                      Continue to Review
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Review & Place Order */}
              {step === 2 && (
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-primary" />
                    Review &amp; Place Order
                  </h2>

                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">
                      Delivery Address
                    </h3>
                    <p className="text-base text-muted-foreground">
                      {fullName}, {phone}
                    </p>
                    <p className="text-base text-muted-foreground">{address}</p>
                    <p className="text-base text-muted-foreground">
                      {city}, {state} – {pincode}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">
                      Payment
                    </h3>
                    <p className="text-base text-muted-foreground">
                      {paymentMethod === "cod"
                        ? "Cash On Delivery"
                        : "Pay Online (Razorpay)"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">
                      Items ({itemCount})
                    </h3>
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-base text-muted-foreground"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-foreground font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {errorMsg && (
                    <p className="text-base text-[var(--color-error)] bg-[var(--color-error)]/10 rounded-xl px-4 py-3">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="rounded-full h-12 px-6"
                      disabled={submitting}
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      className="rounded-full h-12 px-8 flex-1"
                      disabled={submitting}
                      onClick={placeOrder}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        `Place Order – ${formatCurrency(total)}`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </FadeIn>

            <FadeIn direction="left" className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-24 space-y-4">
                {/* Mobile collapsible summary */}
                <div className="rounded-2xl border border-border bg-card lg:p-6 space-y-0 lg:space-y-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 lg:hidden"
                    onClick={() => setSummaryOpen(!summaryOpen)}
                  >
                    <h3 className="text-base font-bold font-heading text-foreground">
                      Order Summary ({itemCount} items)
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-lg">{formatCurrency(total)}</span>
                      <ChevronDown size={18} className={cn("text-muted-foreground transition-transform", summaryOpen && "rotate-180")} />
                    </div>
                  </button>
                  <h3 className="text-lg font-bold font-heading text-foreground hidden lg:block">
                    Order Summary
                  </h3>
                  <div className={cn("border-t border-border pt-4 space-y-2 px-4 pb-4 lg:px-0 lg:pb-0", !summaryOpen && "hidden lg:block")}>
                    <div className="flex justify-between text-base text-[hsl(var(--foreground))]">
                      <span>Items ({itemCount})</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base text-[hsl(var(--foreground))]">
                      <span>GST</span>
                      <span>{formatCurrency(gst)}</span>
                    </div>
                    <div className="flex justify-between text-base text-[hsl(var(--foreground))]">
                      <span>Delivery</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-[hsl(var(--success))] font-medium">
                            FREE
                          </span>
                        ) : (
                          `${formatCurrency(shipping)}`
                        )}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-base text-[hsl(var(--success))]">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-{formatCurrency(appliedCoupon.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-foreground text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div className={cn("rounded-2xl border border-border bg-card p-5", !summaryOpen && "hidden lg:block")}>
                  <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                    <Tag size={14} className="text-primary" /> Apply Coupon
                  </h4>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[hsl(var(--success))]/10 rounded-lg px-3 py-2">
                      <span className="text-base font-semibold text-[hsl(var(--success))]">
                        {appliedCoupon.code} applied!
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-sm text-[var(--color-error)] font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError("");
                          }}
                          placeholder="Enter code"
                          className="h-9 text-base uppercase"
                        />
                        <Button
                          onClick={applyCoupon}
                          size="sm"
                          variant="outline"
                          className="h-9 px-3 text-sm shrink-0"
                        >
                          Apply
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-sm text-[hsl(var(--destructive))] mt-2">
                          {couponError}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        Try: FRESH10, WELCOME50, MUSHROOM15
                      </p>
                    </>
                  )}
                </div>

                {shipping === 0 && subtotal > 0 && (
                  <div className={cn("rounded-xl bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20 p-3 text-center", !summaryOpen && "hidden lg:block")}>
                    <p className="text-sm font-semibold text-[hsl(var(--success))]">
                      <CheckCircle2 size={16} className="inline mr-1" /> You
                      qualify for free delivery!
                    </p>
                  </div>
                )}

                {minShelfLife != null && (
                  <div className={cn("rounded-xl bg-amber-50 border border-amber-200 p-3 space-y-1.5", !summaryOpen && "hidden lg:block")}>
                    <p className="text-sm font-semibold text-amber-700 flex items-center gap-1.5">
                      <Timer size={14} className="shrink-0" />
                      Your order includes items best consumed within {minShelfLife} day{minShelfLife > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-amber-600">
                      We&apos;ll pick and deliver as fast as possible to ensure peak freshness.
                    </p>
                  </div>
                )}

                <div className={cn("rounded-xl bg-primary/5 border border-primary/15 p-3 space-y-2", !summaryOpen && "hidden lg:block")}>
                  <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                    <Truck size={14} className="shrink-0" />
                    Delivery Schedule
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-[var(--color-body)]">
                      <span className="font-semibold text-foreground">Before 7 AM</span> &mdash; We pick fresh today and deliver to your door
                    </p>
                    <p className="text-sm text-[var(--color-body)]">
                      <span className="font-semibold text-foreground">After 7 AM</span> &mdash; We pick tomorrow morning, pack and send
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mushrooms are picked only after your order &mdash; never sitting in storage.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
