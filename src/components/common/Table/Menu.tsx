import Link from "next/link";
import { forwardRef } from "react";
import { FiExternalLink, FiEdit, FiArchive } from "react-icons/fi";
import { FaRegClone } from "react-icons/fa";
import { MousePosition } from "../../../hooks/useMousePosition";

interface IMenuProps {
  id: string;
  url: string;
  hrefPrefix: string;
  position: MousePosition;
  onDelete: (id: string) => void;
  showPreview?: boolean;
}

type Ref = HTMLDivElement;

const Menu = forwardRef<Ref, IMenuProps>(
  ({ id, url, hrefPrefix, position, onDelete, showPreview = true }, ref) => (
    <div
      className="flex flex-row gap-2 items-center absolute drop-shadow-xl bg-slate-50 p-2"
      style={{
        top: position.y ?? 0,
        left: position.x ?? 0,
      }}
      ref={ref}
    >
      {showPreview && (
        <Link href={url} target="_blank">
          <a
            className="button button-warning button-icon"
            data-type="menu-button"
          >
            <FiExternalLink /> Preview
          </a>
        </Link>
      )}
      <Link href={`/${hrefPrefix}/${id}/edit`}>
        <a
          className="button button-primary button-icon"
          data-type="menu-button"
        >
          <FiEdit /> Edit
        </a>
      </Link>
      <button
        className="button button-success button-icon"
        onClick={() => console.log("clone")}
        data-type="menu-button"
      >
        <FaRegClone /> Clone
      </button>
      <button
        className="button-icon button button-danger"
        onClick={() => onDelete(id)}
        data-type="menu-button"
      >
        <FiArchive /> Delete
      </button>
    </div>
  )
);

Menu.displayName = "Menu";

export default Menu;
