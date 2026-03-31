import api from "./axios";

export const ingestLog = (rawLog) =>
  api.post("ingest/", { logs: rawLog }).then((r) => r.data);

export const uploadFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .post("upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress?.(percent);
      },
    })
    .then((r) => r.data);
};

export const getUploadHistory = () => api.get("upload/").then((r) => r.data);
