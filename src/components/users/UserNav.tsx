import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GoChevronDown } from "react-icons/go";
import { MdLogout } from "react-icons/md";

const UserNav: FC<{ username: string }> = ({ username }) => {
  const [showMenu, setShowMenu] = useState(false);

  const clickHandler = () => {
    setShowMenu(!showMenu);
  };

  const logoutHandler = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <>
      <button
        className={`flex flex-row gap-2 items-center p-3 rounded-md ${
          showMenu ? "bg-gray-300" : ""
        }`}
        onClick={clickHandler}
      >
        {username} <AiOutlineUser /> <GoChevronDown />
      </button>
      {showMenu && (
        <div className="absolute right-4 flex flex-col bg-gray-100 top-12 rounded-b-md p-2">
          <Link href="/billing">
            <a className="user-menu-item">
              <AiOutlineUser /> Billing
            </a>
          </Link>
          <button className="user-menu-item" onClick={logoutHandler}>
            <MdLogout /> Logout
          </button>
        </div>
      )}
    </>
  );
};

export default UserNav;
