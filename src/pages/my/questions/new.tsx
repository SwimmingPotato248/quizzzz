import CreateQuestionForm from "@/src/components/CreateQuestionForm";
import { type NextPage } from "next";

const CreateQuestionPage: NextPage = () => {
  return (
    <div className="mx-auto mt-8 w-96">
      <p className="text-xl">Create Question Here</p>
      <CreateQuestionForm />
    </div>
  );
};

export default CreateQuestionPage;
