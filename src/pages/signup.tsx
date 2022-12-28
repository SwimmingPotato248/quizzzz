import { type NextPage } from "next";
import SignupForm from "../components/SignupForm";

const SignUpPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center">
      <SignupForm />
    </div>
  );
};

export default SignUpPage;
