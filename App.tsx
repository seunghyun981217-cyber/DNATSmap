
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  X,
  BatteryCharging,
  ShoppingBag,
  Wrench,
  Database,
  Navigation,
  Zap,
  ChevronLeft,
  Trash2,
  ArrowUpRight,
  Plus,
  Save,
  Lock,
  ShieldCheck,
  Home,
  UserCheck,
  Cpu,
  AlertCircle,
  Info,
  Layers
} from 'lucide-react';

// --- Types ---
interface InfrastructureData {
  id: string;
  name: string;
  address: string;
  district: string;
  serviceType: string;
  phone: string;
  date: string;
}

// --- Navbar Component ---
const Navbar = React.memo(({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: 'home' | 'explorer' | 'admin') => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 md:py-10" role="navigation">
    <div className="max-w-[1800px] mx-auto flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={() => onTabChange('home')}
          className={`group flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-500 shadow-xl ${activeTab === 'home' ? 'bg-white text-black border-white' : 'bg-black/40 text-white border-white/40 backdrop-blur-md hover:border-white hover:bg-black/60'}`}
        >
          <Home size={26} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onTabChange('admin')} 
          className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all px-6 py-3 rounded-xl border-2 backdrop-blur-md ${activeTab === 'admin' ? 'bg-white text-black border-white opacity-100 shadow-lg' : 'bg-black/40 text-white border-white/40 opacity-70 hover:opacity-100 hover:border-white'}`}
        >
          Admin System
        </button>
      </div>
    </div>
  </nav>
));

// --- Waiting List View (품목별 순번 조회) ---
const WaitingListView = ({ onBack }: { onBack: () => void }) => {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<null | { rank: number, name: string, itemName: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setIsSearching(true);
    setResult(null);
    setError(null);

    try {
      // 사용자가 제공한 구글 앱 스크립트 URL
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXTFNMmwPBSqi6BiXevj5Q6MCTW1ytaq1-o1HosdSYxNUa-M-Ltoz4lSw1HJ_YEKaw/exec";
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?name=${encodeURIComponent(search.trim())}`);
      const data = await response.json();

      if (data.rank && data.rank !== -1) {
        setResult({ 
          rank: data.rank, 
          name: search.trim(),
          itemName: data.itemName || "신청 품목"
        });
      } else {
        setError(`'${search.trim()}' 님의 대기 정보를 찾을 수 없습니다. 성함(동명이인 번호)과 대기 상태를 확인해 주세요.`);
      }
    } catch (err) {
      setError("데이터베이스와 통신하는 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen pt-40 px-10 max-w-4xl mx-auto flex flex-col">
      <button onClick={onBack} className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 hover:opacity-100 mb-20 transition-all">
        <ChevronLeft size={14}/> Back to Explorer
      </button>
      
      <div className="mb-20">
        <h2 className="text-7xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">Itemized<br/>Queue</h2>
        <div className="flex items-center gap-4 py-4 px-6 bg-white/5 rounded-2xl w-fit border border-white/5">
          <Layers size={14} className="text-blue-400" />
          <p className="text-[11px] opacity-60 tracking-widest uppercase font-bold">Category-specific live sync</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12">
        <input 
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="성함을 입력하세요 (예: 홍길동(2))"
          className="w-full bg-white/[0.03] border-b-2 border-white/10 py-10 px-4 text-3xl font-black uppercase tracking-tighter focus:border-blue-500 outline-none transition-all placeholder:opacity-10"
        />
        <button type="submit" disabled={isSearching} className="absolute right-4 bottom-10 p-4 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl disabled:opacity-50">
          <Search size={24} />
        </button>
      </form>

      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
            <Cpu className="mx-auto mb-6 animate-spin opacity-20" size={40} />
            <p className="text-[10px] font-black tracking-[0.5em] opacity-30 uppercase animate-pulse">Calculating category rank...</p>
          </motion.div>
        )}

        {error && !isSearching && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-10 border border-red-500/10 bg-red-500/5 rounded-[2rem] flex items-start gap-6">
            <AlertCircle className="text-red-500/40 shrink-0 mt-1" size={24} />
            <p className="text-sm font-medium text-red-500/80 leading-relaxed">{error}</p>
          </motion.div>
        )}

        {result && !isSearching && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="minimal-card p-16 rounded-[3.5rem] border-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
            
            <div className="flex justify-between items-start mb-16 relative z-10">
              <div>
                <p className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase mb-4">Verification Success</p>
                <h3 className="text-5xl font-black tracking-tighter uppercase mb-2">{result.name}</h3>
                <div className="flex items-center gap-2 text-white/40">
                  <ShoppingBag size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{result.itemName} 대기열</span>
                </div>
              </div>
              <div className="bg-blue-500/20 text-blue-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">대기 중</div>
            </div>

            <div className="flex items-end gap-8 relative z-10">
              <span className="text-[160px] font-black leading-none tracking-tighter text-white">{result.rank}</span>
              <div className="mb-6">
                <p className="text-2xl font-black uppercase tracking-tighter text-white/40 leading-none">Ranking</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-20 mt-2">Position in {result.itemName}</p>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-white/5 relative z-10">
              <p className="text-[11px] opacity-40 font-bold leading-relaxed uppercase tracking-[0.1em]">
                본 순번은 <span className="text-white">[{result.itemName}]</span> 카테고리의 '대기/차대기' 인원만 포함된 결과입니다.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- ListView ---
const ListView = ({ district, service, data, onBack }: { district: string, service: string, data: InfrastructureData[], onBack: () => void }) => {
  const filteredData = useMemo(() => data.filter(item => (district === '전체' || item.district === district) && (service === '전체 서비스' || item.serviceType.includes(service.replace(district, "").trim()))), [data, district, service]);
  return (
    <div className="w-full max-w-[1600px] mx-auto px-10 py-40">
      <button onClick={onBack} className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 hover:opacity-100 mb-10"><ChevronLeft size={14}/> Back</button>
      <h2 className="text-6xl md:text-[7vw] font-black tracking-tighter mb-16 uppercase">{service}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredData.map((item) => (
          <div key={item.id} className="minimal-card p-14 h-80 flex flex-col justify-between rounded-[2.5rem] group">
            <div><p className="text-[9px] font-black opacity-30 mb-6 uppercase">{item.district}</p><h3 className="text-2xl font-bold">{item.name}</h3></div>
            <div className="flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity"><span className="text-[11px] truncate">{item.address}</span><ArrowUpRight size={16}/></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- App Root ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explorer' | 'admin'>('home');
  const [step, setStep] = useState<'selector' | 'district' | 'service' | 'list' | 'waiting'>('selector');
  const [data] = useState<InfrastructureData[]>([]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex items-center justify-center relative">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <iframe src='https://my.spline.design/nexbotrobotcharacterconcept-XLVWVFAOrjwv7abuogS3YQZM/' width='100%' height='100%' className="grayscale opacity-40 scale-110"></iframe>
            </div>
            <div className="relative z-10 px-10 w-full text-center">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <h1 className="text-[12vw] font-black tracking-tighter leading-[0.8] uppercase mb-12">SEOUL ATS<br/>SMART MAP</h1>
                <button 
                  onClick={() => { setActiveTab('explorer'); setStep('selector'); }} 
                  className="cta-button px-24 py-10 rounded-full text-[13px] font-black uppercase tracking-[0.6em] hover:scale-105 transition-transform"
                >
                  시작하기
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'explorer' && (
          <motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
            {step === 'selector' && (
              <div className="h-screen flex flex-col md:flex-row">
                <button onClick={() => setStep('district')} className="flex-1 border-r border-white/5 flex flex-col items-center justify-center group relative overflow-hidden transition-all duration-700">
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                  <Navigation size={40} className="mb-8 opacity-20 group-hover:text-black group-hover:opacity-100 z-10 transition-all" />
                  <span className="text-7xl font-black uppercase tracking-tighter group-hover:text-black z-10">Facility Map</span>
                </button>
                <button onClick={() => setStep('waiting')} className="flex-1 flex flex-col items-center justify-center group relative overflow-hidden transition-all duration-700">
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                  <UserCheck size={40} className="mb-8 opacity-20 group-hover:opacity-100 z-10 transition-all" />
                  <span className="text-7xl font-black uppercase tracking-tighter z-10">Live Queue</span>
                </button>
              </div>
            )}
            
            {step === 'waiting' && <WaitingListView onBack={() => setStep('selector')} />}
            
            {step === 'district' && (
              <div className="min-h-screen pt-40 px-10 max-w-6xl mx-auto">
                <button onClick={() => setStep('selector')} className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 hover:opacity-100 mb-12">
                  <ChevronLeft size={14}/> Back
                </button>
                <h2 className="text-6xl font-black uppercase tracking-tighter mb-20">Select District</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['강남구', '강동구', '송파구', '서초구'].map(d => (
                    <button key={d} className="minimal-card p-12 text-left rounded-3xl" onClick={() => setStep('service')}>
                      <h4 className="text-2xl font-black uppercase tracking-tight">{d}</h4>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'service' && (
              <div className="min-h-screen pt-40 px-10 max-w-6xl mx-auto">
                <button onClick={() => setStep('district')} className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 hover:opacity-100 mb-12">
                  <ChevronLeft size={14}/> Back
                </button>
                <h2 className="text-6xl font-black uppercase tracking-tighter mb-20">Service Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                    { name: '전동휠체어 충전소', icon: <Zap size={24} /> },
                    { name: '수리 지정 업체', icon: <Wrench size={24} /> }
                   ].map(s => (
                     <button key={s.name} className="minimal-card p-16 flex items-center justify-between rounded-[2.5rem] group" onClick={() => setStep('selector')}>
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            {s.icon}
                          </div>
                          <span className="text-2xl font-black uppercase tracking-tight">{s.name}</span>
                        </div>
                        <ArrowUpRight className="opacity-10 group-hover:opacity-100" />
                     </button>
                   ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
