import { useState, type FC } from "react";
import { trpc } from "../utils/trpc";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import Loading from "./Loading";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type FormSchema = z.infer<typeof schema>;

const querySchema = z.object({
  content: z.string(),
  difficulty: z.array(z.enum(["Easy", "Medium", "Hard"])),
  tag: z.string(),
});

type QuerySchema = z.infer<typeof querySchema>;

const defaultQuery: QuerySchema = {
  content: "",
  difficulty: ["Easy", "Medium", "Hard"],
  tag: "",
};

const CreateQuizForm: FC = () => {
  const [query, setQuery] = useState(defaultQuery);
  const router = useRouter();
  const { data: questions } = trpc.question.getQuestions.useQuery(defaultQuery);
  const { data, isLoading } = trpc.question.getQuestions.useQuery(query);
  const { data: tags } = trpc.question.getTags.useQuery();
  const { mutate } = trpc.quiz.create.useMutation({
    onSuccess(data) {
      router.push(`/my/quizzes/${data?.id}`);
    },
  });
  const [selected, setSelected] = useState<{ id: string }[]>([]);
  const { register, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const { register: queryRegister, handleSubmit: queryHandleSubmit } =
    useForm<QuerySchema>({
      resolver: zodResolver(querySchema),
      mode: "onSubmit",
      defaultValues: defaultQuery,
    });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    if (selected.length) {
      mutate({ ...data, questions: selected });
    }
  };

  const onQuerySubmit: SubmitHandler<QuerySchema> = (data) => {
    setQuery(data);
  };

  return (
    <div className="mx-auto flex w-96 flex-col gap-6 divide-x divide-zinc-500 bg-emerald-200 md:w-fit md:flex-row md:rounded-3xl">
      <form
        className="flex w-96 flex-col gap-4 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="flex flex-col gap-1">
          Title
          <input
            type={"text"}
            {...register("title")}
            className="border-amber-600 focus:border-amber-700 focus:ring-amber-600"
          />
        </label>
        <label className="flex flex-col gap-1">
          Description
          <textarea
            className="resize-none border-amber-600 focus:border-amber-700 focus:ring-amber-600"
            cols={37}
            rows={4}
            {...register("description")}
            onChange={(e) => {
              e.target.rows = Math.max(
                Math.ceil(e.target.value.length / e.target.cols),
                4
              );
            }}
          ></textarea>
        </label>
        <div>
          <p>Selected questions</p>
          {selected.length !== 0 ? (
            <div className="divide-y divide-emerald-700">
              {questions
                ?.filter((question) =>
                  selected.some((e) => e.id === question.id)
                )
                .map((question) => {
                  return (
                    <div
                      key={question.id}
                      className="flex justify-between p-2 text-lg"
                    >
                      <p>{question.content}</p>
                      <div>
                        <button
                          className="rounded-full bg-red-600 p-1"
                          type="button"
                          onClick={() => {
                            setSelected((prev) =>
                              prev.filter((e) => e.id !== question.id)
                            );
                          }}
                        >
                          <MinusIcon className="h-3 w-3 text-red-100" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="my-2 bg-red-100 py-1 text-center text-red-700">
              Select at least one question
            </div>
          )}
        </div>
        <button className="bg-teal-600 py-2 text-lg font-bold text-teal-100 hover:bg-teal-500">
          Create quiz
        </button>
      </form>

      <div className="max-h-full w-96 overflow-scroll p-4">
        <p className="mb-2">Your questions</p>
        <form
          className="flex flex-col gap-2 border-b-2 border-emerald-600 py-1"
          onSubmit={queryHandleSubmit(onQuerySubmit)}
        >
          <div className="relative flex items-center">
            <input
              type={"search"}
              className="w-full border-amber-400 placeholder:font-light placeholder:text-amber-500 focus:border-amber-800 focus:ring-transparent"
              placeholder="Search..."
              {...queryRegister("content")}
            />
            <button className="absolute right-0 h-full bg-zinc-300 px-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-zinc-800" />
            </button>
          </div>

          <div className="mx-auto flex w-max gap-8">
            <label className="flex items-center gap-2">
              <input
                type={"checkbox"}
                value="Easy"
                {...queryRegister("difficulty")}
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
                {...queryRegister("difficulty")}
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
                {...queryRegister("difficulty")}
              />
              <div className="relative flex flex-row-reverse">
                <div className="absolute h-full w-2 bg-red-500" />
                <p className="pr-3">Hard</p>
              </div>
            </label>
          </div>

          <div>
            <select {...queryRegister("tag")} className="w-full">
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
        </form>
        <div className="divide-y divide-emerald-600">
          {isLoading ? (
            <Loading />
          ) : (
            data
              ?.filter(
                (question) => !selected.some((e) => e.id === question.id)
              )
              .map((question) => {
                return (
                  <div
                    key={question.id}
                    className="relative flex items-center justify-between py-2 px-3"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-3 ${
                        question.difficulty === "Easy"
                          ? "bg-green-500"
                          : question.difficulty === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div className="pl-2">
                      <p className="text-xl">{question.content}</p>
                      <p className="text-sm text-gray-500">
                        {question.difficulty} {question.tag.name.toLowerCase()}{" "}
                        question
                      </p>
                    </div>
                    <div>
                      <button
                        className="rounded-full bg-green-500 p-1"
                        type="button"
                        onClick={() => {
                          setSelected((prev) => {
                            return [...prev, { id: question.id }];
                          });
                        }}
                      >
                        <PlusIcon className="h-3 w-3 text-green-100" />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizForm;
