import { put } from "./http-client.ts";
import type { UpdatePasswordRequest, UpdatePasswordResponse } from "../models/dtos.ts";

export function updatePassword(data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
  return put<UpdatePasswordResponse>("/api/me/password", data);
}
