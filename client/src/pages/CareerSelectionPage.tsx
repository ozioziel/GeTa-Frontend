import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { establishSession, registerRequest } from '../services/authService';
import { getCareers } from '../services/careerService';
import type { Career } from '../types/career.types';
import '../styles/CareerSelectionPage.css';

type RegisterData = {
  fullName: string;
  email: string;
  password: string;
};

const careerVisuals: Record<
  string,
  {
    short: string;
    description: string;
    image: string;
    className: string;
  }
> = {
  'ingenieria de sistemas': {
    short: 'IS',
    description: 'Tecnologia, software y soluciones digitales.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    className: 'career-sistemas',
  },
  'ingenieria civil': {
    short: 'IC',
    description: 'Construccion, infraestructura y diseno estructural.',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',
    className: 'career-civil',
  },
  'ingenieria industrial': {
    short: 'II',
    description: 'Procesos, produccion y optimizacion empresarial.',
    image:
      'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&w=1600&q=80',
    className: 'career-industrial',
  },
  'administracion de empresas': {
    short: 'AE',
    description: 'Gestion, liderazgo y negocios.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    className: 'career-admin',
  },
  'contaduria publica': {
    short: 'CP',
    description: 'Finanzas, auditoria y control contable.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
    className: 'career-contaduria',
  },
  derecho: {
    short: 'DR',
    description: 'Leyes, justicia y sociedad.',
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    className: 'career-derecho',
  },
  psicologia: {
    short: 'PS',
    description: 'Comportamiento humano, mente y bienestar.',
    image:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1600&q=80',
    className: 'career-psicologia',
  },
  medicina: {
    short: 'MD',
    description: 'Salud, ciencia y cuidado humano.',
    image:
      'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?auto=format&fit=crop&w=1600&q=80',
    className: 'career-medicina',
  },
  arquitectura: {
    short: 'AR',
    description: 'Diseno, espacios y creatividad urbana.',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    className: 'career-arquitectura',
  },
  'comunicacion social': {
    short: 'CS',
    description: 'Medios, informacion y expresion social.',
    image:
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=80',
    className: 'career-comunicacion',
  },
};

const defaultVisual = {
  short: 'UCB',
  description: 'Selecciona tu carrera para continuar con el registro.',
  image:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
  className: 'career-default',
};

function normalizeCareerKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getCareerVisual(career: Career | null | undefined) {
  if (!career) {
    return defaultVisual;
  }

  const key = normalizeCareerKey(career.name);

  return (
    careerVisuals[key] || {
      short: career.code || career.name.slice(0, 2).toUpperCase(),
      description: 'Carrera de la Universidad Catolica Boliviana.',
      image:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
      className: 'career-default',
    }
  );
}

function CareerSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const registerData = location.state?.registerData as RegisterData | undefined;

  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('');
  const [hoveredCareerId, setHoveredCareerId] = useState<string>('');
  const [loadingCareers, setLoadingCareers] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!registerData) {
      navigate('/register', { replace: true });
      return;
    }

    const loadCareers = async () => {
      try {
        setLoadingCareers(true);
        setError('');
        const careerList = await getCareers();
        setCareers(careerList);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrio un error al cargar las carreras',
        );
      } finally {
        setLoadingCareers(false);
      }
    };

    loadCareers();
  }, [navigate, registerData]);

  const selectedCareer = useMemo(() => {
    return careers.find((career) => career.id === selectedCareerId) || null;
  }, [careers, selectedCareerId]);

  const hoveredCareer = useMemo(() => {
    return careers.find((career) => career.id === hoveredCareerId) || null;
  }, [careers, hoveredCareerId]);

  const activeCareer = hoveredCareer || selectedCareer;
  const activeVisual = getCareerVisual(activeCareer);

  const handleRegister = async () => {
    if (!registerData || !selectedCareerId || registering) {
      return;
    }

    try {
      setRegistering(true);
      setError('');

      const authPayload = await registerRequest({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        careerId: selectedCareerId,
      });

      await establishSession(authPayload);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrio un error al registrar la cuenta',
      );
    } finally {
      setRegistering(false);
    }
  };

  return (
    <main className="career-selection-page">
      <div
        className="career-bg-image"
        style={{
          backgroundImage: `url(${activeVisual.image})`,
        }}
      ></div>

      <div className="career-bg-blur"></div>
      <div className="career-bg-overlay"></div>
      <div className="career-bg-shine"></div>

      <section className="career-selection-content">
        <div className="career-selection-header">
          <p className="career-brand">GETA - UCB</p>

          <h1 className="career-title">
            {activeCareer ? activeCareer.name : 'Elige tu carrera'}
          </h1>

          <p className="career-subtitle">{activeVisual.description}</p>
        </div>

        {error && <p className="career-error">{error}</p>}

        {loadingCareers ? (
          <div className="career-loading">Cargando carreras...</div>
        ) : (
          <>
            <div className="career-grid">
              {careers.map((career) => {
                const visual = getCareerVisual(career);
                const isSelected = selectedCareerId === career.id;

                return (
                  <button
                    key={career.id}
                    type="button"
                    className={`career-card ${visual.className} ${
                      isSelected ? 'career-card-selected' : ''
                    }`}
                    onMouseEnter={() => setHoveredCareerId(career.id)}
                    onMouseLeave={() => setHoveredCareerId('')}
                    onFocus={() => setHoveredCareerId(career.id)}
                    onBlur={() => setHoveredCareerId('')}
                    onClick={() => setSelectedCareerId(career.id)}
                    disabled={registering}
                  >
                    <div className="career-card-top-line"></div>

                    <div
                      className="career-card-image"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.45)), url(${visual.image})`,
                      }}
                    ></div>

                    <div className="career-card-body">
                      <div className="career-short">{visual.short}</div>

                      <h2>{career.name}</h2>

                      <p>{visual.description}</p>

                      <span className="career-card-action">
                        {isSelected ? 'Seleccionada' : 'Elegir carrera'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="career-continue-button"
              onClick={handleRegister}
              disabled={!selectedCareerId || registering}
            >
              {registering ? 'Creando tu acceso...' : 'Entrar a GeTa'}
            </button>
          </>
        )}

        <button
          type="button"
          className="career-back-button"
          onClick={() => navigate('/register')}
          disabled={registering}
        >
          {'<-'} Volver al registro
        </button>
      </section>
    </main>
  );
}

export default CareerSelectionPage;
