import Image from "next/image";
import Link from "next/link";
import { Landmark, Clapperboard, Factory, Rocket } from "lucide-react";
import { HomeTracking } from "@/components/home-tracking";

const topics = [
  {
    id: "petr-nika",
    title: "От Петра до Ники",
    icon: Landmark,
  },
  {
    id: "kult-kadr",
    title: "Культ и кадр",
    icon: Clapperboard,
  },
  {
    id: "leningrad-kod",
    title: "Ленинградский код",
    icon: Factory,
  },
  {
    id: "novoe-vremya",
    title: "Новое время",
    icon: Rocket,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-16">
      <HomeTracking />
      <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src="/assets/image.jpeg"
            alt="Логотип проекта «Код Петербурга»"
            width={200}
            height={200}
            className="rounded-3xl object-cover shadow-lg"
            priority
          />
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Квиз-викторина
          </p>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="text-black">Код Петербурга</span> 🗝️
            </h1>
            <div className="space-y-3 text-left">
              <p className="text-lg font-semibold leading-snug text-foreground">
                Проверь, как хорошо ты знаешь Петербург.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                На выбор 4 темы по 10 вопросов.
                <br />
                На каждый вопрос — 30 секунд.
                <br />
                Никуда не лезь 😉 — только твои знания и интуиция.
              </p>
            </div>
            <p className="text-xl font-semibold">Начинай! Выбери тему:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {topics.map((topic, index) => (
            <Link
              key={topic.title}
              href={`/quiz/${topic.id}`}
              className="card-hover group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm cursor-pointer"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <topic.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Тема {index + 1}
                </div>
                <div className="text-lg font-semibold leading-tight">
                  {topic.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
