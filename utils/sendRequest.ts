import { API_ROOT } from "../constants";
import { message } from "antd";

interface IRequestConfig {
  url: string;
  body: object;
  contentType?: string;
  method: 'GET' | 'POST';
}

export default async function sendRequest<T>(config: IRequestConfig): Promise<T | null> {
  if (!config.contentType) {
    config.contentType = 'application/json'
  }
  try {
    const res = await fetch(`${ API_ROOT }/${ config.url }`, {
      method: config.method,
      body: JSON.stringify(config.body),
      headers: {
        'content-type': config.contentType,
      }
    });
    return await res.json();
  } catch (e) {
    message.error(e)
    return null;
  }
}