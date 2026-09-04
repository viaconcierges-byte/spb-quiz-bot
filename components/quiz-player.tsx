"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Check, Copy, Home, X } from "lucide-react";
import { type QuizTopic } from "@/lib/quiz-data";
import { generatePromoCode, REWARD_THRESHOLD } from "@/lib/promo";
import { copyToClipboard } from "@/lib/clipboard";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { ContactsBlock, ShareQuiz } from "@/components/result-share";

const QUESTION_TIME = 30;
const TOTAL_QUESTIONS = 10;
const USER_ID_KEY = "spb_user_id";
const PROMO_KEY = "spb_promo_code";
const CONFETTI_COLORS = [
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#22c55e",
  "#06b6d4",
];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

function createConfettiPieces(): ConfettiPiece[] {
  return Array.from({ length: 26 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.2 + Math.random() * 0.8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 6,
  }));
}

function resultEmoji(score: number): string {
  if (score < 6) return "😞";
  if (score <= 7) return "🙂";
  return "😄";
}

export default function QuizPlayer({ topic }: { topic: QuizTopic }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const question = topic.questions[index];

  useEffect(() => {
    track("topic_selected", { topic_id: topic.id, topic_title: topic.title });
  }, [topic.id, topic.title]);

  useEffect(() => {
    if (answered || finished) return;
    if (timeLeft <= 1) {
      const timer = setTimeout(() => {
        setSelected(null);
        setCorrect(false);
        setAnswered(true);
        track("question_answered", {
          topic_id: topic.id,
          topic_title: topic.title,
          question_index: index + 1,
          correct: false,
          timed_out: true,
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, finished, index, topic.id, topic.title]);

  const chooseOption = (optionIndex: number) => {
    if (answered) return;
    const isCorrect = optionIndex === question.correctIndex;
    setSelected(optionIndex);
    setCorrect(isCorrect);
    setAnswered(true);
    track("question_answered", {
      topic_id: topic.id,
      topic_title: topic.title,
      question_index: index + 1,
      correct: isCorrect,
      timed_out: false,
    });
    if (isCorrect) {
      setScore((value) => value + 1);
      setConfettiPieces(createConfettiPieces());
      setConfetti(true);
    }
  };

  const nextQuestion = () => {
    setConfetti(false);
    setConfettiPieces([]);
    if (index >= TOTAL_QUESTIONS - 1) {
      setFinished(true);
      track("theme_completed", {
        topic_id: topic.id,
        topic_title: topic.title,
        score,
        total: TOTAL_QUESTIONS,
      });
      if (score >= REWARD_THRESHOLD) claimPromo();
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setAnswered(false);
    setCorrect(false);
    setTimeLeft(QUESTION_TIME);
  };

  const getOrCreateUserId = () => {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  };

  const claimPromo = useCallback(async () => {
    const localCode = localStorage.getItem(PROMO_KEY);
    if (localCode) {
      track("replay_attempt", { topic_id: topic.id, topic_title: topic.title });
      setPromoCode(localCode);
      return;
    }

    getOrCreateUserId();
    setPromoLoading(true);

    const code = generatePromoCode();
    localStorage.setItem(PROMO_KEY, code);
    setPromoCode(code);
    track("promo_rewarded", {
      topic_id: topic.id,
      topic_title: topic.title,
      score,
    });
  }, [score, topic.id, topic.title]);

  const copyPromo = async () => {
    if (!promoCode) return;
    const id = toast.loading("Копируем промокод...");
    const ok = await copyToClipboard(promoCode);
    if (ok) {
      toast.success("Промокод скопирован", { id });
    } else {
      toast.error("Не удалось скопировать промокод", { id });
    }
  };

  if (finished) {
    return (
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
            {resultEmoji(score)}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {score >= REWARD_THRESHOLD
                ? "Ты — настоящий знаток Петербурга! 🎉"
                : "Тема завершена"}
            </h1>
            <p className="text-lg text-muted-foreground">
              Ты ответил правильно на{" "}
              <span className="font-semibold text-foreground">{score}</span> из{" "}
              {TOTAL_QUESTIONS} вопросов
            </p>
          </div>

          {score >= REWARD_THRESHOLD && (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              {promoLoading && !promoCode ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Твой промокод
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Скидка 10% на экскурсии
                  </p>
                  <p className="my-3 font-mono text-2xl font-bold tracking-wider">
                    {promoCode}
                  </p>
                  {promoCode && (
                    <Button
                      variant="outline"
                      onClick={copyPromo}
                      className="w-full"
                    >
                      <Copy />
                      Скопировать промокод
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <ShareQuiz topicId={topic.id} />
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/" />}
              className="w-full"
            >
              <Home />
              Вернуться к темам
            </Button>
          </div>

          <ContactsBlock />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-16">
      {confetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="absolute top-0 block rounded-sm confetti-piece"
              style={{
                left: `${piece.left}%`,
                width: piece.size,
                height: piece.size * 0.45,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full space-y-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="font-medium uppercase tracking-wide">
            {topic.title}
          </div>
          <div className="tabular-nums">
            Счёт: <span className="font-semibold text-foreground">{score}</span>
            /{TOTAL_QUESTIONS}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Вопрос {index + 1} из {TOTAL_QUESTIONS}
            </span>
            <span
              className={cn(
                "tabular-nums font-semibold",
                timeLeft <= 5 && !answered && "text-destructive animate-pulse"
              )}
            >
              {timeLeft} сек
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-linear",
                timeLeft <= 5 ? "bg-destructive" : "bg-primary"
              )}
              style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
            />
          </div>
        </div>

        <div
          key={index}
          className="rounded-2xl border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="mb-4 flex items-start gap-3">
            <span className="text-4xl leading-none">{question.emoji}</span>
            <h2 className="pt-1 text-xl font-semibold leading-snug">
              {question.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, optionIndex) => {
              const isCorrectOption = optionIndex === question.correctIndex;
              const isSelected = optionIndex === selected;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => chooseOption(optionIndex)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors",
                    !answered &&
                      "border-border bg-background hover:border-primary hover:bg-accent cursor-pointer",
                    answered &&
                      isCorrectOption &&
                      "border-green-500 bg-green-500/10 text-green-700",
                    answered &&
                      isSelected &&
                      !isCorrectOption &&
                      "border-red-500 bg-red-500/10 text-red-700 animate-shake",
                    answered &&
                      !isCorrectOption &&
                      !isSelected &&
                      "border-border bg-background opacity-50"
                  )}
                >
                  {answered && isCorrectOption && (
                    <Check className="h-5 w-5 shrink-0" />
                  )}
                  {answered && isSelected && !isCorrectOption && (
                    <X className="h-5 w-5 shrink-0" />
                  )}
                  {!answered && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
                      {optionIndex + 1}
                    </span>
                  )}
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {answered && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div
              className={cn(
                "rounded-xl border p-4",
                correct
                  ? "border-green-500/40 bg-green-500/5"
                  : "border-destructive/40 bg-destructive/5"
              )}
            >
              <div className="mb-1 flex items-center gap-2 font-semibold">
                {correct ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-700">Верно!</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-600" />
                    <span className="text-red-700">
                      {selected === null ? "Время вышло" : "Неверно"}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {question.explanation}
              </p>
            </div>

            <Button onClick={nextQuestion} className="w-full">
              {index >= TOTAL_QUESTIONS - 1 ? "Завершить" : "Следующий вопрос"}
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
