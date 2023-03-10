import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import Link from "next/link";
import Loading from "../components/Loading";

const Home: NextPage = () => {
  const { data, isLoading, isError } = trpc.quiz.getQuizzes.useQuery();
  if (isLoading) return <Loading />;
  if (isError) return <div>Error</div>;
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
              <Link
                href={`/quizzes/${quiz.id}`}
                className="text-3xl font-bold hover:underline hover:decoration-2"
              >
                {quiz.title}
              </Link>
              <p className="text-zinc-600">{quiz.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
