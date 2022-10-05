import { LandingPage } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const columnHelper = createColumnHelper<LandingPage>();

const defaultColumns = [
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
  }),
  columnHelper.accessor("id", {
    header: "Clicks",
    cell: () => 0,
  }),
  columnHelper.accessor("id", {
    header: "Leads",
    cell: () => 0,
  }),
  columnHelper.accessor("id", {
    header: "Cost",
    cell: () => `$0.00`,
  }),
  columnHelper.accessor("id", {
    header: "Revenue",
    cell: () => `$0.00`,
  }),
  columnHelper.accessor("id", {
    header: "Profit",
    cell: () => `$0.00`,
  }),
  columnHelper.accessor("id", {
    header: "ROI",
    cell: () => `0.00%`,
  }),
  columnHelper.accessor("id", {
    header: "CTR",
    cell: () => `0.00%`,
  }),
  columnHelper.accessor("id", {
    header: "CV",
    cell: () => `0.00%`,
  }),
  columnHelper.accessor("id", {
    header: "CR",
    cell: () => `0.00%`,
  }),
  columnHelper.accessor("id", {
    header: "CPV",
    cell: () => `$0.00`,
  }),
  columnHelper.accessor("id", {
    header: "EPV",
    cell: () => `$0.00`,
  }),
  columnHelper.accessor("id", {
    header: "EPC",
    cell: () => `$0.00`,
  }),
];

const IndexLandingPage: ProtectedPage = () => {
  const [data, setData] = useState<LandingPage[]>([]);
  const landingPages = trpc.useQuery(["landingPages.index"]);

  useEffect(() => {
    if (landingPages.data) setData(landingPages.data);
  }, [landingPages.data]);

  const table = useReactTable({
    data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Head>
        <title>Landing Page</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Landing Page</h1>
        <Link href="/landing/new">
          <a className="button button-success max-w-[4rem]">Create</a>
        </Link>

        <div className="flex w-full p-2">
          <table className="w-full">
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
                <tr key={row.id} className="hover:bg-slate-100 cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 text-center text-gray-500">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

IndexLandingPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default IndexLandingPage;
