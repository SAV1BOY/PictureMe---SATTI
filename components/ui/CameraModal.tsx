import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { IconSwitchCamera } from './icons';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (imageDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const videoTrackRef = useRef<MediaStreamTrack | null>(null);
    
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const [zoom, setZoom] = useState(1);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [capabilities, setCapabilities] = useState<MediaTrackCapabilities | null>(null);
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    useEffect(() => {
        const checkCameras = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    setHasMultipleCameras(videoDevices.length > 1);
                } catch (err) {
                    console.error("Could not enumerate devices:", err);
                }
            }
        };
        checkCameras();
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        videoTrackRef.current = null;
    }, []);

    const startCamera = useCallback(async () => {
        if (videoRef.current) {
            setCameraError(null);
            try {
                stopCamera();
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1024 }, height: { ideal: 1024 }, facingMode }
                });
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                const track = stream.getVideoTracks()[0];
                videoTrackRef.current = track;
                const caps = track.getCapabilities();
                setCapabilities(caps);

                // FIX: The 'zoom' property is not in the standard MediaTrackCapabilities type.
                // Casting to any to allow access to this non-standard property.
                if ((caps as any).zoom) {
                    setZoom(1); // Reset zoom on camera switch
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setCameraError("Acesso à câmera negado. Por favor, permita o acesso à câmera nas configurações do seu navegador.");
            }
        }
    }, [stopCamera, facingMode]);

    useEffect(() => {
        if (isOpen && !capturedImage) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, capturedImage, startCamera, stopCamera]);
    
    useEffect(() => {
        // FIX: The 'zoom' property is not in the standard MediaTrackCapabilities and MediaTrackConstraintSet types.
        // Casting to any to allow access to this non-standard property.
        if (videoTrackRef.current && (capabilities as any)?.zoom) {
            videoTrackRef.current.applyConstraints({
                advanced: [{ zoom: zoom }]
            } as any).catch(e => console.error("Could not apply zoom", e));
        }
    }, [zoom, capabilities]);

    const handleSwitchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (!context) return;
            if (facingMode === 'user') {
                 context.scale(-1, 1);
                 context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            } else {
                 context.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImage(dataUrl);
        }
    };

    const handleConfirm = () => {
        if (capturedImage) {
            onCapture(capturedImage);
            handleClose();
        }
    };
    
    const handleClose = () => {
        setCapturedImage(null);
        onClose();
    }

    const handleRetake = () => {
        setCapturedImage(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-900 rounded-2xl p-6 border border-zinc-700 shadow-2xl w-full max-w-2xl text-center relative"
            >
                <h3 className="text-2xl font-semibold mb-4 text-white">Câmera</h3>
                <div className="aspect-square bg-black rounded-lg overflow-hidden relative mb-4 flex items-center justify-center">
                    {cameraError ? (
                        <div className="p-4 text-red-400">{cameraError}</div>
                    ) : (
                        <>
                            {capturedImage ? (
                                <img src={capturedImage} alt="Captured preview" className="w-full h-full object-cover" />
                            ) : (
                                <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}></video>
                            )}

                             {!capturedImage && (
                                <>
                                    {hasMultipleCameras && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <button onClick={handleSwitchCamera} className="p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm shadow-lg" aria-label="Switch Camera">
                                                <IconSwitchCamera />
                                            </button>
                                        </div>
                                    )}
                                    {/* FIX: The 'zoom' property is not in the standard MediaTrackCapabilities type. Casting to any. */}
                                    {(capabilities as any)?.zoom && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-4/5 max-w-xs">
                                            <div 
                                                className="flex items-center gap-3 bg-zinc-900/70 p-2 rounded-full backdrop-blur-md shadow-2xl border border-white/20"
                                                aria-label="Controle de Zoom"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-zinc-400 flex-shrink-0 ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                                </svg>
                                                <input
                                                    type="range"
                                                    aria-label="Nível de Zoom"
                                                    min={(capabilities as any).zoom.min}
                                                    max={(capabilities as any).zoom.max}
                                                    step={(capabilities as any).zoom.step}
                                                    value={zoom}
                                                    onChange={(e) => setZoom(Number(e.target.value))}
                                                    className="w-full h-2 bg-zinc-700/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                             )}
                        </>
                    )}
                </div>

                <div className="flex justify-center gap-4">
                    {capturedImage ? (
                        <>
                            <Button onClick={handleRetake}>Tirar Novamente</Button>
                            <Button onClick={handleConfirm} primary>Usar Foto</Button>
                        </>
                    ) : (
                        <button onClick={handleCapture} disabled={!!cameraError} className="w-20 h-20 rounded-full bg-white border-4 border-zinc-600 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"></button>
                    )}
                </div>

                <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/70 text-white hover:bg-zinc-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </motion.div>
        </div>
    );
};