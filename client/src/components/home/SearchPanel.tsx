import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll } from '../../services/searchService';
import { followUser, unfollowUser } from '../../services/followService';
import type { DashboardUser, SearchResults } from '../../types/social.types';
import type { Post } from '../../types/post.types';
import PostCard from './PostCard';
import '../../styles/home/DashboardPanels.css';

type SearchPanelProps = {
  initialQuery?: string;
};

function SearchPanel({ initialQuery = '' }: SearchPanelProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyUserId, setBusyUserId] = useState('');

  const runSearch = async (value: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await searchAll(value);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo buscar en GeTa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery(initialQuery);
    runSearch(initialQuery);
  }, [initialQuery]);

  const handleFollowToggle = async (user: DashboardUser) => {
    if (!user.id) {
      return;
    }

    try {
      setBusyUserId(user.id);

      if (user.isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }

      setResults((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.map((item) =>
                item.id === user.id
                  ? { ...item, isFollowing: !item.isFollowing }
                  : item,
              ),
            }
          : prev,
      );
    } finally {
      setBusyUserId('');
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setResults((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts.map((post) =>
              post.id === updatedPost.id ? updatedPost : post,
            ),
          }
        : prev,
    );
  };

  const handlePostDeleted = (postId: string) => {
    setResults((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts.filter((post) => post.id !== postId),
          }
        : prev,
    );
  };

  return (
    <section className="dashboard-panel-stack">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <p className="dashboard-eyebrow">Busqueda</p>
            <h2>Encuentra personas, carreras y publicaciones</h2>
          </div>
        </div>

        <form
          className="dashboard-search-form"
          onSubmit={(event) => {
            event.preventDefault();
            runSearch(query);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca estudiantes, carreras o temas..."
          />
          <button type="submit">Buscar</button>
        </form>

        {error && <p className="dashboard-error">{error}</p>}
        {loading && <div className="dashboard-empty">Buscando resultados...</div>}

        {!loading && results && (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <p className="dashboard-eyebrow">Usuarios</p>
                  <h3>{results.users.length} perfiles encontrados</h3>
                </div>
              </div>

              {results.users.length === 0 ? (
                <div className="dashboard-empty">No se encontraron estudiantes para esa búsqueda.</div>
              ) : (
                <div className="dashboard-user-list">
                  {results.users.map((user) => (
                    <article key={user.id} className="dashboard-user-card">
                      <div>
                        <h4>{user.profile?.fullName || user.email}</h4>
                        <p>{user.profile?.career?.name || 'Comunidad GeTa'}</p>
                        {user.profile?.bio && <small>{user.profile.bio}</small>}
                      </div>

                      <div className="dashboard-inline-actions">
                        <button
                          type="button"
                          onClick={() => navigate(`/profile/${user.id}`)}
                        >
                          Perfil
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/home?view=messages&userId=${user.id}`)
                          }
                        >
                          Mensaje
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
              )}
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div>
                  <p className="dashboard-eyebrow">Carreras</p>
                  <h3>Coincidencias académicas</h3>
                </div>
              </div>

              {results.careers.length === 0 ? (
                <div className="dashboard-empty">No hay carreras relacionadas con ese término.</div>
              ) : (
                <div className="dashboard-chip-grid">
                  {results.careers.map((career) => (
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
              )}
            </div>
          </div>
        )}

        {!loading && results && (
          <div className="dashboard-posts">
            <div className="dashboard-card-header">
              <div>
                <p className="dashboard-eyebrow">Publicaciones</p>
                <h3>Lo que se está hablando ahora</h3>
              </div>
            </div>

            {results.posts.length === 0 ? (
              <div className="dashboard-empty">No hay publicaciones que coincidan todavía.</div>
            ) : (
              <div className="feed-posts">
                {results.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchPanel;
