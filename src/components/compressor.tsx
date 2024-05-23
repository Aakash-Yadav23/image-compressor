// components/Compressor.tsx
'use client'

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { compressImage } from '../util/compressImage';

const Compressor: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [targetSize, setTargetSize] = useState<number>();
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [compressedBase64, setCompressedBase64] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setCompressedBase64(null); // Reset the compressed image when a new file is selected
            convertToBase64(file);
        }
    };

    const convertToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setBase64Image(reader.result as string);
        };
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetSize(Number(e.target.value));
    };

    const handleCompress = () => {
        if (base64Image && targetSize) {
            compressImage(base64Image, targetSize, (compressedBase64) => {
                setCompressedBase64(compressedBase64);
            });
        }
    };

    const download = () => {
        if (compressedBase64) {
            const link = document.createElement('a');
            link.href = compressedBase64;
            link.download = 'compressed_image.jpg';
            link.click();
        }
    };

    return (
        <div className='dark flex flex-col gap-4 text-white'>
            <h1>Image Compressor and Downloader</h1>
            <Input type="file" className='text-white' accept="image/*" onChange={handleFileChange} />
            {base64Image && (
                <div>
                    <h2>Original Image:</h2>
                    <img src={base64Image} alt="Original" className='w-full h-[100px] object-contain' style={{ maxWidth: '100%' }} />
                </div>
            )}
            <Input
                type="number"
                value={targetSize}
                onChange={handleSizeChange}
                className='text-white'
                placeholder="Target size in KB"
            />
            <Button onClick={handleCompress}>Compress</Button>
            {compressedBase64 && (
                <div>
                    <h2>Compressed Image:</h2>
                    <img src={compressedBase64} alt="Compressed" className='w-full h-[100px] object-contain' />
                </div>
            )}
            {compressedBase64 && (
                <Button onClick={download}>
                    Download
                </Button>
            )}
        </div>
    );
};

export default Compressor;
