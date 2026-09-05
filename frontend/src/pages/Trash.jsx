import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2, RotateCcw, File, FileText, Image as ImageIcon, ArrowLeft, X } from 'lucide-react';

const Trash = () => {
    const [trashFiles, setTrashFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrash();
    }, []);

    const fetchTrash = async () => {
        try {
            const response = await api.get('/files/trash');
            setTrashFiles(response.data.data.files || []);
        } catch (error) {
            console.error('Failed to fetch trash:', error);
            toast.error('Failed to load trash');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (fileId) => {
        try {
            await api.post('/files/' + fileId + '/restore');
            toast.success('File restored!');
            fetchTrash();
        } catch (error) {
            toast.error('Restore failed');
        }
    };

    const handlePermanentDelete = async (fileId) => {
        if (!confirm('Permanently delete this file? This cannot be undone!')) return;
        
        try {
            await api.delete('/files/' + fileId + '/permanent');
            toast.success('File permanently deleted');
            fetchTrash();
        } catch (error) {
            toast.error('Delete failed');
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
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-gray-400 hover:text-white flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Trash</h1>
                            <p className="text-sm text-gray-400">Deleted files appear here</p>
                        </div>
                    </div>
                    <Trash2 className="h-8 w-8 text-gray-500" />
                </div>
            </header>

            {/* Content */}
            <main className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : trashFiles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="h-20 w-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="h-10 w-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">Trash is empty</p>
                        <p className="text-sm text-gray-500 mt-1">Deleted files will appear here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {trashFiles.map((file) => (
                            <div key={file.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 group">
                                <div className="flex items-center justify-between mb-3">
                                    {getFileIcon(file.mime_type)}
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleRestore(file.id)}
                                            className="p-2 text-gray-500 hover:text-green-500 hover:bg-gray-800 rounded-lg transition-colors"
                                            title="Restore"
                                        >
                                            <RotateCcw className="h-5 w-5" />
                                        </button>
                                        <button 
                                            onClick={() => handlePermanentDelete(file.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
                                            title="Delete permanently"
                                        >
                                            <X className="h-5 w-5" />
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

export default Trash;
