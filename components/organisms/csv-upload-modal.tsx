"use client";

import { useState, useRef } from "react";
import { X, Upload, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { uploadCSV, downloadCSVTemplate } from "@/lib/api/customer.service";

interface CSVUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CSVUploadModal({ onClose, onSuccess }: CSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    message: string;
    imported: number;
    failed: number;
    errors?: Array<{ row?: number; errors?: string[]; message?: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please select a valid CSV file");
        return;
      }
      setFile(selectedFile);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const result = await uploadCSV(file);
      setUploadResult(result);

      // Auto close if all records imported successfully
      if (result.failed === 0 && result.imported > 0) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload CSV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadCSVTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "customer_template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download template");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type !== "text/csv" && !droppedFile.name.endsWith(".csv")) {
        setError("Please drop a valid CSV file");
        return;
      }
      setFile(droppedFile);
      setError(null);
      setUploadResult(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload CSV File</h2>
            <p className="text-sm text-gray-500">Bulk import customer data</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Download Template Button */}
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div>
              <p className="font-medium text-blue-900">Need a template?</p>
              <p className="text-sm text-blue-700">
                Download the CSV template to get started
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download Template
            </button>
          </div>

          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="space-y-4">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-700">
                    Drag and drop your CSV file here
                  </p>
                  <p className="text-sm text-gray-500">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`rounded-lg border p-4 ${
                uploadResult.failed === 0
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {uploadResult.failed === 0 ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      uploadResult.failed === 0 ? "text-green-900" : "text-yellow-900"
                    }`}
                  >
                    {uploadResult.message}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-green-700">
                      ✓ Successfully imported: {uploadResult.imported} records
                    </p>
                    {uploadResult.failed > 0 && (
                      <p className="text-red-700">
                        ✗ Failed: {uploadResult.failed} records
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
