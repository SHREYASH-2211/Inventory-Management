import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";
import './FileUpload.css';

export default function ImportCSV() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      // Verify it's a CSV file by extension as MIME types can be unreliable
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        toast.error("Please upload a valid CSV file");
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'] // Some CSV files may have this MIME type
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Ensure this matches your backend expectation

    try {
      setUploading(true);
      const token = localStorage.getItem("accessToken");

      // Add console log to verify the file is in FormData
      console.log("FormData entries:", Array.from(formData.entries()));

      const response = await axios.post(
        "http://192.168.252.193:8000/api/v1/items/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(`✅ Imported ${response.data.importedCount} items`);
      setFile(null); // Reset after successful upload
    } catch (error) {
      console.error("Import failed:", error);
      let errorMessage = "❌ Import failed";
      
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        console.error("Request:", error.request);
        errorMessage = "No response received from server";
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="import-csv-container">
      <h2>📥 Import Inventory CSV</h2>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your CSV file here...</p>
        ) : (
          <p>Drag & drop CSV file here, or click to browse</p>
        )}
      </div>

      {file && (
        <div className="file-info">
          <strong>Selected:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
        </div>
      )}

      <button 
        className="upload-btn" 
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? "Uploading..." : "Upload & Import"}
      </button>
    </div>
  );
}