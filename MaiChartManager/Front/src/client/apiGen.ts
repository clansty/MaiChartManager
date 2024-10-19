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

export interface AppVersionResult {
  version?: string | null;
  /** @format int32 */
  gameVersion?: number;
  license?: LicenseStatus;
  hardwareAcceleration?: HardwareAccelerationStatus;
}

export enum AssetType {
  Music = "Music",
  Movie = "Movie",
}

export interface AudioPreviewTime {
  /** @format double */
  startTime?: number;
  /** @format double */
  endTime?: number;
}

export interface BatchSetPropsRequest {
  ids?: MusicIdAndAssetDirPair[] | null;
  /** @format int32 */
  addVersionId?: number;
  /** @format int32 */
  genreId?: number;
  removeLevels?: boolean;
  /** @format int32 */
  version?: number;
}

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

export interface CheatConfig {
  ticketUnlock?: boolean;
  mapUnlock?: boolean;
  unlockUtage?: boolean;
}

export interface CheckConflictEntry {
  type?: AssetType;
  upperDir?: string | null;
  lowerDir?: string | null;
  fileName?: string | null;
  /** @format int32 */
  musicId?: number;
  musicName?: string | null;
}

export interface Config {
  ux?: UXConfig;
  cheat?: CheatConfig;
  fix?: FixConfig;
  utils?: UtilsConfig;
  timeSaving?: TimeSavingConfig;
  windowState?: WindowStateConfig;
  touchSensitivity?: TouchSensitivityConfig;
  customKeyMap?: CustomKeyMapConfig;
}

export interface CustomKeyMapConfig {
  enable?: boolean;
  test?: KeyCodeID;
  service?: KeyCodeID;
  button1_1P?: KeyCodeID;
  button2_1P?: KeyCodeID;
  button3_1P?: KeyCodeID;
  button4_1P?: KeyCodeID;
  button5_1P?: KeyCodeID;
  button6_1P?: KeyCodeID;
  button7_1P?: KeyCodeID;
  button8_1P?: KeyCodeID;
  select_1P?: KeyCodeID;
  button1_2P?: KeyCodeID;
  button2_2P?: KeyCodeID;
  button3_2P?: KeyCodeID;
  button4_2P?: KeyCodeID;
  button5_2P?: KeyCodeID;
  button6_2P?: KeyCodeID;
  button7_2P?: KeyCodeID;
  button8_2P?: KeyCodeID;
  select_2P?: KeyCodeID;
}

export interface DeleteAssetRequest {
  assetDir?: string | null;
  type?: AssetType;
  fileName?: string | null;
}

export interface FixConfig {
  skipVersionCheck?: boolean;
  removeEncryption?: boolean;
  forceAsServer?: boolean;
  forceFreePlay?: boolean;
  forcePaidPlay?: boolean;
  /** @format int32 */
  extendNotesPool?: number;
  frameRateLock?: boolean;
  fontFix?: boolean;
  slideJudgeTweak?: boolean;
  hanabiFix?: boolean;
}

export enum GameEdition {
  SDGA = "SDGA",
  SDEZ = "SDEZ",
}

export interface GameModInfo {
  melonLoaderInstalled?: boolean;
  aquaMaiInstalled?: boolean;
  aquaMaiVersion?: string | null;
  bundledAquaMaiVersion?: string | null;
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
  fileName?: string | null;
  /** @format int32 */
  colorR?: number;
  /** @format int32 */
  colorG?: number;
  /** @format int32 */
  colorB?: number;
}

export interface GetAssetDirTxtValueRequest {
  dirName?: string | null;
  fileName?: string | null;
}

export interface GetAssetsDirsResult {
  dirName?: string | null;
  subFiles?: string[] | null;
}

export enum HardwareAccelerationStatus {
  Pending = "Pending",
  Enabled = "Enabled",
  Disabled = "Disabled",
}

export interface ImportChartCheckResult {
  accept?: boolean;
  errors?: ImportChartMessage[] | null;
  /** @format float */
  musicPadding?: number;
  isDx?: boolean;
  title?: string | null;
  /** @format float */
  first?: number;
  /** @format float */
  bar?: number;
}

export interface ImportChartMessage {
  message?: string | null;
  level?: MessageLevel;
}

export interface ImportChartResult {
  errors?: ImportChartMessage[] | null;
  fatal?: boolean;
}

export interface InstallAquaMaiRequest {
  version?: GameEdition;
}

export enum KeyCodeID {
  None = "None",
  Backspace = "Backspace",
  Tab = "Tab",
  Clear = "Clear",
  Return = "Return",
  Pause = "Pause",
  Escape = "Escape",
  Space = "Space",
  Exclaim = "Exclaim",
  DoubleQuote = "DoubleQuote",
  Hash = "Hash",
  Dollar = "Dollar",
  Ampersand = "Ampersand",
  Quote = "Quote",
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  Asterisk = "Asterisk",
  Plus = "Plus",
  Comma = "Comma",
  Minus = "Minus",
  Period = "Period",
  Slash = "Slash",
  Alpha0 = "Alpha0",
  Alpha1 = "Alpha1",
  Alpha2 = "Alpha2",
  Alpha3 = "Alpha3",
  Alpha4 = "Alpha4",
  Alpha5 = "Alpha5",
  Alpha6 = "Alpha6",
  Alpha7 = "Alpha7",
  Alpha8 = "Alpha8",
  Alpha9 = "Alpha9",
  Colon = "Colon",
  Semicolon = "Semicolon",
  Less = "Less",
  Equals = "Equals",
  Greater = "Greater",
  Question = "Question",
  At = "At",
  LeftBracket = "LeftBracket",
  Backslash = "Backslash",
  RightBracket = "RightBracket",
  Caret = "Caret",
  Underscore = "Underscore",
  BackQuote = "BackQuote",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  U = "U",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
  Z = "Z",
  Delete = "Delete",
  Keypad0 = "Keypad0",
  Keypad1 = "Keypad1",
  Keypad2 = "Keypad2",
  Keypad3 = "Keypad3",
  Keypad4 = "Keypad4",
  Keypad5 = "Keypad5",
  Keypad6 = "Keypad6",
  Keypad7 = "Keypad7",
  Keypad8 = "Keypad8",
  Keypad9 = "Keypad9",
  KeypadPeriod = "KeypadPeriod",
  KeypadDivide = "KeypadDivide",
  KeypadMultiply = "KeypadMultiply",
  KeypadMinus = "KeypadMinus",
  KeypadPlus = "KeypadPlus",
  KeypadEnter = "KeypadEnter",
  KeypadEquals = "KeypadEquals",
  UpArrow = "UpArrow",
  DownArrow = "DownArrow",
  RightArrow = "RightArrow",
  LeftArrow = "LeftArrow",
  Insert = "Insert",
  Home = "Home",
  End = "End",
  PageUp = "PageUp",
  PageDown = "PageDown",
  F1 = "F1",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5 = "F5",
  F6 = "F6",
  F7 = "F7",
  F8 = "F8",
  F9 = "F9",
  F10 = "F10",
  F11 = "F11",
  F12 = "F12",
  F13 = "F13",
  F14 = "F14",
  F15 = "F15",
  Numlock = "Numlock",
  CapsLock = "CapsLock",
  ScrollLock = "ScrollLock",
  RightShift = "RightShift",
  LeftShift = "LeftShift",
  RightControl = "RightControl",
  LeftControl = "LeftControl",
  RightAlt = "RightAlt",
  LeftAlt = "LeftAlt",
  RightCommand = "RightCommand",
  RightApple = "RightApple",
  LeftCommand = "LeftCommand",
  LeftApple = "LeftApple",
  LeftWindows = "LeftWindows",
  RightWindows = "RightWindows",
  AltGr = "AltGr",
  Help = "Help",
  Print = "Print",
  SysReq = "SysReq",
  Break = "Break",
  Menu = "Menu",
  Mouse0 = "Mouse0",
  Mouse1 = "Mouse1",
  Mouse2 = "Mouse2",
  Mouse3 = "Mouse3",
  Mouse4 = "Mouse4",
  Mouse5 = "Mouse5",
  Mouse6 = "Mouse6",
}

export enum LicenseStatus {
  Pending = "Pending",
  Active = "Active",
  Inactive = "Inactive",
}

export enum MessageLevel {
  Info = "Info",
  Warning = "Warning",
  Fatal = "Fatal",
}

export interface MusicIdAndAssetDirPair {
  /** @format int32 */
  id?: number;
  assetDir?: string | null;
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
  utageKanji?: string | null;
  comment?: string | null;
  /** @format int32 */
  version?: number;
  /** @format float */
  bpm?: number;
  disable?: boolean;
  charts?: Chart[] | null;
  assetBundleJacket?: string | null;
  pseudoAssetBundleJacket?: string | null;
  assetDir?: string | null;
  hasJacket?: boolean;
  isAcbAwbExist?: boolean;
  problems?: string[] | null;
}

export interface PutAssetDirTxtValueRequest {
  dirName?: string | null;
  fileName?: string | null;
  content?: string | null;
}

export interface RequestCopyToRequest {
  music?: MusicIdAndAssetDirPair[] | null;
  removeEvents?: boolean;
}

export interface RequestPurchaseResult {
  errorMessage?: string | null;
  status?: StorePurchaseStatus;
}

export interface SetAudioPreviewRequest {
  /** @format double */
  startTime?: number;
  /** @format double */
  endTime?: number;
}

export enum ShiftMethod {
  Legacy = "Legacy",
  Bar = "Bar",
  NoShift = "NoShift",
}

export enum StorePurchaseStatus {
  Succeeded = "Succeeded",
  AlreadyPurchased = "AlreadyPurchased",
  NotPurchased = "NotPurchased",
  NetworkError = "NetworkError",
  ServerError = "ServerError",
}

export interface TimeSavingConfig {
  skipWarningScreen?: boolean;
  improveLoadSpeed?: boolean;
  skipToMusicSelection?: boolean;
  skipEventInfo?: boolean;
  iWontTapOrSlideVigorously?: boolean;
  skipGameOverScreen?: boolean;
  skipTrackStart?: boolean;
}

export interface TouchSensitivityConfig {
  enable?: boolean;
  /** @format int32 */
  a1?: number;
  /** @format int32 */
  a2?: number;
  /** @format int32 */
  a3?: number;
  /** @format int32 */
  a4?: number;
  /** @format int32 */
  a5?: number;
  /** @format int32 */
  a6?: number;
  /** @format int32 */
  a7?: number;
  /** @format int32 */
  a8?: number;
  /** @format int32 */
  b1?: number;
  /** @format int32 */
  b2?: number;
  /** @format int32 */
  b3?: number;
  /** @format int32 */
  b4?: number;
  /** @format int32 */
  b5?: number;
  /** @format int32 */
  b6?: number;
  /** @format int32 */
  b7?: number;
  /** @format int32 */
  b8?: number;
  /** @format int32 */
  c1?: number;
  /** @format int32 */
  c2?: number;
  /** @format int32 */
  d1?: number;
  /** @format int32 */
  d2?: number;
  /** @format int32 */
  d3?: number;
  /** @format int32 */
  d4?: number;
  /** @format int32 */
  d5?: number;
  /** @format int32 */
  d6?: number;
  /** @format int32 */
  d7?: number;
  /** @format int32 */
  d8?: number;
  /** @format int32 */
  e1?: number;
  /** @format int32 */
  e2?: number;
  /** @format int32 */
  e3?: number;
  /** @format int32 */
  e4?: number;
  /** @format int32 */
  e5?: number;
  /** @format int32 */
  e6?: number;
  /** @format int32 */
  e7?: number;
  /** @format int32 */
  e8?: number;
}

export interface UXConfig {
  locale?: string | null;
  singlePlayer?: boolean;
  hideMask?: boolean;
  loadAssetsPng?: boolean;
  loadJacketPng?: boolean;
  loadAssetBundleWithoutManifest?: boolean;
  quickSkip?: boolean;
  randomBgm?: boolean;
  demoMaster?: boolean;
  extendTimer?: boolean;
  immediateSave?: boolean;
  loadLocalBga?: boolean;
  testProof?: boolean;
  hideSelfMadeCharts?: boolean;
  customFont?: boolean;
  customNoteSkin?: boolean;
  trackStartProcessTweak?: boolean;
  hideHanabi?: boolean;
  customVersionString?: string | null;
  customPlaceName?: string | null;
  execOnIdle?: string | null;
  execOnEntry?: string | null;
}

export interface UploadAssetDirResult {
  dirName?: string | null;
}

export interface UtilsConfig {
  logUserId?: boolean;
  /** @format float */
  judgeAdjustA?: number;
  /** @format float */
  judgeAdjustB?: number;
  /** @format int32 */
  touchDelay?: number;
  practiseMode?: boolean;
  selectionDetail?: boolean;
  showNetErrorDetail?: boolean;
  frameRateDisplay?: boolean;
}

export interface VersionXml {
  assetDir?: string | null;
  /** @format int32 */
  id?: number;
  filePath?: string | null;
  genreName?: string | null;
  genreNameTwoLine?: string | null;
  fileName?: string | null;
  /** @format int32 */
  colorR?: number;
  /** @format int32 */
  colorG?: number;
  /** @format int32 */
  colorB?: number;
  /** @format int32 */
  version?: number;
}

export interface WindowStateConfig {
  enable?: boolean;
  windowed?: boolean;
  /** @format int32 */
  width?: number;
  /** @format int32 */
  height?: number;
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
     * @name SetVersionTitleImage
     * @request PUT:/MaiChartManagerServlet/SetVersionTitleImageApi
     */
    SetVersionTitleImage: (
      data: {
        /** @format int32 */
        id?: number;
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetVersionTitleImageApi`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
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
     * @tags AppLicense
     * @name RequestPurchase
     * @request POST:/MaiChartManagerServlet/RequestPurchaseApi
     */
    RequestPurchase: (params: RequestParams = {}) =>
      this.request<RequestPurchaseResult, any>({
        path: `/MaiChartManagerServlet/RequestPurchaseApi`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AppVersion
     * @name GetAppVersion
     * @request GET:/MaiChartManagerServlet/GetAppVersionApi
     */
    GetAppVersion: (params: RequestParams = {}) =>
      this.request<AppVersionResult, any>({
        path: `/MaiChartManagerServlet/GetAppVersionApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name CreateAssetDir
     * @request POST:/MaiChartManagerServlet/CreateAssetDirApi
     */
    CreateAssetDir: (data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/CreateAssetDirApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name DeleteAssetDir
     * @request DELETE:/MaiChartManagerServlet/DeleteAssetDirApi
     */
    DeleteAssetDir: (data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/DeleteAssetDirApi`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name GetAssetsDirs
     * @request GET:/MaiChartManagerServlet/GetAssetsDirsApi
     */
    GetAssetsDirs: (params: RequestParams = {}) =>
      this.request<GetAssetsDirsResult[], any>({
        path: `/MaiChartManagerServlet/GetAssetsDirsApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name GetAssetDirTxtValue
     * @request POST:/MaiChartManagerServlet/GetAssetDirTxtValueApi
     */
    GetAssetDirTxtValue: (data: GetAssetDirTxtValueRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/GetAssetDirTxtValueApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name DeleteAssetDirTxt
     * @request DELETE:/MaiChartManagerServlet/DeleteAssetDirTxtApi
     */
    DeleteAssetDirTxt: (data: GetAssetDirTxtValueRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/DeleteAssetDirTxtApi`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name PutAssetDirTxtValue
     * @request PUT:/MaiChartManagerServlet/PutAssetDirTxtValueApi
     */
    PutAssetDirTxtValue: (data: PutAssetDirTxtValueRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/PutAssetDirTxtValueApi`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name RequestLocalImportDir
     * @request POST:/MaiChartManagerServlet/RequestLocalImportDirApi
     */
    RequestLocalImportDir: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/RequestLocalImportDirApi`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AssetDir
     * @name UploadAssetDir
     * @request POST:/MaiChartManagerServlet/UploadAssetDirApi/{destName}
     */
    UploadAssetDir: (destName: string, params: RequestParams = {}) =>
      this.request<UploadAssetDirResult, any>({
        path: `/MaiChartManagerServlet/UploadAssetDirApi/${destName}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartLevel
     * @request POST:/MaiChartManagerServlet/EditChartLevelApi/{assetDir}/{id}/{level}
     */
    EditChartLevel: (id: number, level: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartLevelApi/${assetDir}/${id}/${level}`,
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
     * @request POST:/MaiChartManagerServlet/EditChartLevelDisplayApi/{assetDir}/{id}/{level}
     */
    EditChartLevelDisplay: (id: number, level: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartLevelDisplayApi/${assetDir}/${id}/${level}`,
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
     * @request POST:/MaiChartManagerServlet/EditChartLevelDecimalApi/{assetDir}/{id}/{level}
     */
    EditChartLevelDecimal: (id: number, level: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartLevelDecimalApi/${assetDir}/${id}/${level}`,
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
     * @request POST:/MaiChartManagerServlet/EditChartDesignerApi/{assetDir}/{id}/{level}
     */
    EditChartDesigner: (id: number, level: number, assetDir: string, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartDesignerApi/${assetDir}/${id}/${level}`,
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
     * @request POST:/MaiChartManagerServlet/EditChartNoteCountApi/{assetDir}/{id}/{level}
     */
    EditChartNoteCount: (id: number, level: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartNoteCountApi/${assetDir}/${id}/${level}`,
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
     * @request POST:/MaiChartManagerServlet/EditChartEnableApi/{assetDir}/{id}/{level}
     */
    EditChartEnable: (id: number, level: number, assetDir: string, data: boolean, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditChartEnableApi/${assetDir}/${id}/${level}`,
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
     * @request GET:/MaiChartManagerServlet/ChartPreviewApi/{assetDir}/{id}/{level}/Maidata/1
     */
    1: (id: number, level: number, assetDir: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/ChartPreviewApi/${assetDir}/${id}/${level}/Maidata/1`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChartPreview
     * @name 12
     * @request GET:/MaiChartManagerServlet/ChartPreviewApi/{assetDir}/{id}/{level}/Track/1
     * @originalName 1
     * @duplicate
     */
    12: (id: number, level: number, assetDir: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ChartPreviewApi/${assetDir}/${id}/${level}/Track/1`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChartPreview
     * @name 13
     * @request GET:/MaiChartManagerServlet/ChartPreviewApi/{assetDir}/{id}/{level}/ImageFull/1
     * @originalName 1
     * @duplicate
     */
    13: (id: number, level: number, assetDir: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ChartPreviewApi/${assetDir}/${id}/${level}/ImageFull/1`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CheckConflict
     * @name CheckConflict
     * @request POST:/MaiChartManagerServlet/CheckConflictApi
     */
    CheckConflict: (data: string, params: RequestParams = {}) =>
      this.request<CheckConflictEntry[], any>({
        path: `/MaiChartManagerServlet/CheckConflictApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CheckConflict
     * @name DeleteAssets
     * @request DELETE:/MaiChartManagerServlet/DeleteAssetsApi
     */
    DeleteAssets: (data: DeleteAssetRequest[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/DeleteAssetsApi`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CueConvert
     * @name GetMusicWav
     * @request GET:/MaiChartManagerServlet/GetMusicWavApi/{assetDir}/{id}
     */
    GetMusicWav: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/GetMusicWavApi/${assetDir}/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags CueConvert
     * @name SetAudio
     * @request PUT:/MaiChartManagerServlet/SetAudioApi/{assetDir}/{id}
     */
    SetAudio: (
      id: number,
      assetDir: string,
      data: {
        /** @format float */
        padding?: number;
        /** @format binary */
        file?: File;
        /** @format binary */
        awb?: File;
        /** @format binary */
        preview?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetAudioApi/${assetDir}/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CueConvert
     * @name SetAudioPreview
     * @request POST:/MaiChartManagerServlet/SetAudioPreviewApi/{assetDir}/{id}
     */
    SetAudioPreview: (id: number, assetDir: string, data: SetAudioPreviewRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetAudioPreviewApi/${assetDir}/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags CueConvert
     * @name GetAudioPreviewTime
     * @request GET:/MaiChartManagerServlet/GetAudioPreviewTimeApi/{assetDir}/{id}
     */
    GetAudioPreviewTime: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<AudioPreviewTime, any>({
        path: `/MaiChartManagerServlet/GetAudioPreviewTimeApi/${assetDir}/${id}`,
        method: "GET",
        format: "json",
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
     * @name SetGenreTitleImage
     * @request PUT:/MaiChartManagerServlet/SetGenreTitleImageApi
     */
    SetGenreTitleImage: (
      data: {
        /** @format int32 */
        id?: number;
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetGenreTitleImageApi`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
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
        /** @format int32 */
        addVersionId?: number;
        /** @format int32 */
        genreId?: number;
        /** @format int32 */
        version?: number;
        assetDir?: string;
        shift?: ShiftMethod;
        /** @default false */
        debug?: boolean;
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
     * @tags LocalAssets
     * @name GetLocalAsset
     * @request GET:/MaiChartManagerServlet/GetLocalAssetApi/{fileName}
     */
    GetLocalAsset: (fileName: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/GetLocalAssetApi/${fileName}`,
        method: "GET",
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
     * @name GetGameModInfo
     * @request GET:/MaiChartManagerServlet/GetGameModInfoApi
     */
    GetGameModInfo: (params: RequestParams = {}) =>
      this.request<GameModInfo, any>({
        path: `/MaiChartManagerServlet/GetGameModInfoApi`,
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
    InstallAquaMai: (data: InstallAquaMaiRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/InstallAquaMaiApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MovieConvert
     * @name SetMovie
     * @request PUT:/MaiChartManagerServlet/SetMovieApi/{assetDir}/{id}
     */
    SetMovie: (
      id: number,
      assetDir: string,
      data: {
        /** @format double */
        padding?: number;
        /** @format binary */
        file?: File;
        noScale?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SetMovieApi/${assetDir}/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name GetMusicDetail
     * @request GET:/MaiChartManagerServlet/GetMusicDetailApi/{assetDir}/{id}
     */
    GetMusicDetail: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<MusicXmlWithABJacket, any>({
        path: `/MaiChartManagerServlet/GetMusicDetailApi/${assetDir}/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicName
     * @request POST:/MaiChartManagerServlet/EditMusicNameApi/{assetDir}/{id}
     */
    EditMusicName: (id: number, assetDir: string, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicNameApi/${assetDir}/${id}`,
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
     * @request POST:/MaiChartManagerServlet/EditMusicArtistApi/{assetDir}/{id}
     */
    EditMusicArtist: (id: number, assetDir: string, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicArtistApi/${assetDir}/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicUtageKanji
     * @request POST:/MaiChartManagerServlet/EditMusicUtageKanjiApi/{assetDir}/{id}
     */
    EditMusicUtageKanji: (id: number, assetDir: string, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicUtageKanjiApi/${assetDir}/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicComment
     * @request POST:/MaiChartManagerServlet/EditMusicCommentApi/{assetDir}/{id}
     */
    EditMusicComment: (id: number, assetDir: string, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicCommentApi/${assetDir}/${id}`,
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
     * @request POST:/MaiChartManagerServlet/EditMusicBpmApi/{assetDir}/{id}
     */
    EditMusicBpm: (id: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicBpmApi/${assetDir}/${id}`,
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
     * @request POST:/MaiChartManagerServlet/EditMusicVersionApi/{assetDir}/{id}
     */
    EditMusicVersion: (id: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicVersionApi/${assetDir}/${id}`,
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
     * @request POST:/MaiChartManagerServlet/EditMusicGenreApi/{assetDir}/{id}
     */
    EditMusicGenre: (id: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicGenreApi/${assetDir}/${id}`,
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
     * @request POST:/MaiChartManagerServlet/EditMusicAddVersionApi/{assetDir}/{id}
     */
    EditMusicAddVersion: (id: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/EditMusicAddVersionApi/${assetDir}/${id}`,
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
     * @request POST:/MaiChartManagerServlet/SaveMusicApi/{assetDir}/{id}
     */
    SaveMusic: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/SaveMusicApi/${assetDir}/${id}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name DeleteMusic
     * @request DELETE:/MaiChartManagerServlet/DeleteMusicApi/{assetDir}/{id}
     */
    DeleteMusic: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/DeleteMusicApi/${assetDir}/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name AddMusic
     * @request POST:/MaiChartManagerServlet/AddMusicApi/{assetDir}/{id}
     */
    AddMusic: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/AddMusicApi/${assetDir}/${id}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name SetMusicJacket
     * @request PUT:/MaiChartManagerServlet/SetMusicJacketApi/{assetDir}/{id}
     */
    SetMusicJacket: (
      id: number,
      assetDir: string,
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/MaiChartManagerServlet/SetMusicJacketApi/${assetDir}/${id}`,
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
     * @request GET:/MaiChartManagerServlet/GetJacketApi/{assetDir}/{id}
     */
    GetJacket: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/GetJacketApi/${assetDir}/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name RequestOpenExplorer
     * @request POST:/MaiChartManagerServlet/RequestOpenExplorerApi/{assetDir}/{id}
     */
    RequestOpenExplorer: (id: number, assetDir: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/RequestOpenExplorerApi/${assetDir}/${id}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicBatch
     * @name BatchSetProps
     * @request POST:/MaiChartManagerServlet/BatchSetPropsApi
     */
    BatchSetProps: (data: BatchSetPropsRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/BatchSetPropsApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicBatch
     * @name BatchDeleteMusic
     * @request DELETE:/MaiChartManagerServlet/BatchDeleteMusicApi
     */
    BatchDeleteMusic: (data: MusicIdAndAssetDirPair[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/BatchDeleteMusicApi`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
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
      this.request<MusicXmlWithABJacket[], any>({
        path: `/MaiChartManagerServlet/GetMusicListApi`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name ReloadAll
     * @request POST:/MaiChartManagerServlet/ReloadAllApi
     */
    ReloadAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ReloadAllApi`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicTransfer
     * @name RequestCopyTo
     * @request POST:/MaiChartManagerServlet/RequestCopyToApi
     */
    RequestCopyTo: (data: RequestCopyToRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/RequestCopyToApi`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicTransfer
     * @name ExportOpt
     * @request GET:/MaiChartManagerServlet/ExportOptApi/{assetDir}/{id}
     */
    ExportOpt: (
      id: number,
      assetDir: string,
      query?: {
        /** @default false */
        removeEvents?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ExportOptApi/${assetDir}/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicTransfer
     * @name ModifyId
     * @request POST:/MaiChartManagerServlet/ModifyIdApi/{assetDir}/{id}
     */
    ModifyId: (id: number, assetDir: string, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ModifyIdApi/${assetDir}/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicTransfer
     * @name ExportAsMaidata
     * @request GET:/MaiChartManagerServlet/ExportAsMaidataApi/{assetDir}/{id}
     */
    ExportAsMaidata: (
      id: number,
      assetDir: string,
      query?: {
        /** @default false */
        ignoreVideo?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/MaiChartManagerServlet/ExportAsMaidataApi/${assetDir}/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
