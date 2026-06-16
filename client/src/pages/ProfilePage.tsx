import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import HomeTopbar from '../components/home/HomeTopbar';
import HomeSidebar from '../components/home/HomeSidebar';
import Feed from '../components/home/Feed';
import FallbackImage from '../components/common/FallbackImage';

import {
  getCurrentUser,
} from '../services/authService';
import {
  followUser,
  getFollowStats,
  getMyFollowNetwork,
  unfollowUser,
} from '../services/followService';
import {
  getMyProfile,
  getProfileByUserId,
  updateMyProfile,
} from '../services/profileService';
import type { Profile, User } from '../types/auth.types';

import '../styles/ProfilePage.css';

type ProfileForm = {
  fullName: string;
  bio: string;
  avatarUrl: string;
};

function ProfilePage() {
  const navigate = useNavigate();
  const params = useParams();
  const routeUserId = params.userId || '';
  const currentUser = getCurrentUser();
  const isOwnProfile = !routeUserId || routeUserId === currentUser?.id;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<ProfileForm>({
    fullName: '',
    bio: '',
    avatarUrl: '',
  });
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError('');

        if (isOwnProfile) {
          const currentProfileUser = await getMyProfile();
          setUser(currentProfileUser);
          setProfile(currentProfileUser.profile || null);
          setFormData({
            fullName: currentProfileUser.profile?.fullName || '',
            bio: currentProfileUser.profile?.bio || '',
            avatarUrl: currentProfileUser.profile?.avatarUrl || '',
          });
        } else {
          const [publicProfile, stats, network] = await Promise.all([
            getProfileByUserId(routeUserId),
            getFollowStats(routeUserId),
            getMyFollowNetwork(),
          ]);

          setProfile(publicProfile);
          setUser(publicProfile.user || null);
          setFormData({
            fullName: publicProfile.fullName || '',
            bio: publicProfile.bio || '',
            avatarUrl: publicProfile.avatarUrl || '',
          });
          setFollowStats(stats);
          setIsFollowing(
            network.following.some((followedUser) => followedUser.id === routeUserId),
          );
        }

        const targetUserId = isOwnProfile
          ? currentUser?.id || ''
          : routeUserId;

        if (targetUserId) {
          const stats = await getFollowStats(targetUserId);
          setFollowStats(stats);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrio un error al cargar el perfil',
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser?.id, isOwnProfile, navigate, routeUserId]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanFullName = formData.fullName.trim();
    const cleanBio = formData.bio.trim();
    const cleanAvatarUrl = formData.avatarUrl.trim();

    setError('');
    setSuccessMessage('');

    if (!cleanFullName) {
      setError('El nombre completo no puede estar vacio');
      return;
    }

    if (cleanAvatarUrl && !cleanAvatarUrl.startsWith('http')) {
      setError('La URL del avatar debe comenzar con http o https');
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await updateMyProfile({
        fullName: cleanFullName,
        bio: cleanBio,
        avatarUrl: cleanAvatarUrl,
      });

      setUser(updatedUser);
      setProfile(updatedUser.profile || null);
      setSuccessMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrio un error al guardar el perfil',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setSaving(true);

      if (isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }

      setIsFollowing((prev) => !prev);
      setFollowStats((prev) => ({
        ...prev,
        followers: prev.followers + (isFollowing ? -1 : 1),
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo actualizar el seguimiento.',
      );
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = useMemo(
    () => formData.fullName.trim().charAt(0).toUpperCase() || 'G',
    [formData.fullName],
  );

  const profileCareerName = profile?.career?.name || 'Carrera no configurada';
  const profileUserId = user?.id || profile?.userId || currentUser?.id || '';

  return (
    <main className="profile-page">
      <div className="profile-bg-circle profile-bg-circle-one"></div>
      <div className="profile-bg-circle profile-bg-circle-two"></div>

      <HomeTopbar activeView="profile" />
      <HomeSidebar activeView="profile" />

      <section className="profile-layout">
        <div className="profile-header-card">
          <div className="profile-cover"></div>

          <div className="profile-header-content">
            <div className="profile-avatar-large">
              {formData.avatarUrl ? (
                <FallbackImage
                  src={formData.avatarUrl}
                  alt="Avatar del usuario"
                  fallback={<span>{avatarLetter}</span>}
                />
              ) : (
                <span>{avatarLetter}</span>
              )}
            </div>

            <div className="profile-title-group">
              <p className="profile-label">
                {isOwnProfile ? 'Perfil de estudiante' : 'Perfil publico'}
              </p>
              <h1>{formData.fullName || 'Mi perfil'}</h1>
              <p>
                {profileCareerName} · {profile?.campus || 'La Paz'}
              </p>
            </div>

            <div className="profile-action-group">
              {!isOwnProfile && user?.id && (
                <>
                  <button
                    type="button"
                    className="profile-secondary-button"
                    onClick={() => navigate(`/home?view=messages&userId=${user.id}`)}
                  >
                    Mensaje
                  </button>
                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={handleFollowToggle}
                    disabled={saving}
                  >
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </button>
                </>
              )}

              <button
                type="button"
                className="profile-back-button"
                onClick={() => navigate('/home?view=feed')}
              >
                Volver al Home
              </button>
            </div>
          </div>
        </div>

        <div className="profile-content-grid">
          <aside className="profile-summary-card">
            <h2>Resumen</h2>

            <div className="profile-stat-grid">
              <div className="profile-stat-card">
                <span>Seguidores</span>
                <strong>{followStats.followers}</strong>
              </div>
              <div className="profile-stat-card">
                <span>Siguiendo</span>
                <strong>{followStats.following}</strong>
              </div>
            </div>

            <div className="profile-summary-item">
              <span>Email</span>
              <p>{user?.email || 'Sin email publico'}</p>
            </div>

            <div className="profile-summary-item">
              <span>Carrera</span>
              <p>{profileCareerName}</p>
            </div>

            <div className="profile-summary-item">
              <span>Campus</span>
              <p>{profile?.campus || 'La Paz'}</p>
            </div>

            <div className="profile-summary-item">
              <span>Bio</span>
              <p>{formData.bio || 'Todavia no hay biografia cargada.'}</p>
            </div>
          </aside>

          <section className="profile-edit-card">
            <div className="profile-edit-header">
              <div>
                <p className="profile-label">
                  {isOwnProfile ? 'Configuracion' : 'Vista del perfil'}
                </p>
                <h2>{isOwnProfile ? 'Editar perfil' : 'Informacion principal'}</h2>
              </div>

              <span className="profile-status-chip">
                {saving ? 'Procesando...' : isOwnProfile ? 'Editable' : 'Publico'}
              </span>
            </div>

            {loading ? (
              <div className="profile-state">Cargando perfil...</div>
            ) : isOwnProfile ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-form-group">
                  <label htmlFor="fullName">Nombre completo</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Cuentale a otros estudiantes algo sobre ti..."
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="avatarUrl">Foto de perfil por URL</label>
                  <input
                    type="url"
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="https://..."
                  />
                  <small>
                    Por ahora usamos URL. Luego podemos conectar subida real con
                    Supabase Storage.
                  </small>
                </div>

                {error && <p className="profile-error">{error}</p>}
                {successMessage && (
                  <p className="profile-success">{successMessage}</p>
                )}

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-secondary-button"
                    onClick={() => navigate('/home?view=feed')}
                    disabled={saving}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-public-card">
                {error && <p className="profile-error">{error}</p>}
                <p>{formData.bio || 'Este estudiante todavia no agrego una bio.'}</p>
                <div className="profile-inline-actions">
                  <button
                    type="button"
                    className="profile-secondary-button"
                    onClick={() => navigate(`/home?view=messages&userId=${user?.id || ''}`)}
                  >
                    Enviar mensaje
                  </button>
                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={handleFollowToggle}
                    disabled={saving}
                  >
                    {isFollowing ? 'Dejar de seguir' : 'Seguir perfil'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {profileUserId && (
          <div className="profile-feed-section">
            <Feed
              title={isOwnProfile ? 'Tus publicaciones' : 'Actividad reciente'}
              subtitle={
                isOwnProfile
                  ? 'Tus aportes se muestran aqui con el mismo componente reutilizable del feed principal.'
                  : 'Lo ultimo que ha compartido este perfil.'
              }
              emptyMessage={
                isOwnProfile
                  ? 'Todavia no publicaste nada en tu perfil.'
                  : 'Este perfil aun no tiene publicaciones visibles.'
              }
              mode="author"
              authorId={profileUserId}
              showComposer={false}
              variant="profile"
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;
