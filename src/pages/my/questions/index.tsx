import GoBackButton from "@/src/components/GoBackButton";
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
    <div className="mx-auto mt-16 w-[700px]">
      <GoBackButton />
      <Link
        href={"/my/questions/new"}
        className="mx-auto mb-4 block w-72 bg-lime-500 py-2 text-center text-lg font-bold text-lime-100 hover:bg-lime-600"
      >
        Create more question
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
        <div className="mx-auto flex w-[660px] flex-wrap gap-4">
          {data?.map((question) => {
            return (
              <Link
                key={question.id}
                className="flex w-80 flex-col rounded-2xl border border-amber-400 bg-amber-300 px-6 py-3 hover:bg-amber-200"
                href={`/my/questions/${question.id}`}
              >
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
