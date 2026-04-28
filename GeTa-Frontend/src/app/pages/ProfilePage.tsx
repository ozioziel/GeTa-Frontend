import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { PostCard } from '../components/PostCard';
import { DashboardLayout } from '../components/DashboardLayout';
import { Navbar } from '../components/Navbar';
import { Post, User } from '../types';
import { postService, profileService } from '../services/api';
import {
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Settings,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Heart,
} from 'lucide-react';

// Career accent colors
const CAREER_ACCENTS: Record<string, string> = {
  'Ingeniería de Sistemas': '#0ea5e9',
  'Ingeniería Industrial': '#f97316',
  Derecho: '#8b5cf6',
  Medicina: '#ef4444',
  'Administración de Empresas': '#10b981',
  Arquitectura: '#d97706',
  Psicología: '#ec4899',
  'Comunicación Social': '#eab308',
  'Contaduría Pública': '#14b8a6',
  'Ingeniería Civil': '#64748b',
};

export const ProfilePage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    loadProfileData();
  }, [id, currentUser]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      let userToShow: User | null = null;

      if (isOwnProfile) {
        userToShow = currentUser;
      } else {
        userToShow = await profileService.getProfile(id!);
      }

      setProfileUser(userToShow);

      if (userToShow) {
        const posts = await postService.getPostsByAuthor(userToShow.id);
        setUserPosts(posts);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setProfileUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    setUserPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <DashboardLayout>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2
              className="h-12 w-12 animate-spin mx-auto mb-4"
              style={{ color: '#FFD100' }}
            />
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Cargando perfil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileUser) {
    return (
      <DashboardLayout>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Usuario no encontrado</h2>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl font-semibold transition-all"
              style={{ background: '#FFD100', color: '#003DA5' }}
            >
              Volver al Feed
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const accent = CAREER_ACCENTS[profileUser.career] ?? '#FFD100';

  return (
    <DashboardLayout>
      <Navbar />

      <div>
        {/* Cover section */}
        <div
          className="relative h-56"
          style={{
            background: `linear-gradient(135deg, #000D24 0%, ${accent}30 50%, #000D24 100%)`,
          }}
        >
          {/* Cover pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Accent glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 80% at 50% 100%, ${accent}20 0%, transparent 70%)`,
            }}
          />

          {/* Back button */}
          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Feed
            </button>
          </div>

          {/* Edit profile button */}
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: '#FFD100',
                  color: '#003DA5',
                  boxShadow: '0 0 20px rgba(255,209,0,0.3)',
                }}
              >
                <Settings className="h-4 w-4" />
                Editar Perfil
              </button>
            </div>
          )}
        </div>

        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Avatar & Info */}
            <div className="relative -mt-20 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar
                    className="h-40 w-40 border-4"
                    style={{
                      borderColor: accent,
                      boxShadow: `0 0 30px ${accent}50`,
                    }}
                  >
                    <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                    <AvatarFallback className="bg-[#003DA5] text-white text-4xl">
                      {getInitials(profileUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div
                    className="absolute bottom-3 right-3 h-4 w-4 rounded-full border-2"
                    style={{
                      background: accent,
                      borderColor: '#020C1B',
                      boxShadow: `0 0 8px ${accent}`,
                    }}
                  />
                </div>

                {/* Profile info card */}
                <div
                  className="flex-1 p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">
                        {profileUser.name}
                      </h1>
                      <span
                        className="text-sm px-3 py-1 rounded-full font-semibold"
                        style={{
                          background: `${accent}20`,
                          color: accent,
                          border: `1px solid ${accent}40`,
                        }}
                      >
                        {profileUser.career}
                      </span>
                    </div>
                  </div>

                  {profileUser.bio && (
                    <p
                      className="mb-4 text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      {profileUser.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Mail className="h-4 w-4 text-[#FFD100]" />
                      <span>{profileUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <GraduationCap className="h-4 w-4 text-[#FFD100]" />
                      <span>Universidad Católica Boliviana</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Calendar className="h-4 w-4 text-[#FFD100]" />
                      <span>Miembro desde 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: TrendingUp,
                  label: 'Publicaciones',
                  value: userPosts.length,
                },
                {
                  icon: Heart,
                  label: 'Me Gusta Recibidos',
                  value: userPosts.reduce((sum, post) => sum + post.likes, 0),
                },
                {
                  icon: BookOpen,
                  label: 'Carrera',
                  value: profileUser.career,
                  small: true,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-sm mb-2"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    <stat.icon className="h-4 w-4" style={{ color: accent }} />
                    <span>{stat.label}</span>
                  </div>
                  <p
                    className={`font-bold text-white ${stat.small ? 'text-sm' : 'text-3xl'} truncate`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Posts section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {isOwnProfile
                  ? 'Mis Publicaciones'
                  : `Publicaciones de ${profileUser.name.split(' ')[0]}`}
              </h2>

              {userPosts.length === 0 ? (
                <div
                  className="text-center py-20 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="text-white font-medium text-lg">
                    {isOwnProfile
                      ? 'Aún no has publicado nada'
                      : `${profileUser.name.split(' ')[0]} no ha publicado nada aún`}
                  </p>
                  {isOwnProfile && (
                    <p
                      className="text-sm mt-2"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      ¡Comparte algo con la comunidad UCB!
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {userPosts.map((post) => (
                    <PostCard key={post.id} post={post} onLike={handleLike} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
