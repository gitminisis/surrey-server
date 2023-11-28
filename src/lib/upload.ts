import axios, {
  AxiosError,
  AxiosInstance,
  AxiosProgressEvent,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
export const EASYLOAD_BASE_API =
  process.env.EASYLOAD_BASE_API || "https://easyload-dev.azurewebsites.net";
export const urls = {
  TOKEN: "/api/auth/token",
  VERSION: "/api/app/version",
  ASSETS: "/api/Assets/",
  ASSETS_UPLOAD_CHUNK: "api/Assets/UploadChunk",
  ASSETS_UPLOAD_COMMIT: "/api/Assets/Commit",
  ASSETS_DELETE: "/api/Assets/Remove",
  ASSETS_SEARCH: "/api/Assets/Search",
};
export const auth = {
  AUTH_TOKEN: "easy_load_authToken",
  TENANT: "easy_load_tenant",
  TENANT_ID: "easy_load_tenant_id",
  USER: "opac_user",
};

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  config.headers.Authorization = `Bearer ${sessionStorage.getItem(
    auth.AUTH_TOKEN
  )}`;
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  // console.error(`[response error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
export const save = (key: string, item: unknown) => {
  sessionStorage.setItem(
    key,
    typeof item === "string" ? item : JSON.stringify(item)
  );
};

import { ProgressServerConfigFunction } from "filepond";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

// setupInterceptorsTo(axios);

interface RequestResult {
  success: boolean;
  message: string | undefined;
  data: unknown;
  cancelled: boolean;
}

const handleError = (error: AxiosError): string | undefined => {
  if (error.response) {
    let errorMessage;
    switch (error.response.status) {
      case 400:
        errorMessage = (error.response?.data as string) || "Bad request";
        break;
      case 401:
        errorMessage = "Unauthorized - please login again";
        break;
      case 404:
        errorMessage =
          "Not found - the requested resource returned empty result";
        break;
      case 403:
        errorMessage =
          "Forbidden - you have no authorisation to view or edit the requested resourse";
        break;
      case 406:
        errorMessage = "Not Acceptable - please complete registration";
        break;
      case 423:
        errorMessage = "Locked - account has been deactivated";
        break;
      case 500:
      case 502:
        errorMessage = "The request was made but server returned an error";
        break;
      case 503:
        errorMessage = "The service is unavailable";
        break;
      default:
        errorMessage = undefined;
    }
    return errorMessage;
  }

  if (error.request) return "The request was made but no response was received";

  return `Something happened in setting up the request that triggered an Error. ${error.message}`;
};

const catchError = (error: unknown): RequestResult => {
  const result = { success: false, message: undefined } as RequestResult;
  if (error instanceof AxiosError) {
    result.message = handleError(error);
  } else if (error instanceof Error) {
    result.message = error.message;
  } else {
    result.message = JSON.stringify(error);
  }
  return result;
};

export const Authorize = async (): Promise<RequestResult> => {
  try {
    const req = await fetch("/api/token");
    const response = await req.json();
    if (req.status === 200) {
      save(auth.AUTH_TOKEN, response.Token);
      save(auth.TENANT, { ...response, token: undefined });
      save(auth.TENANT_ID, response.Id);
      save(auth.USER, "OPAC user");
    }
    return { success: true, data: response } as RequestResult;
  } catch (error) {
    return catchError(error);
  }
};

export const UploadAssetChunk = async (
  fileChunk: Blob,
  chunkId: string,
  fileId: string,
  fileName: string,
  totalLoaded: number,
  fileSize: number,
  progress: ProgressServerConfigFunction,
  abortController: AbortController
): Promise<RequestResult> => {
  try {
    const res = await axios.postForm("/api/upload", {
      Blobid: fileId,
      Blobname: fileName,
      Blockid: chunkId,
      Tenant: sessionStorage.getItem(auth.TENANT_ID) || "",
      File: fileChunk,
      Token: `${sessionStorage.getItem(auth.AUTH_TOKEN)}`,
    });

    if (res.status === 200) {
      return { success: true, data: res.data } as RequestResult;
    }

    return {
      success: false,
      message: "Error uploading chunk",
    } as RequestResult;
  } catch (error) {
    if (axios.isCancel(error)) {
      return { success: false, message: "Cancelled" } as RequestResult;
    }
    return catchError(error);
  }
};

export const CommitAssetUpload = async (
  fileId: string,
  fileName: string,
  fileType: string,
  chunksIds: string[]
): Promise<RequestResult> => {
  try {
    const response = await axios.postForm("/api/commit", {
      Blobid: fileId,
      Blobname: fileName,
      Tenant: sessionStorage.getItem(auth.TENANT_ID) || "",
      Token: `${sessionStorage.getItem(auth.AUTH_TOKEN)}`,
      MimeType: fileType,
      User: sessionStorage.getItem(auth.USER),
    });

    return {
      success: response.status === 200,
      data: response.data,
    } as RequestResult;
  } catch (error) {
    if (axios.isCancel(error)) {
      return { success: false, message: "Cancelled" } as RequestResult;
    }
    return catchError(error);
  }
};

export const DeleteAsset = async (fileId: string): Promise<RequestResult> => {
  try {
    const headers = {
      Blobid: fileId,
      User: sessionStorage.getItem(auth.USER),
      Tenant: sessionStorage.getItem(auth.TENANT_ID),
    };

    const response = await axios.delete(
      EASYLOAD_BASE_API + urls.ASSETS_DELETE,
      {
        headers,
      }
    );

    return {
      success: response.status === 200,
      data: response.data,
    } as RequestResult;
  } catch (error) {
    if (axios.isCancel(error)) {
      return { success: false, message: "Cancelled" } as RequestResult;
    }
    return catchError(error);
  }
};

export const SearchAssets = async (phrase: string): Promise<RequestResult> => {
  try {
    const headers = {
      User: sessionStorage.getItem(auth.USER),
      Tenant: sessionStorage.getItem(auth.TENANT_ID),
    };

    const response = await axios.get(
      `${EASYLOAD_BASE_API + urls.ASSETS_SEARCH}/${phrase}`,
      {
        headers,
      }
    );

    return {
      success: response.status === 200,
      data: response.data,
    } as RequestResult;
  } catch (error) {
    if (axios.isCancel(error)) {
      return { success: false, message: "Cancelled" } as RequestResult;
    }
    return catchError(error);
  }
};
