import React from "react";
import { Search, Upload, X } from "lucide-react";

const Header = ({
  searchTerm,
  setSearchTerm,
  loading,
  uploadProgress,
  onUpload,
}) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <label className="px-4 py-2.5 bg-blue-600 text-white rounded-xl flex items-center space-x-2 cursor-pointer hover:bg-blue-700">
            <Upload className="h-5 w-5" />
            <span>{loading ? "Uploading..." : "Upload"}</span>
            <input
              type="file"
              className="hidden"
              onChange={onUpload}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {loading && uploadProgress > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Uploading...</span>
            <span className="text-xs text-gray-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: uploadProgress + "%" }}
            ></div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
