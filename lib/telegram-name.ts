"use client";

export const DEFAULT_PLAYER_NAME = "Игрок";

interface TelegramUser {
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface TelegramWebApp {
  initDataUnsafe?: { user?: TelegramUser };
}

interface TelegramGlobal {
  WebApp?: TelegramWebApp;
}

export function getTelegramPlayerName(): string {
  if (typeof window === "undefined") return DEFAULT_PLAYER_NAME;

  try {
    const tg = (window as unknown as { Telegram?: TelegramGlobal }).Telegram;
    const user = tg?.WebApp?.initDataUnsafe?.user;
    if (!user) return DEFAULT_PLAYER_NAME;

    const full = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (full) return full;
    if (user.username) return user.username;
  } catch {
    // игнорируем ошибки доступа к Telegram WebApp
  }

  return DEFAULT_PLAYER_NAME;
}
