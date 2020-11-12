import { API_ROOT } from "../constants";
import { message } from "antd";

interface IRequestConfig {
  url: string;
  body?: object | FormData;
  contentType?: string;
  method: 'GET' | 'POST';
}

export default async function sendRequest<T>(config: IRequestConfig): Promise<T | null> {
  if (!(config.body instanceof FormData) && !config.contentType) {
    config.contentType = 'application/json';
  }

  let headers: any = {
    'token': localStorage.token,
  };
  if (config.contentType) {
    headers = { ...headers, 'content-type': config.contentType };
  }
  const body = config.body instanceof FormData ? config.body : JSON.stringify(config.body);
  try {
    const res = await fetch(`${ API_ROOT }/${ config.url }`, {
      method: config.method,
      body,
      headers,
    });
    const data = await res.json();
    if (!data.success) {
      message.error(data.message);
      return null;
    }
    return data;
  } catch (e) {
    message.error(e.toString());
    return null;
  }
}
