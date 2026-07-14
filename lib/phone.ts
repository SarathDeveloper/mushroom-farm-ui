/** Indian mobile: exactly 10 digits, first digit 6–9. */
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function normalizeIndianMobile(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function isValidIndianMobile(phone: string): boolean {
  return INDIAN_MOBILE_REGEX.test(phone);
}

export function indianMobileError(phone: string): string | null {
  if (!phone) return "Phone number is required.";
  if (phone.length !== 10) return "Enter a valid 10-digit mobile number.";
  if (!/^[6-9]/.test(phone)) {
    return "Mobile number must start with 6, 7, 8, or 9.";
  }
  if (!INDIAN_MOBILE_REGEX.test(phone)) {
    return "Enter a valid 10-digit mobile number.";
  }
  return null;
}
