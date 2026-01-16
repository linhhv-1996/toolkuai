// compressorWorker.ts
import jpegEncode from '@jsquash/jpeg/encode';
import pngEncode from '@jsquash/png/encode';
import webpEncode from '@jsquash/webp/encode';
import { optimise } from '@jsquash/oxipng';
import resize from '@jsquash/resize';

async function getImageDataFromFile(file: File): Promise<ImageData> {
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        bitmap.close();
        throw new Error('Failed to get 2d context');
    }
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    bitmap.close();
    return imageData;
}

function getFileFormat(file: File): string {
    const type = file.type.toLowerCase();
    if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
    if (type.includes('png')) return 'png';
    if (type.includes('webp')) return 'webp';
    return 'jpg'; // Fallback
}

self.onmessage = async (e) => {
    const { file, outputFormat, quality, maxWidthOrHeight, index } = e.data;

    try {
        let imageData = await getImageDataFromFile(file);

        if (maxWidthOrHeight > 0 && (imageData.width > maxWidthOrHeight || imageData.height > maxWidthOrHeight)) {
            imageData = await resize(imageData, {
                width: maxWidthOrHeight,
                height: maxWidthOrHeight,
                method: 'lanczos3',
                fitMethod: 'contain'
            });
        }

        let effectiveFormat = outputFormat;
        if (outputFormat === 'original') {
            effectiveFormat = getFileFormat(file);
        }

        let compressedBuffer: ArrayBuffer;
        if (effectiveFormat === 'jpg') {
            compressedBuffer = await jpegEncode(imageData, { quality });
        } else if (effectiveFormat === 'webp') {
            compressedBuffer = await webpEncode(imageData, { quality });
        } else if (effectiveFormat === 'png') {
            let pngBuffer = await pngEncode(imageData);
            const level = Math.floor((100 - quality) / 20) + 1;
            compressedBuffer = await optimise(pngBuffer, { level });
        } else {
            compressedBuffer = await jpegEncode(imageData, { quality });
            effectiveFormat = 'jpg';
        }

        self.postMessage({
            index,
            compressedBuffer,
            effectiveFormat,
            resultSize: compressedBuffer.byteLength
        });
    } catch (error) {
        self.postMessage({ error, index });
    }
};
