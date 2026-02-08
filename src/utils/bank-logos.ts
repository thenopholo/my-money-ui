import nubankLogo from "../assets/nubank-logo.png";
import itauLogo from "../assets/Itaú_Unibanco_Logo.png";
import ricoLogo from "../assets/rico-bank-logo.png";
import mercadoPagoLogo from "../assets/mercado-pago.webp";

const bankLogos: Record<string, string> = {
  nubank: nubankLogo,
  "itaú": itauLogo,
  itau: itauLogo,
  rico: ricoLogo,
  "mercado pago": mercadoPagoLogo,
};

export function getBankLogo(bankName: string): string | null {
  const lower = bankName.toLowerCase();
  for (const [keyword, logo] of Object.entries(bankLogos)) {
    if (lower.includes(keyword)) return logo;
  }
  return null;
}
