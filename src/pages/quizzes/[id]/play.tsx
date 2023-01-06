import GoBackButton from "@/src/components/GoBackButton";
import { trpc } from "@/src/utils/trpc";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
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

const TakeQuizPage: NextPage = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [transitionLeft, setTransitionLeft] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const { id } = router.query;
  const { mutate } = trpc.quizAttempt.submitAttempt.useMutation({
    onSuccess(data) {
      setScore(data);
      setIsOpen(true);
    },
  });
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
    mutate({ quiz_id: id, answers: data.answers });
  };

  return (
    <div className="mx-auto w-max">
      <p className="text-center text-3xl font-bold text-sky-700">
        {data?.title}
      </p>
      <p className="text-center text-orange-700">
        Question {current + 1} / {data?.questions.length}
      </p>
      <div className="flex justify-center gap-8 px-6">
        <button
          type="button"
          onClick={() => {
            setTransitionLeft(true);
            setCurrent((prev) => {
              if (prev === 0) return data ? data.questions.length - 1 : 0;
              return prev - 1;
            });
          }}
        >
          {"<-"} Prev
        </button>

        <button
          type="button"
          onClick={() => {
            setTransitionLeft(false);
            setCurrent((prev) => {
              if (!data) return 0;
              if (prev === data.questions.length - 1) return 0;
              return prev + 1;
            });
          }}
        >
          Next {"->"}
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-12">
          {data?.questions.map((question, index) => {
            return (
              <div
                className={`w-fit ${index === current ? "block" : "hidden"}`}
                key={question.id}
              >
                <Transition
                  show={index === current}
                  enter="transition duration-150 ease-in-out"
                  enterFrom={
                    transitionLeft ? "-translate-x-full" : "translate-x-full"
                  }
                  enterTo="translate-x-0"
                >
                  <p className="text-xl font-semibold text-rose-600 md:w-[800px]">
                    {question.content}
                  </p>
                  <div className="grid w-fit grid-cols-2 gap-x-8 gap-y-2">
                    {question.answers.map((answer) => {
                      return (
                        <label
                          key={answer.id}
                          className="flex w-96 items-center"
                        >
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
                </Transition>
              </div>
            );
          })}
        </div>

        <button className="mx-auto mt-8 block rounded-2xl bg-sky-700 px-8 py-4 text-xl font-bold text-sky-100 hover:bg-sky-600">
          Submit
        </button>
      </form>
      <Transition
        as={Fragment}
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Dialog
          open={isOpen}
          onClose={() => {
            router.push(router.asPath.split("/").slice(0, -1).join("/"));
          }}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              className={"w-96 rounded-xl bg-slate-100 p-4 text-slate-800"}
            >
              <Dialog.Title className={"mb-4 text-center text-3xl font-bold"}>
                Quiz completed
              </Dialog.Title>
              <Dialog.Description>
                <p className="text-xl">
                  Your score is {score} / {data?.questions.length}
                </p>
                <p>Do you want to play again</p>
                <div className="mt-2 flex w-full items-center justify-end gap-4">
                  <GoBackButton />
                  <button className="rounded-xl bg-blue-600 px-4 py-2 text-blue-100 hover:bg-blue-500">
                    Play again
                  </button>
                </div>
              </Dialog.Description>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default TakeQuizPage;
