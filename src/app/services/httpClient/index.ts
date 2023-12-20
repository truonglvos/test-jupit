import { NEXT_PUBLIC_REQUEST_TIMEOUT } from "@/app/constants/common.constant";

interface IHttpOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: { [key: string]: unknown };
  contentType?: "json" | "multi-form";
  query?: { [key: string]: unknown };
  headers?: Headers;
  responseType?:
    | "json"
    | "text"
    | "formData"
    | "clone"
    | "blob"
    | "arrayBuffer";
  credentials?: "omit" | "same-origin" | "include";
  timeout?: number;
  retry?: number;
  loadingGlobal?: boolean;
  returnRaw?: boolean;
  rawError?: boolean;
  autoQuery?: boolean;
}

class HttpClient {
  fetch = async <T>(config: IHttpOptions): Promise<T> => {
    const {
      method,
      body,
      contentType = "json",
      responseType = "json",
      headers: headersInit,
      url: originUrl,
      credentials = "same-origin",
      timeout = 0,
      retry = 0,
      loadingGlobal = false,
      rawError = false,
      autoQuery = true,
    } = config;
    const headers = !headersInit ? new Headers() : headersInit;
    let url = originUrl;
    if (typeof config.query === "object") {
      let q = "";
      Object.entries(config.query).forEach(([key, value]) => {
        q = q ? q + `&${key}=${value}` : `?${key}=${value}`;
      });
      url += q;
    }

    const formData =
      contentType === "multi-form" ? new FormData() : (null as any);
    if (contentType === "multi-form" && body) {
      Object.keys(body).forEach((key) => {
        if (body[key] !== null) {
          formData.append(key, body[key]);
        }
      });
    } else {
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");
    }

    const reqOptions: Pick<IHttpOptions, "method" | "headers"> & {
      body?: string | FormData;
    } = {
      method,
      headers,
    };
    if (contentType === "multi-form") {
      reqOptions.body = formData;
    } else if (typeof body === "object") {
      reqOptions.body = JSON.stringify(body);
    }
    const requestTimeout = timeout ? timeout : NEXT_PUBLIC_REQUEST_TIMEOUT;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout);
    return fetch(url, {
      ...reqOptions,
      credentials,
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 202) {
          return res;
        }
        if (res.status === 204) {
          return null;
        }
        if (rawError && res.status === 401) {
          return Promise.reject(res);
        }
        const result = await res[responseType]();
        if (res.ok) {
          return result;
        }
        if (retry > 0) {
          return this.fetch({ ...config, retry: retry - 1 });
        }
        if (rawError) {
          return Promise.reject(result);
        }
        // TODO handle error
        throw new Error(result.message || "Something went wrong", {});
      })
      .catch((error) => {
        // TODO handle error
        throw error;
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  };

  get = <T>(
    url: string,
    options?: Omit<IHttpOptions, "url" | "method" | "body" | "contentType">
  ) => {
    return this.fetch<T>({ ...options, method: "GET", url } as IHttpOptions);
  };

  post = <U, T>(
    url: string,
    body: U,
    options?: Omit<IHttpOptions, "url" | "method" | "body">
  ) => {
    return this.fetch<T>({
      ...options,
      method: "POST",
      url,
      body,
    } as IHttpOptions);
  };

  put = <U, T>(
    url: string,
    body: U,
    options?: Omit<IHttpOptions, "url" | "method" | "body">
  ) => {
    return this.fetch<T>({
      ...options,
      method: "PUT",
      url,
      body,
    } as IHttpOptions);
  };

  patch = <U, T>(
    url: string,
    body: U,
    options?: Omit<IHttpOptions, "url" | "method" | "body">
  ) => {
    return this.fetch<T>({
      ...options,
      method: "PATCH",
      url,
      body,
    } as IHttpOptions);
  };

  delete = <T>(url: string, options: Omit<IHttpOptions, "method" | "url">) => {
    return this.fetch<T>({ ...options, method: "DELETE", url } as IHttpOptions);
  };
}

const httpClient = new HttpClient();
export default httpClient;
