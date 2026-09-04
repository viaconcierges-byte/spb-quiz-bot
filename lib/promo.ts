export const REWARD_THRESHOLD = 8;

export function generatePromoCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (len: number) =>
    Array.from(
      { length: len },
      () => alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join("");
  return `SPB-${part(4)}-${part(4)}`;
}
