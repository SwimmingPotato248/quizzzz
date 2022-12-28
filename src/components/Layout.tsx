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
    <>
      <nav>
        <div>Navbar</div>
        <div>
          {session?.user ? (
            <>
              <div>{session.user.name}</div>
              <button onClick={() => signOut()}>Log Out</button>
            </>
          ) : (
            <>
              <Link href={"/signup"}>Sign Up</Link>
              <Link href={"/signin"}>Log In</Link>
            </>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Layout;
