import React, { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { X, Link, Copy } from "lucide-react";

const LinkShareModal = ({ resource, onClose }) => {
  const [expiresAt, setExpiresAt] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      const response = await api.post("/links", {
        resourceType: resource.type,
        resourceId: resource.id,
        expiresAt: expiresAt || null,
        password: password || null,
      });
      setGeneratedLink(response.data.data.url);
      toast.success("Link created!");
    } catch (error) {
      toast.error("Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-96 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Link className="h-5 w-5 mr-2 text-blue-500" />
            Public Link for "{resource.name}"
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {generatedLink ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-xl">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 bg-transparent text-white text-sm focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-400 hover:text-blue-500"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Anyone with this link can access this {resource.type}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-800 text-white py-2.5 rounded-xl hover:bg-gray-700"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expiry (optional)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password (optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Protect with password"
              />
            </div>

            <button
              onClick={handleCreateLink}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkShareModal;
