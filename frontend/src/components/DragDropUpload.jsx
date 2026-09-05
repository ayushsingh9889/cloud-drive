import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

const DragDropUpload = ({ onFileSelect, loading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={
        "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 " +
        (isDragging
          ? "border-blue-500 bg-blue-500/10"
          : "border-gray-700 bg-gray-900/50 hover:border-gray-600")
      }
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) {
            onFileSelect(e.target.files[0]);
          }
          e.target.value = "";
        }}
        disabled={loading}
      />

      {isDragging ? (
        <>
          <Upload className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-bounce" />
          <p className="text-blue-500 font-medium">Drop file here</p>
        </>
      ) : (
        <>
          <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">
            {loading ? "Uploading..." : "Drag & Drop file here"}
          </p>
          <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        </>
      )}
    </div>
  );
};

export default DragDropUpload;
