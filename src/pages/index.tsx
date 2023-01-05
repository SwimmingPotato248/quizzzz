import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import Link from "next/link";

const Home: NextPage = () => {
  const { data } = trpc.quiz.getQuizzes.useQuery();
  return (
    <div className="mt-14 w-screen">
      <h1 className="hidden text-center">Homepage</h1>
      <div className="mx-auto flex w-96 flex-col gap-6">
        {data?.map((quiz) => {
          return (
            <div
              key={quiz.id}
              className="relative block w-96 overflow-hidden rounded-3xl bg-sky-200 py-4 pl-10 pr-6 text-sky-700"
            >
              <div className="absolute left-0 top-0 h-full w-4 bg-rose-600" />
              <p className="text-2xl font-bold">{quiz.title}</p>
              <p className="text-sm">
                Created by {quiz.user.username} at{" "}
                {quiz.created_at.toLocaleDateString()}
              </p>
              <p>{quiz._count.questions} questions</p>
              <Link
                href={`/quizzes/${quiz.id}`}
                className="text-purple-600 underline"
              >
                Take quiz {"~>"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
