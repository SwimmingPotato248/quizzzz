import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type FC, Fragment } from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeftIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { trpc } from "../utils/trpc";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

const answers = z.object({
  content: z.string().min(1),
  status: z.boolean(),
});

const formSchema = z.object({
  content: z.string().min(1),
  answers: z.array(answers),
});

type FormSchemaType = z.infer<typeof formSchema>;

const CreateQuestionForm: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = trpc.question.create.useMutation({
    onSuccess() {
      setIsOpen(true);
    },
  });

  const { register, handleSubmit, control, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      answers: [
        { content: "", status: true },
        { content: "", status: false },
      ],
    },
    mode: "onSubmit",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col divide-y divide-amber-500 py-2 [&>*]:py-4"
      >
        <label>
          <p className="">Question content</p>
          <textarea
            {...register("content")}
            className="w-full resize-none rounded border-amber-700 focus:border-amber-700 focus:ring-amber-600"
            cols={37}
            rows={4}
          ></textarea>
        </label>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className={`${field.status ? "mb-8" : ""}`}>
                <div className="flex">
                  {field.status ? (
                    <p>{"Correct answer"}</p>
                  ) : index === 1 ? (
                    <p>{"Incorrect answer(s)"}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="w-full text-right text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type={"text"}
                  {...register(`answers.${index}.content`)}
                  className="w-full rounded border-amber-700 focus:border-amber-700 focus:ring-amber-600"
                  autoComplete="off"
                />
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => append({ content: "", status: false })}
            className="mx-auto mt-4 flex items-center gap-1 rounded-full border border-amber-700 px-4 py-2 hover:bg-amber-700 hover:text-amber-100"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add more answers</span>
          </button>
        </div>
        <button
          type="submit"
          className="rounded-sm bg-amber-800 text-xl font-bold text-amber-100 hover:bg-amber-700"
        >
          Create Question
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
        <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
          <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              className={"w-96 rounded-xl bg-slate-100 p-4 text-slate-800"}
            >
              <Dialog.Title className={"mb-4 text-xl font-bold"}>
                Question created
              </Dialog.Title>
              <Dialog.Description>
                You have successfully created a question. Do you want to create
                more?
              </Dialog.Description>
              <div className="mt-2 flex w-full items-center justify-end gap-4">
                <Link
                  href={"/my/questions"}
                  className="flex items-center gap-2 rounded-full border border-red-600 bg-red-100 px-4 py-2 font-semibold text-red-700"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Return
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className="rounded-full border border-sky-600 bg-sky-700 px-4 py-2 font-bold text-sky-100 hover:bg-sky-600"
                >
                  Create more
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CreateQuestionForm;
