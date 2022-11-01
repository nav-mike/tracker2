import { GetServerSidePropsContext } from "next";

const LOCAL_IP = "::1";
const FAKE_IP = "134.201.250.155";

export const geoIp = async (context: GetServerSidePropsContext) => {
  const { req } = context;
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (ip === LOCAL_IP) ip = FAKE_IP;

  const response = await fetch(
    `http://api.ipstack.com/${ip}?access_key=${process.env.IP_STACK_API_KEY}`
  );
  const jsonData = await response.json();

  return { country: jsonData.country_code };
};
