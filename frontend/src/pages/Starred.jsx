import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Star, Folder, File, FileText, Image as ImageIcon, ArrowLeft, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Starred = () => {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStarred();
    }, []);

    const fetchStarred = async () => {
        try {
            const response = await api.get('/stars/items');
            setFiles(response.data.data.files || []);
            setFolders(response.data.data.folders || []);
        } catch (error) {
            console.error('Failed to fetch starred:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnstar = async (resourceType, resourceId) => {
        try {
            await api.post('/stars', { resourceType, resourceId });
            toast.success('Removed from starred');
            fetchStarred();
        } catch (error) {
            toast.error('Failed to remove star');
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const response = await api.get('/files/' + fileId + '/download');
            window.open(response.data.data.downloadUrl, '_blank');
        } catch (error) {
            toast.error('Download failed');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType) => {
        if (mimeType?.startsWith('image/')) {
            return <ImageIcon className="h-10 w-10 text-green-500" />;
        } else if (mimeType?.includes('pdf')) {
            return <FileText className="h-10 w-10 text-red-500" />;
        } else {
            return <File className="h-10 w-10 text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center space-x-2">
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Starred</h1>
                            <p className="text-sm text-gray-400">Your favorite files and folders</p>
                        </div>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                </div>
            </header>

            <main className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : folders.length === 0 && files.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="h-10 w-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">No starred items</p>
                        <p className="text-sm text-gray-500 mt-1">Star important files and folders</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {folders.map((folder) => (
                            <div key={folder.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 group">
                                <div className="flex items-center justify-between mb-3">
                                    <Folder className="h-10 w-10 text-yellow-500" />
                                    <button onClick={() => handleUnstar('folder', folder.id)} className="text-yellow-500 hover:text-yellow-400">
                                        <Star className="h-5 w-5 fill-current" />
                                    </button>
                                </div>
                                <p className="text-sm font-medium text-white truncate">{folder.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Folder</p>
                            </div>
                        ))}

                        {files.map((file) => (
                            <div key={file.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 group">
                                <div className="flex items-center justify-between mb-3">
                                    {getFileIcon(file.mime_type)}
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleDownload(file.id)} className="text-gray-500 hover:text-blue-500">
                                            <Download className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleUnstar('file', file.id)} className="text-yellow-500 hover:text-yellow-400">
                                            <Star className="h-5 w-5 fill-current" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size_bytes)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Starred;
