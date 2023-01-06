import { type FC } from "react";

const Spinner: FC = () => {
  return (
    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-t-2 border-r-2 border-black" />
  );
};

export default Spinner;
