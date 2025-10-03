"use client";

import React, { useState, useRef } from 'react';

function Ocr() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [ocrResult, setOcrResult] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const newTextFieldRef = useRef(null); // Ref for the new text field

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

    // New handler for the new text field focus
    const handleNewTextFieldFocus = (e) => {
      const input = e.target;
      input.setSelectionRange(input.value.length, input.value.length);
    };

    return (
        <>
            {error && <p className="error">{error}</p>}

            <div className="bottom-ui-container">
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} id="file-upload-input" className="hidden-file-input" />
                <label htmlFor="file-upload-input" className="custom-file-upload">
                    Choose File
                </label>
                <button onClick={handleUpload} disabled={loading}>
                    {loading ? 'Processing...' : 'Upload & OCR'}
                </button>
                <textarea className="ocr-result-display" value={ocrResult} readOnly style={{ width: '66.66%' }} />
                {/* New text field - placed beside the OCR textarea */}
                <div style={{ marginTop: '10px' }}> {/* Added margin for spacing */}
                  <textarea
                    id="new-text-field"
                    className="new-text-field-style"
                    ref={newTextFieldRef}
                    onFocus={handleNewTextFieldFocus}
                    placeholder="Enter text here"
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid white', width: '180px', backgroundColor: 'transparent', color: 'white' }}
                  ></textarea>
                </div>
            </div>
        </>
    );
}

export default Ocr;