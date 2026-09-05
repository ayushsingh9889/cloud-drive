import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Activity as ActivityIcon,
  ArrowLeft,
  Upload,
  Trash2,
  RotateCcw,
  Share2,
  Star,
  Folder,
  File,
  Clock,
} from "lucide-react";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get("/activities?limit=50");
      setActivities(response.data.data.activities || []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "upload":
        return <Upload className="h-5 w-5 text-blue-500" />;
      case "delete":
        return <Trash2 className="h-5 w-5 text-red-500" />;
      case "restore":
        return <RotateCcw className="h-5 w-5 text-green-500" />;
      case "share":
        return <Share2 className="h-5 w-5 text-purple-500" />;
      case "star":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "create_folder":
        return <Folder className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case "upload":
        return "Uploaded";
      case "delete":
        return "Deleted";
      case "restore":
        return "Restored";
      case "share":
        return "Shared";
      case "star":
        return "Starred";
      case "create_folder":
        return "Created folder";
      default:
        return action;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return diffMins + " mins ago";
    if (diffHours < 24) return diffHours + " hours ago";
    if (diffDays < 7) return diffDays + " days ago";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getContextText = (activity) => {
    if (!activity.context) return "";
    try {
      const ctx = JSON.parse(activity.context);
      return ctx.fileName || ctx.folderName || "";
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Activity Log</h1>
              <p className="text-sm text-gray-400">
                Recent actions on your files
              </p>
            </div>
          </div>
          <ActivityIcon className="h-8 w-8 text-gray-500" />
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ActivityIcon className="h-10 w-10 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">No activity yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Your actions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center space-x-4 hover:border-gray-700 transition-colors"
              >
                <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">
                    {getActionLabel(activity.action)}
                    {getContextText(activity) && (
                      <span className="text-gray-300">
                        {" "}
                        - {getContextText(activity)}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.resource_type || "item"}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-500">
                    {formatTime(activity.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Activity;
