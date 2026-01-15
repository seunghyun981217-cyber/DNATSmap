
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
  Home
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
// React.memo를 사용하여 불필요한 리렌더링 방지
const Navbar = React.memo(({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: 'home' | 'explorer' | 'admin') => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 md:py-10" role="navigation">
    <div className="max-w-[1800px] mx-auto flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={() => onTabChange('home')}
          className={`group flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-500 shadow-xl ${activeTab === 'home' ? 'bg-white text-black border-white' : 'bg-black/40 text-white border-white/40 backdrop-blur-md hover:border-white hover:bg-black/60'}`}
          aria-label="홈으로 이동"
          aria-current={activeTab === 'home' ? 'page' : undefined}
        >
          <Home size={26} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onTabChange('admin')} 
          className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-all px-6 py-3 rounded-xl border-2 backdrop-blur-md ${activeTab === 'admin' ? 'bg-white text-black border-white opacity-100 shadow-lg' : 'bg-black/40 text-white border-white/40 opacity-70 hover:opacity-100 hover:border-white'}`}
          aria-label="관리자 시스템 접근"
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

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1217') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setPassword('');
    }
  }, [password]);

  const addNewRow = useCallback(() => {
    const newRow: InfrastructureData = {
      id: `node-${Date.now()}`,
      name: "",
      address: "",
      district: "강남구",
      serviceType: "전동휠체어 충전소",
      phone: "",
      date: new Date().toLocaleDateString()
    };
    setLocalData(prev => [newRow, ...prev]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setLocalData(prev => prev.filter(i => i.id !== id));
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center px-6 bg-black">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-12 glass-panel border border-white/10 rounded-[2.5rem] text-center bg-[#0a0a0a]">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock size={24} className="opacity-50" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2">System Access</h2>
          <p className="text-[10px] opacity-30 uppercase tracking-[0.2em] mb-10">Authorized Personnel Only</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER ACCESS CODE"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-sm tracking-[0.5em] focus:border-white/30 outline-none transition-all mb-4"
              autoFocus
              aria-label="비밀번호 입력"
            />
            <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:invert transition-all">Authenticate</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mx-auto px-6 py-40">
      <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4 opacity-50">
            <ShieldCheck size={16} aria-hidden="true" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Administrator Verified</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase text-white/90">Data Control</h2>
        </div>
        <div className="flex gap-4">
          <button onClick={addNewRow} className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
            <Plus size={14} aria-hidden="true" /> Add Row
          </button>
          <button onClick={() => { onSave(localData); alert('데이터가 저장되었습니다.'); }} className="px-8 py-4 bg-white text-black rounded-full text-[9px] font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
            <Save size={14} aria-hidden="true" /> Sync Cloud
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/10 text-[9px] font-black uppercase tracking-widest opacity-30 bg-white/[0.03]">
          <div className="col-span-3">Facility Name</div>
          <div className="col-span-4">Address</div>
          <div className="col-span-2">District</div>
          <div className="col-span-2">Service Type</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {localData.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-8 py-4 items-center border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
              <div className="col-span-3">
                <input 
                  value={item.name} 
                  onChange={(e) => setLocalData(prev => prev.map(i => i.id === item.id ? {...i, name: e.target.value} : i))}
                  className="w-full bg-transparent border-none outline-none text-sm font-bold focus:text-blue-400" 
                  aria-label="시설명 입력"
                />
              </div>
              <div className="col-span-4">
                <input 
                  value={item.address} 
                  onChange={(e) => setLocalData(prev => prev.map(i => i.id === item.id ? {...i, address: e.target.value} : i))}
                  className="w-full bg-transparent border-none outline-none text-xs opacity-60 focus:opacity-100" 
                  aria-label="주소 입력"
                />
              </div>
              <div className="col-span-2">
                <select 
                  value={item.district} 
                  onChange={(e) => setLocalData(prev => prev.map(i => i.id === item.id ? {...i, district: e.target.value} : i))}
                  className="bg-black text-[10px] font-bold uppercase p-2 border border-white/10 rounded w-full"
                  aria-label="자치구 선택"
                >
                  {districtList.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <select 
                  value={item.serviceType} 
                  onChange={(e) => setLocalData(prev => prev.map(i => i.id === item.id ? {...i, serviceType: e.target.value} : i))}
                  className="bg-black text-[10px] font-bold uppercase p-2 border border-white/10 rounded w-full"
                  aria-label="서비스 유형 선택"
                >
                  {serviceCategories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-1 text-center">
                <button onClick={() => removeRow(item.id)} className="p-2 opacity-20 group-hover:opacity-100 text-red-400 hover:bg-red-500/10 rounded-lg transition-all" aria-label="삭제">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- List View ---
const ListView = ({ district, service, data, onBack }: { district: string, service: string, data: InfrastructureData[], onBack: () => void }) => {
  const [selectedItem, setSelectedItem] = useState<InfrastructureData | null>(null);
  
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchDistrict = district === '전체' || item.district === district;
      const matchService = service === '전체 서비스' || item.serviceType.includes(service.replace(district, "").trim());
      return matchDistrict && matchService;
    });
  }, [data, district, service]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-10 py-40">
      <div className="mb-32">
        <button 
          onClick={onBack} 
          className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-all mb-10 group"
          aria-label="이전 단계로"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true"/> Navigator Back
        </button>
        <h2 className="text-6xl md:text-[7vw] font-black tracking-tighter leading-tight mb-6 uppercase text-white/90">{service}</h2>
        <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-white/20" aria-hidden="true"></div>
            <p className="text-[10px] font-medium tracking-[0.5em] opacity-30 uppercase">{district} Node Coverage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
        {filteredData.map((item) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="minimal-card p-14 h-80 flex flex-col justify-between cursor-pointer group rounded-[2.5rem]"
            role="listitem"
            aria-label={`${item.name} 상세 정보`}
          >
            <div>
              <div className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase mb-6 group-hover:text-white transition-colors">{item.district}</div>
              <h3 className="text-2xl font-bold tracking-tight leading-tight opacity-80 group-hover:opacity-100 transition-opacity">{item.name}</h3>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] opacity-30 font-medium">
                  <MapPin size={12} aria-hidden="true" /> <span className="truncate max-w-[150px]">{item.address}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} aria-hidden="true" />
                </div>
            </div>
          </motion.div>
        ))}
        {filteredData.length === 0 && (
            <div className="col-span-full py-40 text-center opacity-20 border border-white/5 rounded-[3rem]">
                <p className="text-[10px] font-bold tracking-[0.5em] uppercase">No Data Nodes Found</p>
            </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
            onClick={() => setSelectedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div 
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-2xl bg-white text-black p-16 md:p-24 rounded-[3.5rem] relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedItem(null)} className="absolute top-12 right-12 text-black/10 hover:text-black transition-colors" aria-label="닫기">
                <X size={24} aria-hidden="true" />
              </button>
              <div className="mb-20">
                <p className="text-[9px] font-black tracking-[0.5em] uppercase text-black/30 mb-6">{selectedItem.district} / System Utility</p>
                <h2 id="modal-title" className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">{selectedItem.name}</h2>
              </div>
              <div className="space-y-12 mb-20">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-20 block mb-4">Location Coordinate</label>
                  <p className="text-lg font-bold leading-relaxed opacity-80">{selectedItem.address}</p>
                </div>
              </div>
              <a 
                href={`https://map.kakao.com/link/search/${encodeURIComponent(selectedItem.address)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-7 bg-black text-white text-[9px] font-black uppercase tracking-[0.3em] text-center rounded-full hover:invert transition-all"
              >
                Access Navigation Node
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explorer' | 'admin'>('home');
  const [step, setStep] = useState<'district' | 'service' | 'list'>('district');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [data, setData] = useState<InfrastructureData[]>(() => {
    const saved = localStorage.getItem('seoul_smart_map_v10');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { 
    localStorage.setItem('seoul_smart_map_v10', JSON.stringify(data)); 
  }, [data]);

  const districts = useMemo(() => ['전체', '강남구', '강동구', '송파구', '서초구', '광진구', '성동구'], []);
  const services = useMemo(() => [
    { name: '전동휠체어 충전소', icon: <Zap size={18} aria-hidden="true" /> },
    { name: '수리 지정 업체', icon: <Wrench size={18} aria-hidden="true" /> },
    { name: '휴대용 충전기 대여소', icon: <BatteryCharging size={18} aria-hidden="true" /> },
    { name: '휠체어 대여소', icon: <ShoppingBag size={18} aria-hidden="true" /> }
  ], []);

  // 단계 변경 시 상단으로 스크롤 자동 이동 (UX 최적화)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, activeTab]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="relative min-h-screen" id="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-screen flex items-center justify-center relative"
            >
              <div className="absolute inset-0 z-0 scale-105">
                <iframe 
                  src='https://my.spline.design/nexbotrobotcharacterconcept-XLVWVFAOrjwv7abuogS3YQZM/' 
                  frameBorder='0' 
                  width='100%' 
                  height='100%'
                  loading="eager"
                  className="grayscale opacity-60 hover:grayscale-0 transition-all duration-1000"
                  title="Spline 3D Robot Background"
                ></iframe>
              </div>

              <div className="relative z-10 w-full px-10 md:px-24 flex flex-col items-start pointer-events-none">
                <motion.div 
                  initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-6xl"
                >
                    <div className="flex items-center gap-4 mb-8 opacity-40">
                        <div className="h-[1px] w-12 bg-white" aria-hidden="true"></div>
                        <span className="text-[9px] font-bold tracking-[0.5em] uppercase">City Navigation Infrastructure</span>
                    </div>
                  <h1 className="text-[10vw] md:text-[7.5vw] font-black tracking-tighter leading-[0.85] uppercase mb-16 text-white/90">
                    서울시 동남<br/>보조기기센터<br/>Smart map
                  </h1>
                  <div className="pointer-events-auto">
                    <button 
                      onClick={() => { setActiveTab('explorer'); setStep('district'); }}
                      className="cta-button px-20 py-8 rounded-full text-[12px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-black hover:text-white transition-all"
                      aria-label="탐색 시작하기"
                    >
                      시작하기
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[7px] font-bold uppercase tracking-[0.6em] opacity-20 pointer-events-none">
                <span>PROTOCOL V.12.0</span>
                <div className="flex gap-10">
                    <span>RELIABILITY</span>
                    <span>ACCESSIBILITY</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'explorer' && (
            <motion.div 
              key="explorer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="min-h-screen bg-black"
            >
              {step === 'list' ? (
                <ListView district={selectedDistrict} service={selectedService} data={data} onBack={() => setStep('service')} />
              ) : (
                <div className="max-w-[1600px] mx-auto px-12 py-40">
                  <div className="mb-40 flex flex-col md:flex-row justify-between items-end gap-10">
                    <div>
                        <p className="text-[9px] font-black tracking-[0.8em] text-white/30 uppercase mb-8">PHASE {step === 'district' ? '01' : '02'}</p>
                        <h2 className="text-7xl md:text-[8vw] font-black tracking-tighter leading-none uppercase">
                        {step === 'district' ? 'Region' : 'Category'}
                        </h2>
                    </div>
                    <p className="text-[11px] font-medium tracking-[0.2em] opacity-30 uppercase max-w-xs text-right leading-loose">
                        {selectedDistrict ? `Refining access for ${selectedDistrict} sector nodes.` : 'Select a primary sector to begin data visualization.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="group" aria-label={step === 'district' ? "지역 선택" : "서비스 선택"}>
                    {step === 'district' ? districts.map((d) => (
                      <button 
                        key={d} onClick={() => { setSelectedDistrict(d); setStep('service'); }}
                        className="p-16 minimal-card text-left group overflow-hidden relative"
                        aria-label={`${d} 선택`}
                      >
                        <div className="relative z-10">
                            <span className="text-[9px] font-bold opacity-30 mb-2 block group-hover:opacity-100 transition-opacity" aria-hidden="true">NODE</span>
                            <span className="text-3xl font-black uppercase tracking-tighter">{d}</span>
                        </div>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" aria-hidden="true"></div>
                        <span className="absolute inset-0 flex items-center p-16 text-black text-3xl font-black uppercase tracking-tighter translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20" aria-hidden="true">{d}</span>
                      </button>
                    )) : services.map((s) => (
                      <button 
                        key={s.name} onClick={() => { setSelectedService(`${selectedDistrict} ${s.name}`); setStep('list'); }}
                        className="p-16 minimal-card text-left group relative overflow-hidden"
                        aria-label={`${s.name} 선택`}
                      >
                        <div className="mb-10 opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                            {s.icon}
                        </div>
                        <div className="text-xl font-bold uppercase tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                            {s.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-black">
              <AdminPanel data={data} onSave={setData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
