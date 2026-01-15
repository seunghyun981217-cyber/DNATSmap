
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Settings, 
  ArrowRight, 
  Compass, 
  Activity, 
  Layers,
  Menu,
  X,
  Cpu,
  Zap,
  ChevronRight,
  Globe
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Custom Seoul Logo Icon Component
const SeoulIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="30" r="15" fill="#E60012" />
    <path d="M20 50C20 50 35 35 50 50C65 65 80 50 80 50V80C80 80 65 95 50 80C35 65 20 80 20 80V50Z" fill="#007BC3" />
    <path d="M10 55C10 55 15 45 25 45C35 45 40 55 40 55L35 70C35 70 30 65 25 65C20 65 15 70 15 70L10 55Z" fill="#388E3C" />
  </svg>
);

const DistrictModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  const districts = [
    { name: '강동구', sub: 'Gangdong-gu', icon: <MapPin className="text-blue-500" />, count: '128 locations' },
    { name: '강남구', sub: 'Gangnam-gu', icon: <Globe className="text-purple-500" />, count: '256 locations' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-lg glass-card p-8 shadow-[0_0_100px_rgba(59,130,246,0.15)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ring-1 ring-white/20">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-10 text-center">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl mb-4">
            <Compass size={32} className="text-blue-500" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Select District</h2>
          <p className="text-white/40 text-sm">탐색을 시작할 지역을 선택해주세요.</p>
        </div>

        <div className="space-y-4">
          {districts.map((d, i) => (
            <button 
              key={i}
              className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-blue-600/10 hover:border-blue-500/30 transition-all group overflow-hidden relative"
              onClick={() => {
                alert(`${d.name} 스마트맵으로 이동합니다.`);
                onClose();
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-5 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {d.icon}
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight">{d.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{d.sub}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-[10px] uppercase font-bold text-white/20 group-hover:text-blue-400 transition-colors">{d.count}</span>
                <ChevronRight size={20} className="text-white/10 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Smart Map Navigation System</p>
        </div>
      </div>
    </div>
  );
};

// Components
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center neon-glow overflow-hidden p-1 shadow-lg shadow-blue-500/20">
            <SeoulIcon className="w-full h-full" />
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter uppercase whitespace-nowrap">
            서울시동남보조기기센터 <span className="text-blue-500">SMART MAP</span>
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#services" className="hover:text-blue-400 transition-colors">보조기기 서비스</a>
          <a href="#map" className="hover:text-blue-400 transition-colors">스마트 맵</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">센터안내</a>
        </div>
        
        <button className="lg:hidden p-2 text-white">
          <Menu size={28} />
        </button>
      </div>
    </nav>
  );
};

const Hero = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Background Spline Mesh */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <iframe 
          src='https://my.spline.design/nexbotrobotcharacterconcept-XLVWVFAOrjwv7abuogS3YQZM/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full scale-110 md:scale-100"
          title="NexBot 3D Robot"
        ></iframe>
      </div>

      <div className="relative z-10 text-center max-w-5xl pointer-events-none mt-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
          <SeoulIcon className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">Seoul Southeast Assistive Technology Center</span>
        </div>
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-12 tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase">
          서울시동남보조기기센터<br/><span className="text-blue-500 text-3xl md:text-6xl lg:text-7xl block mt-4">SMART MAP</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
          <button 
            onClick={onOpenModal}
            className="group relative px-10 py-5 bg-blue-600 rounded-full font-bold overflow-hidden transition-all hover:bg-blue-500 shadow-xl shadow-blue-600/30"
          >
            <span className="relative z-10 flex items-center gap-2 text-lg uppercase tracking-tight">지도 바로가기 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
          </button>
          
          {/* Updated link for 센터 소개 */}
          <a 
            href="http://www.seoulats.or.kr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full font-bold backdrop-blur-md transition-all text-lg uppercase tracking-tight flex items-center justify-center"
          >
            센터 소개
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll Down</span>
      </div>
    </section>
  );
};

const MapInterface = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `서울시동남보조기기센터 스마트맵 사용자(휠체어, 보조기기 이용자)를 위해 다음 장소의 접근성 정보를 상세히 알려주세요: ${query}. (답변은 한국어로, 핵심 접근성 포인트 3가지를 강조해주세요)`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setResult(response.text || "데이터를 분석할 수 없습니다.");
    } catch (err) {
      setResult("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="map" className="py-32 px-6 relative bg-black">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1">
          <div className="glass-card p-10 min-h-[550px] flex flex-col shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <SeoulIcon className="w-32 h-32" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">AI Navigator Active</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-8 text-white tracking-tight">목적지 접근성 분석</h3>
              
              <div className="relative mb-10">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="예: 잠실역 엘리베이터 위치"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg placeholder:text-white/20"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50"
                >
                  <Search size={24} />
                </button>
              </div>

              {isSearching ? (
                <div className="flex flex-col items-center justify-center h-56 gap-6">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-blue-400 font-bold animate-pulse tracking-widest uppercase text-xs">AI 공간 데이터 분석 중...</p>
                </div>
              ) : result ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-inner">
                  <div className="flex items-center gap-3 mb-6 text-blue-400">
                    <MapPin size={22} />
                    <span className="font-black text-sm tracking-widest uppercase">Smart Report</span>
                  </div>
                  <div className="text-white/80 leading-relaxed text-base font-light whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-56 opacity-10">
                  <MapPin size={64} className="mb-4" />
                  <p className="text-xl font-bold uppercase tracking-tighter">Enter destination</p>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
              <span>Smart Map Engine v4.0</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Online</span>
                <span className="hidden sm:inline">Encrypted Data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mb-6 inline-block p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
            <SeoulIcon className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-none uppercase">서울시동남보조기기센터<br/><span className="text-blue-500">스마트 맵 서비스</span></h2>
          <p className="text-white/50 text-xl mb-12 leading-relaxed font-light">
            우리는 기술을 통해 누구에게나 평평한 서울을 만듭니다. 실시간 공공데이터와 AI 분석을 결합하여 휠체어 및 보조기기 사용자를 위한 맞춤형 경로를 안내합니다.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-6 p-8 glass-card hover:bg-white/5 transition-all border-l-4 border-blue-600 group">
              <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                <Compass size={32} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">배리어프리 정밀 안내</h4>
                <p className="text-sm text-white/40 leading-relaxed">엘리베이터의 실시간 가동 상태부터 경사로의 각도까지, 가장 정확한 정보를 제공합니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-6 p-8 glass-card hover:bg-white/5 transition-all border-l-4 border-purple-600 group">
              <div className="p-4 bg-purple-600/20 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-white">실시간 도로 인프라 데이터</h4>
                <p className="text-sm text-white/40 leading-relaxed">갑작스러운 공사나 장애물 정보를 즉각적으로 공유하여 안전한 이동을 보장합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureSection = () => {
  return (
    <section className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 uppercase">핵심 <span className="text-blue-500">기술력</span></h2>
            <p className="text-white/40 text-lg font-light leading-relaxed">
              서울시동남보조기기센터는 단순한 지도를 넘어 보조공학 기술의 정수를 담았습니다.
            </p>
          </div>
          <button className="px-8 py-4 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
            모든 기술 보기
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "3D 공간 스캐닝",
              desc: "LiDAR 기술을 활용한 3D 입체 매핑으로 실내외 통합 경로를 완벽하게 안내합니다.",
              icon: <Layers className="w-10 h-10 text-blue-500" />
            },
            {
              title: "기기별 맞춤 최적화",
              desc: "전동 휠체어, 수동 휠체어, 유모차 등 사용 기기에 따른 차별화된 경로를 생성합니다.",
              icon: <Settings className="w-10 h-10 text-purple-500" />
            },
            {
              title: "서울 공공 데이터 연동",
              desc: "서울시의 모든 교통 및 인프라 데이터를 실시간으로 수집하여 정확도를 높였습니다.",
              icon: <Cpu className="w-10 h-10 text-green-500" />
            }
          ].map((item, idx) => (
            <div key={idx} className="group p-12 glass-card hover:scale-[1.03] transition-all duration-500 hover:ring-1 hover:ring-blue-500/50">
              <div className="mb-10 p-5 bg-white/5 rounded-3xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-500/0 group-hover:shadow-blue-500/20">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">{item.title}</h3>
              <p className="text-white/40 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 px-6 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <SeoulIcon className="w-10 h-10" />
            <span className="text-2xl font-black tracking-tighter uppercase">서울시동남보조기기센터 <span className="text-blue-500">SMART MAP</span></span>
          </div>
          <p className="text-white/30 text-base leading-relaxed mb-10 font-light">
            서울특별시동남보조기기센터는 장애인 및 노인을 위한 전문적인 보조기기 서비스를 통해 일상생활의 편의와 삶의 질 향상을 도모하는 서울특별시 지정 전문기관입니다.
          </p>
          <div className="flex gap-4">
            {[Activity, MapPin, Zap].map((Icon, i) => (
              <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer group">
                <Icon size={20} className="text-white/40 group-hover:text-white" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div>
            <h5 className="font-black mb-8 text-[11px] uppercase tracking-[0.4em] text-blue-500">Service</h5>
            <ul className="space-y-5 text-sm font-light text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">스마트 맵</li>
              <li className="hover:text-white cursor-pointer transition-colors">보조기기 대여</li>
              <li className="hover:text-white cursor-pointer transition-colors">맞춤 제작 지원</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black mb-8 text-[11px] uppercase tracking-[0.4em] text-blue-500">Center</h5>
            <ul className="space-y-5 text-sm font-light text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">센터 안내</li>
              <li className="hover:text-white cursor-pointer transition-colors">공지사항</li>
              <li className="hover:text-white cursor-pointer transition-colors">오시는 길</li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
             <h5 className="font-black mb-8 text-[11px] uppercase tracking-[0.4em] text-blue-500">Updates</h5>
             <div className="flex flex-col gap-4">
               <p className="text-[10px] text-white/20 font-light uppercase tracking-widest">새로운 소식을 받아보세요</p>
               <div className="flex gap-2">
                 <input type="text" placeholder="이메일 입력" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs w-full outline-none focus:border-blue-500 font-light" />
                 <button className="bg-blue-600 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">구독</button>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/20 uppercase tracking-[0.4em] font-medium">
        <p>© 2025 서울특별시동남보조기기센터. All rights reserved.</p>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white">
      <Navbar />
      <Hero onOpenModal={() => setIsModalOpen(true)} />
      <FeatureSection />
      <MapInterface />
      <Footer />
      
      <DistrictModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Visual background accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[200px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[200px] rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)]"></div>
      </div>
    </div>
  );
}
