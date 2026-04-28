import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const VIDEO_URL =
  'https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center p-4">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
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
          top: 0,
          left: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,209,0,0.06) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,61,165,0.1) 0%, transparent 70%)',
          transform: 'translate(30%, 30%)',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-2xl p-8 shadow-2xl"
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
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,209,0,0.6), transparent)',
            }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: '#FFD100',
                  boxShadow: '0 0 30px rgba(255,209,0,0.4)',
                }}
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
              style={{
                color: '#FFD100',
                textShadow: '0 0 40px rgba(255,209,0,0.4)',
              }}
            >
              GeTa
            </h1>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Red Social Académica UCB
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                disabled={loading}
                className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200 disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                }}
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

            {/* Password */}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200 disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                }}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 mt-2 group"
              style={{
                background: '#FFD100',
                color: '#003DA5',
                boxShadow: '0 0 25px rgba(255,209,0,0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLElement).style.background = '#FFDB33';
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 35px rgba(255,209,0,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FFD100';
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 25px rgba(255,209,0,0.3)';
              }}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-semibold inline-flex items-center gap-1 group transition-colors"
                style={{ color: '#FFD100' }}
              >
                Regístrate aquí
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </p>
          </div>

          {/* Test credentials */}
          <div
            className="mt-5 p-4 rounded-xl"
            style={{
              background: 'rgba(255,209,0,0.06)',
              border: '1px solid rgba(255,209,0,0.15)',
            }}
          >
            <div className="flex items-start gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#FFD100' }}
              >
                <span className="text-[10px] text-[#003DA5] font-bold">!</span>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: '#FFD100' }}>
                  Credenciales de prueba
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span className="font-medium text-white/70">Email:</span>{' '}
                  maria.gonzalez@ucb.edu.bo
                  <br />
                  <span className="font-medium text-white/70">Contraseña:</span> cualquiera
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
