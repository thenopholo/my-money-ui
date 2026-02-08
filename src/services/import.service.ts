import { post, postMultipart } from "./http-client.ts";
import type { ImportConfirmRequest } from "../models/dtos.ts";
import type { ImportPreviewResponse, ImportResult } from "../models/entities.ts";
import type { ImportType } from "../models/enums.ts";

export function importPreview(
  file: File,
  importType: ImportType,
  targetId: string,
): Promise<ImportPreviewResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("import_type", importType);
  formData.append("target_id", targetId);
  return postMultipart<ImportPreviewResponse>("/api/import/preview", formData);
}

export function importConfirm(data: ImportConfirmRequest): Promise<ImportResult> {
  return post<ImportResult>("/api/import/confirm", data);
}
