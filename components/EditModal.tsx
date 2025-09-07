import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { IconSparkles } from './ui/icons';
import type { EditingImageInfo } from '../types';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (prompt: string, maskDataUrl: string) => Promise<void>;
    imageInfo: EditingImageInfo;
}

const suggestionCategories = [
    {
        title: "Adicionar e Remover",
        suggestions: [
            { text: "Óculos de sol", prompt: "Adicione um par de óculos de sol estilosos" },
            { text: "Chapéu", prompt: "Coloque um chapéu elegante na cabeça da pessoa" },
            { text: "Animal de estimação", prompt: "Adicione um gato fofo ao lado da pessoa" },
            { text: "Remover objeto", prompt: "Remova o [descreva o objeto] da cena" },
        ]
    },
    {
        title: "Mudar Fundo",
        suggestions: [
            { text: "Praia", prompt: "Mude o fundo para uma praia ensolarada" },
            { text: "Cidade Cyberpunk", prompt: "Transforme o fundo em uma rua de cidade cyberpunk com neon" },
            { text: "Floresta", prompt: "Mude o fundo para uma floresta enevoada ao amanhecer" },
        ]
    },
    {
        title: "Mudar Estilo e Efeitos",
        suggestions: [
            { text: "Pintura a Óleo", prompt: "Transforme a foto inteira em uma pintura a óleo" },
            { text: "Desenho animado", prompt: "Recrie a imagem no estilo de um desenho animado" },
            { text: "Iluminação Dramática", prompt: "Altere a iluminação para ser mais dramática" },
            { text: "Fazer nevar", prompt: "Faça nevar na cena" },
        ]
    },
    {
        title: "Retocar Roupa",
        suggestions: [
            { text: "Mudar cor", prompt: "Mude a cor da camisa para [cor]" },
            { text: "Mudar roupa", prompt: "Mude a roupa para um terno formal" },
        ]
    }
];

const PromptSuggestions: React.FC<{ onSelect: (suggestion: string) => void }> = ({ onSelect }) => (
    <div className="text-left bg-zinc-800/50 p-4 rounded-lg mt-4 space-y-4">
        <h4 className="text-md font-semibold text-purple-400">Sugestões de Prompt</h4>
        {suggestionCategories.map(category => (
            <div key={category.title}>
                <h5 className="text-sm font-semibold text-zinc-400 mb-2">{category.title}</h5>
                <div className="flex flex-wrap gap-2">
                    {category.suggestions.map(suggestion => (
                        <button 
                            key={suggestion.text}
                            onClick={() => onSelect(suggestion.prompt)}
                            className="px-3 py-1.5 text-xs rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold transition-colors"
                            title={suggestion.prompt}
                        >
                            {suggestion.text}
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>
);


export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onEdit, imageInfo }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const [brushOpacity, setBrushOpacity] = useState(0.5);
    const [prompt, setPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const getCanvasContext = () => canvasRef.current?.getContext('2d');

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (canvas && image && image.naturalWidth > 0) {
            canvas.width = image.clientWidth;
            canvas.height = image.clientHeight;
            const ctx = getCanvasContext();
            if (ctx) {
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    const getCoords = (event: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        if ('touches' in event.nativeEvent) {
            return {
                x: event.nativeEvent.touches[0].clientX - rect.left,
                y: event.nativeEvent.touches[0].clientY - rect.top,
            };
        }
        return {
            x: event.nativeEvent.offsetX,
            y: event.nativeEvent.offsetY,
        };
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        const coords = getCoords(event);
        if (coords) {
            const ctx = getCanvasContext();
            if (!ctx) return;
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
        }
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        event.preventDefault(); // Prevent page scroll on touch devices
        const coords = getCoords(event);
        if (coords) {
            const ctx = getCanvasContext();
            if (!ctx) return;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = `rgba(255, 255, 255, ${brushOpacity})`;
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        const ctx = getCanvasContext();
        if (!ctx) return;
        ctx.closePath();
        setIsDrawing(false);
    };

    const handleSubmit = async () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image || image.naturalWidth === 0) return;

        // Create a new canvas to generate the final black and white mask.
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = image.naturalWidth;
        maskCanvas.height = image.naturalHeight;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        // 1. Fill the entire mask canvas with a black background.
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        
        // 2. Draw the user's strokes from the display canvas onto the mask canvas,
        // scaling the drawing to match the original image's dimensions.
        maskCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, maskCanvas.width, maskCanvas.height);
        
        // 3. Process the mask to be pure black and white. The user's strokes are
        // semi-transparent, so we convert any non-black pixel to solid white.
        const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // If the pixel is not fully transparent (i.e., it was drawn on), make it solid white.
            if (data[i + 3] > 0) {
                data[i] = 255;     // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 255; // A (fully opaque)
            }
        }
        maskCtx.putImageData(imageData, 0, 0);

        const maskDataUrl = maskCanvas.toDataURL('image/png');
        
        setIsEditing(true);
        await onEdit(prompt, maskDataUrl);
        // The parent component's state change will handle closing the modal.
    };

    const handleClose = () => {
        if (!isEditing) {
            onClose();
        }
    };

    const handleSuggestionSelect = (suggestion: string) => {
        setPrompt(prev => prev ? `${prev}. ${suggestion}` : suggestion);
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-900 rounded-2xl p-6 border border-zinc-700 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-white">Editar Imagem</h3>
                    <button onClick={handleClose} className="p-2 rounded-full bg-zinc-800/70 text-white hover:bg-zinc-700 transition-colors disabled:opacity-50" disabled={isEditing}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
                    {/* Image & Canvas */}
                    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-black rounded-lg overflow-hidden">
                         <img 
                            ref={imageRef} 
                            src={imageInfo.imageUrl} 
                            alt={`Editando: ${imageInfo.id}`} 
                            className="max-w-full max-h-full object-contain"
                            onLoad={resizeCanvas}
                         />
                         <canvas
                            ref={canvasRef}
                            className="absolute top-0 left-0 cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                         />
                    </div>
                    
                    {/* Controls */}
                    <div className="flex flex-col space-y-4 overflow-y-auto pr-2">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">1. Pinte sobre a área que deseja alterar.</label>
                            <div className="flex flex-col gap-3 bg-zinc-800/50 p-3 rounded-lg">
                                {/* Brush Size */}
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-zinc-500 w-16 text-right">Tamanho</span>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        value={brushSize}
                                        onChange={(e) => setBrushSize(Number(e.target.value))}
                                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-black font-bold text-xs" style={{ width: `${brushSize/2}px`, height: `${brushSize/2}px`, minWidth: '16px', minHeight: '16px' }}></div>
                                </div>
                                 {/* Opacity */}
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-zinc-500 w-16 text-right">Opacidade</span>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={brushOpacity}
                                        onChange={(e) => setBrushOpacity(Number(e.target.value))}
                                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                    <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-white" style={{ opacity: brushOpacity }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                             <label htmlFor="edit-prompt" className="block text-sm font-medium text-zinc-400 mb-2">2. Descreva sua edição.</label>
                             <textarea
                                id="edit-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="ex: Adicione um chapéu de pirata"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white min-h-[100px] resize-y"
                                disabled={isEditing}
                             />
                        </div>
                        
                        <Button
                            onClick={handleSubmit}
                            disabled={!prompt.trim() || isEditing}
                            primary
                            className="w-full text-lg py-3"
                        >
                             <div className="flex items-center justify-center gap-3">
                                {isEditing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>Gerando...</span>
                                    </>
                                ) : (
                                    <>
                                        <IconSparkles />
                                        Gerar Edição
                                    </>
                                )}
                            </div>
                        </Button>
                        <PromptSuggestions onSelect={handleSuggestionSelect} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};