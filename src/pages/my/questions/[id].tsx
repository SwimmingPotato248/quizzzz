import GoBackButton from "@/src/components/GoBackButton";
import Loading from "@/src/components/Loading";
import { trpc } from "@/src/utils/trpc";
import { Dialog } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const QuestionDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  if (typeof id !== "string") return <div>Error</div>;
  const { data, isLoading } = trpc.question.getOne.useQuery({ id });
  const { mutate } = trpc.question.delete.useMutation({
    onSuccess() {
      router.push(router.asPath.split("/").slice(0, -1).join("/"));
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto mt-12 w-96">
      <GoBackButton />
      <div className="flex items-start justify-between">
        <div className="py-1 px-2">
          <p className="text-2xl font-semibold">{data?.content}</p>
          <p className="text-sm text-zinc-400">
            Created at {data?.created_at.toLocaleString()}
          </p>
        </div>
        <button type="button" onClick={() => setIsOpen(true)}>
          <TrashIcon className="h-6 w-6 text-red-500  hover:text-red-600" />
        </button>
      </div>
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

      {/* Delete confirmation dialog */}

      <Dialog onClose={setIsOpen} open={isOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={"bg-slate-100 px-6 py-3"}>
            <Dialog.Title className={"text-center text-xl text-slate-800"}>
              Delete confirmation
            </Dialog.Title>
            <Dialog.Description className={"text-slate-600"}>
              Are you sure you want to delete this question?
            </Dialog.Description>
            <div className="flex w-full justify-end gap-4 p-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:underline"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 p-2 font-bold text-red-100 hover:bg-red-500"
                onClick={() => {
                  mutate({ id });
                }}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default QuestionDetailPage;
