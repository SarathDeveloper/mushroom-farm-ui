/** Indian mobile: exactly 10 digits, first digit 6–9. */
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function normalizeIndianMobile(value: string): string {
  let digits = value.replace(/\D/g, "");
  // Drop a pasted "+91" / "0" prefix rather than keeping the first 10 digits.
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
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
