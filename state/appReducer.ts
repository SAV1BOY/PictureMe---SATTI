import type { AppState, AppAction, GenerationSession, TemplateId } from '../types';
import { templates } from '../constants';

export const initialState: AppState = {
    uploadedImage: null,
    originalUploadedImage: null,
    activeFilter: 'none',
    generatedImages: [],
    promptGeneratedImages: [],
    history: [],
    status: 'idle',
    error: null,
    isCameraOpen: false,
    isDownloadingAlbum: false,
    progress: 0,
    editingImageInfo: null,
    generationAspectRatio: '1:1',
    generationStyle: 'Fotorrealista',
    cameraShotType: 'Padrão',
    cameraLensType: 'Padrão',
    promptImageCount: 1,
    customPrompt: '',
    template: null,
    currentAlbumStyle: '',
    hair: {
        colors: [],
        selectedStyles: [],
        customStyle: '',
        isCustomActive: false,
    },
    headshots: {
        expression: 'Friendly Smile',
        pose: 'Forward',
        backgroundBlur: 'Médio',
    },
    lookbook: {
        style: '',
        customStyle: '',
    },
    retroPoster: {
        title: '',
    },
    cyberpunkCity: {
        neonColor: 'Cyan',
    }
};

export function appReducer(state: AppState, action: AppAction): AppState {
    
    /**
     * Checks if the current state has generated images and, if so,
     * creates a session object and prepends it to the history array.
     * @param currentState The current application state.
     * @returns A new history array with the saved session, or the original history array if nothing was saved.
     */
    const saveCurrentSessionToHistory = (currentState: AppState): AppState['history'] => {
        const hasImagesToSave = currentState.generatedImages.length > 0 || currentState.promptGeneratedImages.length > 0;
        
        if (!hasImagesToSave) {
            return currentState.history; // Return original history if there's nothing to save
        }

        let sessionName = 'Geração de Prompt';
        let sessionTemplate: TemplateId = null;

        // Prioritize theme generation for naming, as a session can't be both theme and prompt.
        if (currentState.generatedImages.length > 0) {
            const firstImageTemplate = currentState.generatedImages[0]?.template;
            if (firstImageTemplate && templates[firstImageTemplate]) {
                sessionTemplate = firstImageTemplate;
                sessionName = templates[firstImageTemplate].name;
            } else {
                sessionName = 'Geração de Tema'; // Fallback name
            }
        }

        const newSession: GenerationSession = {
            id: `sid-${Date.now()}`,
            name: sessionName,
            timestamp: new Date().toISOString(),
            template: sessionTemplate,
            originalUploadedImage: currentState.originalUploadedImage,
            generatedImages: currentState.generatedImages,
            promptGeneratedImages: currentState.promptGeneratedImages,
        };

        return [newSession, ...currentState.history];
    };


    switch (action.type) {
        case 'UPLOAD_IMAGE_START':
            return { ...state, status: 'uploading', error: null };
        
        case 'UPLOAD_IMAGE_SUCCESS': {
            // Save any existing work before clearing it for the new image.
            const updatedHistory = saveCurrentSessionToHistory(state);
            return { 
                ...state, 
                history: updatedHistory,
                status: 'idle', 
                uploadedImage: action.payload,
                originalUploadedImage: action.payload,
                activeFilter: 'none',
                generatedImages: [], 
                promptGeneratedImages: [] 
            };
        }
            
        case 'UPLOAD_IMAGE_FAILURE':
            return { ...state, status: 'error', error: action.payload };
        case 'SET_CAMERA_OPEN':
            return { ...state, isCameraOpen: action.payload };
        case 'DISMISS_ERROR':
            return { ...state, error: null };
            
        case 'START_OVER': {
            // Save any existing work before clearing the workspace.
            const updatedHistory = saveCurrentSessionToHistory(state);
            return { 
                ...initialState,
                history: updatedHistory 
            };
        }

        case 'SELECT_TEMPLATE':
            return { 
                ...state, 
                template: action.payload,
                // Reset other template options
                hair: initialState.hair,
                headshots: initialState.headshots,
                lookbook: initialState.lookbook,
                retroPoster: initialState.retroPoster,
                cyberpunkCity: initialState.cyberpunkCity,
            };
        case 'APPLY_FILTER':
            return {
                ...state,
                activeFilter: action.payload.filter,
                uploadedImage: action.payload.image,
            };
        case 'UPDATE_GENERATION_SETTINGS':
            return { ...state, ...action.payload };
        case 'UPDATE_HAIR_OPTIONS':
            return { ...state, hair: { ...state.hair, ...action.payload } };
        case 'UPDATE_HEADSHOT_OPTIONS':
            return { ...state, headshots: { ...state.headshots, ...action.payload } };
        case 'UPDATE_LOOKBOOK_OPTIONS':
            return { ...state, lookbook: { ...state.lookbook, ...action.payload } };
        case 'UPDATE_RETRO_POSTER_OPTIONS':
            return { ...state, retroPoster: { ...state.retroPoster, ...action.payload } };
        case 'UPDATE_CYBERPUNK_CITY_OPTIONS':
            return { ...state, cyberpunkCity: { ...state.cyberpunkCity, ...action.payload } };
        
        case 'GENERATION_START': {
            const isNewGenerationFromPrompt = action.payload.source === 'prompt';
            // Save the current session before starting a new one.
            const updatedHistory = saveCurrentSessionToHistory(state);

            return {
                ...state,
                history: updatedHistory,
                status: isNewGenerationFromPrompt ? 'prompt_loading' : 'loading',
                error: null,
                progress: 0,
                // Clear the correct array for the new generation, filling it with placeholders.
                generatedImages: isNewGenerationFromPrompt ? [] : action.payload.placeholders,
                promptGeneratedImages: isNewGenerationFromPrompt ? action.payload.placeholders : [],
            };
        }

        case 'SETTING_UP_START':
            return { ...state, status: 'setting_up' };
        case 'SET_ALBUM_STYLE':
            return { ...state, currentAlbumStyle: action.payload };
        case 'GENERATION_PROGRESS': {
            const targetKey = action.payload.source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const newImages = [...state[targetKey]];
            newImages[action.payload.index] = { ...newImages[action.payload.index], ...action.payload.image };
            
            const totalImages = state[targetKey].length;
            const completedImages = newImages.filter(img => img.status !== 'pending').length;
            const progress = totalImages > 0 ? (completedImages / totalImages) * 100 : 0;

            return { ...state, [targetKey]: newImages, progress };
        }
        case 'GENERATION_COMPLETE':
            return { ...state, status: 'success', progress: 100 };
        case 'GENERATION_FAILURE':
            return { ...state, status: 'error', error: action.payload };
        case 'REGENERATE_IMAGE': {
            const { index, source } = action.payload;
            const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const images = [...state[targetKey]];
            if (images[index]) {
                images[index].status = 'pending';
            }
            return { ...state, status: source === 'theme' ? 'loading' : 'prompt_loading', [targetKey]: images, error: null };
        }
        case 'CREATE_VARIATIONS_START': {
            const { parentIndex, source } = action.payload;
            const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const images = [...state[targetKey]];
            if (images[parentIndex]) {
                images[parentIndex].isGeneratingVariations = true;
            }
            return { ...state, [targetKey]: images };
        }
        case 'CREATE_VARIATIONS_SUCCESS': {
            const { parentIndex, variations, source } = action.payload;
            const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const images = [...state[targetKey]];
            if (images[parentIndex]) {
                images[parentIndex].isGeneratingVariations = false;
                images[parentIndex].variations = [...(images[parentIndex].variations || []), ...variations];
            }
            return { ...state, [targetKey]: images };
        }
        case 'CREATE_VARIATIONS_FAILURE': {
            const { parentIndex, source, error } = action.payload;
            const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const images = [...state[targetKey]];
            if (images[parentIndex]) {
                images[parentIndex].isGeneratingVariations = false;
            }
            return { ...state, [targetKey]: images, error };
        }
        case 'DOWNLOAD_ALBUM_START':
            return { ...state, isDownloadingAlbum: true };
        case 'DOWNLOAD_ALBUM_FINISH':
            return { ...state, isDownloadingAlbum: false };
        
        case 'OPEN_EDIT_MODAL':
            return { ...state, editingImageInfo: action.payload };
        case 'CLOSE_EDIT_MODAL':
            return { ...state, editingImageInfo: null };
        case 'EDIT_IMAGE_START': {
            if (!state.editingImageInfo) return state;
            const { source, index, variationIndex } = state.editingImageInfo;
            const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const images = JSON.parse(JSON.stringify(state[targetKey]));

            if (typeof variationIndex === 'number' && images[index]?.variations?.[variationIndex]) {
                images[index].variations[variationIndex].isEditing = true;
            } else if (images[index]) {
                images[index].isEditing = true;
            }
            return { ...state, [targetKey]: images, status: 'loading' };
        }
        case 'EDIT_IMAGE_SUCCESS': {
            const { source, index, variationIndex, newImageUrl } = action.payload;
            const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const images = JSON.parse(JSON.stringify(state[targetKey]));
            
            if (typeof variationIndex === 'number' && images[index]?.variations?.[variationIndex]) {
                images[index].variations[variationIndex].isEditing = false;
                images[index].variations[variationIndex].imageUrl = newImageUrl;
            } else if (images[index]) {
                images[index].isEditing = false;
                images[index].imageUrl = newImageUrl;
            }
            return { ...state, [targetKey]: images, editingImageInfo: null, status: 'success' };
        }
        case 'EDIT_IMAGE_FAILURE': {
            const { source, index, variationIndex, error } = action.payload;
            const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
            const images = JSON.parse(JSON.stringify(state[targetKey]));
            
            if (typeof variationIndex === 'number' && images[index]?.variations?.[variationIndex]) {
                images[index].variations[variationIndex].isEditing = false;
            } else if (images[index]) {
                images[index].isEditing = false;
            }
            return { ...state, [targetKey]: images, editingImageInfo: null, status: 'error', error };
        }
        case 'LOAD_HISTORY_SESSION': {
            const sessionToLoad = state.history.find(s => s.id === action.payload);
            if (!sessionToLoad) return state;
            return {
                ...state,
                status: 'success',
                uploadedImage: sessionToLoad.originalUploadedImage,
                originalUploadedImage: sessionToLoad.originalUploadedImage,
                generatedImages: sessionToLoad.generatedImages,
                promptGeneratedImages: sessionToLoad.promptGeneratedImages,
                template: sessionToLoad.template,
                editingImageInfo: null,
                error: null,
                progress: 100,
            };
        }
        case 'CLEAR_HISTORY':
            return { ...state, history: [] };
        default:
            return state;
    }
}