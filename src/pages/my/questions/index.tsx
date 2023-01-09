import { trpc } from "@/src/utils/trpc";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { type NextPage } from "next";
import Link from "next/link";
import { useRef, useState } from "react";

const QuestionPage: NextPage = () => {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data } = trpc.question.getQuestions.useQuery({ query });
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
      <div className="">
        <form
          className="relative mb-6 flex items-center bg-amber-50"
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
              className="absolute right-0 -translate-x-8"
              type="button"
              onClick={() => {
                setQuery("");
                if (searchInputRef.current) searchInputRef.current.value = "";
              }}
            >
              <XMarkIcon className="h-5 w-5 font-bold" />
            </button>
          )}
          <button className="absolute right-0 -translate-x-1">
            <MagnifyingGlassIcon className="h-6 w-6 cursor-pointer" />
          </button>
        </form>
        <div className="mx-auto grid w-max grid-cols-1 gap-4 md:grid-cols-2">
          {data?.map((question) => {
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
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
