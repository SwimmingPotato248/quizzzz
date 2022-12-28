import { type NextPage } from "next";
import SigninForm from "../components/SigninForm";

const SignInPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center pt-8">
      <p className="my-4 text-3xl">Log In</p>
      <SigninForm />
    </div>
  );
};

export default SignInPage;
