/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Chart {
  path?: string | null;
  /** @format int32 */
  level?: number;
  /** @format int32 */
  levelDecimal?: number;
  /** @format int32 */
  levelId?: number;
  /** @format int32 */
  maxNotes?: number;
  enable?: boolean;
  designer?: string | null;
  problems?: string[] | null;
}

export interface ChartAvailable {
  /** @format int32 */
  index?: number;
  /** @format int32 */
  levelId?: number;
}

export interface CheatConfig {
  ticketUnlock?: boolean;
  mapUnlock?: boolean;
  unlockUtage?: boolean;
}

export interface Config {
  ux?: UXConfig;
  cheat?: CheatConfig;
  performance?: PerformanceConfig;
  fix?: FixConfig;
}

export interface FixConfig {
  skipVersionCheck?: boolean;
  removeEncryption?: boolean;
  forceAsServer?: boolean;
  forceFreePlay?: boolean;
}

export interface GenreAddRequest {
  /** @format int32 */
  id?: number;
  assetDir?: string | null;
}

export interface GenreEditRequest {
  name?: string | null;
  nameTwoLine?: string | null;
  /** @format int32 */
  r?: number;
  /** @format int32 */
  g?: number;
  /** @format int32 */
  b?: number;
}

export interface GenreXml {
  assetDir?: string | null;
  /** @format int32 */
  id?: number;
  filePath?: string | null;
  genreName?: string | null;
  genreNameTwoLine?: string | null;
  /** @format int32 */
  colorR?: number;
  /** @format int32 */
  colorG?: number;
  /** @format int32 */
  colorB?: number;
}

export interface ImportChartCheckResult {
  accept?: boolean;
  errors?: ImportChartMessage[] | null;
  /** @format float */
  musicPadding?: number;
  isDx?: boolean;
}

export interface ImportChartMessage {
  message?: string | null;
  level?: MessageLevel;
}

export interface ImportChartResult {
  shiftNoteEaten?: boolean;
}

export enum MessageLevel {
  Info = "Info",
  Warning = "Warning",
  Fatal = "Fatal",
}

export interface MusicBrief {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  nonDxId?: number;
  name?: string | null;
  hasJacket?: boolean;
  modified?: boolean;
  chartsAvailable?: ChartAvailable[] | null;
  problems?: string[] | null;
}

export interface MusicXmlWithABJacket {
  filePath?: string | null;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  nonDxId?: number;
  modified?: boolean;
  name?: string | null;
  /** @format int32 */
  genreId?: number;
  /** @format int32 */
  addVersionId?: number;
  artist?: string | null;
  /** @format int32 */
  version?: number;
  /** @format int32 */
  bpm?: number;
  disable?: boolean;
  charts?: Chart[] | null;
  assetBundleJacket?: string | null;
  hasJacket?: boolean;
  isAcbAwbExist?: boolean;
  problems?: string[] | null;
}

export interface PerformanceConfig {
  improveLoadSpeed?: boolean;
}

export interface UXConfig {
  skipWarningScreen?: boolean;
  singlePlayer?: boolean;
  skipToMusicSelection?: boolean;
  loadJacketPng?: boolean;
  loadAssetBundleWithoutManifest?: boolean;
  quickSkip?: boolean;
  randomBgm?: boolean;
  demoMaster?: boolean;
  extendTimer?: boolean;
  skipEventInfo?: boolean;
  immediateSave?: boolean;
  loadLocalBga?: boolean;
  testProof?: boolean;
  customVersionString?: string | null;
  execOnIdle?: string | null;
  execOnEntry?: string | null;
}

export interface VersionXml {
  assetDir?: string | null;
  /** @format int32 */
  id?: number;
  filePath?: string | null;
  genreName?: string | null;
  genreNameTwoLine?: string | null;
  /** @format int32 */
  colorR?: number;
  /** @format int32 */
  colorG?: number;
  /** @format int32 */
  colorB?: number;
  /** @format int32 */
  version?: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title MaiChartManager
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  maiChartManagerServlet = {
    /**
     * No description
     *
     * @tags AddVersion
     * @name GetAllAddVersions
     * @request GET:/MaiChartManagerServlet/GetAllAddVersionsApi
     */
    GetAllAddVersions: (params: RequestParams = {}) =>
      this.request<VersionXml[], any>({
        path: `/MaiChartManagerServlet/GetAllAddVersionsApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AddVersion
     * @name EditVersion
     * @request POST:/MaiChartManagerServlet/EditVersionApi/{id}
     */
    EditVersion: (id: number, data: GenreEditRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditVersionApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AddVersion
     * @name AddVersion
     * @request POST:/MaiChartManagerServlet/AddVersionApi
     */
    AddVersion: (data: GenreAddRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/AddVersionApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AddVersion
     * @name DeleteVersion
     * @request DELETE:/MaiChartManagerServlet/DeleteVersionApi/{id}
     */
    DeleteVersion: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/DeleteVersionApi/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartLevel
     * @request POST:/MaiChartManagerServlet/EditChartLevelApi/{id}/{level}
     */
    EditChartLevel: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartLevelApi/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartLevelDisplay
     * @request POST:/MaiChartManagerServlet/EditChartLevelDisplayApi/{id}/{level}
     */
    EditChartLevelDisplay: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartLevelDisplayApi/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartLevelDecimal
     * @request POST:/MaiChartManagerServlet/EditChartLevelDecimalApi/{id}/{level}
     */
    EditChartLevelDecimal: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartLevelDecimalApi/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartDesigner
     * @request POST:/MaiChartManagerServlet/EditChartDesignerApi/{id}/{level}
     */
    EditChartDesigner: (id: number, level: number, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartDesignerApi/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartNoteCount
     * @request POST:/MaiChartManagerServlet/EditChartNoteCountApi/{id}/{level}
     */
    EditChartNoteCount: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartNoteCountApi/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartEnable
     * @request POST:/MaiChartManagerServlet/EditChartEnableApi/{id}/{level}
     */
    EditChartEnable: (id: number, level: number, data: boolean, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartEnableApi/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChartPreview
     * @name 1
     * @request GET:/MaiChartManagerServlet/ChartPreview/{id}/{level}/Maidata/1
     */
    1: (id: number, level: number, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/ChartPreview/${id}/${level}/Maidata/1`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChartPreview
     * @name 12
     * @request GET:/MaiChartManagerServlet/ChartPreview/{id}/{level}/Track/1
     * @originalName 1
     * @duplicate
     */
    12: (id: number, level: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ChartPreview/${id}/${level}/Track/1`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChartPreview
     * @name 13
     * @request GET:/MaiChartManagerServlet/ChartPreview/{id}/{level}/ImageFull/1
     * @originalName 1
     * @duplicate
     */
    13: (id: number, level: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ChartPreview/${id}/${level}/ImageFull/1`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Genre
     * @name GetAllGenres
     * @request GET:/MaiChartManagerServlet/GetAllGenresApi
     */
    GetAllGenres: (params: RequestParams = {}) =>
      this.request<GenreXml[], any>({
        path: `/MaiChartManagerServlet/GetAllGenresApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Genre
     * @name EditGenre
     * @request POST:/MaiChartManagerServlet/EditGenreApi/{id}
     */
    EditGenre: (id: number, data: GenreEditRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditGenreApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Genre
     * @name AddGenre
     * @request POST:/MaiChartManagerServlet/AddGenreApi
     */
    AddGenre: (data: GenreAddRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/AddGenreApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Genre
     * @name DeleteGenre
     * @request DELETE:/MaiChartManagerServlet/DeleteGenreApi/{id}
     */
    DeleteGenre: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/DeleteGenreApi/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ImportChart
     * @name ImportChartCheck
     * @request POST:/MaiChartManagerServlet/ImportChartCheckApi
     */
    ImportChartCheck: (
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ImportChartCheckResult, any>({
        path: `/MaiChartManagerServlet/ImportChartCheckApi`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ImportChart
     * @name ImportChart
     * @request POST:/MaiChartManagerServlet/ImportChartApi
     */
    ImportChart: (
      data: {
        /** @format int32 */
        id?: number;
        /** @format binary */
        file?: File;
        ignoreLevelNum?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ImportChartResult, any>({
        path: `/MaiChartManagerServlet/ImportChartApi`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mod
     * @name IsMelonInstalled
     * @request GET:/MaiChartManagerServlet/IsMelonInstalledApi
     */
    IsMelonInstalled: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/MaiChartManagerServlet/IsMelonInstalledApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mod
     * @name IsAquaMaiInstalled
     * @request GET:/MaiChartManagerServlet/IsAquaMaiInstalledApi
     */
    IsAquaMaiInstalled: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/MaiChartManagerServlet/IsAquaMaiInstalledApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mod
     * @name GetAquaMaiConfig
     * @request GET:/MaiChartManagerServlet/GetAquaMaiConfigApi
     */
    GetAquaMaiConfig: (params: RequestParams = {}) =>
      this.request<Config, any>({
        path: `/MaiChartManagerServlet/GetAquaMaiConfigApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mod
     * @name SetAquaMaiConfig
     * @request PUT:/MaiChartManagerServlet/SetAquaMaiConfigApi
     */
    SetAquaMaiConfig: (data: Config, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetAquaMaiConfigApi`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mod
     * @name InstallMelonLoader
     * @request POST:/MaiChartManagerServlet/InstallMelonLoaderApi
     */
    InstallMelonLoader: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/InstallMelonLoaderApi`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mod
     * @name InstallAquaMai
     * @request POST:/MaiChartManagerServlet/InstallAquaMaiApi
     */
    InstallAquaMai: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/InstallAquaMaiApi`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name GetMusicDetail
     * @request GET:/MaiChartManagerServlet/GetMusicDetailApi/{id}
     */
    GetMusicDetail: (id: number, params: RequestParams = {}) =>
      this.request<MusicXmlWithABJacket, any>({
        path: `/MaiChartManagerServlet/GetMusicDetailApi/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicName
     * @request POST:/MaiChartManagerServlet/EditMusicNameApi/{id}
     */
    EditMusicName: (id: number, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicNameApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicArtist
     * @request POST:/MaiChartManagerServlet/EditMusicArtistApi/{id}
     */
    EditMusicArtist: (id: number, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicArtistApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicBpm
     * @request POST:/MaiChartManagerServlet/EditMusicBpmApi/{id}
     */
    EditMusicBpm: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicBpmApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicVersion
     * @request POST:/MaiChartManagerServlet/EditMusicVersionApi/{id}
     */
    EditMusicVersion: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicVersionApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicGenre
     * @request POST:/MaiChartManagerServlet/EditMusicGenreApi/{id}
     */
    EditMusicGenre: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicGenreApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicAddVersion
     * @request POST:/MaiChartManagerServlet/EditMusicAddVersionApi/{id}
     */
    EditMusicAddVersion: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicAddVersionApi/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name SaveMusic
     * @request POST:/MaiChartManagerServlet/SaveMusicApi/{id}
     */
    SaveMusic: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SaveMusicApi/${id}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name DeleteMusic
     * @request DELETE:/MaiChartManagerServlet/DeleteMusicApi/{id}
     */
    DeleteMusic: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/DeleteMusicApi/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name AddMusic
     * @request POST:/MaiChartManagerServlet/AddMusicApi/{id}
     */
    AddMusic: (id: number, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/AddMusicApi/${id}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name SetMusicJacket
     * @request PUT:/MaiChartManagerServlet/SetMusicJacketApi/{id}
     */
    SetMusicJacket: (
      id: number,
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/SetMusicJacketApi/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name GetJacket
     * @request GET:/MaiChartManagerServlet/GetJacketApi/{id}
     */
    GetJacket: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/GetJacketApi/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name GetMusicWav
     * @request GET:/MaiChartManagerServlet/GetMusicWavApi/{id}
     */
    GetMusicWav: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/GetMusicWavApi/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name SetAudio
     * @request PUT:/MaiChartManagerServlet/SetAudioApi/{id}
     */
    SetAudio: (
      id: number,
      data: {
        /** @format float */
        padding?: number;
        /** @format binary */
        file?: File;
        /** @format binary */
        awb?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetAudioApi/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name SetAssetsDir
     * @request POST:/MaiChartManagerServlet/SetAssetsDirApi
     */
    SetAssetsDir: (data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetAssetsDirApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name GetAssetsDirs
     * @request GET:/MaiChartManagerServlet/GetAssetsDirsApi
     */
    GetAssetsDirs: (params: RequestParams = {}) =>
      this.request<string[], any>({
        path: `/MaiChartManagerServlet/GetAssetsDirsApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name GetSelectedAssetsDir
     * @request GET:/MaiChartManagerServlet/GetSelectedAssetsDirApi
     */
    GetSelectedAssetsDir: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/GetSelectedAssetsDirApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name GetMusicList
     * @request GET:/MaiChartManagerServlet/GetMusicListApi
     */
    GetMusicList: (params: RequestParams = {}) =>
      this.request<MusicBrief[], any>({
        path: `/MaiChartManagerServlet/GetMusicListApi`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
