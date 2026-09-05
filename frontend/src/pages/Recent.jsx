import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Clock, File, FileText, Image as ImageIcon, Download, Trash2, ArrowLeft, Star } from 'lucide-react';

const Recent = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecentFiles();
    }, []);

    const fetchRecentFiles = async () => {
        try {
            const response = await api.get('/files/recent');
            setFiles(response.data.data.files || []);
        } catch (error) {
            console.error('Failed to fetch recent files:', error);
            toast.error('Failed to load recent files');
        } finally {
            setLoading(false);
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

    const handleDelete = async (fileId) => {
        try {
            await api.delete('/files/' + fileId);
            toast.success('File moved to trash');
            fetchRecentFiles();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleStar = async (fileId) => {
        try {
            await api.post('/stars', { resourceType: 'file', resourceId: fileId });
            toast.success('Star updated');
        } catch (error) {
            toast.error('Failed to star');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return diffMins + ' mins ago';
        if (diffHours < 24) return diffHours + ' hours ago';
        if (diffDays < 7) return diffDays + ' days ago';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                            <h1 className="text-2xl font-bold text-white">Recent Files</h1>
                            <p className="text-sm text-gray-400">Recently uploaded files</p>
                        </div>
                    </div>
                    <Clock className="h-8 w-8 text-gray-500" />
                </div>
            </header>

            <main className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="h-10 w-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">No recent files</p>
                        <p className="text-sm text-gray-500 mt-1">Upload files to see them here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {files.map((file) => (
                            <div key={file.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 group">
                                <div className="flex items-center justify-between mb-3">
                                    {getFileIcon(file.mime_type)}
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleStar(file.id)} className="text-gray-500 hover:text-yellow-500">
                                            <Star className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDownload(file.id)} className="text-gray-500 hover:text-blue-500">
                                            <Download className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(file.id)} className="text-gray-500 hover:text-red-500">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size_bytes)}</p>
                                <p className="text-xs text-gray-600 mt-1">{formatDate(file.created_at)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Recent;
