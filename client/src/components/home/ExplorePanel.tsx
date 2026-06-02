import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCareers } from '../../services/careerService';
import {
  followUser,
  getFollowSuggestions,
  unfollowUser,
} from '../../services/followService';
import { searchAll } from '../../services/searchService';
import type { Career } from '../../types/career.types';
import type { Post } from '../../types/post.types';
import type { DashboardUser } from '../../types/social.types';
import PostCard from './PostCard';
import '../../styles/home/DashboardPanels.css';

function ExplorePanel() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyUserId, setBusyUserId] = useState('');

  useEffect(() => {
    const loadExplore = async () => {
      try {
        setLoading(true);
        setError('');

        const [careerData, userData, searchData] = await Promise.all([
          getCareers(),
          getFollowSuggestions(),
          searchAll(''),
        ]);

        setCareers(careerData);
        setUsers(userData);
        setPosts(searchData.posts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar la vista de exploración.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadExplore();
  }, []);

  const handleFollowToggle = async (user: DashboardUser) => {
    try {
      setBusyUserId(user.id);

      if (user.isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, isFollowing: !item.isFollowing } : item,
        ),
      );
    } finally {
      setBusyUserId('');
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  if (loading) {
    return <div className="dashboard-empty">Cargando descubrimientos...</div>;
  }

  return (
    <section className="dashboard-panel-stack">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <p className="dashboard-eyebrow">Explorar</p>
            <h2>Descubre gente, carreras y conversaciones activas</h2>
          </div>
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <p className="dashboard-eyebrow">Carreras</p>
                <h3>Explora comunidades</h3>
              </div>
            </div>

            <div className="dashboard-chip-grid">
              {careers.map((career) => (
                <button
                  key={career.id}
                  type="button"
                  className="dashboard-chip"
                  onClick={() => navigate(`/home?view=career&careerId=${career.id}`)}
                >
                  <strong>{career.code || 'UCB'}</strong>
                  <span>{career.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <p className="dashboard-eyebrow">Sugeridos</p>
                <h3>Estudiantes que podrías seguir</h3>
              </div>
            </div>

            <div className="dashboard-user-list">
              {users.map((user) => (
                <article key={user.id} className="dashboard-user-card">
                  <div>
                    <h4>{user.profile?.fullName || user.email}</h4>
                    <p>{user.profile?.career?.name || 'Comunidad GeTa'}</p>
                    {user.profile?.bio && <small>{user.profile.bio}</small>}
                  </div>
                  <div className="dashboard-inline-actions">
                    <button type="button" onClick={() => navigate(`/profile/${user.id}`)}>
                      Perfil
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFollowToggle(user)}
                      disabled={busyUserId === user.id}
                    >
                      {user.isFollowing ? 'Siguiendo' : 'Seguir'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-posts">
          <div className="dashboard-card-header">
            <div>
              <p className="dashboard-eyebrow">Tendencias del feed</p>
              <h3>Publicaciones destacadas</h3>
            </div>
          </div>

          <div className="feed-posts">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExplorePanel;
