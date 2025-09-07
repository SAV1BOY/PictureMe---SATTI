export type ImageStatus = 'pending' | 'success' | 'failed';
export type AppStatus = 'idle' | 'uploading' | 'setting_up' | 'loading' | 'prompt_loading' | 'success' | 'error';
export type AspectRatio = '1:1' | '9:16' | '16:9';
export type GenerationStyle = 'Fotorrealista' | 'Arte Fantasia' | 'Anime' | 'Ghibli' | 'Desenho Animado' | 'Pintura a Óleo' | 'Aquarela' | 'Arte Steampunk' | 'Arte Cyberpunk' | 'Pixel Art' | 'Pôster Retrô' | 'Cinematic' | 'Fotografia de Produto' | 'Arte Abstrata' | 'Ilustração Vetorial' | 'Neo-Noir' | 'Dystopian' | 'Surrealismo' | 'Minimalista' | 'Abstrato Geométrico' | 'Arte Conceitual' | 'Estilo HQ de mangá' | 'Arte de Pintura Digital' | 'Fotografia de Rua';
export type TemplateId = 
    'decades' | 'styleLookbook' | 'eightiesMall' | 'figurines' | 'hairStyler' | 
    'impossibleSelfies' | 'headshots' |
    'retroPoster' | 'cyberpunkCity' | 'oilPainting' | 'watercolor' | 'steampunk' | 'pixelArt' |
    null;
export type FilterType = 'none' | 'vintage' | 'bw' | 'sepia' | 'cool' | 'warm';
export type BackgroundBlur = 'Nenhum' | 'Baixo' | 'Médio' | 'Alto';
export type CameraShotType = 'Padrão' | 'Close-up Extremo' | 'Close-up' | 'Plano Médio' | 'Plano Americano' | 'Corpo Inteiro' | 'Plano Geral';
export type CameraLensType = 'Padrão' | 'Grande Angular (24mm)' | 'Padrão (50mm)' | 'Retrato (85mm)' | 'Teleobjetiva (200mm)';

export interface GeneratedImage {
    id: string;
    status: ImageStatus;
    imageUrl: string | null;
    modelInstruction: string;
    source: 'theme' | 'prompt';
    template?: TemplateId;
    isGeneratingVariations?: boolean;
    isEditing?: boolean;
    variations: Omit<GeneratedImage, 'variations' | 'isGeneratingVariations'>[];
}

export interface EditingImageInfo {
    imageUrl: string;
    id: string;
    source: 'theme' | 'prompt';
    index: number;
    variationIndex?: number;
}

export interface GenerationSession {
    id: string;
    name: string;
    timestamp: string;
    template: TemplateId;
    originalUploadedImage: string | null;
    generatedImages: GeneratedImage[];
    promptGeneratedImages: GeneratedImage[];
}

export interface AppState {
    uploadedImage: string | null;
    originalUploadedImage: string | null;
    activeFilter: FilterType;
    generatedImages: GeneratedImage[];
    promptGeneratedImages: GeneratedImage[];
    history: GenerationSession[];
    status: AppStatus;
    error: string | null;
    isCameraOpen: boolean;
    isDownloadingAlbum: boolean;
    progress: number;
    editingImageInfo: EditingImageInfo | null;
    
    // Generation Settings
    generationAspectRatio: AspectRatio;
    generationStyle: GenerationStyle;
    cameraShotType: CameraShotType;
    cameraLensType: CameraLensType;
    promptImageCount: number;
    customPrompt: string;
    
    // Template
    template: TemplateId;
    currentAlbumStyle: string;
    
    // Template-specific options
    hair: {
        colors: string[];
        selectedStyles: string[];
        customStyle: string;
        isCustomActive: boolean;
    },
    headshots: {
        expression: string;
        pose: string;
        backgroundBlur: BackgroundBlur;
    },
    lookbook: {
        style: string;
        customStyle: string;
    },
    retroPoster: {
        title: string;
    },
    cyberpunkCity: {
        neonColor: string;
    }
}

export type AppAction =
    | { type: 'UPLOAD_IMAGE_START' }
    | { type: 'UPLOAD_IMAGE_SUCCESS'; payload: string }
    | { type: 'UPLOAD_IMAGE_FAILURE'; payload: string }
    | { type: 'SET_CAMERA_OPEN'; payload: boolean }
    | { type: 'DISMISS_ERROR' }
    | { type: 'START_OVER' }
    | { type: 'SELECT_TEMPLATE'; payload: TemplateId }
    | { type: 'APPLY_FILTER'; payload: { filter: FilterType; image: string } }
    | { type: 'UPDATE_GENERATION_SETTINGS'; payload: Partial<{ generationAspectRatio: AspectRatio; generationStyle: GenerationStyle; cameraShotType: CameraShotType; cameraLensType: CameraLensType; promptImageCount: number; customPrompt: string; }> }
    | { type: 'UPDATE_HAIR_OPTIONS'; payload: Partial<AppState['hair']> }
    | { type: 'UPDATE_HEADSHOT_OPTIONS'; payload: Partial<AppState['headshots']> }
    | { type: 'UPDATE_LOOKBOOK_OPTIONS'; payload: Partial<AppState['lookbook']> }
    | { type: 'UPDATE_RETRO_POSTER_OPTIONS'; payload: Partial<AppState['retroPoster']> }
    | { type: 'UPDATE_CYBERPUNK_CITY_OPTIONS'; payload: Partial<AppState['cyberpunkCity']> }
    | { type: 'GENERATION_START'; payload: { placeholders: GeneratedImage[], source: 'theme' | 'prompt' } }
    | { type: 'SETTING_UP_START' }
    | { type: 'SET_ALBUM_STYLE'; payload: string }
    | { type: 'GENERATION_PROGRESS'; payload: { index: number; image: Omit<GeneratedImage, 'variations'>, source: 'theme' | 'prompt' } }
    | { type: 'GENERATION_COMPLETE' }
    | { type: 'GENERATION_FAILURE'; payload: string }
    | { type: 'REGENERATE_IMAGE'; payload: { index: number; source: 'theme' | 'prompt' } }
    | { type: 'CREATE_VARIATIONS_START'; payload: { parentIndex: number; source: 'theme' | 'prompt' } }
    | { type: 'CREATE_VARIATIONS_SUCCESS'; payload: { parentIndex: number; variations: GeneratedImage['variations']; source: 'theme' | 'prompt' } }
    | { type: 'CREATE_VARIATIONS_FAILURE'; payload: { parentIndex: number; source: 'theme' | 'prompt', error: string } }
    | { type: 'DOWNLOAD_ALBUM_START' }
    | { type: 'DOWNLOAD_ALBUM_FINISH' }
    | { type: 'OPEN_EDIT_MODAL'; payload: EditingImageInfo }
    | { type: 'CLOSE_EDIT_MODAL' }
    | { type: 'EDIT_IMAGE_START' }
    | { type: 'EDIT_IMAGE_SUCCESS'; payload: { source: 'theme' | 'prompt'; index: number; variationIndex?: number; newImageUrl: string } }
    | { type: 'EDIT_IMAGE_FAILURE'; payload: { source: 'theme' | 'prompt'; index: number; variationIndex?: number; error: string } }
    | { type: 'LOAD_HISTORY_SESSION'; payload: string }
    | { type: 'CLEAR_HISTORY' };

export interface PromptOption {
    id: string;
    base: string;
}

export interface Template {
    name: string;
    description: string;
    icon: string;
    isPolaroid: boolean;
    prompts: PromptOption[];
    styles?: string[];
}

export interface TemplateCollection {
    [key: string]: Template;
}