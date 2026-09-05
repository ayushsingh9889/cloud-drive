import React from "react";
import {
  File,
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  Star,
  Share2,
  Music,
  Video,
  Archive,
  FileSpreadsheet,
  FileCode,
  Eye,
} from "lucide-react";

const FileCard = ({
  file,
  onDownload,
  onDelete,
  onStar,
  onShare,
  onPreview,
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) {
      return <ImageIcon className="h-10 w-10 text-green-500" />;
    } else if (mimeType?.includes("pdf")) {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (mimeType?.includes("audio/")) {
      return <Music className="h-10 w-10 text-purple-500" />;
    } else if (mimeType?.includes("video/")) {
      return <Video className="h-10 w-10 text-pink-500" />;
    } else if (mimeType?.includes("zip") || mimeType?.includes("rar")) {
      return <Archive className="h-10 w-10 text-yellow-500" />;
    } else if (mimeType?.includes("sheet") || mimeType?.includes("excel")) {
      return <FileSpreadsheet className="h-10 w-10 text-emerald-500" />;
    } else if (
      mimeType?.includes("javascript") ||
      mimeType?.includes("json") ||
      mimeType?.includes("code")
    ) {
      return <FileCode className="h-10 w-10 text-blue-500" />;
    } else {
      return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (mimeType) => {
    if (mimeType?.startsWith("image/")) return "Image";
    if (mimeType?.includes("pdf")) return "PDF";
    if (mimeType?.includes("audio/")) return "Audio";
    if (mimeType?.includes("video/")) return "Video";
    if (mimeType?.includes("zip") || mimeType?.includes("rar"))
      return "Archive";
    if (mimeType?.includes("sheet") || mimeType?.includes("excel"))
      return "Spreadsheet";
    if (mimeType?.includes("javascript") || mimeType?.includes("json"))
      return "Code";
    return "File";
  };

  return (
    <div
      className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 group cursor-pointer"
      onClick={() => onPreview && onPreview(file)}
      onDoubleClick={() => onPreview && onPreview(file)}
    >
      <div className="flex items-center justify-between mb-3">
        {getFileIcon(file.mime_type)}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(file);
              }}
              className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(file);
              }}
              className="p-2 text-gray-500 hover:text-purple-500 hover:bg-gray-800 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          {onStar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStar("file", file.id);
              }}
              className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-gray-800 rounded-lg transition-colors"
              title="Star"
            >
              <Star className="h-4 w-4" />
            </button>
          )}
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(file.id);
              }}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-800 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
              }}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm font-medium text-white truncate">{file.name}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size_bytes)}
        </p>
        <p className="text-xs text-gray-600">
          {getFileTypeLabel(file.mime_type)}
        </p>
      </div>
    </div>
  );
};

export default FileCard;
