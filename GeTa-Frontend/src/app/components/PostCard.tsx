import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Play } from 'lucide-react';
import { Post } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv|ogg)(\?.*)?$/i.test(url);
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLocalLikes((l) => l + 1);
      onLike(post.id);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${post.author.id}`);
  };

  // Career accent color map
  const careerAccents: Record<string, string> = {
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
  const accent = careerAccents[post.career] ?? '#FFD100';

  return (
    <div
      className="rounded-2xl transition-all duration-300 overflow-hidden group"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {/* Accent top line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-3">
          <button
            onClick={handleUserClick}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Avatar
              className="h-12 w-12 border-2"
              style={{ borderColor: `${accent}60` }}
            >
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="bg-[#003DA5] text-white">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleUserClick}
                className="font-semibold text-white hover:text-[#FFD100] transition-colors text-sm"
              >
                {post.author.name}
              </button>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: `${accent}20`,
                  color: accent,
                  border: `1px solid ${accent}40`,
                }}
              >
                {post.career}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: es })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <p
            className="whitespace-pre-wrap leading-relaxed text-sm"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {post.content}
          </p>
        </div>
      </div>

      {/* Media */}
      {post.imageUrl && (
        <div className="px-6 pb-4">
          {isVideo(post.imageUrl) ? (
            <video
              src={post.imageUrl}
              controls
              className="w-full rounded-xl object-cover max-h-96"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Play className="h-8 w-8" />
            </video>
          ) : (
            <img
              src={post.imageUrl}
              alt="Media del post"
              className="w-full rounded-xl object-cover max-h-96"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div
        className="px-6 py-3 flex items-center gap-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200"
          style={{
            color: liked ? '#f87171' : 'rgba(255,255,255,0.45)',
          }}
          onMouseEnter={(e) => {
            if (!liked)
              (e.currentTarget as HTMLElement).style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            if (!liked)
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
          }}
        >
          <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
          <span>{localLikes}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200"
          style={{ color: showComments ? '#FFD100' : 'rgba(255,255,255,0.45)' }}
          onMouseEnter={(e) => {
            if (!showComments)
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            if (!showComments)
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
          }}
        >
          <MessageCircle className="h-5 w-5" />
          <span>Comentar</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-6 pb-6">
          <CommentSection postId={post.id} externalToggle />
        </div>
      )}
    </div>
  );
};
