
import React, { useState, useEffect } from 'react';
import { Mode, GenerationHistory } from './types';
import Bookmark from './components/Bookmark';
import CloudBorder from './components/CloudBorder';
import { generateImage } from './services/geminiService';
import { Sparkles, Send, Loader2, Download, History, RotateCcw, Key, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

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
        const selected = await (window as any).aistudio?.hasSelectedApiKey();
        setHasApiKey(!!selected);
      } catch {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    try {
      await (window as any).aistudio?.openSelectKey();
      setHasApiKey(true);
    } catch (e) {
      console.error("无法打开 Key 选择对话框:", e);
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
      if (err.message === "KEY_RESET_REQUIRED" || err.message.includes("404")) {
        setHasApiKey(false);
        setError('API 连接失效。请重新选择一个有效的付费项目 API Key。');
      } else {
        const friendlyError = err.message || '请检查 API 状态或重试';
        setError('创作失败：' + friendlyError);
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
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border-4 border-[#8B0000] text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#8B0000] text-[#FFD700] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Key size={32} />
          </div>
          <h2 className="text-3xl chinese-font text-[#8B0000]">准备笔墨纸砚</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Gemini 3 Pro 绘图引擎需要您关联一个<span className="font-bold text-[#8B0000]">已启用计费</span>的 Google Cloud 项目 API Key 才能开始创作。
          </p>
          <button 
            onClick={handleOpenKeyDialog} 
            className="w-full py-4 bg-[#8B0000] text-[#FFD700] rounded-xl font-bold hover:bg-[#A00000] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Key size={18} /> 选择 API Key 并测试
          </button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center justify-center gap-1">
            关于计费说明 <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-8 pb-24 px-4 sm:px-8 bg-amber-50/20">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="text-center relative">
          <h1 className="text-5xl md:text-7xl text-[#8B0000] chinese-font mb-2 tracking-tight">古韵画境</h1>
          <p className="text-xs md:text-sm text-black/40 tracking-[0.5em] font-serif uppercase">Gu Yun AI Image Engine</p>
          
          <div className="absolute top-0 right-0 hidden sm:flex items-center gap-1.5 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            <CheckCircle2 size={12} />
            <span>引擎就绪</span>
          </div>
        </header>

        <div className="w-full flex flex-col items-center gap-4">
          {/* 生成区域容器宽度保持紧凑 */}
          <div className="w-full max-w-[300px] space-y-4 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-xl border border-[#8B0000]/10 flex flex-col sm:flex-row items-center gap-1.5">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === Mode.CITY_MAP ? "输入想探索的城市..." : "输入非遗技艺名称..."}
                className="flex-1 w-full bg-amber-50/20 border-none rounded-lg px-4 py-2 outline-none text-black font-medium text-sm placeholder:text-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !input.trim()}
                className="w-full sm:w-auto px-4 py-2 bg-[#8B0000] text-[#FFD700] rounded-lg flex items-center justify-center gap-1.5 font-bold hover:bg-[#A00000] transition-all disabled:opacity-50 shadow-md active:scale-95 text-sm"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                <span>{isGenerating ? "构思中" : "生成"}</span>
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-xs animate-fade-in shadow-sm">
                <AlertCircle size={14} className="shrink-0" />
                <p className="flex-1">{error}</p>
                <button onClick={handleOpenKeyDialog} className="ml-auto underline font-bold hover:text-red-800">重设</button>
              </div>
            )}
          </div>

          {/* 书签切换区域 */}
          <div className="flex justify-center -mb-2 mt-2">
            <div className="flex shadow-md rounded-lg overflow-hidden border border-[#8B0000]/20">
              <Bookmark label="城市地图" isActive={mode === Mode.CITY_MAP} onClick={() => setMode(Mode.CITY_MAP)} />
              <Bookmark label="特产工艺" isActive={mode === Mode.SPECIALTY_CRAFT} onClick={() => setMode(Mode.SPECIALTY_CRAFT)} />
            </div>
          </div>

          {/* 图片展示区域：宽度不变（450px），比例固定为 3:4 */}
          <div className="relative transition-all duration-700 mx-auto w-full max-w-[450px] aspect-[3/4]">
            <CloudBorder>
              {isGenerating ? (
                <div className="text-center text-[#8B0000] space-y-4">
                  <Loader2 className="w-14 h-14 animate-spin mx-auto opacity-80" />
                  <p className="chinese-font text-2xl animate-pulse tracking-widest">挥毫落纸中...</p>
                </div>
              ) : currentImage ? (
                <div className="relative group w-full h-full flex items-center justify-center p-2">
                  <img src={currentImage} alt="AI Art" className="max-w-full max-h-full object-contain rounded shadow-lg transition-transform group-hover:scale-[1.005]" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 rounded-lg">
                    <button onClick={() => {
                      const a = document.createElement('a'); a.href = currentImage; a.download = `guyun-${Date.now()}.png`; a.click();
                    }} className="p-4 bg-white rounded-full text-[#8B0000] shadow-2xl hover:scale-110 transition-transform"><Download size={28} /></button>
                    <button onClick={() => { setCurrentImage(null); setInput(''); }} className="p-4 bg-white rounded-full text-[#8B0000] shadow-2xl hover:scale-110 transition-transform"><RotateCcw size={28} /></button>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-30 select-none space-y-4">
                  <Sparkles className="w-20 h-20 mx-auto text-amber-800" />
                  <p className="font-serif italic tracking-widest px-4">输入心仪之城，为您点睛成画</p>
                </div>
              )}
            </CloudBorder>
          </div>
        </div>

        {history.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-[#8B0000]/10 animate-fade-in">
            <h2 className="text-2xl chinese-font text-[#8B0000] flex items-center gap-2">
              <History size={22} /> 往昔绘卷
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {history.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setCurrentImage(item.url);
                    setInput(item.prompt);
                    setMode(item.mode);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl border border-[#8B0000]/10 hover:border-[#8B0000] transition-all shadow-sm hover:shadow-md"
                >
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col items-center justify-center text-center">
                    <span className="text-white text-[10px] font-medium mb-2 line-clamp-3">{item.prompt}</span>
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"><RotateCcw size={10} className="text-white" /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-4 right-4 text-[8px] text-black/10 font-serif pointer-events-none uppercase tracking-tighter">
        GuYun Engine v2.5 • Powered by Gemini 3 Pro
      </div>
    </div>
  );
};

export default App;
