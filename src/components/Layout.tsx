import { type ReactNode, type FC } from "react";
import { trpc } from "../utils/trpc";
import { signOut } from "next-auth/react";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const { data: session } = trpc.auth.getSession.useQuery(undefined, {});

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex items-center justify-between bg-amber-200 px-4 py-3">
        <Link className="text-2xl font-bold text-amber-900" href={"/"}>
          Quizzzz
        </Link>
        <div className="flex gap-4 px-2">
          {session?.user ? (
            <>
              <Link href={"/my/questions"}>{session.user.name}</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:text-amber-900"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href={"/signup"} className="hover:text-amber-900">
                Sign Up
              </Link>
              <Link href={"/signin"} className="hover:text-amber-900">
                Log In
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-grow bg-amber-100 text-amber-800">{children}</main>
    </div>
  );
};

export default Layout;
