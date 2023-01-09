import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { type FC } from "react";

const GoBackButton: FC = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      className="flex items-baseline gap-1 text-sm text-red-600 decoration-red-600 hover:underline"
      onClick={() => {
        router.push(router.asPath.split("/").slice(0, -1).join("/"));
      }}
    >
      <ArrowLeftIcon className="h-3 w-3" />
      Go back
    </button>
  );
};

export default GoBackButton;
