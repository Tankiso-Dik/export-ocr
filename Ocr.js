"use client";

import React, { useState } from 'react';

function Ocr() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [ocrResult, setOcrResult] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setOcrResult('');
        setError('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first.');
            return;
        }

        setLoading(true);
        setError('');
        setOcrResult('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('/api/ocr', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOcrResult(data.text);
        } catch (e) {
            setError('Failed to perform OCR: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>OCR Application</h1>

            <div className="upload-section">
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={loading}>
                    {loading ? 'Processing...' : 'Upload & OCR'}
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            {ocrResult && (
                <div className="results-section">
                    <h2>OCR Result:</h2>
                    <pre>{ocrResult}</pre>
                </div>
            )}
        </div>
    );
}

export default Ocr;