"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Star,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Address = {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalOrders: number;
  addresses: Address[];
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: "HOME",
    street: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/account");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setForm({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => (prev ? { ...prev, ...data } : prev));
        setEditMode(false);
        toast.success("Profile updated!");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress
        ? `/api/account/addresses/${editingAddress.id}`
        : "/api/account/addresses";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (res.ok) {
        toast.success(editingAddress ? "Address updated!" : "Address added!");
        setShowAddressForm(false);
        setEditingAddress(null);
        resetAddressForm();
        fetchProfile();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save address");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address removed");
        fetchProfile();
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        toast.success("Default address updated");
        fetchProfile();
      }
    } catch {
      toast.error("Failed to set default");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({ type: "HOME", street: "", city: "", state: "Tamil Nadu", pincode: "", isDefault: false });
  };

  const startEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({
      type: addr.type,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHero eyebrow="Account" title="My Account" />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero eyebrow="Account" title="My Account" />

      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
          {/* Profile Card */}
          <FadeIn>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                  Profile Information
                </h2>
                {!editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setEditMode(true)}
                  >
                    <Pencil size={14} className="mr-1.5" />
                    Edit
                  </Button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 93855 26105"
                        className="h-11"
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">Phone number cannot be changed.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={saving} className="rounded-full px-6">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                      onClick={() => {
                        setEditMode(false);
                        setForm({ name: profile.name, email: profile.email, phone: profile.phone });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{profile.name || "—"}</p>
                      <p className="text-sm text-muted-foreground">Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{profile.email || "—"}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{profile.phone || "—"}</p>
                      <p className="text-sm text-muted-foreground">Phone</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="text-center p-4 rounded-xl bg-secondary">
                      <p className="text-2xl font-bold text-primary">{profile.totalOrders}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary">
                      <p className="text-base font-bold text-foreground">{profile.memberSince}</p>
                      <p className="text-sm text-muted-foreground mt-1">Member Since</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Addresses */}
          <FadeIn>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                  Saved Addresses
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    resetAddressForm();
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                >
                  <Plus size={14} className="mr-1.5" />
                  Add
                </Button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="mb-6 p-5 rounded-xl border border-border bg-secondary/50 space-y-4">
                  <h3 className="text-base font-bold text-foreground">
                    {editingAddress ? "Edit Address" : "New Address"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Address Type</Label>
                      <div className="flex gap-2">
                        {["HOME", "WORK", "OTHER"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAddressForm({ ...addressForm, type: t })}
                            className={`rounded-full px-4 py-1.5 text-base font-medium border transition-colors ${
                              addressForm.type === t
                                ? "bg-primary text-white border-primary"
                                : "bg-card text-foreground border-border hover:bg-secondary"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="House/Flat No., Street, Landmark"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="City"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        placeholder="State"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        placeholder="606209"
                        className="h-11"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4 rounded border-border text-primary"
                      />
                      <Label htmlFor="isDefault" className="text-base">Set as default</Label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={savingAddress} className="rounded-full px-6">
                      {savingAddress ? <Loader2 size={16} className="animate-spin" /> : editingAddress ? "Update" : "Save Address"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                      onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {profile.addresses.length === 0 && !showAddressForm ? (
                <div className="text-center py-10">
                  <MapPin size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-base text-muted-foreground">No saved addresses yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Add an address for faster checkout.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border bg-background"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-sm">{addr.type}</Badge>
                          {addr.isDefault && (
                            <Badge variant="default" className="text-sm bg-primary">Default</Badge>
                          )}
                        </div>
                        <p className="text-base text-foreground">{addr.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Set as default"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => startEditAddress(addr)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Edit address"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/orders"
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">My Orders</p>
                  <p className="text-sm text-muted-foreground">Track and manage your orders</p>
                </div>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Wishlist</p>
                  <p className="text-sm text-muted-foreground">Items you saved for later</p>
                </div>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
