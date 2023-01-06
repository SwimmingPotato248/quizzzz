import Loading from "@/src/components/Loading";
import { trpc } from "@/src/utils/trpc";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const QuizPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return <div>Error...</div>;
  const { data, isLoading, isError } = trpc.quiz.getOne.useQuery({ id });
  const { data: leaderboard } = trpc.quizAttempt.getLeaderboard.useQuery({
    id,
  });
  if (isLoading) return <Loading />;
  if (isError)
    return <div className="mt-16 text-center text-3xl">Error...</div>;
  return (
    <div className="mt-12 flex md:px-36">
      <div className="mx-auto w-96">
        <p className="text-center text-3xl font-semibold text-sky-700">
          {data?.title}
        </p>
        <p className="text-xs text-zinc-500">
          Created by {data?.user.username} at{" "}
          {data?.created_at.toLocaleString()}
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
      <div className="w-72">
        <p className="text-center text-lg">Leaderboards</p>
        <div className="mb-1 mt-4 flex">
          <div className="flex w-12 justify-center">
            <TrophyIcon className="h-6 w-6 text-zinc-500" />
          </div>
          <div className="flex flex-1 justify-between pl-4">
            <div className="flex-1 text-center">User</div>
            <div className="w-12 text-center">Score</div>
          </div>
        </div>
        {leaderboard?.map((attempt, index) => {
          return (
            <div
              key={attempt.id}
              className={`flex ${
                index === 0
                  ? "bg-yellow-500 text-lg font-bold text-yellow-50"
                  : index === 1
                  ? "bg-slate-500 font-bold text-slate-100"
                  : ""
              }`}
            >
              <div className="flex w-12 justify-center">{index + 1}</div>
              <div className="flex flex-1 justify-between pl-4">
                <div>{attempt.user.username}</div>
                <div className="w-12 text-center">{attempt.score}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizPage;
