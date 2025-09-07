import type { FilterType } from '../types';

export const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export const cropImage = (imageUrl: string, aspectRatio: string): Promise<string> => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Could not get canvas context"));

        let sourceX, sourceY, sourceWidth, sourceHeight;
        const originalWidth = img.width;
        const originalHeight = img.height;
        const originalAspectRatio = originalWidth / originalHeight;

        const [targetW, targetH] = aspectRatio.split(':').map(Number);
        const targetAspectRatio = targetW / targetH;

        if (originalAspectRatio > targetAspectRatio) {
            sourceHeight = originalHeight;
            sourceWidth = originalHeight * targetAspectRatio;
            sourceX = (originalWidth - sourceWidth) / 2;
            sourceY = 0;
        } else {
            sourceWidth = originalWidth;
            sourceHeight = originalWidth / targetAspectRatio;
            sourceY = (originalHeight - sourceHeight) / 2;
            sourceX = 0;
        }

        canvas.width = sourceWidth;
        canvas.height = sourceHeight;

        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
        resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
});

export const createSingleFramedImage = (imageUrl: string, cropRatio: string, labelText: string | null = null): Promise<string> => new Promise(async (resolve, reject) => {
    try {
        const croppedImgUrl = await cropImage(imageUrl, cropRatio);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = croppedImgUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error("Could not get canvas context"));

            const hasLabel = !!labelText;
            const sidePadding = img.width * 0.04;
            const topPadding = img.width * 0.04;
            let bottomPadding = img.width * 0.18;

            if (hasLabel) {
                bottomPadding = img.width * 0.24;
            }

            canvas.width = img.width + sidePadding * 2;
            canvas.height = img.height + topPadding + bottomPadding;

            ctx.fillStyle = '#111827'; // A dark gray for the frame
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, sidePadding, topPadding);

            if (hasLabel) {
                const labelFontSize = Math.max(24, Math.floor(img.width * 0.08));
                ctx.font = `700 ${labelFontSize}px Caveat, cursive`;
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(labelText, canvas.width / 2, img.height + topPadding + (bottomPadding - img.width * 0.1) / 2);
            }

            const fontSize = Math.max(12, Math.floor(img.width * 0.05));
            ctx.font = `600 ${fontSize}px Inter, sans-serif`;
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("Made with Gemini", canvas.width / 2, canvas.height - (img.width * 0.11));

            const nanoFontSize = Math.max(8, Math.floor(img.width * 0.035));
            ctx.font = `600 ${nanoFontSize}px Inter, sans-serif`;
            ctx.fillText("Edit your images with Nano Banana at gemini.google", canvas.width / 2, canvas.height - (img.width * 0.05));

            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
    } catch (err) {
        reject(err);
    }
});

export const applyFilterToImage = (imageDataUrl: string, filter: FilterType): Promise<string> => new Promise((resolve, reject) => {
    if (filter === 'none') {
        resolve(imageDataUrl);
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageDataUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Could not get canvas context"));

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            switch (filter) {
                case 'bw': {
                    const gray = r * 0.299 + g * 0.587 + b * 0.114;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                    break;
                }
                case 'sepia': {
                    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                    break;
                }
                 case 'vintage': {
                    data[i] = Math.min(255, r * 0.5 + g * 0.7 + b * 0.2);
                    data[i + 1] = Math.min(255, r * 0.45 + g * 0.65 + b * 0.15);
                    data[i + 2] = Math.min(255, r * 0.4 + g * 0.5 + b * 0.1);
                    break;
                }
                case 'cool': {
                    data[i] = Math.min(255, r * 0.9);
                    data[i + 1] = g;
                    data[i + 2] = Math.min(255, b * 1.1);
                    break;
                }
                case 'warm': {
                    data[i] = Math.min(255, r * 1.1);
                    data[i + 1] = g;
                    data[i + 2] = Math.min(255, b * 0.9);
                    break;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
});