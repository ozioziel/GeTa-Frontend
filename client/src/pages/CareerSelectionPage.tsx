import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/CareerSelectionPage.css';

type RegisterData = {
  fullName: string;
  email: string;
  password: string;
};

type Career = {
  id: string;
  name: string;
  code?: string;
};

const API_URL = 'http://localhost:3000/api';

const careerVisuals: Record<
  string,
  {
    short: string;
    description: string;
    image: string;
    className: string;
  }
> = {
  'Ingeniería de Sistemas': {
    short: 'IS',
    description: 'Tecnología, software y soluciones digitales.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    className: 'career-sistemas',
  },
  'Ingeniería Civil': {
    short: 'IC',
    description: 'Construcción, infraestructura y diseño estructural.',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',
    className: 'career-civil',
  },
  'Ingeniería Industrial': {
    short: 'II',
    description: 'Procesos, producción y optimización empresarial.',
    image:
      'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&w=1600&q=80',
    className: 'career-industrial',
  },
  'Administración de Empresas': {
    short: 'AE',
    description: 'Gestión, liderazgo y negocios.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    className: 'career-admin',
  },
  'Contaduría Pública': {
    short: 'CP',
    description: 'Finanzas, auditoría y control contable.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
    className: 'career-contaduria',
  },
  Derecho: {
    short: 'DR',
    description: 'Leyes, justicia y sociedad.',
    image:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    className: 'career-derecho',
  },
  Psicología: {
    short: 'PS',
    description: 'Comportamiento humano, mente y bienestar.',
    image:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1600&q=80',
    className: 'career-psicologia',
  },
  Medicina: {
    short: 'MD',
    description: 'Salud, ciencia y cuidado humano.',
    image:
      'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?auto=format&fit=crop&w=1600&q=80',
    className: 'career-medicina',
  },
  Arquitectura: {
    short: 'AR',
    description: 'Diseño, espacios y creatividad urbana.',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    className: 'career-arquitectura',
  },
  'Comunicación Social': {
    short: 'CS',
    description: 'Medios, información y expresión social.',
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

function getCareerVisual(career: Career | null | undefined) {
  if (!career) return defaultVisual;

  return (
    careerVisuals[career.name] || {
      short: career.code || career.name.slice(0, 2).toUpperCase(),
      description: 'Carrera de la Universidad Católica Boliviana.',
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

        const response = await fetch(`${API_URL}/careers`);

        if (!response.ok) {
          throw new Error('No se pudieron cargar las carreras');
        }

        const data = await response.json();

        const careerList = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.careers)
          ? data.careers
          : [];

        const normalizedCareers: Career[] = careerList
          .map((career: any) => ({
            id: career.id || career.careerId || career.CareerID || '',
            name:
              career.name ||
              career.careerName ||
              career.CareerName ||
              career.nombre ||
              '',
            code: career.code || career.Code || '',
          }))
          .filter((career: Career) => career.id && career.name);

        setCareers(normalizedCareers);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al cargar las carreras'
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
    if (!registerData || !selectedCareerId || registering) return;

    try {
      setRegistering(true);
      setError('');

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: registerData.fullName,
          email: registerData.email,
          password: registerData.password,
          careerId: selectedCareerId,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo registrar la cuenta');
      }

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      if (data.token) {
        localStorage.setItem('accessToken', data.token);
      }

      navigate('/login', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al registrar la cuenta'
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

          <p className="career-subtitle">
            {activeVisual.description}
          </p>
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
              {registering ? 'Registrando...' : 'Continuar'}
            </button>
          </>
        )}

        <button
          type="button"
          className="career-back-button"
          onClick={() => navigate('/register')}
          disabled={registering}
        >
          ← Volver al registro
        </button>
      </section>
    </main>
  );
}

export default CareerSelectionPage;