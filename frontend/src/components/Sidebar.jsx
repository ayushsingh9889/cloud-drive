import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  Folder,
  Trash2,
  Star,
  LogOut,
  Plus,
  Clock,
  Share2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Activity as ActivityIcon } from "lucide-react";

const Sidebar = ({ onNewFolder }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Cloud Drive</span>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={onNewFolder}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>New Folder</span>
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-lg">
          <Folder className="h-5 w-5" />
          <span>My Drive</span>
        </button>
        <button
          onClick={() => navigate("/recent")}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-white"
        >
          <Clock className="h-5 w-5" />
          <span>Recent</span>
        </button>
        <button
          onClick={() => navigate("/starred")}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-white"
        >
          <Star className="h-5 w-5" />
          <span>Starred</span>
        </button>
        <button
          onClick={() => navigate("/shared")}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-white"
        >
          <Share2 className="h-5 w-5" />
          <span>Shared</span>
        </button>
        <button
          onClick={() => navigate("/trash")}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-white"
        >
          <Trash2 className="h-5 w-5" />
          <span>Trash</span>
        </button>
        <button
          onClick={() => navigate("/activity")}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-white"
        >
          <ActivityIcon className="h-5 w-5" />
          <span>Activity</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 ml-2"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
