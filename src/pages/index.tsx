import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return <>{hello.data?.greeting}</>;
};

export default Home;
