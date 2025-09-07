import React, { useReducer, useRef, useState, useEffect } from 'react';

import { appReducer, initialState } from './state/appReducer';
import { useImageGeneration } from './hooks/useImageGeneration';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GenerationSettings } from './components/GenerationSettings';
import { TemplateSelector } from './components/TemplateSelector';
import { TemplateOptions } from './components/TemplateOptions';
import { PromptGenerator } from './components/PromptGenerator';
import { ResultsContainer } from './components/ResultsContainer';
import { Button } from './components/ui/Button';
import { IconSparkles } from './components/ui/icons';
import { AlbumDownloadButton } from './components/AlbumDownloadButton';
import { EditModal } from './components/EditModal';
import { HistoryPanel } from './components/HistoryPanel';
import { OnboardingTour, TourStep } from './components/OnboardingTour';

const tourSteps: TourStep[] = [
  {
    targetSelector: 'body',
    title: 'Bem-vindo ao PictureMe!',
    content: 'Este é um tour rápido para mostrar como você pode transformar suas fotos com IA.',
    position: 'center',
  },
  {
    targetSelector: '#image-uploader-section',
    title: '1. Carregue sua foto',
    content: 'Comece carregando uma foto sua. Você pode usar um arquivo ou tirar uma foto com sua câmera.',
    position: 'right',
  },
  {
    targetSelector: '#template-selector-section',
    title: '2. Escolha um Tema',
    content: 'Explore nossos temas criativos para se ver em diferentes estilos e cenários com apenas um clique.',
    position: 'bottom',
  },
  {
    targetSelector: '#prompt-generator-section',
    title: 'OU... Use sua Imaginação',
    content: 'Se preferir, escreva sua própria ideia (prompt) para criar algo totalmente único.',
    position: 'top',
  },
  {
    targetSelector: '#generate-button-theme',
    title: '3. Gere suas Imagens',
    content: 'Quando estiver pronto, clique aqui para deixar a IA fazer sua mágica!',
    position: 'top',
  },
  {
    targetSelector: 'body',
    title: '4. Edite suas Criações',
    content: 'Após a geração, você pode clicar em qualquer imagem para abrir o editor e fazer ajustes, adicionar ou remover elementos.',
    position: 'center',
  }
];

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { 
        handleGenerateFromTemplate, 
        handleGenerateFromPrompt,
        handleRegenerateImage,
        handleCreateVariations,
        handleUseImageAsBase,
        handleDownloadImage,
        handleDownloadAlbum,
        handleStartOver,
        handleEditImage,
    } = useImageGeneration(state, dispatch);
    
    const [isTourOpen, setIsTourOpen] = useState(false);

    useEffect(() => {
        const hasCompletedTour = localStorage.getItem('hasCompletedOnboarding');
        if (!hasCompletedTour) {
            // Use a timeout to ensure the UI is ready before starting the tour
            setTimeout(() => setIsTourOpen(true), 500);
        }
    }, []);

    const handleCloseTour = () => {
        setIsTourOpen(false);
        localStorage.setItem('hasCompletedOnboarding', 'true');
    };


    const resultsRef = useRef<HTMLDivElement>(null);
    const promptResultsRef = useRef<HTMLDivElement>(null);
    
    const showResults = state.generatedImages.length > 0 || state.promptGeneratedImages.length > 0;
    const showThemeGenerator = !showResults || state.generatedImages.length > 0;
    const showPromptGenerator = !showResults || state.promptGeneratedImages.length > 0;
    
    const handleOpenEditModal = (index: number, source: 'theme' | 'prompt', variationIndex?: number) => {
        const targetKey = source === 'theme' ? 'generatedImages' : 'promptGeneratedImages';
        const parentImage = state[targetKey][index];
        const image = typeof variationIndex === 'number' ? parentImage?.variations?.[variationIndex] : parentImage;

        if (image && image.imageUrl) {
            dispatch({ type: 'OPEN_EDIT_MODAL', payload: {
                imageUrl: image.imageUrl,
                id: image.id,
                source,
                index,
                variationIndex,
            }});
        }
    };

    const handleLoadSession = (sessionId: string) => {
        dispatch({ type: 'LOAD_HISTORY_SESSION', payload: sessionId });
    };

    const handleClearHistory = () => {
        if (window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            dispatch({ type: 'CLEAR_HISTORY' });
        }
    };

    return (
        <div className="bg-zinc-950 text-gray-300 min-h-screen flex">
            <OnboardingTour isOpen={isTourOpen} onClose={handleCloseTour} steps={tourSteps} />
            {/* Left Sidebar */}
            <aside className="w-[380px] fixed top-0 left-0 h-full bg-zinc-900 p-6 flex flex-col">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-8">
                        Picture<span className="text-purple-500">Me</span> - <span className="font-bungee text-neon-purple">SATTI</span>
                    </h1>
                    <ImageUploader state={state} dispatch={dispatch} />
                </div>
                <div className="border-t border-zinc-700/50 my-6"></div>
                <div className="overflow-y-auto space-y-8 flex-1 pr-2 -mr-2">
                    <GenerationSettings state={state} dispatch={dispatch} />
                    <div className="border-t border-zinc-700/50 my-6"></div>
                    <HistoryPanel 
                        history={state.history}
                        onLoadSession={handleLoadSession}
                        onClearHistory={handleClearHistory}
                    />
                </div>
            </aside>
            
            {/* Edit Modal */}
            {state.editingImageInfo && (
                <EditModal 
                    isOpen={!!state.editingImageInfo}
                    onClose={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}
                    onEdit={handleEditImage}
                    imageInfo={state.editingImageInfo}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 ml-[380px] p-8">
                <Header error={state.error} onDismiss={() => dispatch({ type: 'DISMISS_ERROR' })} />

                {/* Generation Area */}
                <div className="max-w-7xl mx-auto">
                    {showThemeGenerator && (
                        <div id="template-selector-section" className="mb-16">
                            <div className="bg-zinc-900/50 p-8 rounded-2xl">
                                <h3 className="text-xl font-semibold text-purple-400 mb-4">Gere com um Tema</h3>
                                <TemplateSelector selectedTemplate={state.template} onSelect={(id) => dispatch({ type: 'SELECT_TEMPLATE', payload: id })} />
                                
                                {state.template && (
                                    <div className="mt-8 p-6 rounded-xl bg-zinc-800/50">
                                        <TemplateOptions state={state} dispatch={dispatch} />
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 text-center">
                                <Button
                                    id="generate-button-theme"
                                    onClick={() => handleGenerateFromTemplate(resultsRef)}
                                    disabled={!state.uploadedImage || !state.template || state.status === 'loading' || state.status === 'setting_up'}
                                    primary
                                    className="text-lg px-12 py-4 shadow-lg shadow-purple-500/20"
                                >
                                    <div className="flex items-center gap-3">
                                        {(state.status === 'loading' || state.status === 'setting_up') ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                {state.status === 'setting_up' ? "Preparando o cenário..." : `Gerando... (${Math.round(state.progress)}%)`}
                                            </>
                                        ) : (
                                            <>
                                                <IconSparkles /> Gerar Fotos do Tema
                                            </>
                                        )}
                                    </div>
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {showThemeGenerator && showPromptGenerator && (
                        <div className="my-12 flex items-center">
                            <div className="flex-grow border-t border-zinc-800"></div>
                            <span className="flex-shrink mx-4 text-zinc-600 font-bold text-sm">OU</span>
                            <div className="flex-grow border-t border-zinc-800"></div>
                        </div>
                    )}
                    
                    {showPromptGenerator && (
                         <div id="prompt-generator-section">
                            <PromptGenerator state={state} dispatch={dispatch} onGenerate={() => handleGenerateFromPrompt(promptResultsRef)} />
                        </div>
                    )}

                    {/* Results Section */}
                    <ResultsContainer
                        ref={resultsRef}
                        title="Resultados do Tema"
                        images={state.generatedImages}
                        status={state.status}
                        progress={state.progress}
                        onRegenerate={handleRegenerateImage}
                        onCreateVariations={handleCreateVariations}
                        onUseAsBase={handleUseImageAsBase}
                        onDownload={handleDownloadImage}
                        onEdit={handleOpenEditModal}
                    />

                    <ResultsContainer
                        ref={promptResultsRef}
                        title="Resultados do Prompt"
                        images={state.promptGeneratedImages}
                        status={state.status}
                        isPromptResult={true}
                        onRegenerate={handleRegenerateImage}
                        onCreateVariations={handleCreateVariations}
                        onUseAsBase={handleUseImageAsBase}
                        onDownload={handleDownloadImage}
                        onEdit={handleOpenEditModal}
                    />
                    
                    {state.status === 'success' && (state.generatedImages.length > 0 || state.promptGeneratedImages.length > 0) && (
                        <div className="text-center mt-16 mb-12 flex justify-center gap-6">
                            <Button onClick={handleStartOver}>Começar de Novo</Button>
                            {state.generatedImages.length > 0 && 
                              <AlbumDownloadButton 
                                onDownload={handleDownloadAlbum}
                                isDownloading={state.isDownloadingAlbum}
                              />
                            }
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;