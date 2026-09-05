import React, { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Cloud } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FileCard from "../components/FileCard";
import FolderCard from "../components/FolderCard";
import NewFolderModal from "../components/NewFolderModal";
import ShareModal from "../components/ShareModal";
import DragDropUpload from "../components/DragDropUpload";
import FilePreviewModal from "../components/FilePreviewModal";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [shareResource, setShareResource] = useState(null);

  const [previewFile, setPreviewFile] = useState(null);

  // =========================
  // FETCH FOLDERS & FILES
  // =========================

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await api.get("/folders/parent/null");

      setFolders(response.data?.data?.folders || []);
    } catch (error) {
      console.error("Fetch folders error:", error);
      setFolders([]);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files/folder/null");

      setFiles(response.data?.data?.files || []);
    } catch (error) {
      console.error("Fetch files error:", error);
      setFiles([]);
    }
  };

  // =========================
  // CREATE FOLDER
  // =========================

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter folder name");
      return;
    }

    try {
      await api.post("/folders", {
        name: newFolderName.trim(),
        parentId: null,
      });

      toast.success("Folder created!");

      setNewFolderName("");
      setShowNewFolder(false);

      await fetchFolders();
    } catch (error) {
      console.error("Create folder error:", error);

      toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  // =========================
  // FILE UPLOAD
  // =========================

  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    setLoading(true);
    setUploadProgress(0);

    try {
      await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );

            setUploadProgress(percent);
          }
        },
      });

      toast.success("File uploaded!");

      await fetchFiles();

      setUploadProgress(0);
    } catch (error) {
      console.error("Upload error:", error);

      toast.error(error.response?.data?.message || "Upload failed");

      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DOWNLOAD FILE
  // =========================

  const handleDownload = async (fileId) => {
    try {
      const response = await api.get("/files/" + fileId + "/download");

      const downloadUrl = response.data?.data?.downloadUrl;

      if (!downloadUrl) {
        throw new Error("Download URL not found");
      }

      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);

      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  // =========================
  // DELETE FILE
  // =========================

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete("/files/" + fileId);

      toast.success("File moved to trash");

      await fetchFiles();
    } catch (error) {
      console.error("Delete file error:", error);

      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // =========================
  // DELETE FOLDER
  // =========================

  const handleDeleteFolder = async (folderId) => {
    try {
      await api.delete("/folders/" + folderId);

      toast.success("Folder deleted");

      await fetchFolders();
    } catch (error) {
      console.error("Delete folder error:", error);

      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // =========================
  // STAR FILE / FOLDER
  // =========================

  const handleStar = async (resourceType, resourceId) => {
    try {
      const response = await api.post("/stars", {
        resourceType,
        resourceId,
      });

      toast.success(
        response.data?.starred ? "Added to starred" : "Removed from starred",
      );
    } catch (error) {
      console.error("Star error:", error);

      toast.error(error.response?.data?.message || "Failed to update star");
    }
  };

  // =========================
  // SHARE FILE / FOLDER
  // =========================

  const handleShare = (resource) => {
    if (!resource?.id) {
      toast.error("Resource ID not found");
      return;
    }

    setShareResource({
      resourceType: resource.mime_type ? "file" : "folder",
      resourceId: resource.id,
      name: resource.name,
    });
  };

  // =========================
  // SEARCH
  // =========================

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isEmpty = filteredFolders.length === 0 && filteredFiles.length === 0;

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <Sidebar onNewFolder={() => setShowNewFolder(true)} />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          uploadProgress={uploadProgress}
          onUpload={(e) => handleFileUpload(e.target.files[0])}
        />

        {/* New Folder Modal */}
        <NewFolderModal
          show={showNewFolder}
          folderName={newFolderName}
          setFolderName={setNewFolderName}
          onCreate={handleCreateFolder}
          onClose={() => setShowNewFolder(false)}
        />

        {/* Share Modal */}
        {shareResource && (
          <ShareModal
            isOpen={true}
            resourceType={shareResource.resourceType}
            resourceId={shareResource.resourceId}
            onClose={() => setShareResource(null)}
          />
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <FilePreviewModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}

        {/* Main */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Drag & Drop Upload */}
          {isEmpty && !searchTerm && (
            <div className="mb-6">
              <DragDropUpload
                onFileSelect={handleFileUpload}
                loading={loading}
              />
            </div>
          )}

          {/* Files & Folders */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Folders */}
            {filteredFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onDelete={handleDeleteFolder}
                onStar={handleStar}
                onShare={handleShare}
              />
            ))}

            {/* Files */}
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={handleDownload}
                onDelete={handleDeleteFile}
                onStar={handleStar}
                onShare={handleShare}
                onPreview={setPreviewFile}
              />
            ))}
          </div>

          {/* No Search Results */}
          {isEmpty && searchTerm && (
            <div className="text-center py-20">
              <Cloud className="h-16 w-16 text-gray-700 mx-auto mb-4" />

              <p className="text-gray-400 text-lg">No results found</p>

              <p className="text-sm text-gray-500">
                Try different search terms
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
