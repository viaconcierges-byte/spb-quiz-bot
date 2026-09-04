import { notFound } from "next/navigation";
import QuizPlayer from "@/components/quiz-player";
import { getQuizTopic } from "@/lib/quiz-data";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getQuizTopic(topicId);
  if (!topic) notFound();
  return <QuizPlayer topic={topic} />;
}
