"use client";

import { useState, useEffect } from "react";
import { ShippingAddress } from "@/types/order";

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialValues?: Partial<ShippingAddress>;
}

const STORAGE_KEY = "bitjunk_shipping";

export default function ShippingForm({
  onSubmit,
  initialValues,
}: ShippingFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    stateCode: "",
    countryCode: "US",
    zip: "",
    ...initialValues,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddress((prev) => ({ ...prev, ...parsed }));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!address.name.trim()) newErrors.name = "Name is required";
    if (!address.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email))
      newErrors.email = "Invalid email format";
    if (!address.phone.trim()) newErrors.phone = "Phone is required";
    if (!address.address1.trim()) newErrors.address1 = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.stateCode.trim()) newErrors.stateCode = "State is required";
    if (!address.zip.trim()) newErrors.zip = "ZIP code is required";
    if (!address.countryCode.trim()) newErrors.countryCode = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
      onSubmit(address);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClassName = (field: keyof ShippingAddress) =>
    `w-full border-2 bg-black px-4 py-3 text-white placeholder-zinc-600 transition-colors focus:outline-none ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-zinc-700 focus:border-lime-400"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={address.name}
            onChange={handleChange}
            className={inputClassName("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={address.email}
            onChange={handleChange}
            className={inputClassName("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone *"
            value={address.phone}
            onChange={handleChange}
            className={inputClassName("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <input
            type="text"
            name="address1"
            placeholder="Street Address *"
            value={address.address1}
            onChange={handleChange}
            className={inputClassName("address1")}
          />
          {errors.address1 && (
            <p className="mt-1 text-xs text-red-500">{errors.address1}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <input
            type="text"
            name="address2"
            placeholder="Apartment, suite, etc. (optional)"
            value={address.address2}
            onChange={handleChange}
            className={inputClassName("address2")}
          />
        </div>

        <div>
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={address.city}
            onChange={handleChange}
            className={inputClassName("city")}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-500">{errors.city}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="stateCode"
              placeholder="State *"
              value={address.stateCode}
              onChange={handleChange}
              className={inputClassName("stateCode")}
            />
            {errors.stateCode && (
              <p className="mt-1 text-xs text-red-500">{errors.stateCode}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="zip"
              placeholder="ZIP *"
              value={address.zip}
              onChange={handleChange}
              className={inputClassName("zip")}
            />
            {errors.zip && (
              <p className="mt-1 text-xs text-red-500">{errors.zip}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <select
            name="countryCode"
            value={address.countryCode}
            onChange={handleChange}
            className={inputClassName("countryCode")}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
          </select>
          {errors.countryCode && (
            <p className="mt-1 text-xs text-red-500">{errors.countryCode}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-lime-400 py-4 text-lg font-black uppercase tracking-wide text-black transition-colors hover:bg-lime-300"
      >
        Continue to Payment
      </button>
    </form>
  );
}
