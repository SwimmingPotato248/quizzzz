import { trpc } from "@/src/utils/trpc";
import { type NextPage } from "next";
import Link from "next/link";

const UserPage: NextPage = () => {
  const { data } = trpc.quizAttempt.getHistory.useQuery();
  return (
    <div className="mx-auto mt-8 flex w-max">
      <div>
        <h2 className="text-center text-2xl">Your history</h2>
        <table className="mt-4 table-auto border-collapse border-spacing-6 border border-gray-600 shadow-2xl">
          <thead>
            <tr className="bg-blue-500 text-blue-50">
              <th className="w-60 py-2 px-4">Quiz name</th>
              <th className="w-56 py-2 px-4">Completed at</th>
              <th className="w-16 py-2 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((attempt) => {
              return (
                <tr
                  key={attempt.id}
                  className="text-gray-800 odd:bg-gray-100 even:bg-gray-200"
                >
                  <td className="py-2 px-1">{attempt.quiz.title}</td>
                  <td className="py-2 px-1">
                    {attempt.created_at.toLocaleString()}
                  </td>
                  <td className="py-2 px-1 text-center">
                    {attempt.score}/{attempt._count.QuizAttemptDetail}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="ml-12 flex flex-col">
        <Link href={"/my/questions"} className="hover:underline">
          Your question {"~>"}
        </Link>
        <Link href={"/my/quizzes"} className="hover:underline">
          Your quizzes {"~>"}
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
