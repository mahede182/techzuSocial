import AsyncStorage from "@react-native-async-storage/async-storage";
import { RequestOptions } from "../@types/api.type";
import { HttpMethod, URL } from "../constants/api";
import { AppLogger } from "@/helper/applogger";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? URL;

const logger = new AppLogger("Api Client");

export const storeToken = async (token: string) => {
  logger.log("storeToken", token);
  if (!token) {
    logger.log("storeToken: token is undefined, skipping");
    return;
  }
  if (typeof window !== 'undefined') {
    await AsyncStorage.setItem('access_token', token);
  }
};

export const getToken = () => {
  logger.log("getToken");
  if (typeof window !== 'undefined') {
    return AsyncStorage.getItem('access_token');
  }
  return null;
};

export const clearToken = () => {
  logger.log("clearToken");
  if (typeof window !== 'undefined') {
    AsyncStorage.removeItem('access_token');
  }
};

export async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  logger.log("request", path, method, body, token);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authToken = token || (await getToken());
  logger.log("authToken", authToken);
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  logger.log("${API_BASE_URL}${path}", `${API_BASE_URL}${path}`);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  logger.log("res status", res.status);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return (await res.json()) as T;
}

export { API_BASE_URL };