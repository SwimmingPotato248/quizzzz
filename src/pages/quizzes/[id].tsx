import { trpc } from "@/src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  answers: z.array(
    z.object({
      id: z.string(),
    })
  ),
});

type FormSchemaType = z.infer<typeof schema>;

const QuizPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { register } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });
  if (typeof id !== "string") return <div>Error...</div>;
  const { data } = trpc.quiz.getOne.useQuery({ id });
  console.log(data);

  return (
    <div className="mx-auto w-max">
      <p className="text-center text-3xl font-bold text-sky-700">
        {data?.title}
      </p>
      <div className="flex flex-col gap-4">
        {data?.questions.map((question) => {
          return (
            <div key={question.id} className="w-96">
              <p className="text-xl font-semibold">{question.content}</p>
              <div className="flex flex-col gap-2">
                {question.answers.map((answer) => {
                  return (
                    <label key={answer.id} className="flex items-center">
                      <input
                        type={"radio"}
                        name={question.id}
                        value={answer.id}
                        className="peer hidden"
                      />
                      <div className="block w-full cursor-pointer rounded-full border border-slate-400 bg-slate-300 py-2 px-4  text-lg text-slate-900 peer-checked:border-emerald-700 peer-checked:bg-emerald-600 peer-checked:text-emerald-200 peer-checked:ring-emerald-600">
                        {answer.content}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizPage;
