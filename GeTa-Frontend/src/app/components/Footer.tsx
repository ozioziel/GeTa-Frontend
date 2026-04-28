import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="mt-12"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: '#FFD100' }}
            >
              <GraduationCap className="h-5 w-5 text-[#003DA5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">GeTa</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Red Social Académica
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-right">
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Universidad Católica Boliviana
            </p>
            <p
              className="text-xs flex items-center justify-center md:justify-end gap-1 mt-1"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Proyecto académico · Hecho con{' '}
              <Heart className="h-3 w-3 text-red-400 fill-current" /> por estudiantes UCB
            </p>
          </div>
        </div>

        <div
          className="mt-6 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2026 GeTa – Universidad Católica Boliviana. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
