import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import { CreatePostDialog } from '../components/CreatePostDialog';
import { DashboardLayout } from '../components/DashboardLayout';
import { Navbar } from '../components/Navbar';
import { Post } from '../types';
import { postService } from '../services/api';
import { Loader2, TrendingUp, Heart, BookOpen } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCareer, setSelectedCareer] = useState('Todas las Carreras');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.selectedCareer) {
      setSelectedCareer(location.state.selectedCareer);
    }
  }, [location]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const filteredPosts =
    selectedCareer === 'Todas las Carreras'
      ? posts
      : posts.filter((post) => post.career === selectedCareer);

  return (
    <DashboardLayout
      selectedCareer={selectedCareer}
      onSelectCareer={setSelectedCareer}
      showCareerFilter={true}
    >
      <Navbar />

      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome banner */}
          <div
            className="rounded-2xl p-6 mb-8"
            style={{
              background: 'rgba(0,61,165,0.2)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,61,165,0.4)',
              boxShadow: '0 0 40px rgba(0,61,165,0.15)',
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  ¡Bienvenido/a,{' '}
                  <span style={{ color: '#FFD100' }}>{user?.name?.split(' ')[0]}</span>!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Comparte ideas, proyectos y experiencias con la comunidad UCB
                </p>
              </div>
              <div
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  background: 'rgba(255,209,0,0.1)',
                  border: '1px solid rgba(255,209,0,0.2)',
                }}
              >
                <BookOpen className="h-4 w-4 text-[#FFD100]" />
                <span className="text-sm font-medium" style={{ color: '#FFD100' }}>
                  {user?.career}
                </span>
              </div>
            </div>
          </div>

          {/* Create post button */}
          <div className="mb-8">
            <CreatePostDialog onPostCreated={handlePostCreated} />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: TrendingUp,
                label: 'Publicaciones',
                value: filteredPosts.length,
              },
              {
                icon: Heart,
                label: 'Me Gusta',
                value: filteredPosts.reduce((sum, p) => sum + p.likes, 0),
              },
              {
                icon: BookOpen,
                label: 'Mi Carrera',
                value: user?.career ?? '—',
                small: true,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl"
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
                  <stat.icon className="h-4 w-4 text-[#FFD100]" />
                  <span>{stat.label}</span>
                </div>
                <p
                  className={`font-bold ${stat.small ? 'text-sm' : 'text-2xl'} text-white truncate`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Posts */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2
                  className="h-12 w-12 animate-spin mx-auto mb-4"
                  style={{ color: '#FFD100' }}
                />
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Cargando publicaciones...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-white font-semibold text-lg mb-2">
                No hay publicaciones aún
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-sm">
                {selectedCareer !== 'Todas las Carreras'
                  ? 'No hay publicaciones en esta carrera'
                  : '¡Sé el primero en publicar!'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
