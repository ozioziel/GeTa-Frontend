import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HomeTopbar from '../components/home/HomeTopbar';
import HomeSidebar from '../components/home/HomeSidebar';

import { isAuthenticated } from '../services/authService';
import { getMyProfile, updateMyProfile } from '../services/profileService';
import type { User } from '../types/auth.types';

import '../styles/ProfilePage.css';

type ProfileForm = {
  fullName: string;
  bio: string;
  avatarUrl: string;
};

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<ProfileForm>({
    fullName: '',
    bio: '',
    avatarUrl: '',
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const currentUser = await getMyProfile();

        setUser(currentUser);

        setFormData({
          fullName: currentUser.profile?.fullName || '',
          bio: currentUser.profile?.bio || '',
          avatarUrl: currentUser.profile?.avatarUrl || '',
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al cargar el perfil',
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

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
      setError('El nombre completo no puede estar vacío');
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
      setSuccessMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al guardar el perfil',
      );
    } finally {
      setSaving(false);
    }
  };

  const profile = user?.profile;
  const avatarLetter = formData.fullName.trim().charAt(0).toUpperCase() || 'G';

  return (
    <main className="profile-page">
      <div className="profile-bg-circle profile-bg-circle-one"></div>
      <div className="profile-bg-circle profile-bg-circle-two"></div>

      <HomeTopbar />
      <HomeSidebar />

      <section className="profile-layout">
        <div className="profile-header-card">
          <div className="profile-cover"></div>

          <div className="profile-header-content">
            <div className="profile-avatar-large">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar del usuario" />
              ) : (
                <span>{avatarLetter}</span>
              )}
            </div>

            <div className="profile-title-group">
              <p className="profile-label">Perfil de estudiante</p>
              <h1>{formData.fullName || 'Mi perfil'}</h1>
              <p>
                {profile?.career?.name || 'Carrera no configurada'} ·{' '}
                {profile?.campus || 'La Paz'}
              </p>
            </div>

            <button
              type="button"
              className="profile-back-button"
              onClick={() => navigate('/home')}
            >
              Volver al Home
            </button>
          </div>
        </div>

        <div className="profile-content-grid">
          <aside className="profile-summary-card">
            <h2>Resumen</h2>

            <div className="profile-summary-item">
              <span>Email</span>
              <p>{user?.email || 'Sin email'}</p>
            </div>

            <div className="profile-summary-item">
              <span>Carrera</span>
              <p>{profile?.career?.name || 'Sin carrera'}</p>
            </div>

            <div className="profile-summary-item">
              <span>Campus</span>
              <p>{profile?.campus || 'La Paz'}</p>
            </div>

            <div className="profile-summary-item">
              <span>Rol</span>
              <p>{user?.role || 'student'}</p>
            </div>
          </aside>

          <section className="profile-edit-card">
            <div className="profile-edit-header">
              <div>
                <p className="profile-label">Configuración</p>
                <h2>Editar perfil</h2>
              </div>

              <span className="profile-status-chip">
                {saving ? 'Guardando...' : 'Editable'}
              </span>
            </div>

            {loading ? (
              <div className="profile-state">Cargando perfil...</div>
            ) : (
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
                    placeholder="Cuéntale a otros estudiantes algo sobre ti..."
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
                    Por ahora usaremos URL. Luego podemos conectar subida real
                    de imagen con Supabase Storage.
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
                    onClick={() => navigate('/home')}
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
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;