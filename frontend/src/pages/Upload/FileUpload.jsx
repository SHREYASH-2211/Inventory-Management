import { useState, useRef, useEffect } from 'react';
import {
  FiUploadCloud,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiClipboard,
  FiUpload,
  FiCheckSquare
} from 'react-icons/fi';
import './FileUpload.css';

const UploadGuide = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      title: 'Select Your Document',
      description: 'Drag and drop your document into the upload area or click to browse your files.',
      icon: <FiClipboard className="step-icon" />,
      details: [
        'Supported file types: PDF, DOCX, DOC, TXT',
        'Maximum file size: 10MB',
        'Make sure your document is complete and correctly formatted',
      ],
    },
    {
      id: 2,
      title: 'Upload in Progress',
      description: 'Your document is being uploaded and processed. This may take a few moments.',
      icon: <FiUpload className="step-icon" />,
      details: [
        'Do not close your browser during upload',
        'The progress bar will show the upload status',
        'Your document is being securely transferred',
      ],
    },
    {
      id: 3,
      title: 'Upload Complete',
      description: 'Your document has been successfully uploaded and is now available for use.',
      icon: <FiCheckSquare className="step-icon" />,
      details: [
        'You will receive an email confirmation',
        'Your document is now stored securely',
        'You can upload another document or continue to the next step of your process',
      ],
    },
  ];

  return (
    <div className="upload-guide">
      <h2 className="guide-title">Upload Guide</h2>
      <p className="guide-subtitle">Follow these steps to successfully upload your document</p>

      <div className="steps-container">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          >
            <div className="step-header">
              <div className="step-number">{step.id}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              <div className="step-icon-container">{step.icon}</div>
            </div>
            <div className="step-details">
              <ul>
                {step.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="what-to-expect">
        <h3>What to Expect After Upload</h3>
        <ul>
          <li>Automatic document verification and processing</li>
          <li>Email notification when processing is complete</li>
          <li>Secure document storage with password protection</li>
          <li>Ability to share documents with authorized users</li>
        </ul>
      </div>
    </div>
  );
};

const UploadArea = ({ onFileUpload, uploadedFile, uploadStatus, uploadProgress, onReset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEvents = (e, dragging = false) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files?.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const renderUploadContent = () => {
    switch (uploadStatus) {
      case 'idle':
        return (
          <>
            <FiUploadCloud className="upload-icon" />
            <h3 className="upload-title">Drag and drop your document</h3>
            <p className="upload-subtitle">or</p>
            <button className="browse-button" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </button>
            <p className="file-hint">Accepted file types: PDF, DOCX, DOC, TXT (max 10MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              className="file-input"
              onChange={handleFileInputChange}
              accept=".pdf,.docx,.doc,.txt"
              hidden
            />
          </>
        );

      case 'uploading':
        return (
          <div className="upload-progress-container">
            <FiFile className="file-icon" />
            <p className="file-name">{uploadedFile?.name}</p>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="progress-text">Uploading... {uploadProgress}%</p>
          </div>
        );

      case 'success':
        return (
          <div className="upload-complete">
            <FiCheckCircle className="success-icon" />
            <h3 className="upload-title">Upload Complete!</h3>
            <p className="file-name">{uploadedFile?.name}</p>
            <p className="success-message">Your document has been successfully uploaded.</p>
            <button className="reset-button" onClick={onReset}>
              <FiRefreshCw /> Upload Another Document
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="upload-error">
            <FiAlertCircle className="error-icon" />
            <h3 className="upload-title">Upload Failed</h3>
            <p className="error-message">There was an error uploading your document. Please try again.</p>
            <button className="reset-button" onClick={onReset}>
              <FiRefreshCw /> Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`upload-area ${isDragging ? 'dragging' : ''} ${uploadStatus !== 'idle' ? 'has-file' : ''}`}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDrop={handleDrop}
    >
      {renderUploadContent()}
    </div>
  );
};

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    let intervalId;

    if (uploadStatus === 'uploading') {
      intervalId = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            setUploadStatus('success');
            setCurrentStep(3);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [uploadStatus]);

  const handleFileUpload = (file) => {
    if (!file) return;

    setUploadedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setCurrentStep(2);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setCurrentStep(1);
  };

  return (
    <div className="file-upload-page">
      <h1 className="page-title">File Upload <span>(document upload)</span></h1>
      <div className="upload-container">
        <UploadGuide currentStep={currentStep} />
        <UploadArea
          onFileUpload={handleFileUpload}
          uploadedFile={uploadedFile}
          uploadStatus={uploadStatus}
          uploadProgress={uploadProgress}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};

export default FileUpload;