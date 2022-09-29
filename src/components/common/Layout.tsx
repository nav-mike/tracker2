import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { GrMenu } from "react-icons/gr";
import { LayoutType } from "../../types/layout-type";
import UserNav from "../users/UserNav";
import Menu from "./Menu";

const Layout: FC<LayoutType> = ({ children }) => {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const clickHandler = () => setShowMenu(!showMenu);

  if (status === "loading") return <div>loading...</div>;

  return (
    <div className="flex flex-row w-full">
      <Menu isShow={showMenu} />
      <div className="flex flex-col w-full gap-4">
        <div className="w-full flex flex-row justify-between items-center bg-gray-100 pr-4">
          <button className="hover:bg-gray-300 p-4" onClick={clickHandler}>
            <GrMenu />
          </button>
          <UserNav
            username={
              session?.user?.email ?? session?.user?.name ?? "unknown user"
            }
          />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
