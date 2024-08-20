import {generateApi} from "swagger-typescript-api";
import path from "node:path";

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
  name: "apiGen.ts",
  output: path.resolve("src/client"),
  url: "http://localhost:5181/swagger/v1/swagger.json",
  templates: path.resolve("./api-templates"),
  httpClientType: "fetch", // or "fetch"
  defaultResponseType: "void",
  enumNamesAsValues: true,
})
