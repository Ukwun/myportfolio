export const WHATSAPP_NUMBER = "08119678524";

function whatsappInternationalNumber(number: string) {
  const normalized = number.replace(/\D/g, "");
  return normalized.startsWith("0") ? `234${normalized.slice(1)}` : normalized;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappInternationalNumber(WHATSAPP_NUMBER)}?text=${encodeURIComponent(message)}`;
}
