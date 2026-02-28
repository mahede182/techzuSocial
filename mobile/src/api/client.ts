import AsyncStorage from "@react-native-async-storage/async-storage";
import { HttpMethod, URL } from "../constants/api";
import { AppLogger } from "@/helper/applogger";
import { RequestOptions } from "@/@types/api";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? URL;

const logger = new AppLogger("Api Client");

export const storeToken = async (token: string) => {
  if (!token) {
    logger.log("storeToken: token is undefined, skipping");
    return;
  }
  if (typeof window !== 'undefined') {
    await AsyncStorage.setItem('access_token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return AsyncStorage.getItem('access_token');
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    AsyncStorage.removeItem('access_token');
  }
};

export async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authToken = token || (await getToken());

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = `Request failed with status ${res.status}`;
    if (text) {
      try {
        const json = JSON.parse(text);
        message = json.error ?? json.message ?? text;
      } catch {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return (await res.json()) as T;
}

export { API_BASE_URL };