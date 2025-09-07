import React, { useRef } from 'react';
import type { Dispatch } from 'react';
import { Button } from './ui/Button';
import { CameraModal } from './ui/CameraModal';
import { IconUpload, IconCamera } from './ui/icons';
import type { AppState, AppAction } from '../types';
import { toBase64 } from '../services/imageUtils';
import { ImageFilterSelector } from './ImageFilterSelector';

interface ImageUploaderProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ state, dispatch }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            dispatch({ type: 'UPLOAD_IMAGE_START' });
            try {
                const base64Image = await toBase64(file);
                dispatch({ type: 'UPLOAD_IMAGE_SUCCESS', payload: base64Image });
            } catch (err) {
                console.error("Error during image upload:", err);
                dispatch({ type: 'UPLOAD_IMAGE_FAILURE', payload: "Não foi possível processar essa imagem." });
            }
        }
    };

    const handleCaptureConfirm = (imageDataUrl: string) => {
        dispatch({ type: 'UPLOAD_IMAGE_SUCCESS', payload: imageDataUrl });
    };

    return (
        <section id="image-uploader-section">
            <CameraModal
                isOpen={state.isCameraOpen}
                onClose={() => dispatch({ type: 'SET_CAMERA_OPEN', payload: false })}
                onCapture={handleCaptureConfirm}
            />
            <h2 className="text-xl font-semibold mb-4 text-white tracking-tight">Sua Foto</h2>
            <div className="flex flex-col gap-4">
                <div
                    className="w-full aspect-square border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors bg-zinc-800 overflow-hidden shadow-inner"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {state.status === 'uploading' ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
                            <p className="text-zinc-400 mt-4">Carregando...</p>
                        </div>
                    ) : state.uploadedImage ? (
                        <img src={state.uploadedImage} alt="Uploaded preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                            <IconUpload />
                            <p className="mt-4 text-lg text-zinc-300">Carregar um arquivo</p>
                            <p className="mt-1 text-sm">ou</p>
                            <p className="mt-1 text-sm font-semibold text-purple-400">Arraste e solte</p>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-2">
                     <Button onClick={() => fileInputRef.current?.click()}>
                        {state.uploadedImage ? 'Trocar Arquivo' : 'Escolher do Computador'}
                    </Button>
                    <Button onClick={() => dispatch({ type: 'SET_CAMERA_OPEN', payload: true })}>
                        <div className="flex items-center justify-center gap-2">
                            <IconCamera />
                            <span>Usar Câmera</span>
                        </div>
                    </Button>
                </div>
                
                {state.originalUploadedImage && (
                    <ImageFilterSelector
                        originalImage={state.originalUploadedImage}
                        activeFilter={state.activeFilter}
                        dispatch={dispatch}
                    />
                )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg" className="hidden" />
        </section>
    );
};