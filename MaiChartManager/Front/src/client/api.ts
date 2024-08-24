import {Api} from "@/client/apiGen";

export default (new Api({
  baseApiParams: {
    headers: {
      accept: 'application/json',
    }
  }
})).maiChartManagerServlet
