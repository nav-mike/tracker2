import { LandingPage } from "@prisma/client";
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
import Menu from "./Menu";

interface ITableProps {
  data: LandingPage[];
}

const Table: FC<ITableProps> = ({ data }) => {
  const columnHelper = useMemo<ColumnHelper<LandingPage>>(
    () => createColumnHelper<LandingPage>(),
    []
  );
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (row) => row.getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (row) => row.getValue(),
      }),
      columnHelper.accessor("id", {
        header: "Visits",
        cell: () => 0,
        id: "visits",
      }),
      columnHelper.accessor("id", {
        header: "Clicks",
        cell: () => 0,
        id: "clicks",
      }),
      columnHelper.accessor("id", {
        header: "Leads",
        cell: () => 0,
        id: "leads",
      }),
      columnHelper.accessor("id", {
        header: "Cost",
        cell: () => `$0.00`,
        id: "cost",
      }),
      columnHelper.accessor("id", {
        header: "Revenue",
        cell: () => `$0.00`,
        id: "revenue",
      }),
      columnHelper.accessor("id", {
        header: "Profit",
        cell: () => `$0.00`,
        id: "profit",
      }),
      columnHelper.accessor("id", {
        header: "ROI",
        cell: () => `0.00%`,
        id: "roi",
      }),
      columnHelper.accessor("id", {
        header: "CTR",
        cell: () => `0.00%`,
        id: "ctr",
      }),
      columnHelper.accessor("id", {
        header: "CV",
        cell: () => `0.00%`,
        id: "cv",
      }),
      columnHelper.accessor("id", {
        header: "CR",
        cell: () => `0.00%`,
        id: "cr",
      }),
      columnHelper.accessor("id", {
        header: "CPV",
        cell: () => `$0.00`,
        id: "cpv",
      }),
      columnHelper.accessor("id", {
        header: "EPV",
        cell: () => `$0.00`,
        id: "epv",
      }),
      columnHelper.accessor("id", {
        header: "EPC",
        cell: () => `$0.00`,
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
  const [selectedLanding, setSelectedLanding] = useState<LandingPage | null>(
    null
  );
  const tableRef = useRef<HTMLTableElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(tableRef, () => setShowMenu(false), [menuRef]);

  const handleRowClick = (landing: LandingPage) => {
    setSelectedLanding(landing);
    setShowMenu(true);
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
      </table>

      {showMenu && selectedLanding && (
        <Menu
          id={selectedLanding.id}
          url={selectedLanding.url}
          hrefPrefix="landing"
          position={menuPosition}
          ref={menuRef}
        />
      )}
    </>
  );
};

export default Table;
