
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
  Cpu
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

// --- High-End Navigation Component ---
const Navbar = React.memo(({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: 'home' | 'explorer' | 'admin') => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 md:py-10" role="navigation">
    <div className="max-w-[1800px] mx-auto flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={() => onTabChange('home')}
          className={`group flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-500 shadow-xl ${activeTab === 'home' ? 'bg-white text-black border-white' : 'bg-black/40 text-white border-white/40 backdrop-blur-md hover:border-white hover:bg-black/60'}`}
          aria-label="홈으로 이동"
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

// --- Admin Panel ---
const AdminPanel = ({ data, onSave }: { data: InfrastructureData[], onSave: (data: InfrastructureData[]) => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [localData, setLocalData] = useState<InfrastructureData[]>(data);
  const districtList = useMemo(() => ["강남구", "서초구", "강동구", "송파구", "성동구", "광진구"], []);
  const serviceCategories = useMemo(() => ["전동휠체어 충전소", "수리 지정 업체", "휴대용 충전기 대여소", "휠체어 대여소"], []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1217') setIsAuthenticated(true);
    else { alert('비밀번호가 일치하지 않습니다.'); setPassword(''); }
  };

  const addNewRow = () => {
    const newRow: InfrastructureData = {
      id: `node-${Date.now()}`,
      name: "", address: "", district: "강남구", serviceType: "전동휠체어 충전소", phone: "", date: new Date().toLocaleDateString()
    };
    setLocalData(prev => [newRow, ...prev]);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center px-6 bg-black">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-12 glass-panel border border-white/10 rounded-[2.5rem] text-center">
          <Lock size={24} className="mx-auto mb-8 opacity-20" />
          <h2 className="text-xl font-bold uppercase tracking-widest mb-10">System Access</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="ACCESS CODE"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-sm tracking-[0.5em] outline-none mb-4"
            />
            <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:invert">Authenticate</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-40">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-5xl font-black tracking-tighter uppercase">Data Control</h2>
        <div className="flex gap-4">
          <button onClick={addNewRow} className="px-8 py-4 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest">Add Row</button>
          <button onClick={() => { onSave(localData); alert('저장되었습니다.'); }} className="px-8 py-4 bg-white text-black rounded-full text-[9px] font-bold uppercase tracking-widest">Sync Cloud</button>
        </div>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {localData.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/5 hover:bg-white/[0.03] items-center">
              <input value={item.name} onChange={(e) => setLocalData(prev => prev.map(i => i.id === item.id ? {...i, name: e.target.value} : i))} className="col-span-4 bg-transparent outline-none text-sm font-bold" placeholder="Facility Name" />
              <input value={item.address} onChange={(e) => setLocalData(prev => prev.map(i => i.id === item.id ? {...i, address: e.target.value} : i))} className="col-span-5 bg-transparent outline-none text-xs opacity-50" placeholder="Address" />
              <button onClick={() => setLocalData(prev => prev.filter(i => i.id !== item.id))} className="col-span-3 text-right text-red-500/40 hover:text-red-500"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- List View ---
const ListView = ({ district, service, data, onBack }: { district: string, service: string, data: InfrastructureData[], onBack: () => void }) => {
  const [selectedItem, setSelectedItem] = useState<InfrastructureData | null>(null);
  const filteredData = useMemo(() => data.filter(item => (district === '전체' || item.district === district) && (service === '전체 서비스' || item.serviceType.includes(service.replace(district, "").trim()))), [data, district, service]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-10 py-40">
      <button onClick={onBack} className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 hover:opacity-100 mb-10"><ChevronLeft size={14}/> Back</button>
      <h2 className="text-6xl md:text-[7vw] font-black tracking-tighter mb-16 uppercase">{service}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredData.map((item) => (
          <div key={item.id} onClick={() => setSelectedItem(item)} className="minimal-card p-14 h-80 flex flex-col justify-between cursor-pointer rounded-[2.5rem] group">
            <div><p className="text-[9px] font-black opacity-30 mb-6 uppercase">{item.district}</p><h3 className="text-2xl font-bold">{item.name}</h3></div>
            <div className="flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity"><span className="text-[11px] truncate max-w-[150px]">{item.address}</span><ArrowUpRight size={16}/></div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-2xl bg-white text-black p-24 rounded-[3.5rem] relative" onClick={e => e.stopPropagation()}>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-12">{selectedItem.name}</h2>
              <p className="text-lg font-bold opacity-60 mb-20">{selectedItem.address}</p>
              <a href={`https://map.kakao.com/link/search/${encodeURIComponent(selectedItem.address)}`} target="_blank" className="block w-full py-7 bg-black text-white text-[10px] font-black uppercase text-center rounded-full">Open Navigation</a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Waiting List View ---
const WaitingListView = ({ onBack }: { onBack: () => void }) => {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<null | { rank: number, name: string }>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    setIsSearching(true);
    setResult(null);
    setTimeout(() => {
      setIsSearching(false);
      setResult({ rank: Math.floor(Math.random() * 20) + 1, name: search });
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-40 px-10 max-w-4xl mx-auto flex flex-col">
      <button onClick={onBack} className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 hover:opacity-100 mb-20"><ChevronLeft size={14}/> Explorer Back</button>
      <div className="mb-20">
        <h2 className="text-7xl font-black tracking-tighter uppercase mb-6">Waiting<br/>Status</h2>
        <p className="text-[11px] opacity-30 tracking-widest uppercase font-bold">Real-time Service Queue Sync</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-20">
        <input 
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ENTER FULL NAME OR ID"
          className="w-full bg-white/[0.03] border-b-2 border-white/10 py-10 px-4 text-3xl font-black uppercase tracking-tighter focus:border-white outline-none transition-all placeholder:opacity-10"
        />
        <button type="submit" className="absolute right-4 bottom-10 p-4 bg-white text-black rounded-full hover:scale-110 transition-transform">
          <Search size={24} />
        </button>
      </form>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
              <Cpu className="mx-auto mb-6 animate-spin opacity-20" size={40} />
              <p className="text-[10px] font-black tracking-[0.5em] opacity-30 uppercase animate-pulse">Scanning Cloud Database...</p>
            </motion.div>
          )}
          {result && !isSearching && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="minimal-card p-20 rounded-[3rem] border-blue-500/30">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-[9px] font-black tracking-[0.4em] text-blue-400 uppercase mb-4">Verification Success</p>
                  <h3 className="text-4xl font-black tracking-tighter uppercase">{result.name}</h3>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">Active</div>
              </div>
              <div className="flex items-end gap-6">
                <span className="text-[120px] font-black leading-none tracking-tighter text-white">{result.rank}</span>
                <p className="text-xl font-bold uppercase opacity-30 mb-4 tracking-tighter">Current Rank in Queue</p>
              </div>
              <p className="mt-12 text-[10px] opacity-20 font-medium leading-relaxed uppercase tracking-widest">본 정보는 실시간 데이터를 바탕으로 집계되었습니다.<br/>방문 전 센터에 유선 확인을 권장합니다.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explorer' | 'admin'>('home');
  const [step, setStep] = useState<'selector' | 'district' | 'service' | 'list' | 'waiting'>('selector');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [data, setData] = useState<InfrastructureData[]>(() => {
    const saved = localStorage.getItem('seoul_smart_map_v10');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('seoul_smart_map_v10', JSON.stringify(data)); }, [data]);

  const districts = useMemo(() => ['전체', '강남구', '강동구', '송파구', '서초구', '광진구', '성동구'], []);
  const services = useMemo(() => [
    { name: '전동휠체어 충전소', icon: <Zap size={18} /> },
    { name: '수리 지정 업체', icon: <Wrench size={18} /> },
    { name: '휴대용 충전기 대여소', icon: <BatteryCharging size={18} /> },
    { name: '휠체어 대여소', icon: <ShoppingBag size={18} /> }
  ], []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex items-center justify-center relative">
            <div className="absolute inset-0 z-0"><iframe src='https://my.spline.design/nexbotrobotcharacterconcept-XLVWVFAOrjwv7abuogS3YQZM/' width='100%' height='100%' className="grayscale opacity-50"></iframe></div>
            <div className="relative z-10 px-10 md:px-24 w-full">
              <h1 className="text-[10vw] font-black tracking-tighter leading-[0.85] uppercase mb-16">SEOUL SE<br/>SMART MAP</h1>
              <button onClick={() => { setActiveTab('explorer'); setStep('selector'); }} className="cta-button px-20 py-8 rounded-full text-[12px] font-black uppercase tracking-[0.5em]">시작하기</button>
            </div>
          </motion.div>
        )}

        {activeTab === 'explorer' && (
          <motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
            {step === 'selector' && (
              <div className="h-screen flex flex-col md:flex-row">
                <button onClick={() => setStep('district')} className="flex-1 border-r border-white/5 flex flex-col items-center justify-center group relative overflow-hidden transition-all hover:flex-[1.5]">
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                  <Navigation size={40} className="mb-8 opacity-20 group-hover:text-black group-hover:opacity-100 z-10" />
                  <span className="text-6xl font-black uppercase tracking-tighter group-hover:text-black z-10">Smart Map</span>
                  <p className="text-[9px] font-bold tracking-[0.8em] uppercase opacity-20 mt-4 group-hover:text-black z-10">Facility Navigation Node</p>
                </button>
                <button onClick={() => setStep('waiting')} className="flex-1 flex flex-col items-center justify-center group relative overflow-hidden transition-all hover:flex-[1.5]">
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                  <UserCheck size={40} className="mb-8 opacity-20 group-hover:opacity-100 z-10" />
                  <span className="text-6xl font-black uppercase tracking-tighter z-10">Waiting List</span>
                  <p className="text-[9px] font-bold tracking-[0.8em] uppercase opacity-20 mt-4 z-10">Real-time Service Queue</p>
                </button>
              </div>
            )}
            {step === 'district' && (
              <div className="max-w-[1600px] mx-auto px-12 py-40">
                <button onClick={() => setStep('selector')} className="mb-20 opacity-30 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest"><ChevronLeft size={14}/> Main Menu</button>
                <h2 className="text-7xl md:text-[8vw] font-black tracking-tighter uppercase mb-20">Region</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {districts.map(d => (
                    <button key={d} onClick={() => { setSelectedDistrict(d); setStep('service'); }} className="p-16 minimal-card text-left group overflow-hidden relative">
                      <span className="text-3xl font-black uppercase z-10 relative">{d}</span>
                      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="absolute inset-0 flex items-center p-16 text-black text-3xl font-black uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">{d}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 'service' && (
              <div className="max-w-[1600px] mx-auto px-12 py-40">
                <button onClick={() => setStep('district')} className="mb-20 opacity-30 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest"><ChevronLeft size={14}/> Back</button>
                <h2 className="text-7xl md:text-[8vw] font-black tracking-tighter uppercase mb-20">Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {services.map(s => (
                    <button key={s.name} onClick={() => { setSelectedService(`${selectedDistrict} ${s.name}`); setStep('list'); }} className="p-16 minimal-card text-left group">
                      <div className="mb-10 opacity-40 group-hover:opacity-100">{s.icon}</div>
                      <div className="text-xl font-bold uppercase leading-tight group-hover:text-blue-400">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 'list' && <ListView district={selectedDistrict} service={selectedService} data={data} onBack={() => setStep('service')} />}
            {step === 'waiting' && <WaitingListView onBack={() => setStep('selector')} />}
          </motion.div>
        )}

        {activeTab === 'admin' && <motion.div key="admin" className="bg-black"><AdminPanel data={data} onSave={setData} /></motion.div>}
      </AnimatePresence>
    </div>
  );
}
