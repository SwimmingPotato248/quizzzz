import { trpc } from "@/src/utils/trpc";
import { type NextPage } from "next";
import { useRouter } from "next/router";

const QuestionDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return <div>Error</div>;
  const { data } = trpc.question.getOne.useQuery({ id });
  console.log(data);

  return (
    <div className="mx-auto w-96">
      <p className="py-1 px-2 text-2xl font-semibold">{data?.content}</p>
      <ul className="divide-y divide-amber-500">
        {data?.answers.map((answer) => {
          return (
            <li
              key={answer.id}
              className={`${
                answer.status
                  ? "bg-green-600 text-lg font-semibold text-green-100"
                  : "bg-red-500 text-red-100"
              } py-2 px-6`}
            >
              {answer.content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default QuestionDetailPage;
