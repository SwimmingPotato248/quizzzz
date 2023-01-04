import CreateQuizForm from "@/src/components/CreateQuizForm";
import { type NextPage } from "next";

const CreateExamPage: NextPage = () => {
  return (
    <div>
      <p className="my-4 text-center text-lg">Create new quiz</p>
      <CreateQuizForm />
    </div>
  );
};

export default CreateExamPage;
