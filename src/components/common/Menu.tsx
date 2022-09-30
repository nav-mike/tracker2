import Link from "next/link";
import { FC } from "react";
import { BiTable } from "react-icons/bi";
import { BsCardChecklist } from "react-icons/bs";
import { BsTag } from "react-icons/bs";
import { FaCreditCard } from "react-icons/fa";
import { AiOutlineAreaChart } from "react-icons/ai";

const Menu: FC<{ isShow: boolean }> = ({ isShow }) => {
  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen bg-slate-500 text-white">
      <Link href="/">
        <a className="text-5xl">{isShow ? "Tracker2" : "T"}</a>
      </Link>
      <Link href="/campaign">
        <a className="menu-item" title="Campaigns">
          <BiTable /> {isShow && "Campaigns"}
        </a>
      </Link>
      <Link href="/landing">
        <a className="menu-item" title="Landings">
          <BsCardChecklist />
          {isShow && "Landings"}
        </a>
      </Link>
      <Link href="/offers">
        <a className="menu-item" title="Offers">
          <BsTag />
          {isShow && "Offers"}
        </a>
      </Link>
      <Link href="/billing">
        <a className="menu-item" title="Billing">
          <FaCreditCard />
          {isShow && "Billing"}
        </a>
      </Link>
      <Link href="/reports">
        <a className="menu-item" title="Reports">
          <AiOutlineAreaChart />
          {isShow && "Reports"}
        </a>
      </Link>
    </div>
  );
};

export default Menu;