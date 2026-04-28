import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, Mail, Lock, User, ArrowRight, ArrowLeft, Check,
  Code2, Settings, Scale, Activity, Briefcase, Building2, Brain,
  Radio, Calculator, HardHat,
} from 'lucide-react';
import { careerService } from '../services/api';
import { Career } from '../types';
import { cn } from '../components/ui/utils';

type CareerMeta = {
  Icon: React.ElementType;
  gradient: string;
  bg: string;
  description: string;
  accent: string;
};

const CAREER_META: Record<string, CareerMeta> = {
  'Ingeniería de Sistemas': {
    Icon: Code2,
    gradient: 'from-blue-600 to-cyan-500',
    bg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop',
    description: 'Software e innovación digital',
    accent: '#0ea5e9',
  },
  'Ingeniería Industrial': {
    Icon: Settings,
    gradient: 'from-orange-500 to-amber-400',
    bg: 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=1920&h=1080&fit=crop',
    description: 'Optimización y procesos',
    accent: '#f97316',
  },
  'Derecho': {
    Icon: Scale,
    gradient: 'from-purple-600 to-violet-500',
    bg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&h=1080&fit=crop',
    description: 'Justicia y legislación',
    accent: '#8b5cf6',
  },
  'Medicina': {
    Icon: Activity,
    gradient: 'from-red-500 to-rose-400',
    bg: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=1920&h=1080&fit=crop',
    description: 'Salud y vida humana',
    accent: '#ef4444',
  },
  'Administración de Empresas': {
    Icon: Briefcase,
    gradient: 'from-emerald-600 to-green-500',
    bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop',
    description: 'Liderazgo y gestión',
    accent: '#10b981',
  },
  'Arquitectura': {
    Icon: Building2,
    gradient: 'from-stone-500 to-amber-600',
    bg: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&h=1080&fit=crop',
    description: 'Diseño y construcción',
    accent: '#d97706',
  },
  'Psicología': {
    Icon: Brain,
    gradient: 'from-pink-500 to-fuchsia-500',
    bg: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&h=1080&fit=crop',
    description: 'Mente y comportamiento',
    accent: '#ec4899',
  },
  'Comunicación Social': {
    Icon: Radio,
    gradient: 'from-yellow-500 to-orange-500',
    bg: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop',
    description: 'Medios e información',
    accent: '#eab308',
  },
  'Contaduría Pública': {
    Icon: Calculator,
    gradient: 'from-teal-600 to-cyan-500',
    bg: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop',
    description: 'Finanzas y auditoría',
    accent: '#14b8a6',
  },
  'Ingeniería Civil': {
    Icon: HardHat,
    gradient: 'from-slate-600 to-zinc-500',
    bg: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop',
    description: 'Infraestructura y obras',
    accent: '#64748b',
  },
};

const FALLBACK_META = CAREER_META['Ingeniería de Sistemas'];

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState('');
  const [hoveredCareer, setHoveredCareer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    careerService.getCareers().then(setCareers).catch(() => {});
  }, []);

  useEffect(() => {
    if (step === 2 && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [step]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCareerSelect = async (career: Career) => {
    if (loading) return;
    setSelectedCareerId(career.id);
    try {
      setLoading(true);
      await register(name, email, password, career.id);
      navigate('/');
    } catch {
      setSelectedCareerId('');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  /* ───────── STEP 1 ───────── */
  if (step === 1) {
    const inputStyle = {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'white',
    };
    return (
      <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center p-4">
        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ opacity: 0.45 }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent" />

        {/* Accent glows */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, right: 0, width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(255,209,0,0.06) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0, left: 0, width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(0,61,165,0.1) 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)',
          }}
        />

        {/* Card */}
        <div className="relative z-10 w-full max-w-md">
          <div
            className="relative rounded-2xl p-8 shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,209,0,0.6), transparent)' }}
            />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: '#FFD100', boxShadow: '0 0 30px rgba(255,209,0,0.4)' }}
                >
                  <GraduationCap className="h-7 w-7 text-[#003DA5]" />
                </div>
                <span
                  className="font-light tracking-widest text-sm uppercase"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  GeTa · UCB
                </span>
              </div>
              <h1
                className="text-5xl font-black tracking-tight mb-2"
                style={{ color: '#FFD100', textShadow: '0 0 40px rgba(255,209,0,0.4)' }}
              >
                GeTa
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)' }}>
                Únete a la comunidad académica UCB
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleStep1} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <User className="h-4 w-4 text-[#FFD100]" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="María González"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255,209,0,0.5)';
                    (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <Mail className="h-4 w-4 text-[#FFD100]" />
                  Correo Institucional
                </label>
                <input
                  type="email"
                  placeholder="tu.nombre@ucb.edu.bo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255,209,0,0.5)';
                    (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                />
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Debe ser un correo @ucb.edu.bo
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <Lock className="h-4 w-4 text-[#FFD100]" />
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255,209,0,0.5)';
                    (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 mt-2 group"
                style={{
                  background: '#FFD100',
                  color: '#003DA5',
                  boxShadow: '0 0 25px rgba(255,209,0,0.3)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#FFDB33';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 35px rgba(255,209,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#FFD100';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 25px rgba(255,209,0,0.3)';
                }}
              >
                Continuar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="font-semibold inline-flex items-center gap-1 group transition-colors"
                  style={{ color: '#FFD100' }}
                >
                  Inicia sesión
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───────── STEP 2: EPIC CAREER SELECTOR ───────── */
  const hoveredMeta = hoveredCareer ? (CAREER_META[hoveredCareer] ?? FALLBACK_META) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">

      {/* ── Video base ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{ opacity: hoveredCareer ? 0.25 : 0.55, transition: 'opacity 700ms' }}
      />

      {/* ── Career epic image overlays ── */}
      {Object.entries(CAREER_META).map(([careerName, meta]) => (
        <div
          key={careerName}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${meta.bg})`,
            opacity: hoveredCareer === careerName ? 0.6 : 0,
            transition: 'opacity 600ms ease',
          }}
        />
      ))}

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-black/55" style={{ transition: 'background 600ms' }} />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />

      {/* Accent glow for hovered career */}
      {hoveredMeta && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${hoveredMeta.accent}30 0%, transparent 70%)`,
          }}
        />
      )}

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">

        {/* Logo + heading */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-[#FFD100] p-2.5 rounded-xl shadow-2xl shadow-yellow-500/30">
              <GraduationCap className="h-7 w-7 text-[#003DA5]" />
            </div>
            <span className="text-white/50 font-light tracking-widest text-sm uppercase">GeTa · UCB</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-black tracking-tight mb-3 transition-all duration-500"
            style={{ color: hoveredMeta ? hoveredMeta.accent : '#FFD100', textShadow: hoveredMeta ? `0 0 60px ${hoveredMeta.accent}80` : '0 0 40px rgba(255,209,0,0.4)' }}
          >
            {hoveredCareer
              ? hoveredCareer.replace('Ingeniería de ', 'Ing. ').replace('Administración de Empresas', 'Administración')
              : 'Elige tu Carrera'}
          </h1>

          <p className="text-white/60 text-lg transition-all duration-300">
            {hoveredCareer
              ? (CAREER_META[hoveredCareer]?.description ?? '')
              : 'Pasa el mouse sobre una carrera para explorarla'}
          </p>
        </div>

        {/* Career grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-5xl w-full">
          {careers.map((career) => {
            const meta = CAREER_META[career.name] ?? FALLBACK_META;
            const { Icon } = meta;
            const isSelected = selectedCareerId === career.id;
            const isHovered = hoveredCareer === career.name;
            const isLoadingThis = loading && isSelected;
            const isDimmed = hoveredCareer !== null && !isHovered && !isSelected;

            return (
              <button
                key={career.id}
                onClick={() => handleCareerSelect(career)}
                onMouseEnter={() => setHoveredCareer(career.name)}
                onMouseLeave={() => setHoveredCareer(null)}
                disabled={loading}
                className={cn(
                  'relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 group',
                  'backdrop-blur-md focus:outline-none',
                  isSelected
                    ? 'border-[#FFD100] bg-white/25 shadow-[0_0_40px_rgba(255,209,0,0.45)] scale-105'
                    : isHovered
                    ? 'border-white/80 bg-white/20 scale-108 shadow-2xl'
                    : isDimmed
                    ? 'border-white/10 bg-white/5 opacity-50 scale-95'
                    : 'border-white/20 bg-white/10 hover:border-white/60'
                )}
                style={
                  isHovered
                    ? { borderColor: meta.accent, boxShadow: `0 0 30px ${meta.accent}60` }
                    : isSelected
                    ? { borderColor: '#FFD100', boxShadow: '0 0 40px rgba(255,209,0,0.45)' }
                    : {}
                }
              >
                {/* Icon */}
                <div
                  className={cn(
                    'p-3 rounded-xl bg-gradient-to-br transition-all duration-300 shadow-lg',
                    meta.gradient,
                    'group-hover:scale-110 group-hover:shadow-xl'
                  )}
                >
                  {isLoadingThis ? (
                    <div className="h-7 w-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                  )}
                </div>

                {/* Name + description */}
                <div className="text-center">
                  <p className="text-white font-semibold text-sm leading-tight">{career.name}</p>
                  <p className="text-white/50 text-xs mt-0.5 group-hover:text-white/80 transition-colors">
                    {meta.description}
                  </p>
                </div>

                {/* Selection checkmark */}
                {isSelected && !isLoadingThis && (
                  <div className="absolute -top-2 -right-2 bg-[#FFD100] rounded-full p-1 shadow-lg">
                    <Check className="h-3 w-3 text-[#003DA5]" strokeWidth={3} />
                  </div>
                )}

                {/* Hover bottom glow line */}
                {isHovered && (
                  <div
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ background: meta.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Back */}
        <button
          onClick={() => setStep(1)}
          disabled={loading}
          className="mt-10 flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm disabled:pointer-events-none"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al registro
        </button>
      </div>
    </div>
  );
};
