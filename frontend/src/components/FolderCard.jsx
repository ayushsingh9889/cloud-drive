import React from "react";
import { Folder, Trash2, Star, Share2 } from "lucide-react";

const FolderCard = ({ folder, onDelete, onStar, onShare }) => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 cursor-pointer group">
      <div className="flex items-center justify-between mb-3">
        <Folder className="h-10 w-10 text-yellow-500" />
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onShare && (
            <button
              onClick={() => onShare(folder)}
              className="p-2 text-gray-500 hover:text-purple-500 hover:bg-gray-800 rounded-lg transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          {onStar && (
            <button
              onClick={() => onStar("folder", folder.id)}
              className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-gray-800 rounded-lg transition-colors"
              title="Star"
            >
              <Star className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(folder.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm font-medium text-white truncate">{folder.name}</p>
      <p className="text-xs text-gray-500 mt-1">Folder</p>
    </div>
  );
};

export default FolderCard;
