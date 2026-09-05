import React from 'react';

const NewFolderModal = ({ show, folderName, setFolderName, onCreate, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-96 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-white">Create New Folder</h3>
                <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Folder name"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && onCreate()}
                />
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2.5 bg-gray-800 text-white rounded-xl">Cancel</button>
                    <button onClick={onCreate} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl">Create</button>
                </div>
            </div>
        </div>
    );
};

export default NewFolderModal;
