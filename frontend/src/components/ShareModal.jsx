import React, { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { X, Share2, Link, Copy, Users } from "lucide-react";

const ShareModal = ({ isOpen, onClose, resourceType, resourceId }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [shares, setShares] = useState([]);

  const loadShares = async () => {
    try {
      const response = await api.get(`/shares/${resourceType}/${resourceId}`);

      setShares(response.data?.data?.shares || []);
    } catch (error) {
      console.error("Failed to load shares:", error);
    }
  };

  useEffect(() => {
    if (isOpen && resourceType && resourceId) {
      loadShares();
    }
  }, [isOpen, resourceType, resourceId]);

  const handleShare = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);

      await api.post("/shares", {
        resourceType,
        resourceId,
        granteeEmail: email.trim(),
        role,
      });

      toast.success("Shared successfully");

      setEmail("");
      setRole("viewer");

      await loadShares();
    } catch (error) {
      console.error("Share error:", error);

      toast.error(error.response?.data?.message || "Failed to share");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      const link =
        window.location.origin + `/shared/${resourceType}/${resourceId}`;

      await navigator.clipboard.writeText(link);

      toast.success("Link copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy link");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Share2 className="w-5 h-5 text-purple-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Share</h2>

              <p className="text-sm text-gray-500">
                Give others access to this {resourceType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleShare} className="p-5">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 outline-none focus:border-purple-500"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 outline-none focus:border-purple-500"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg py-2.5 font-medium"
          >
            <Users className="w-4 h-4" />

            {loading ? "Sharing..." : "Share"}
          </button>
        </form>

        {/* Copy Link */}
        <div className="px-5 pb-5">
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg py-2.5"
          >
            <Link className="w-4 h-4" />
            Copy share link
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Shares */}
        <div className="border-t border-gray-800 p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            People with access
          </h3>

          {shares.length === 0 ? (
            <p className="text-sm text-gray-500">No one has access yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm text-white">
                      {share.grantee_name || "User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {share.grantee_email}
                    </p>
                  </div>

                  <span className="text-xs text-purple-400 capitalize">
                    {share.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
