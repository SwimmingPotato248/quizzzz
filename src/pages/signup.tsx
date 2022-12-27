import { type NextPage } from "next";
import SignupForm from "../components/SignupForm";

const SignUpPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>Sign Up Page</h1>
      <SignupForm />
    </div>
  );
};

export default SignUpPage;
