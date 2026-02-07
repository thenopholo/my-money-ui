import { put } from "./client.ts";
import type { UpdatePasswordRequest, UpdatePasswordResponse } from "../types/api.ts";

export function updatePassword(data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
  return put<UpdatePasswordResponse>("/api/me/password", data);
}
