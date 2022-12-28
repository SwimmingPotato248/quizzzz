import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const signinFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const SigninForm: FC = () => {
  const [error, setError] = useState(false);
  const { register, handleSubmit } =
    useForm<z.infer<typeof signinFormSchema>>();
  const router = useRouter();

  const onSubmit: SubmitHandler<z.infer<typeof signinFormSchema>> = async (
    data
  ) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      setError(true);
    } else {
      router.push("/");
    }
  };

  return (
    <form
      className="flex w-96 flex-col gap-4 rounded-xl border bg-slate-300 px-8 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && (
        <div className="bg-red-200 p-1 text-center text-xs font-semibold text-red-600">
          Incorrect user name or password
        </div>
      )}
      <label className="flex flex-col gap-1">
        <p className="font-semibold">Username</p>
        <input type={"text"} {...register("username")} />
      </label>
      <label className="flex flex-col gap-1">
        <p className="font-semibold">Password</p>
        <input type={"password"} {...register("password")} />
      </label>
      <div className="text-sm text-gray-700">
        {"Don't have an account? "}
        <Link href={"/signup"} className="font-semibold text-blue-700">
          Sign Up
        </Link>
      </div>
      <button className="mx-auto rounded-lg bg-blue-600 px-4 py-2 font-bold text-blue-100 hover:bg-blue-700">
        Login
      </button>
    </form>
  );
};

export default SigninForm;
