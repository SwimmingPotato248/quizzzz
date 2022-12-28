import { type NextPage } from "next";
import SigninForm from "../components/SigninForm";

const SignInPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center">
      <SigninForm />
    </div>
  );
};

export default SignInPage;
