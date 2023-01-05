import { trpc } from "@/src/utils/trpc";
import { type NextPage } from "next";
import Link from "next/link";

const QuizzesPage: NextPage = () => {
  const { data } = trpc.quiz.getMyQuizzes.useQuery();
  console.log(data);
  return (
    <div className="mx-auto mt-14 flex w-96 flex-col divide-y-2 divide-sky-500">
      <div className="py-2">
        <Link
          href={"/my/quizzes/new"}
          className="block w-full bg-blue-600 py-2 text-center text-xl font-bold text-blue-100"
        >
          Create new quiz
        </Link>
      </div>
      <div className="py-2">
        <p className="text-center text-lg font-semibold">Your Quizzes</p>
        <div className="flex flex-col divide-y divide-violet-400">
          {data?.map((quiz) => {
            return (
              <Link
                key={quiz.id}
                href={`/my/quizzes/${quiz.id}`}
                className="block bg-fuchsia-200 px-4 py-2 text-fuchsia-800"
              >
                <p>{quiz.title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizzesPage;
