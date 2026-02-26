import { HttpMethod } from "../constants/api";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}