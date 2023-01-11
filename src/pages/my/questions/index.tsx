import Loading from "@/src/components/Loading";
import { trpc } from "@/src/utils/trpc";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  content: z.string(),
  difficulty: z.array(z.enum(["Easy", "Medium", "Hard"])),
  tag: z.string(),
});

type FormSchema = z.infer<typeof schema>;

const defaultQuery: FormSchema = {
  content: "",
  difficulty: ["Easy", "Medium", "Hard"],
  tag: "",
};

const QuestionPage: NextPage = () => {
  const [query, setQuery] = useState(defaultQuery);
  const { data, isFetching } = trpc.question.getQuestions.useQuery(query);
  const { data: tags } = trpc.question.getTags.useQuery();
  const { register, handleSubmit, watch, resetField } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: defaultQuery,
  });

  const watchContent = watch("content");

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    setQuery(data);
  };
  return (
    <div className="mx-auto mt-16 w-max">
      <Link
        href={"/my/questions/new"}
        className="mx-auto mb-4 block w-72 bg-lime-500 py-2 text-center text-lg font-bold text-lime-100 hover:bg-lime-600"
      >
        Create more question
      </Link>
      <div className="text-center">~ or ~</div>
      <Link
        href={"/my/quizzes"}
        className="mx-auto block w-max py-2 text-center text-lg text-lime-600 underline"
      >
        View your quizzes
      </Link>
      <div>
        <form
          className="relative mb-6 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative flex items-center bg-amber-50">
            <input
              type={"search"}
              className="w-full border-amber-400 placeholder:font-light placeholder:text-amber-500 focus:border-amber-800 focus:ring-transparent"
              placeholder="Search..."
              {...register("content")}
            />
            {watchContent !== "" && (
              <button
                className="absolute right-0 -translate-x-4"
                type="button"
                onClick={() => resetField("content")}
              >
                <XMarkIcon className="h-5 w-5 font-bold" />
              </button>
            )}
          </div>

          <div className="justfiy-around flex">
            <div className="mx-auto flex w-max gap-8">
              <label className="flex items-center gap-2">
                <input
                  type={"checkbox"}
                  value="Easy"
                  {...register("difficulty")}
                />
                <div className="relative flex flex-row-reverse">
                  <div className="absolute h-full w-2 bg-green-500" />
                  <p className="pr-3">Easy</p>
                </div>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type={"checkbox"}
                  value="Medium"
                  {...register("difficulty")}
                />
                <div className="relative flex flex-row-reverse">
                  <div className="absolute h-full w-2 bg-yellow-500" />
                  <p className="pr-3">Medium</p>
                </div>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type={"checkbox"}
                  value="Hard"
                  {...register("difficulty")}
                />
                <div className="relative flex flex-row-reverse">
                  <div className="absolute h-full w-2 bg-red-500" />
                  <p className="pr-3">Hard</p>
                </div>
              </label>
            </div>

            <div>
              <select {...register("tag")}>
                <option value="">All tag</option>
                {tags?.map((tag) => {
                  return (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-2 text-xl font-bold text-blue-100"
          >
            Search
          </button>
        </form>
        <div className="mx-auto grid w-max grid-cols-1 gap-4 md:grid-cols-2">
          {isFetching ? (
            <Loading />
          ) : (
            data?.map((question) => {
              return (
                <Link
                  key={question.id}
                  className="relative flex w-80 flex-col overflow-hidden rounded-2xl border border-amber-400 bg-amber-300 px-6 py-3 hover:bg-amber-200"
                  href={`/my/questions/${question.id}`}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-4 ${
                      question.difficulty === "Easy"
                        ? "bg-green-500"
                        : question.difficulty === "Medium"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                  />
                  <p className="text-xl font-semibold text-amber-800">
                    {question.content}
                  </p>
                  <div className="text-xs text-amber-600">
                    {question.created_at.toLocaleString()}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
