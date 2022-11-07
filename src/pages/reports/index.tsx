import Head from "next/head";
import { useEffect, useState } from "react";
import { commonLayout } from "../../components/common/Layout";
import Table from "../../components/common/Table/Table";
import { Report } from "../../models/report";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const grouping = [
  { label: "Landing Page", value: "landingPageId" },
  { label: "Offer Page", value: "offerPageId" },
  { label: "Campaign", value: "campaignId" },
  { label: "Path", value: "pathId" },
  { label: "Country", value: "country" },
  { label: "OS", value: "os" },
  { label: "Browser", value: "browser" },
  { label: "Device", value: "device" },
  { label: "Date", value: "createdAt" },
];

const IndexReportPage: ProtectedPage = () => {
  const [group, setGroup] = useState<string>("landingPageId");
  const [data, setData] = useState<Report[]>([]);
  const reports = trpc.useQuery(["reports.index", { type: group }]);

  useEffect(() => {
    if (reports.data) setData(reports.data);
  }, [reports.data]);

  return (
    <>
      <Head>
        <title>Reports</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Reports</h1>

        <div className="flex w-full p-2">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm">Group By</label>
              <select
                className="border border-gray-300 rounded-md p-2 px-8"
                defaultValue={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                {grouping.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex w-full p-2">
          <Table type="reports" data={data} menu={false} />
        </div>
      </div>
    </>
  );
};

IndexReportPage.getLayout = commonLayout;

export default IndexReportPage;
