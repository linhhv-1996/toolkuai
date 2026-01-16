// pdfCompressorWorker.ts
import { compress } from "@quicktoolsone/pdf-compress";
import * as pdfjs from "pdfjs-dist";

// Update path theo docs (sau khi copy file)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.js/pdf.worker.min.mjs';  // Hoặc remove dòng này để fallback CDN

self.onmessage = async (e) => {
    const { index, buffer, options } = e.data;

    try {
        self.postMessage({
            type: 'log',
            data: { message: `Starting compression for index ${index}, preset: ${options.preset}` }
        });

        const result = await compress(buffer, {
            ...options,
            onProgress: (event) => {
                self.postMessage({
                    type: 'progress',
                    data: { index, progress: event.progress, message: event.message }
                });
            }
        });

        self.postMessage({
            type: 'result',
            data: { index, compressedBuffer: result.pdf }
        });
    } catch (error: any) {
        // Gửi full details theo docs
        self.postMessage({
            type: 'result',
            data: {
                index,
                error: error.message,
                stack: error.stack || 'No stack trace',
                phase: error.phase || 'Unknown phase',  // e.g., 'compressing'
                attemptedPreset: error.attemptedPreset || options.preset,
                originalSize: error.originalSize || buffer.byteLength
            }
        });
    }
};
