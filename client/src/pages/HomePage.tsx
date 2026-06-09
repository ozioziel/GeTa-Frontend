import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HomeTopbar from '../components/home/HomeTopbar';
import HomeSidebar from '../components/home/HomeSidebar';
import Feed from '../components/home/Feed';
import SearchPanel from '../components/home/SearchPanel';
import NotificationsPanel from '../components/home/NotificationsPanel';
import MessagesPanel from '../components/home/MessagesPanel';
import ExplorePanel from '../components/home/ExplorePanel';
import DashboardOverviewPanel from '../components/home/DashboardOverviewPanel';
import { getCurrentCareerId } from '../services/authService';
import type { DashboardView } from '../types/dashboard.types';
import '../styles/HomePage.css';
import '../styles/home/DashboardPanels.css';

const allowedViews = new Set<DashboardView>([
  'feed',
  'career',
  'explore',
  'search',
  'saved',
  'notifications',
  'messages',
  'profile',
]);

function getActiveView(rawView: string | null): DashboardView {
  if (rawView && allowedViews.has(rawView as DashboardView)) {
    return rawView as DashboardView;
  }

  return 'feed';
}

function HomePage() {
  const [searchParams] = useSearchParams();
  const [careerId, setCareerId] = useState('');
  const [careerError, setCareerError] = useState('');
  const [careerLoading, setCareerLoading] = useState(false);

  const activeView = getActiveView(searchParams.get('view'));
  const query = searchParams.get('q') || '';
  const composer = searchParams.get('composer') === '1';
  const selectedUserId = searchParams.get('userId') || '';
  const selectedCareerId = searchParams.get('careerId') || '';
  const featuredPostId = searchParams.get('postId') || '';
  const showOverview =
    activeView !== 'messages' && activeView !== 'notifications';

  useEffect(() => {
    if (activeView !== 'career') {
      setCareerError('');
      setCareerLoading(false);
      return;
    }

    if (selectedCareerId) {
      setCareerId(selectedCareerId);
      setCareerError('');
      setCareerLoading(false);
      return;
    }

    const loadCareerId = async () => {
      try {
        setCareerLoading(true);
        const currentCareerId = await getCurrentCareerId();
        setCareerId(currentCareerId);
        setCareerError('');
      } catch (err) {
        setCareerError(
          err instanceof Error
            ? err.message
            : 'No se pudo obtener la carrera del usuario actual.',
        );
      } finally {
        setCareerLoading(false);
      }
    };

    loadCareerId();
  }, [activeView, selectedCareerId]);

  const renderView = () => {
    if (careerError) {
      return <div className="dashboard-empty">{careerError}</div>;
    }

    switch (activeView) {
      case 'career':
        if (careerLoading || !careerId) {
          return <div className="dashboard-empty">Cargando tu comunidad academica...</div>;
        }
        return (
          <Feed
            title="Tu comunidad academica"
            subtitle="Publicaciones filtradas por la carrera del usuario autenticado."
            emptyMessage="Aun no hay publicaciones en esta carrera. Puedes abrir la conversacion con la primera."
            mode="career"
            careerId={careerId}
            showComposer
            featuredPostId={featuredPostId}
          />
        );
      case 'explore':
        return <ExplorePanel />;
      case 'search':
        return <SearchPanel initialQuery={query} />;
      case 'saved':
        return (
          <Feed
            title="Tus guardados"
            subtitle="Todo lo que decidiste conservar para volver luego."
            emptyMessage="Todavia no guardaste publicaciones."
            mode="saved"
            showComposer={false}
            featuredPostId={featuredPostId}
          />
        );
      case 'notifications':
        return <NotificationsPanel />;
      case 'messages':
        return <MessagesPanel selectedUserId={selectedUserId} />;
      case 'feed':
      default:
        return (
          <Feed
            title="Feed principal"
            subtitle="Lo que comparte tu comunidad universitaria ahora mismo."
            emptyMessage="Todavia no hay publicaciones. Se la primera persona en publicar."
            mode="all"
            showComposer
            focusComposer={composer}
            featuredPostId={featuredPostId}
          />
        );
    }
  };

  return (
    <main className="home-page">
      <div className="home-bg-circle home-bg-circle-one"></div>
      <div className="home-bg-circle home-bg-circle-two"></div>

      <HomeTopbar activeView={activeView} />
      <HomeSidebar activeView={activeView} />

      <div className={showOverview ? 'home-layout home-layout-with-side' : 'home-layout'}>
        <div className="home-main-column">{renderView()}</div>

        {showOverview && (
          <div className="home-side-column">
            <DashboardOverviewPanel activeView={activeView} />
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;
