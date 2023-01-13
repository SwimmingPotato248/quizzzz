import GoBackButton from "@/src/components/GoBackButton";
import { trpc } from "@/src/utils/trpc";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const QuizDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return <div>Error</div>;
  const { data } = trpc.quiz.getMyOne.useQuery({ id });
  return (
    <div className="mx-auto mt-8 w-min">
      <GoBackButton />
      <div className="mx-auto w-96 bg-indigo-100 px-3 py-2 md:rounded-3xl">
        <p className="text-2xl font-bold text-indigo-800">{data?.title}</p>
        <p className="text-sm text-zinc-500">
          {data?.created_at.toLocaleString()}
        </p>
        <p className="mt-3 text-xl text-indigo-500">{data?.description}</p>
        <div className="mt-2">
          <p className="font-semibold text-rose-700">
            Questions ({data?.questions.length})
          </p>
          <ul className="divide-y-2 divide-red-600">
            {data?.questions.map((question) => {
              return (
                <li key={question.id} className="p-2">
                  <Link
                    href={`/my/questions/${question.id}`}
                    className="text-lg text-rose-600"
                  >
                    {question.content}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;
