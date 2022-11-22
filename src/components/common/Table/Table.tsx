import {
  ColumnHelper,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useMemo, useRef, useState } from "react";
import useMousePosition from "../../../hooks/useMousePosition";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { Report } from "../../../models/report";
import Menu from "./Menu";

const moneyRender = (value: number) => {
  if (value > 0) {
    return <span style={{ color: "green" }}>${value.toFixed(2)}</span>;
  } else if (value < 0) {
    return <span style={{ color: "red" }}>-${Math.abs(value).toFixed(2)}</span>;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

interface ITableProps {
  data: Report[];
  onDelete?: (id: string) => void;
  type: string;
  showPreview?: boolean;
  menu?: boolean;
}

const Table: FC<ITableProps> = ({
  data,
  type,
  onDelete,
  showPreview = true,
  menu = true,
}) => {
  const columnHelper = useMemo<ColumnHelper<Report>>(
    () => createColumnHelper<Report>(),
    []
  );
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (row) => row.getValue(),
      }),
      columnHelper.accessor("visits", {
        header: "Visits",
        cell: (row) => row.getValue(),
        id: "visits",
      }),
      columnHelper.accessor("clicks", {
        header: "Clicks",
        cell: (row) => row.getValue(),
        id: "clicks",
      }),
      columnHelper.accessor("cost", {
        header: "Cost",
        cell: (row) => moneyRender(row.getValue()),
        id: "cost",
      }),
      columnHelper.accessor("revenue", {
        header: "Revenue",
        cell: (row) => moneyRender(row.getValue()),
        id: "revenue",
      }),
      columnHelper.accessor("profit", {
        header: "Profit",
        cell: (row) => moneyRender(row.getValue()),
        id: "profit",
      }),
      columnHelper.accessor("roi", {
        header: "ROI",
        cell: (row) => moneyRender(row.getValue()),
        id: "roi",
      }),
      columnHelper.accessor("ctr", {
        header: "CTR",
        cell: (row) => moneyRender(row.getValue()),
        id: "ctr",
      }),
      columnHelper.accessor("cpv", {
        header: "CPV",
        cell: (row) => moneyRender(row.getValue()),
        id: "cpv",
      }),
      columnHelper.accessor("epv", {
        header: "EPV",
        cell: (row) => moneyRender(row.getValue()),
        id: "epv",
      }),
      columnHelper.accessor("epc", {
        header: "EPC",
        cell: (row) => moneyRender(row.getValue()),
        id: "epc",
      }),
    ],
    [columnHelper]
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [showMenu, setShowMenu] = useState(false);
  const menuPosition = useMousePosition();
  const [selectedLanding, setSelectedLanding] = useState<Report | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(tableRef, () => setShowMenu(false), [menuRef]);

  const handleRowClick = (row: Report) => {
    setSelectedLanding(row);
    setShowMenu(true);
  };

  const handleDelete = (id: string) => {
    if (onDelete) onDelete(id);
    setShowMenu(false);
  };

  return (
    <>
      <table className="w-full" ref={tableRef}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-slate-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 underline decoration-dashed underline-offset-4 cursor-pointer hover:text-slate-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {table.getRowModel().rows.length > 0 && (
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-100 cursor-pointer"
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 text-center text-gray-500">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
        {table.getRowModel().rows.length <= 0 && (
          <tbody>
            <tr>
              <td
                colSpan={columns.length}
                className="p-2 text-center text-gray-500"
              >
                No data found
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {menu && showMenu && selectedLanding && (
        <Menu
          id={selectedLanding.id}
          url={selectedLanding.url}
          hrefPrefix={type}
          position={menuPosition}
          ref={menuRef}
          onDelete={handleDelete}
          showPreview={showPreview}
        />
      )}
    </>
  );
};

export default Table;
