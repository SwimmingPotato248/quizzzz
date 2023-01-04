import { useState, type FC, useRef } from "react";
import { trpc } from "../utils/trpc";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type FormSchema = z.infer<typeof schema>;

const CreateQuizForm: FC = () => {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data } = trpc.question.getQuestions.useQuery({ query });
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

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    if (selected.length) {
      mutate({ ...data, questions: selected });
    }
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
              {data
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
      <div className="max-h-full w-80 overflow-scroll p-4">
        <p className="mb-2">Your questions</p>
        <form
          className="relative mb-2 flex items-center bg-amber-50"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchInputRef.current) {
              setQuery(searchInputRef.current.value);
            }
          }}
        >
          <input
            type={"search"}
            className="w-full border-amber-400 placeholder:font-light placeholder:text-amber-500 focus:border-amber-800 focus:ring-transparent"
            placeholder="Search..."
            ref={searchInputRef}
          />
          {query !== "" && (
            <button
              className="absolute right-0 -translate-x-14 rounded-full"
              type="button"
              onClick={() => {
                setQuery("");
                if (searchInputRef.current) searchInputRef.current.value = "";
              }}
            >
              <XMarkIcon className="h-5 w-5 font-bold" />
            </button>
          )}
          <button className="absolute right-0 h-full bg-zinc-300 px-4">
            <MagnifyingGlassIcon className="h-6 w-6 text-zinc-800" />
          </button>
        </form>
        <div className="divide-y divide-emerald-600">
          {data
            ?.filter((question) => !selected.some((e) => e.id === question.id))
            .map((question) => {
              return (
                <div
                  key={question.id}
                  className="flex items-center justify-between py-2 px-3"
                >
                  <p className="text-xl">{question.content}</p>
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
            })}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizForm;
