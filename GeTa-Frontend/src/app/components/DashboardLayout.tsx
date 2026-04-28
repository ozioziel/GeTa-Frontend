import React from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

const VIDEO_URL =
  'https://res.cloudinary.com/dj5kb9v78/video/upload/v1771434311/assets/intro_tu8teq.mp4';

interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedCareer?: string;
  onSelectCareer?: (career: string) => void;
  showCareerFilter?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  selectedCareer,
  onSelectCareer,
  showCareerFilter = false,
}) => {
  return (
    <div className="min-h-screen bg-[#020C1B]">
      {/* Fixed video background - very subtle */}
      <video
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        style={{ opacity: 0.06, zIndex: 0 }}
      />

      {/* Dot pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          zIndex: 0,
        }}
      />

      {/* Accent glows */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,209,0,0.04) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: 0,
          left: '256px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,61,165,0.08) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Layout content */}
      <div className="relative flex min-h-screen" style={{ zIndex: 1 }}>
        <Sidebar
          selectedCareer={selectedCareer}
          onSelectCareer={onSelectCareer}
          showCareerFilter={showCareerFilter}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
