import React, { useState, useEffect } from "react";
import { X, Download, FileText, Image as ImageIcon } from "lucide-react";
import api from "../api/axios";

const FilePreviewModal = ({ file, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file && isPreviewable(file.mime_type)) {
      fetchPreviewUrl();
    }
  }, [file]);

  const isPreviewable = (mimeType) => {
    return (
      mimeType?.startsWith("image/") ||
      mimeType?.includes("pdf") ||
      mimeType?.startsWith("text/") ||
      mimeType?.includes("json") ||
      mimeType?.includes("javascript")
    );
  };

  const fetchPreviewUrl = async () => {
    try {
      const response = await api.get("/files/" + file.id + "/download");
      setPreviewUrl(response.data.data.downloadUrl);
      setLoading(false);
    } catch (error) {
      setError("Failed to load preview");
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileType = (mimeType) => {
    if (mimeType?.startsWith("image/")) return "Image";
    if (mimeType?.includes("pdf")) return "PDF";
    if (mimeType?.startsWith("text/")) return "Text";
    if (mimeType?.includes("json")) return "JSON";
    if (mimeType?.includes("javascript")) return "JavaScript";
    return "File";
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            {file?.mime_type?.startsWith("image/") ? (
              <ImageIcon className="h-6 w-6 text-green-500" />
            ) : (
              <FileText className="h-6 w-6 text-blue-500" />
            )}
            <div>
              <h3 className="text-white font-medium truncate">{file?.name}</h3>
              <p className="text-xs text-gray-500">
                {getFileType(file?.mime_type)} •{" "}
                {formatFileSize(file?.size_bytes)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-4 overflow-auto"
          style={{ maxHeight: "calc(90vh - 80px)" }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-gray-400">{error}</p>
            </div>
          ) : file?.mime_type?.startsWith("image/") ? (
            <div className="flex items-center justify-center">
              <img
                src={previewUrl}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          ) : file?.mime_type?.includes("pdf") ? (
            <div className="w-full h-[70vh]">
              <iframe
                src={previewUrl}
                title={file.name}
                className="w-full h-full rounded-xl"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-20 w-20 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">
                Preview not available for this file type
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Download to view the file
              </p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
