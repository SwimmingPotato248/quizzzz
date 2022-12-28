import { useState, type FC, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { signIn } from "next-auth/react";
import Link from "next/link";

const signupFormSchema = z.object({
  username: z
    .string()
    .min(5)
    .max(20)
    .regex(/^[a-zA-Z0-9]+([_.-]?[a-zA-Z0-9])*$/),
  password: z
    .string()
    .min(5)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/),
  passwordConfirmation: z.string(),
});

const SignupForm: FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    trigger,
    getFieldState,
    formState: { errors },
  } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    mode: "onTouched",
    defaultValues: { username: "", password: "", passwordConfirmation: "" },
  });
  const { mutate: signUp } = trpc.auth.signUp.useMutation({
    onSuccess(data) {
      console.log("Done");
      signIn("credentials", { ...data, callbackUrl: "/" });
    },
  });
  const { mutateAsync: checkUnique } = trpc.auth.checkUnique.useMutation();

  const [unique, setUnique] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const checkUsername = async () => {
    if (!errors.username) {
      const username = getValues("username");
      const check = await checkUnique({ username });
      if (check) setUnique(true);
      else setUnique(false);
    }
  };

  const watchPassword = watch(["password", "passwordConfirmation"]);
  const [match, setMatch] = useState<null | boolean>(null);
  useEffect(() => {
    if (getFieldState("passwordConfirmation").isDirty)
      if (watchPassword[0] === watchPassword[1]) {
        setMatch(true);
      } else setMatch(false);
  }, [watchPassword, getFieldState]);

  const onSubmit: SubmitHandler<z.infer<typeof signupFormSchema>> = (data) => {
    setSubmitting(true);
    signUp({ username: data.username, password: data.password });
  };

  return (
    <form
      className="flex w-96 flex-col gap-4 rounded-xl border bg-slate-300 px-8 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label className="flex flex-col gap-1">
          <p className="font-semibold">Username</p>
          <input
            type={"text"}
            {...register("username")}
            onBlur={async () => {
              trigger("username");
              checkUsername();
            }}
          />
        </label>
        <div className="min-h-[16px] text-xs">
          {(errors.username?.type === "too_small" ||
            errors.username?.type === "too_large") && (
            <p className={`${"text-red-600"}`}>
              Username must be betweens 5-20 characters
            </p>
          )}
          {errors.username?.type === "invalid_string" && (
            <p className={`${"text-red-600"}`}>
              Username must only contain letters, numbers, ., - and _
            </p>
          )}
          {unique === false && (
            <p className="text-red-600">Username is not unique</p>
          )}
        </div>
      </div>

      <div>
        <label className="flex flex-col gap-1">
          <p className="font-semibold">Password</p>
          <input type={"password"} {...register("password")} />
        </label>
        <div className="min-h-[16px] text-xs">
          {(errors.password?.type === "too_small" ||
            errors.password?.type === "too_large") && (
            <p className={`${"text-red-600"}`}>
              Password must be betweens 5-20 characters
            </p>
          )}
          {errors.password?.type === "invalid_string" && (
            <p className={`${"text-red-600"}`}>
              Password must only contain letters and numbers
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="flex flex-col gap-1">
          <p className="font-semibold">Password Confirmation</p>
          <input type={"password"} {...register("passwordConfirmation")} />
        </label>
        <div className="min-h-[16px] text-xs text-red-600">
          {match === false && <p>Password do not match</p>}
        </div>
      </div>
      <div className="text-sm text-gray-700">
        Already have an account?{" "}
        <Link href={"/signin"} className="font-semibold text-blue-700">
          Log In
        </Link>
      </div>
      <button
        className={`mx-auto rounded-lg bg-blue-600 px-4 py-2 font-bold text-blue-100 hover:bg-blue-700 disabled:bg-gray-500 ${
          submitting ? "cursor-progress" : "disabled:cursor-not-allowed"
        }`}
        disabled={
          !unique ||
          !match ||
          errors === undefined ||
          Object.keys(errors).length !== 0 ||
          submitting
        }
      >
        {submitting ? (
          <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-r-2 border-black" />
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
