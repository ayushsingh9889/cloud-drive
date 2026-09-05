import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Folder, File, Download } from "lucide-react";

const SharedWithMe = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedItems();
  }, []);

  const fetchSharedItems = async () => {
    try {
      const response = await api.get("/shares/shared-with-me");
      setFiles(response.data.data.files);
      setFolders(response.data.data.folders);
    } catch (error) {
      console.error("Failed to fetch shared items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Shared With Me</h2>

      {folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-20">
          <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No items shared with you</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div key={folder.id} className="bg-white rounded-lg shadow p-4">
              <Folder className="h-10 w-10 text-yellow-500 mb-3" />
              <p className="font-medium truncate">{folder.name}</p>
              <p className="text-sm text-gray-500">
                Shared by {folder.owner_name}
              </p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2 inline-block">
                {folder.share_role}
              </span>
            </div>
          ))}

          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow p-4">
              <File className="h-10 w-10 text-blue-500 mb-3" />
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500">
                Shared by {file.owner_name}
              </p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2 inline-block">
                {file.share_role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedWithMe;
