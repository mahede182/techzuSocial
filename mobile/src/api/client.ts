import AsyncStorage from "@react-native-async-storage/async-storage";
import { RequestOptions } from "../@types/api.type";
import { URL } from "../constants/api";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? URL;

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("access_token", token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
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

  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");

  const res = await fetch(`${base}/${p}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

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