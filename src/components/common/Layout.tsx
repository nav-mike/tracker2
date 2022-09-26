import { useSession } from "next-auth/react";
import { FC } from "react";
import { GrMenu } from "react-icons/gr";
import { AiOutlineUser } from "react-icons/ai";
import { GoChevronDown } from "react-icons/go";
import { LayoutType } from "../../types/layout-type";

const Layout: FC<LayoutType> = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>loading...</div>;

  return (
    <div className="container mx-auto flex flex-row p-4 gap-4">
      <div className="">Menu</div>
      <div className="flex flex-col w-full gap-4">
        <div className="w-full flex flex-row justify-between">
          <button>Menu</button>
          <button>User</button>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
