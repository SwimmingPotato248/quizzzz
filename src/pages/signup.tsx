import { type NextPage } from "next";
import SignupForm from "../components/SignupForm";

const SignUpPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center pt-8">
      <p className="my-4 text-3xl">Create an account</p>
      <SignupForm />
    </div>
  );
};

export default SignUpPage;
