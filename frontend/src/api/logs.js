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
        if (e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress?.(percent);
        }
      },
    })
    .then((r) => r.data);
};

export const getUploadHistory = () => api.get("upload/").then((r) => r.data);
export const deleteUpload = async (uploadId) => {
  const paths = [
    `upload/${uploadId}/`,
    `upload/${uploadId}`,
    `upload/delete/${uploadId}/`,
    `upload/delete/${uploadId}`,
  ];
  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.delete(path);
      return response.data;
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      lastError = error;
    }
  }
  throw lastError;
};
export const getUploadPreview = async (uploadId) => {
  const paths = [`upload/${uploadId}/preview/`, `upload/preview/${uploadId}/`];
  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.get(path);
      return response.data;
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      lastError = error;
    }
  }
  throw lastError;
};

export const analyzeUploadFile = async (uploadId, options = {}) => {
  const { force = false } = options;
  const paths = [`upload/${uploadId}/analyze/`, `upload/analyze/${uploadId}/`];
  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.post(
        path,
        { force },
        {
          // Large file AI analysis can take a while; avoid premature client timeout.
          timeout: 300000,
        },
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      lastError = error;
    }
  }
  throw lastError;
};

export const markUploadAnalysisFailed = async (uploadId, errorMessage) => {
  const paths = [
    `upload/${uploadId}/mark-failed/`,
    `upload/mark-failed/${uploadId}/`,
  ];
  let lastError = null;
  for (const path of paths) {
    try {
      const response = await api.post(path, { error_message: errorMessage });
      return response.data;
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      lastError = error;
    }
  }
  throw lastError;
};
