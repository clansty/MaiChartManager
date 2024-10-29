import { Api } from "@/client/apiGen";

declare global {
  const backendUrl: string | undefined;
}

export default (new Api({
  // @ts-ignore
  baseUrl: globalThis.backendUrl,
  baseApiParams: {
    headers: {
      accept: 'application/json',
    },
  },
})).maiChartManagerServlet

export const getUrl = (suffix: string) => {
  // @ts-ignore
  return `${globalThis.backendUrl ?? ''}/MaiChartManagerServlet/${suffix}`;
}
