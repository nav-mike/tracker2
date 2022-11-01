import platform from "platform";

export const userDevice = (useragent = "") => {
  const client = platform.parse(useragent);

  const os = client.os?.family || "Unknown";
  const browser = client.name || "Unknown";
  const device = client.product || "Unknown";

  return { os, browser, device };
};
