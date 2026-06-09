import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readCachedValue } from '../../services/cache';
import { getDashboardOverview } from '../../services/dashboardService';
import type {
  DashboardOverview,
  DashboardView,
} from '../../types/dashboard.types';
import '../../styles/home/DashboardOverviewPanel.css';

type DashboardOverviewPanelProps = {
  activeView: DashboardView;
};

type MetricCard = {
  id: string;
  label: string;
  value: number;
  helper: string;
  href: string;
};

const DASHBOARD_OVERVIEW_CACHE_KEY = 'dashboard:overview';

function DashboardOverviewPanel({ activeView }: DashboardOverviewPanelProps) {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<DashboardOverview | null>(() =>
    readCachedValue<DashboardOverview>(DASHBOARD_OVERVIEW_CACHE_KEY),
  );
  const [loading, setLoading] = useState(!overview);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading((current) => current || !overview);
        setError('');
        const data = await getDashboardOverview();
        setOverview(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el resumen del dashboard.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [activeView]);

  if (loading && !overview) {
    return <aside className="dashboard-overview-shell">Cargando resumen...</aside>;
  }

  if (error && !overview) {
    return (
      <aside className="dashboard-overview-shell">
        <div className="dashboard-overview-card">
          <p className="dashboard-eyebrow">Resumen</p>
          <h3>No se pudo cargar tu panel</h3>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </aside>
    );
  }

  if (!overview) {
    return null;
  }

  const metricCards: MetricCard[] = [
    {
      id: 'my-posts',
      label: 'Publicaciones',
      value: overview.metrics.myPosts,
      helper: 'Aportes compartidos por ti',
      href: '/profile',
    },
    {
      id: 'career-posts',
      label: 'Mi carrera',
      value: overview.metrics.careerPosts,
      helper: 'Actividad dentro de tu comunidad',
      href: '/home?view=career',
    },
    {
      id: 'saved-posts',
      label: 'Guardados',
      value: overview.metrics.savedPosts,
      helper: 'Material que dejaste para revisar',
      href: '/home?view=saved',
    },
    {
      id: 'pending-items',
      label: 'Pendientes',
      value: overview.metrics.pendingItems,
      helper: 'Mensajes y alertas sin revisar',
      href:
        overview.metrics.unreadMessages > 0
          ? '/home?view=messages'
          : '/home?view=notifications',
    },
  ];

  return (
    <aside className="dashboard-overview-shell">
      <section className="dashboard-overview-hero">
        <p className="dashboard-eyebrow">Pulso personal</p>
        <h2>{overview.profile.fullName}</h2>
        <p>{overview.highlight.focusMessage}</p>

        <div className="dashboard-overview-progress">
          <div className="dashboard-overview-progress-copy">
            <span>Perfil completo</span>
            <strong>{overview.highlight.profileCompletion}%</strong>
          </div>
          <div className="dashboard-overview-progress-track">
            <div
              className="dashboard-overview-progress-value"
              style={{ width: `${overview.highlight.profileCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="dashboard-overview-meta">
          <span>{overview.profile.career?.name || 'Comunidad GeTa'}</span>
          <span>{overview.profile.campus}</span>
          <span>Score {overview.highlight.engagementScore}</span>
        </div>
      </section>

      <section className="dashboard-overview-grid">
        {metricCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="dashboard-metric-card"
            onClick={() => navigate(card.href)}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.helper}</small>
          </button>
        ))}
      </section>

      <section className="dashboard-overview-card">
        <div className="dashboard-overview-card-header">
          <div>
            <p className="dashboard-eyebrow">Comunidad</p>
            <h3>Tu red inmediata</h3>
          </div>
        </div>

        <div className="dashboard-community-grid">
          <div>
            <span>Seguidores</span>
            <strong>{overview.metrics.followers}</strong>
          </div>
          <div>
            <span>Siguiendo</span>
            <strong>{overview.metrics.following}</strong>
          </div>
          <div>
            <span>Mensajes</span>
            <strong>{overview.metrics.unreadMessages}</strong>
          </div>
          <div>
            <span>Alertas</span>
            <strong>{overview.metrics.unreadNotifications}</strong>
          </div>
        </div>
      </section>
    </aside>
  );
}

export default DashboardOverviewPanel;
