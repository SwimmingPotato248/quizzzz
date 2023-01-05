import { trpc } from "@/src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  answers: z.array(
    z.object({
      question_id: z.string(),
      answer_id: z.string(),
    })
  ),
});

type FormSchemaType = z.infer<typeof schema>;

const QuizPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = trpc.quiz.getOne.useQuery({
    id: typeof id === "string" ? id : "",
  });
  const { register, handleSubmit } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      answers: [],
    },
    values: {
      answers: data
        ? data?.questions.map((question) => {
            return { question_id: question.id, answer_id: "" };
          })
        : [],
    },
  });

  if (typeof id !== "string") return <div>Error...</div>;

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
  };

  return (
    <div className="mx-auto w-max">
      <p className="text-center text-3xl font-bold text-sky-700">
        {data?.title}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-12">
          {data?.questions.map((question, index) => {
            return (
              <div key={question.id} className="w-fit">
                <p className="text-xl font-semibold md:w-[800px]">
                  {question.content}
                </p>
                <div className="grid w-fit grid-cols-2 gap-x-8 gap-y-2">
                  {question.answers.map((answer) => {
                    return (
                      <label key={answer.id} className="flex w-96 items-center">
                        <input
                          type={"radio"}
                          value={answer.id}
                          className="peer hidden"
                          {...register(`answers.${index}.answer_id` as const)}
                        />
                        <div className="block w-full cursor-pointer rounded-full border border-slate-400 bg-slate-300 py-2 px-4  text-lg text-slate-900 hover:bg-slate-400 peer-checked:border-emerald-700 peer-checked:bg-emerald-600 peer-checked:text-emerald-200 peer-checked:ring-emerald-600">
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
        <button className="mx-auto mt-8 block rounded-2xl bg-sky-700 px-8 py-4 text-xl font-bold text-sky-100 hover:bg-sky-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default QuizPage;
