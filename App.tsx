
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
        setError('画师暂歇，请检查网络或 API Key 状态。');
      }
    } finally {
      setIsGenerating(false);
    }
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
          <div className="w-16 h-16 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto">
            <Key size={32} />
          </div>
          <h2 className="text-3xl chinese-font text-[#8B0000]">配置绘图引擎</h2>
          <p className="text-gray-600 text-sm">Gemini 3 Pro 需要一个关联了付费项目的 API Key 以进行高品质创作。</p>
          <button onClick={handleOpenKeyDialog} className="w-full py-4 bg-[#8B0000] text-[#FFD700] rounded-xl font-bold hover:bg-[#A00000] transition-all flex items-center justify-center gap-2 shadow-lg">
            <Key size={18} /> 选择 API Key
          </button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center justify-center gap-1">
            计费文档 <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-12 pb-24 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl md:text-7xl chinese-font mb-4">古韵画境</h1>
          <p className="text-lg md:text-xl text-black/60 tracking-widest font-serif italic border-y border-black/10 py-1 inline-block px-6">GU YUN AI ART</p>
        </header>

        <div className="w-full flex flex-col items-center gap-8">
          <div className="w-full max-w-xl space-y-6">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-[#8B0000]/10 flex flex-col sm:flex-row items-center gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === Mode.CITY_MAP ? "输入城市名称..." : "输入传统技艺..."}
                className="flex-1 w-full bg-amber-50/50 border-none rounded-xl px-5 py-3 outline-none text-black font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !input.trim()}
                className="w-full sm:w-auto px-8 py-3 bg-[#8B0000] text-[#FFD700] rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-[#A00000] transition-all disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                <span>生成</span>
              </button>
            </div>

            {error && <div className="text-center text-red-600 bg-red-50 p-2 rounded border border-red-100 text-sm">{error}</div>}

            <div className={`relative transition-all duration-700 mx-auto w-full ${mode === Mode.CITY_MAP ? 'aspect-[3/4]' : 'aspect-square'}`}>
              <Bookmark label="手绘城市地图" isActive={mode === Mode.CITY_MAP} onClick={() => setMode(Mode.CITY_MAP)} position="left" />
              <Bookmark label="手绘特产工艺" isActive={mode === Mode.SPECIALTY_CRAFT} onClick={() => setMode(Mode.SPECIALTY_CRAFT)} position="right" />

              <CloudBorder>
                {isGenerating ? (
                  <div className="text-center text-[#8B0000] animate-pulse">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p className="chinese-font text-2xl">挥毫落纸中...</p>
                  </div>
                ) : currentImage ? (
                  <div className="relative group w-full h-full flex items-center justify-center">
                    <img src={currentImage} alt="AI Art" className="max-w-full max-h-full object-contain rounded shadow-lg" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button onClick={() => {
                        const a = document.createElement('a'); a.href = currentImage; a.download = 'art.png'; a.click();
                      }} className="p-3 bg-white rounded-full text-[#8B0000] shadow-xl hover:scale-110 transition-transform"><Download size={24} /></button>
                      <button onClick={() => { setCurrentImage(null); setInput(''); }} className="p-3 bg-white rounded-full text-[#8B0000] shadow-xl hover:scale-110 transition-transform"><RotateCcw size={24} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-30 select-none">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-700" />
                    <p className="font-serif italic">输入心仪词汇，开启古风绘卷</p>
                  </div>
                )}
              </CloudBorder>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <section className="space-y-4 pt-10 border-t border-[#8B0000]/10">
            <h2 className="text-2xl chinese-font text-[#8B0000] flex items-center gap-2">
              <History size={20} /> 往昔绘卷
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {history.map(item => (
                <div key={item.id} onClick={() => setCurrentImage(item.url)} className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg border border-[#8B0000]/10 hover:border-[#8B0000] transition-all shadow-sm">
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-center justify-center text-center">
                    <span className="text-white text-[10px] line-clamp-2">{item.prompt}</span>
                  </div>
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
