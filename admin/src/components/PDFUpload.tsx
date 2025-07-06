import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';

interface PDFUploadProps {
  currentFile?: string;
  onFileChange: (fileUrl: string) => void;
  label: string;
}

const PDFUpload = ({ currentFile, onFileChange, label }: PDFUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFileName(file.name);
      onFileChange(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="relative">
        {currentFile ? (
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <File className="h-6 w-6 text-blue-500" />
            <span className="text-sm text-gray-600">{fileName || 'Syllabus PDF'}</span>
            <button
              type="button"
              onClick={() => onFileChange('')}
              className="ml-auto text-gray-400 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="mb-2 text-sm text-gray-500">Click to upload PDF</p>
              <p className="text-xs text-gray-500">PDF up to 10MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUpload;