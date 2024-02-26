import { _post, _download } from "@App/server/http";

// 文件上传
export function fileUpload(data, headers) {
  return _post(
    `/api/upload/file`,
    data,
    headers
  );
}