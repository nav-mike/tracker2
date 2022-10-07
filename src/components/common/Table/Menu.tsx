import Link from "next/link";
import { FC } from "react";
import { FiExternalLink, FiEdit, FiArchive } from "react-icons/fi";
import { FaRegClone } from "react-icons/fa";
import { MousePosition } from "../../../hooks/useMousePosition";

interface IMenuProps {
  id: string;
  url: string;
  hrefPrefix: string;
  position: MousePosition;
}

const Menu: FC<IMenuProps> = ({ id, url, hrefPrefix, position }) => (
  <div
    className="flex flex-row items-center absolute"
    style={{
      top: position.y ?? 0,
      left: position.x ?? 0,
    }}
  >
    <Link href={url} target="_blank">
      <a className="flex flex-row items-center">
        <FiExternalLink /> Preview
      </a>
    </Link>
    <Link href={`/${hrefPrefix}/${id}/edit`}>
      <a className="flex flex-row items-center">
        <FiEdit /> Edit
      </a>
    </Link>
    <button className="flex flex-row items-center">
      <FaRegClone /> Clone
    </button>
    <button className="flex flex-row items-center">
      <FiArchive /> Archive
    </button>
  </div>
);

export default Menu;
