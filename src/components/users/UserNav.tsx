import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC, useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GoChevronDown } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const UserNav: FC<{ username: string }> = ({ username }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useOutsideClick(navbarRef, () => setShowMenu(false));

  const clickHandler = () => {
    setShowMenu(!showMenu);
  };

  const logoutHandler = () => {
    setShowMenu(false);
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div ref={navbarRef}>
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
            <a className="user-menu-item" onClick={() => setShowMenu(false)}>
              <AiOutlineUser /> Billing
            </a>
          </Link>
          <button className="user-menu-item" onClick={logoutHandler}>
            <MdLogout /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNav;
