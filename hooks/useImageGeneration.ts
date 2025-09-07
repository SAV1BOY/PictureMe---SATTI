// FIX: Import React to use the React.RefObject type.
import React, { useCallback } from 'react';
import type { Dispatch } from 'react';
import type { AppState, AppAction, PromptOption, TemplateId, BackgroundBlur, CameraShotType, CameraLensType } from '../types';
import { generateImage, generateAlbumStyle, editImage } from '../services/geminiService';
import { createSingleFramedImage, cropImage } from '../services/imageUtils';
import { templates } from '../constants';

const getCameraInstruction = (cameraShotType: CameraShotType, cameraLensType: CameraLensType): string => {
    let instruction = '';
    if (cameraShotType && cameraShotType !== 'Padrão') {
        const shotTypeMap: { [key in CameraShotType]?: string } = {
            'Close-up Extremo': 'an extreme close-up shot',
            'Close-up': 'a close-up shot',
            'Plano Médio': 'a medium shot',
            'Plano Americano': 'a medium long shot (cowboy shot)',
            'Corpo Inteiro': 'a full body shot',
            'Plano Geral': 'a wide shot'
        };
        if(shotTypeMap[cameraShotType]) {
            instruction += ` The image should be framed as ${shotTypeMap[cameraShotType]}.`;
        }
    }
    if (cameraLensType && cameraLensType !== 'Padrão') {
        const lensTypeMap: { [key in CameraLensType]?: string } = {
            'Grande Angular (24mm)': 'a wide-angle lens (24mm)',
            'Padrão (50mm)': 'a standard lens (50mm)',
            'Retrato (85mm)': 'a portrait lens (85mm)',
            'Teleobjetiva (200mm)': 'a telephoto lens (200mm)'
        };
        if(lensTypeMap[cameraLensType]) {
            instruction += ` The photo should have the characteristics of being taken with ${lensTypeMap[cameraLensType]}.`;
        }
    }
    return instruction;
};

const getModelInstruction = (template: TemplateId, prompt: PromptOption, options: AppState): string => {
    const { headshots, currentAlbumStyle, lookbook, hair, generationStyle, generationAspectRatio, retroPoster, cyberpunkCity, cameraShotType, cameraLensType } = options;
    const styleInstruction = `The final image should be in a ${generationStyle} style with a composition suitable for a ${generationAspectRatio} aspect ratio.`;
    const cameraInstruction = getCameraInstruction(cameraShotType, cameraLensType);

    switch (template) {
        case 'decades':
            return `The highest priority is to maintain the exact facial features, likeness, perceived gender, framing, and composition of the person in the provided reference photo. Keeping the original photo's composition, change the person's hair, clothing, and accessories, as well as the photo's background, to match the style of the ${prompt.id}. ${prompt.base} Do not alter the person's core facial structure. ${styleInstruction}${cameraInstruction}`;
        case 'impossibleSelfies':
            return `The highest priority is to maintain the exact facial features, likeness, and perceived gender of the person in the provided reference photo. Keeping the original photo's composition as much as possible, place the person into the following scene, changing their clothing, hair, and the background to match: ${prompt.base}. Do not alter the person's core facial structure. ${styleInstruction}${cameraInstruction}`;
        case 'hairStyler': {
            let instruction = `The highest priority is to maintain the exact facial features, likeness, and perceived gender of the person in the provided reference photo. Keeping the original photo's composition, style the person's hair to be a perfect example of ${prompt.base}. If the person's hair already has this style, enhance and perfect it. Do not alter the person's core facial structure, clothing, or the background. ${styleInstruction}`;
            if (['Short', 'Medium', 'Long'].includes(prompt.id)) {
                instruction += " Maintain the person's original hair texture (e.g., straight, wavy, curly).";
            }
            if (hair.colors && hair.colors.length > 0) {
                if (hair.colors.length === 1) {
                    instruction += ` The hair color should be ${hair.colors[0]}.`;
                } else if (hair.colors.length === 2) {
                    instruction += ` The hair should be a mix of two colors: ${hair.colors[0]} and ${hair.colors[1]}.`;
                }
            }
            return instruction + cameraInstruction;
        }
        case 'headshots': {
            const poseInstruction = headshots.pose === 'Forward' ? 'facing forward towards the camera' : 'posed at a slight angle to the camera';
            
            const getBlurInstruction = (blurLevel: BackgroundBlur) => {
                switch(blurLevel) {
                    case 'Nenhum': return "The background should be a clean, neutral studio background that is completely in sharp focus.";
                    case 'Baixo': return "The background should be a clean, neutral studio background with a very subtle, slight blur (low depth of field).";
                    case 'Médio': return "The background should be a clean, neutral, out-of-focus studio background (like light gray, beige, or white) with a moderate, natural-looking blur (medium depth of field).";
                    case 'Alto': return "The background should be a clean, neutral studio background that is heavily blurred into abstract shapes and colors (high depth of field).";
                    default: return "The background should be a clean, neutral, out-of-focus studio background (like light gray, beige, or white).";
                }
            }
            const backgroundInstruction = getBlurInstruction(headshots.backgroundBlur);

            return `The highest priority is to maintain the exact facial features, likeness, and perceived gender of the person in the provided reference photo. Transform the image into a professional headshot. The person should be ${poseInstruction} with a "${headshots.expression}" expression. They should be ${prompt.base}. Please maintain the original hairstyle from the photo. ${backgroundInstruction} Do not alter the person's core facial structure. The final image should be a well-lit, high-quality professional portrait. ${styleInstruction}${cameraInstruction}`;
        }
        case 'eightiesMall':
            return `The highest priority is to maintain the exact facial features, likeness, and perceived gender of the person in the provided reference photo. Transform the image into a photo from a single 1980s mall photoshoot. The overall style for the entire photoshoot is: "${currentAlbumStyle}". For this specific photo, the person should be in ${prompt.base}. The person's hair and clothing should be 80s style and be consistent across all photos in this set. The background and lighting must also match the overall style for every photo. ${styleInstruction}${cameraInstruction}`;
        case 'styleLookbook': {
            const finalStyle = lookbook.style === 'Other' ? lookbook.customStyle : lookbook.style;
            return `The highest priority is to maintain the exact facial features, likeness, and perceived gender of the person in the provided reference photo. Transform the image into a high-fashion lookbook photo. The overall fashion style for the entire lookbook is "${finalStyle}". For this specific photo, create a unique, stylish outfit that fits the overall style, and place the person in ${prompt.base} in a suitable, fashionable setting. The person's hair and makeup should also complement the style. Each photo in the lookbook should feature a different outfit. Do not alter the person's core facial structure. ${styleInstruction}${cameraInstruction}`;
        }
        case 'figurines':
            return `The highest priority is to maintain the exact facial features and likeness of the person in the provided reference photo. Transform the person into a miniature figurine based on the following description, placing it in a realistic environment: ${prompt.base}. The final image should look like a real photograph of a physical object. Do not alter the person's core facial structure. ${styleInstruction}${cameraInstruction}`;
        case 'retroPoster': {
            let instruction = `The highest priority is to maintain the exact facial features and likeness of the person in the provided reference photo. ${prompt.base}`;
            if (retroPoster.title.trim()) {
                instruction += ` O pôster deve apresentar de forma proeminente e artística o texto do título "${retroPoster.title.trim()}".`;
            }
            return `${instruction} Do not alter the person's core facial structure. ${styleInstruction}${cameraInstruction}`;
        }
        case 'cyberpunkCity': {
            let instruction = `The highest priority is to maintain the exact facial features and likeness of the person in the provided reference photo. ${prompt.base}`;
            if (cyberpunkCity.neonColor) {
                instruction += ` A cena deve ser dominada por luzes de neon brilhantes de cor ${cyberpunkCity.neonColor}.`;
            }
            return `${instruction} Do not alter the person's core facial structure. ${styleInstruction}${cameraInstruction}`;
        }
        case 'oilPainting':
        case 'watercolor':
        case 'steampunk':
        case 'pixelArt':
             return `The highest priority is to maintain the exact facial features, likeness, and perceived gender of the person in the provided reference photo. Keeping the original photo's composition, ${prompt.base} Do not alter the person's core facial structure. ${styleInstruction}${cameraInstruction}`;
        default:
            return `Create an image based on the reference photo and this prompt: ${prompt.base}. ${styleInstruction}${cameraInstruction}`;
    }
};

export const useImageGeneration = (state: AppState, dispatch: Dispatch<AppAction>) => {

    const performGeneration = useCallback(async <T,>(
        prompts: T[],
        source: 'theme' | 'prompt',
        instructionBuilder: (prompt: T, index: number) => string,
        scrollRef: React.RefObject<HTMLElement>
    ) => {
        const placeholders = prompts.map((p, i) => ({
            id: (typeof p === 'string' ? p : (p as PromptOption).id) || `Image ${i + 1}`,
            status: 'pending' as const,
            imageUrl: null,
            modelInstruction: '',
            source,
            variations: [],
        }));

        dispatch({ type: 'GENERATION_START', payload: { placeholders, source } });
        
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];
            const modelInstruction = instructionBuilder(prompt, i);
            try {
                const imageUrl = await generateImage(modelInstruction, state.uploadedImage);
                dispatch({
                    type: 'GENERATION_PROGRESS',
                    payload: {
                        index: i,
                        source,
                        image: { id: (prompt as any).id || state.customPrompt, status: 'success', imageUrl, modelInstruction, source, template: state.template }
                    }
                });
            } catch (err: any) {
                console.error(`Failed to generate image for prompt ${i}:`, err);
                dispatch({
                    type: 'GENERATION_PROGRESS',
                    payload: {
                        index: i,
                        source,
                        image: { id: (prompt as any).id || state.customPrompt, status: 'failed', imageUrl: null, modelInstruction, source, template: state.template }
                    }
                });
            }
        }
        dispatch({ type: 'GENERATION_COMPLETE' });

    }, [dispatch, state.uploadedImage, state.customPrompt, state.template]);

    const handleGenerateFromTemplate = useCallback(async (scrollRef: React.RefObject<HTMLElement>) => {
        if (!state.uploadedImage || !state.template) {
            dispatch({ type: 'GENERATION_FAILURE', payload: "Por favor, carregue uma foto e selecione um tema." });
            return;
        }

        const activeTemplate = templates[state.template];
        let promptsForGeneration = activeTemplate.prompts;

        if (state.template === 'hairStyler') {
            const selected = activeTemplate.prompts.filter(p => state.hair.selectedStyles.includes(p.id));
            if (state.hair.isCustomActive && state.hair.customStyle.trim()) {
                selected.push({ id: state.hair.customStyle, base: state.hair.customStyle });
            }
            if (selected.length === 0) {
                dispatch({ type: 'GENERATION_FAILURE', payload: "Por favor, selecione pelo menos um penteado." });
                return;
            }
            promptsForGeneration = selected;
        }

        if (state.template === 'eightiesMall') {
            dispatch({ type: 'SETTING_UP_START' });
            try {
                const style = await generateAlbumStyle("A specific, creative, and detailed style for an 80s mall portrait studio photoshoot.");
                dispatch({ type: 'SET_ALBUM_STYLE', payload: style });
                // We pass the new style directly to performGeneration
                const updatedState = { ...state, currentAlbumStyle: style };
                await performGeneration(
                    promptsForGeneration, 
                    'theme',
                    (p) => getModelInstruction(state.template, p as PromptOption, updatedState), 
                    scrollRef
                );
                return; // Exit to avoid double generation
            } catch (e) {
                dispatch({ type: 'GENERATION_FAILURE', payload: "Não conseguimos gerar um estilo. Tente novamente." });
                return;
            }
        }

        await performGeneration(
            promptsForGeneration, 
            'theme',
            (p) => getModelInstruction(state.template, p as PromptOption, state), 
            scrollRef
        );
    }, [state, dispatch, performGeneration]);

    const handleGenerateFromPrompt = useCallback(async (scrollRef: React.RefObject<HTMLElement>) => {
         if (!state.customPrompt.trim()) {
            dispatch({ type: 'GENERATION_FAILURE', payload: "Por favor, insira um prompt." });
            return;
        }
        const prompts = Array(state.promptImageCount).fill(state.customPrompt);
        
        await performGeneration(prompts, 'prompt', (p, i) => {
             const variedPrompt = state.promptImageCount > 1 ? `${p} (variation ${i + 1})` : p;
             const cameraInstruction = getCameraInstruction(state.cameraShotType, state.cameraLensType);
             if(state.uploadedImage) {
                 return `The highest priority is to maintain the exact facial features and likeness of the person in the provided reference photo. Keeping the original photo's composition, transform the image based on the following creative prompt: "${variedPrompt}". The final image should be in a ${state.generationStyle} style with a composition suitable for a ${state.generationAspectRatio} aspect ratio.${cameraInstruction}`;
             }
             return `A high-quality, ${state.generationStyle} style image with an aspect ratio of ${state.generationAspectRatio}, depicting: ${variedPrompt}.${cameraInstruction}`;
        }, scrollRef);
    }, [state.customPrompt, state.promptImageCount, state.uploadedImage, state.generationStyle, state.generationAspectRatio, state.cameraShotType, state.cameraLensType, dispatch, performGeneration]);

    const handleRegenerateImage = useCallback(async (index: number, source: 'theme' | 'prompt') => {
        dispatch({ type: 'REGENERATE_IMAGE', payload: { index, source } });

        const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
        const imageToRegen = state[targetKey][index];
        if (!imageToRegen || !imageToRegen.modelInstruction) {
             dispatch({ type: 'GENERATION_FAILURE', payload: "Não foi possível encontrar a instrução original para recriar." });
             return;
        }
        
        try {
            const imageUrl = await generateImage(imageToRegen.modelInstruction, state.uploadedImage);
            dispatch({
                type: 'GENERATION_PROGRESS',
                payload: {
                    index, source,
                    image: { ...imageToRegen, status: 'success', imageUrl }
                }
            });
        } catch (err: any) {
            console.error(`Regeneration failed for image ${index}:`, err);
            dispatch({ type: 'GENERATION_FAILURE', payload: `A recriação para "${imageToRegen.id}" falhou.` });
             dispatch({
                type: 'GENERATION_PROGRESS',
                payload: {
                    index, source,
                    image: { ...imageToRegen, status: 'failed', imageUrl: null }
                }
            });
        }
    }, [dispatch, state.generatedImages, state.promptGeneratedImages, state.uploadedImage]);

    const handleCreateVariations = useCallback(async (parentIndex: number, source: 'theme' | 'prompt', baseImageUrl?: string) => {
        const NUMBER_OF_VARIATIONS = 2;
        dispatch({ type: 'CREATE_VARIATIONS_START', payload: { parentIndex, source } });

        const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
        const parentImage = state[targetKey][parentIndex];

        if (!parentImage || !parentImage.modelInstruction) {
            dispatch({ type: 'CREATE_VARIATIONS_FAILURE', payload: { parentIndex, source, error: "Informação original não encontrada." } });
            return;
        }
        
        const imageToUse = baseImageUrl || state.uploadedImage;

        const variationPromises = Array(NUMBER_OF_VARIATIONS).fill(null).map(() => 
            generateImage(parentImage.modelInstruction, imageToUse)
        );

        const results = await Promise.allSettled(variationPromises);
        
        const newVariations = results.map((result, i) => {
            if (result.status === 'fulfilled') {
                return {
                    status: 'success' as const, imageUrl: result.value, id: `Variação ${i + 1}`,
                    modelInstruction: parentImage.modelInstruction, source: parentImage.source
                };
            }
            return {
                status: 'failed' as const, imageUrl: null, id: `Variação ${i + 1}`,
                modelInstruction: parentImage.modelInstruction, source: parentImage.source
            };
        });

        dispatch({ type: 'CREATE_VARIATIONS_SUCCESS', payload: { parentIndex, source, variations: newVariations }});

    }, [dispatch, state.uploadedImage, state.generatedImages, state.promptGeneratedImages]);

    const handleEditImage = useCallback(async (editPrompt: string, maskDataUrl: string) => {
        if (!state.editingImageInfo) {
            dispatch({ type: 'GENERATION_FAILURE', payload: 'Nenhuma imagem selecionada para edição.' });
            return;
        }
        
        const { imageUrl, source, index, variationIndex } = state.editingImageInfo;

        dispatch({ type: 'EDIT_IMAGE_START' });

        try {
            const newImageUrl = await editImage(editPrompt, imageUrl, maskDataUrl);
            dispatch({ type: 'EDIT_IMAGE_SUCCESS', payload: { source, index, variationIndex, newImageUrl } });
        } catch (err: any) {
            console.error('Image edit failed:', err);
            dispatch({ type: 'EDIT_IMAGE_FAILURE', payload: { source, index, variationIndex, error: err.message || 'Falha ao editar a imagem.' }});
        }
    }, [dispatch, state.editingImageInfo]);
    
    const handleUseImageAsBase = useCallback((imageUrl: string) => {
        dispatch({ type: 'UPLOAD_IMAGE_SUCCESS', payload: imageUrl });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [dispatch]);
    
    const triggerDownload = async (href: string, fileName: string) => {
        try {
            const response = await fetch(href);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error("Could not download the image:", error);
            dispatch({ type: 'GENERATION_FAILURE', payload: "Desculpe, o download falhou." });
        }
    };

    const handleDownloadImage = useCallback(async (imageUrl: string, label: string, ratio: string, template: TemplateId) => {
        const fileName = `picture-me-${label.toLowerCase().replace(/\s+/g, '-')}-${ratio.replace(':', 'x')}.png`;
        try {
            const shouldAddLabel = !['headshots', 'eightiesMall', 'styleLookbook', 'figurines'].includes(template || '');
            const framedImageUrl = await createSingleFramedImage(imageUrl, ratio, shouldAddLabel ? label : null);
            await triggerDownload(framedImageUrl, fileName);
        } catch (err) {
            dispatch({ type: 'GENERATION_FAILURE', payload: "Não foi possível preparar essa imagem para download." });
        }
    }, [dispatch]);

    const handleDownloadAlbum = useCallback(async (ratio: string) => {
        dispatch({ type: 'DOWNLOAD_ALBUM_START' });
        
        try {
            const successfulImages = state.generatedImages.filter(img => img.status === 'success');
            if(successfulImages.length === 0) throw new Error("Não há imagens para criar um álbum.");

            let albumTitle = "Meu Álbum PictureMe";
             if(state.template) albumTitle = `PictureMe: ${templates[state.template].name}`;
            
            const shouldAddLabel = !['headshots', 'eightiesMall', 'styleLookbook', 'figurines'].includes(state.template || '');

            const croppedImageUrls = await Promise.all(successfulImages.map(img => cropImage(img.imageUrl!, ratio)));
            const imagesToStitch = await Promise.all(croppedImageUrls.map((url, index) => new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = url;
                img.onload = () => resolve(img);
                img.onerror = reject;
            })));

            const stitchCanvas = document.createElement('canvas');
            const stitchCtx = stitchCanvas.getContext('2d')!;
            const cols = imagesToStitch.length > 4 ? 3 : 2;
            const rows = Math.ceil(imagesToStitch.length / cols);
            const imageWidth = imagesToStitch[0].width;
            const imageHeight = imagesToStitch[0].height;
            const padding = Math.floor(imageWidth * 0.05);

            stitchCanvas.width = (cols * imageWidth) + ((cols + 1) * padding);
            stitchCanvas.height = (rows * imageHeight) + ((rows + 1) * padding);
            stitchCtx.fillStyle = '#FFFFFF';
            stitchCtx.fillRect(0, 0, stitchCanvas.width, stitchCanvas.height);

            for (let i=0; i < imagesToStitch.length; i++) {
                const img = imagesToStitch[i];
                const row = Math.floor(i / cols);
                const col = i % cols;
                stitchCtx.drawImage(img, padding + col * (imageWidth + padding), padding + row * (imageHeight + padding), imageWidth, imageHeight);
                 if (shouldAddLabel) {
                    const labelFontSize = Math.max(24, Math.floor(imageWidth * 0.08));
                    stitchCtx.font = `700 ${labelFontSize}px Caveat, cursive`;
                    stitchCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
                    stitchCtx.textAlign = 'center';
                    stitchCtx.textBaseline = 'bottom';
                    stitchCtx.fillText(successfulImages[i].id, padding + col * (imageWidth + padding) + imageWidth / 2, padding + row * (imageHeight + padding) + imageHeight - 10);
                }
            }

            const finalCanvas = document.createElement('canvas');
            const finalCtx = finalCanvas.getContext('2d')!;
            const outerPadding = stitchCanvas.width * 0.05;
            const titleFontSize = Math.max(48, Math.floor(stitchCanvas.width * 0.07));
            const footerFontSize = Math.max(24, Math.floor(stitchCanvas.width * 0.025));
            const titleSpacing = titleFontSize * 1.5;
            const footerSpacing = footerFontSize * 4.0;

            finalCanvas.width = stitchCanvas.width + outerPadding * 2;
            finalCanvas.height = stitchCanvas.height + outerPadding * 2 + titleSpacing + footerSpacing;

            finalCtx.fillStyle = '#111827';
            finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
            finalCtx.font = `700 ${titleFontSize}px Caveat, cursive`;
            finalCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
            finalCtx.textAlign = 'center';
            finalCtx.textBaseline = 'middle';
            finalCtx.fillText(albumTitle, finalCanvas.width / 2, outerPadding + titleSpacing / 2);
            finalCtx.drawImage(stitchCanvas, outerPadding, outerPadding + titleSpacing);
            finalCtx.font = `600 ${footerFontSize}px Inter, sans-serif`;
            finalCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
            finalCtx.fillText("Made with Gemini", finalCanvas.width / 2, finalCanvas.height - footerSpacing * 0.66);
            const nanoFooterFontSize = Math.max(18, Math.floor(stitchCanvas.width * 0.022));
            finalCtx.font = `600 ${nanoFooterFontSize}px Inter, sans-serif`;
            finalCtx.fillText("Edit your images with Nano Banana at gemini.google", finalCanvas.width / 2, finalCanvas.height - footerSpacing * 0.33);

            await triggerDownload(finalCanvas.toDataURL('image/png'), `picture-me-album-${ratio.replace(':', 'x')}.png`);

        } catch (err: any) {
            dispatch({ type: 'GENERATION_FAILURE', payload: err.message || "O download do álbum falhou." });
        } finally {
            dispatch({ type: 'DOWNLOAD_ALBUM_FINISH' });
        }
    }, [dispatch, state.generatedImages, state.template]);

    const handleStartOver = useCallback(() => {
        dispatch({ type: 'START_OVER' });
         window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [dispatch]);
    
    return {
        handleGenerateFromTemplate,
        handleGenerateFromPrompt,
        handleRegenerateImage,
        handleCreateVariations,
        handleUseImageAsBase,
        handleDownloadImage,
        handleDownloadAlbum,
        handleStartOver,
        handleEditImage,
    };
};