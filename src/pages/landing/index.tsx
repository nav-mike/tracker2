import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import { useTable } from "react-table";
import Layout from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";

const IndexLandingPage: ProtectedPage = () => {
  const data = useMemo(
    () => [
      { col1: "Hello", col2: "World" },
      { col1: "react-table", col2: "rocks" },
      { col1: "whatever", col2: "you want" },
    ],
    []
  );
  const columns = useMemo(
    () => [
      { Header: "Column 1", accessor: "col1" },
      { Header: "Column 2", accessor: "col2" },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <Head>
        <title>Landing Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">Landing Page</h1>
        <Link href="/landing/new">
          <a className="button button-success">Create</a>
        </Link>

        <div>
          <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: "solid 3px red",
                        background: "aliceblue",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: "10px",
                            border: "solid 1px gray",
                            background: "papayawhip",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
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
