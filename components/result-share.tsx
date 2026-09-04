"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Share2, Copy, Send, Globe, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export const SITE_URL = "https://spbkod.ru";
export const TELEGRAM_BOT_URL = "https://t.me/spbcode_bot";
export const TELEGRAM_CHANNEL_URL = "https://t.me/spbcode";
export const QUIZ_BOT_HANDLE = "@spbcode_quiz_bot";

export function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return SITE_URL;
}

export function ShareResult({
  topicTitle,
  score,
}: {
  topicTitle: string;
  score: number;
}) {
  const shareText =
    `Я прошёл тему «${topicTitle}» в квизе «Код Петербурга» ` +
    `и ответил правильно на ${score} из 10! Попробуй и ты: ${SITE_URL}`;

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Текст для отправки скопирован");
    } catch {
      toast.error("Не удалось скопировать текст");
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="w-full" />}>
        <Share2 />
        Поделиться результатом
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Поделиться результатом</DialogTitle>
          <DialogDescription>
            Отсканируй QR-код или отправь текст друзьям в мессенджер.
          </DialogDescription>
        </DialogHeader>

        <div className="mx-auto rounded-xl border bg-white p-3">
          <QRCodeSVG
            value={shareText}
            size={220}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        <p className="text-center text-sm leading-snug text-muted-foreground">
          {shareText}
        </p>

        <Button onClick={copyText} className="w-full">
          <Copy />
          Скопировать текст
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function MessengerIcon({ name }: { name: string }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "telegram":
      return (
        <svg {...commonProps}>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...commonProps}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      );
    case "vkontakte":
      return (
        <svg {...commonProps}>
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.863-.519-2.052-1.707-1.035-1.009-1.492-1.135-1.745-1.135-.356 0-.458.102-.458.611v1.607c0 .407-.132.623-1.154.623-1.7 0-3.584-1.037-4.914-2.966C4.86 10.992 4.393 9.271 4.393 8.877c0-.255.101-.509.611-.509h1.745c.458 0 .63.203.811.662.863 2.442 2.31 4.578 2.902 4.578.225 0 .326-.102.326-.661V9.448c-.071-1.187-.712-1.287-.712-1.71 0-.203.178-.406.458-.406h2.747c.407 0 .559.203.559.61v3.31c0 .407.174.559.279.559.225 0 .417-.152.856-.59 1.322-1.473 2.262-3.748 2.262-3.748.13-.305.33-.41.713-.41h1.745c.53 0 .636.28.53.66-.224 1.017-2.405 4.034-2.405 4.034-.18.29-.244.41 0 .72.178.244.763.738 1.155 1.187.728.814 1.286 1.501 1.43 1.965.145.458-.09.694-.559.694z" />
        </svg>
      );
    case "viber":
      return (
        <svg {...commonProps}>
          <path d="M12.019 0C5.708 0 1.632 3.886 1.575 9.843c-.028 2.322.602 4.08 1.797 5.456.28.323.384.744.286 1.144-.11.452-.375 1.008-.72 1.571l-.15.244c-.392.642-.503 1.231-.194 1.656.378.52 1.222.76 2.246.687l.553-.042c.32-.023.643-.043.98-.043.474 0 .954.063 1.424.186.505.132 1.01.294 1.502.485.468.182.884.541 1.237.926l.183.193c.233.243.367.566.367.896 0 .482-.264.97-.754 1.402-.628.552-1.576.862-2.65.862h-.16c.804-.174 1.443-.554 1.908-1.087 1.55-1.784 2.743-3.895 3.84-5.963.166-.312.322-.633.47-.958.818.377 1.688.538 2.598.538.045 0 .089 0 .134-.002 1.086-.027 2.092-.377 2.948-1.03.847-.645 1.497-1.54 1.87-2.58.38-1.05.503-2.16.35-3.28-.157-1.13-.614-2.17-1.336-3.043A9.195 9.195 0 0 0 19.93 2.51 8.447 8.447 0 0 0 16.08.587 11.71 11.71 0 0 0 12.019 0zm.15 3.187c.682-.011 1.361.079 1.998.289.838.272 1.596.744 2.214 1.364.618.619 1.091 1.379 1.362 2.217.146.452.224.933.268 1.407l.016.2a.53.53 0 0 1-.36.542.596.596 0 0 1-.724-.27 9.805 9.805 0 0 0-1.553-2.162 7.96 7.96 0 0 0-1.85-1.448c-.283-.158-.335-.558-.139-.812.174-.225.492-.324.768-.327zm.582 1.778a3.232 3.232 0 0 1 1.49.49 3.62 3.62 0 0 1 1.484 1.67.854.854 0 0 1-.486 1.167.835.835 0 0 1-1.114-.493 1.92 1.92 0 0 0-1.484-1.215.852.852 0 0 1-.708-.977.833.833 0 0 1 .818-.642zm3.178.429c.543.042 1.07.202 1.537.472.697.402 1.281.972 1.695 1.659.344.573.56 1.207.638 1.865l.017.179a.864.864 0 0 1-1.47.756.876.876 0 0 1-.249-.605l-.01-.12a4.12 4.12 0 0 0-1.102-2.255 3.817 3.817 0 0 0-1.57-.99.878.878 0 0 1-.626-1.073.855.855 0 0 1 .83-.625c.11 0 .222.013.33.037zM5.186 6.61c.057 2.95 1.925 6.435 4.45 9.03 1.727 1.776 3.706 2.91 5.591 3.384-.298-1.682.367-3.165 2.105-3.655.331.496.907.842 1.487.965.886 1.015 1.387 1.86 1.55 2.583-.328.599-1.011.994-1.917.994-2.084 0-4.193-1.12-5.978-2.7-.21-.185-.419-.37-.617-.565-1.858-1.923-3.209-3.782-3.577-5.238-.307-1.213-.09-2.13.84-2.13.277.497.737.87 1.284.994.463 1.226.263 2.404-.634 3.002l.582.438a3.1 3.1 0 0 0 1.475-1.354c1.696.489 2.977 1.869 3.47 3.665l.546.154a6.015 6.015 0 0 0-3.094-3.848c.658-.77 1.447-1.24 2.374-1.413.435-.082.882-.116 1.326-.07l.083.01c.067.01.134.026.2.045.126.035.247.08.361.137.15.163.282.34.393.53.494.036.971.178 1.394.412.16.406.25.836.27 1.27l-.095.423-.455.017c-1.06.04-2.03-.556-2.513-1.547l-.062.026a3.47 3.47 0 0 0-.617.663 4.06 4.06 0 0 1 1.68.309 4.24 4.24 0 0 1 2.297 2.319c.107.267.17.55.184.837-.016.63-.103 1.254-.26 1.861l-.029.08c-2.26 1.196-5.095 1.26-7.858-.28-2.637-1.485-4.871-4.117-5.934-6.66a1.23 1.23 0 0 0-.446.943z" />
        </svg>
      );
    case "odnoklassniki":
      return (
        <svg {...commonProps}>
          <path d="M12.112 4.413a3.987 3.987 0 1 0 0 7.974 3.987 3.987 0 0 0 0-7.974zm0 5.3a1.313 1.313 0 1 1 0-2.626 1.313 1.313 0 0 1 0 2.626zM17.26 8.454a5.15 5.15 0 0 1-1.523 3.418 5.135 5.135 0 0 1-3.206 1.497 5.04 5.04 0 0 0 3.333 2.013c1.626.278 3.329-.134 4.535-1.237a1.09 1.09 0 0 0-1.45-1.626 2.83 2.83 0 0 1-2.689-.513 2.795 2.795 0 0 1-.766-.95 1.11 1.11 0 0 0-1.001-.602h-.234c-.442 0-.83.265-1.01.678-.183.42-.068.898.244 1.29.261.33.424.742.449 1.16a5.04 5.04 0 0 1-4.393-4.138 5.118 5.118 0 0 1 .927-3.97 5.09 5.09 0 0 1 3.05-1.987 5.08 5.08 0 0 1 5.764 3.026zM12.012 9.54c-.947 0-1.712.765-1.712 1.711 0 .947.765 1.712 1.712 1.712.947 0 1.712-.765 1.712-1.712a1.714 1.714 0 0 0-1.712-1.711z" />
        </svg>
      );
    default:
      return null;
  }
}

const SHARE_MESSENGERS = [
  {
    id: "telegram",
    label: "Telegram",
    url: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        text
      )}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    id: "vkontakte",
    label: "VK",
    url: (url: string, _text: string) =>
      `https://vk.com/share.php?url=${encodeURIComponent(url)}`,
  },
];

export function ShareQuiz({ topicId }: { topicId: string }) {
  const [open, setOpen] = useState(false);
  const quizUrl = `${getBaseUrl()}/quiz/${topicId}`;
  const shareText = `Сыграй в квиз «Код Петербурга» и проверь, как хорошо ты знаешь Петербург: ${quizUrl}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Квиз «Код Петербурга»",
          text: shareText,
          url: quizUrl,
        });
        return;
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
      }
    }
    setOpen(true);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      toast.success("Ссылка на викторину скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  return (
    <>
      <Button variant="outline" className="w-full" onClick={handleShare}>
        <Share2 />
        Поделиться викториной
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Поделиться викториной</DialogTitle>
            <DialogDescription>
              Выбери мессенджер или скопируй ссылку, чтобы поделиться квизом с
              друзьями.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3">
            {SHARE_MESSENGERS.map(({ id, label, url }) => (
              <a
                key={id}
                href={url(quizUrl, shareText)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition-colors hover:border-primary hover:bg-accent"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MessengerIcon name={id} />
                </span>
                <span className="text-xs font-medium leading-tight">
                  {label}
                </span>
              </a>
            ))}
          </div>

          <Separator />

          <Button onClick={copyText} className="w-full">
            <Copy />
            Скопировать ссылку
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ContactsBlock() {
  const links = [
    {
      href: TELEGRAM_BOT_URL,
      label: "Заказ экскурсии",
      sub: "t.me/spbcode_bot",
      icon: Send,
    },
    {
      href: TELEGRAM_CHANNEL_URL,
      label: "Подписка на канал",
      sub: "t.me/spbcode",
      icon: Radio,
    },
    {
      href: SITE_URL,
      label: "Сайт проекта",
      sub: "spbkod.ru",
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-5 text-left shadow-sm">
      <Separator className="mb-1" />
      <div className="flex items-center gap-2">
        <p className="text-lg font-bold tracking-wide text-foreground">
          Контакты проекта
        </p>
        <span className="text-lg leading-none" aria-hidden="true">
          ⬇️
        </span>
      </div>
      <p className="text-base font-medium text-muted-foreground">
        Закажи экскурсию и подпишись на канал, чтобы не пропускать новое.
      </p>
      <div className="flex flex-col gap-2">
        {links.map(({ href, label, sub, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-primary hover:bg-accent"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs text-muted-foreground">{sub}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
