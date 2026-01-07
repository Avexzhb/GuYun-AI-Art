
import React, { useState, useEffect } from 'react';
import { Mode, GenerationHistory } from './types';
import Bookmark from './components/Bookmark';
import CloudBorder from './components/CloudBorder';
import { generateImage } from './services/geminiService';
import { Sparkles, Send, Loader2, Download, History, RotateCcw, Key, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.CITY_MAP);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    } catch (e) {
      console.error("Key selection failed:", e);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateImage(input, mode);
      setCurrentImage(imageUrl);
      setHistory(prev => [{
        id: Date.now().toString(),
        url: imageUrl,
        prompt: input,
        mode,
        timestamp: Date.now(),
      }, ...prev].slice(0, 10));
    } catch (err: any) {
      if (err.message === "KEY_RESET_REQUIRED") {
        setHasApiKey(false);
        setError('请重新选择付费项目的 API Key。');
        await handleOpenKeyDialog();
      } else {
        setError('创作失败，请检查网络或 API Key 状态。');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setCurrentImage(null);
    setInput('');
    setError(null);
  };

  if (hasApiKey === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-amber-50">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border-4 border-[#8B0000] text-center space-y-6">
          <div className="w-20 h-20 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Key size={40} />
          </div>
          <h2 className="text-3xl chinese-font text-[#8B0000]">配置绘图引擎</h2>
          <p className="text-gray-600 leading-relaxed">请选择一个关联了 <span className="text-[#8B0000] font-bold">付费项目</span> 的 API Key 以开启 AI 创作。</p>
          <div className="flex flex-col gap-4">
            <button onClick={handleOpenKeyDialog} className="w-full py-4 bg-[#8B0000] text-[#FFD700] rounded-xl font-bold text-lg hover:bg-[#A00000] transition-all flex items-center justify-center gap-2 shadow-xl">
              <Key size={20} /> 选择 API Key
            </button>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 flex items-center justify-center gap-1 hover:underline">
              计费说明 <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-12 pb-24 px-4 bg-amber-50/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl chinese-font text-black">古韵画境</h1>
          <p className="text-xl md:text-2xl text-black/80 tracking-[0.2em] border-y border-black/20 py-2 px-8 inline-block font-serif italic">GuYun AI Art</p>
        </header>

        <div className="w-full flex flex-col items-center space-y-8">
          <div className="w-full max-w-xl space-y-8">
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-[#8B0000]/10 flex flex-col md:flex-row items-center gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === Mode.CITY_MAP ? "输入城市名称..." : "输入传统技艺..."}
                className="flex-1 w-full bg-amber-50/50 border border-transparent focus:border-[#8B0000]/30 rounded-xl px-5 py-3 outline-none text-black font-medium transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !input.trim()}
                className="w-full md:w-auto px-8 py-3 bg-[#8B0000] text-[#FFD700] rounded-xl flex items-center justify-center space-x-2 font-bold hover:bg-[#A00000] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-md"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                <span>{isGenerating ? "生成中" : "生成"}</span>
              </button>
            </div>

            {error && <div className="text-center p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 animate-pulse">{error}</div>}

            <div className={`relative transition-all duration-700 ${mode === Mode.CITY_MAP ? 'aspect-[3/4]' : 'aspect-square'}`}>
              <Bookmark label="手绘城市地图" isActive={mode === Mode.CITY_MAP} onClick={() => setMode(Mode.CITY_MAP)} position="left" />
              <Bookmark label="手绘特产工艺" isActive={mode === Mode.SPECIALTY_CRAFT} onClick={() => setMode(Mode.SPECIALTY_CRAFT)} position="right" />

              <CloudBorder>
                {isGenerating ? (
                  <div className="text-center space-y-4 text-[#8B0000]">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto" />
                    <p className="chinese-font text-2xl animate-pulse">正在挥毫创作...</p>
                  </div>
                ) : currentImage ? (
                  <div className="relative group w-full h-full flex items-center justify-center">
                    <img src={currentImage} alt="Generated" className="max-w-full max-h-full object-contain rounded shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button onClick={() => {
                        const link = document.createElement('a');
                        link.href = currentImage;
                        link.download = `art-${Date.now()}.png`;
                        link.click();
                      }} className="p-3 bg-white text-[#8B0000] rounded-full hover:scale-110 transition-transform shadow-lg"><Download size={24} /></button>
                      <button onClick={reset} className="p-3 bg-white text-[#8B0000] rounded-full hover:scale-110 transition-transform shadow-lg"><RotateCcw size={24} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6 opacity-40 p-8">
                    <Sparkles className="w-16 h-16 mx-auto text-amber-600" />
                    <p className="text-lg italic font-serif">请在上方输入关键词以开启创作</p>
                  </div>
                )}
              </CloudBorder>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-2 text-[#8B0000] border-b border-[#8B0000]/10 pb-2">
              <History size={24} />
              <h2 className="text-2xl chinese-font">往昔绘卷</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {history.map(item => (
                <div key={item.id} onClick={() => setCurrentImage(item.url)} className="aspect-square bg-white border border-[#8B0000]/10 p-1 rounded-lg cursor-pointer hover:border-[#8B0000] transition-all transform hover:-translate-y-1 shadow-sm overflow-hidden group relative">
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover rounded" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] p-2 text-center transition-opacity">{item.prompt}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
