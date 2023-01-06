import Loading from "@/src/components/Loading";
import { trpc } from "@/src/utils/trpc";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const QuizPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return <div>Error...</div>;
  const { data, isLoading, isError } = trpc.quiz.getOne.useQuery({ id });
  if (isLoading) return <Loading />;
  if (isError)
    return <div className="mt-16 text-center text-3xl">Error...</div>;
  return (
    <div className="mx-auto mt-12 w-96">
      <p className="text-center text-3xl font-semibold text-sky-700">
        {data?.title}
      </p>
      <p className="text-xs text-zinc-500">
        Created by {data?.user.username} at {data?.created_at.toLocaleString()}
      </p>
      <p className="mt-4 text-lg">{data?.description}</p>
      <p className="text-sm text-slate-800">
        {data?.questions.length} questions
      </p>
      <Link
        href={`/quizzes/${id}/play`}
        className="mt-4 block border-2 border-blue-800 bg-blue-500 py-4 text-center text-xl font-bold text-blue-100 hover:bg-blue-600 "
      >
        Take this quiz {"~>"}
      </Link>
    </div>
  );
};

export default QuizPage;
