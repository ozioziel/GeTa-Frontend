import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send } from 'lucide-react';
import { Comment } from '../types';
import { commentService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CommentSectionProps {
  postId: string;
  externalToggle?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  externalToggle = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  // When used with externalToggle, always show
  const isVisible = externalToggle || showComments;

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(postId);
      setComments(data);
    } catch {
      // Silently fail
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setLoading(true);
      const comment = await commentService.createComment(postId, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment('');
      if (!externalToggle) setShowComments(true);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-3">
      {/* Toggle (only when not externally controlled) */}
      {!externalToggle && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm transition-colors flex items-center gap-2"
          style={{ color: showComments ? '#FFD100' : 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = showComments
              ? '#FFD100'
              : 'rgba(255,255,255,0.4)';
          }}
        >
          {showComments ? 'Ocultar' : 'Ver'} comentarios ({comments.length})
        </button>
      )}

      {/* Comment list */}
      {isVisible && (
        <div className="space-y-3 pl-1">
          {comments.length === 0 ? (
            <p
              className="text-sm italic py-2"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              No hay comentarios aún. ¡Sé el primero!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <button
                  onClick={() => navigate(`/profile/${comment.author.id}`)}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.author.avatar}
                      alt={comment.author.name}
                    />
                    <AvatarFallback className="bg-[#003DA5] text-white text-xs">
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/profile/${comment.author.id}`)}
                    className="font-medium text-sm transition-colors"
                    style={{ color: '#FFD100' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        'rgba(255,209,0,0.7)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#FFD100';
                    }}
                  >
                    {comment.author.name}
                  </button>
                  <p
                    className="text-sm mt-1 break-words"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    {comment.content}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* New comment form */}
      {isVisible && (
        <form onSubmit={handleSubmit} className="flex gap-3 pt-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-[#003DA5] text-white text-xs">
              {user ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              disabled={loading}
              className="flex-1 rounded-xl px-3 py-2 text-sm resize-none outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
              }}
              onFocus={(e) => {
                (e.target as HTMLTextAreaElement).style.borderColor =
                  'rgba(255,209,0,0.4)';
              }}
              onBlur={(e) => {
                (e.target as HTMLTextAreaElement).style.borderColor =
                  'rgba(255,255,255,0.1)';
              }}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="self-end h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 disabled:opacity-40"
              style={{ background: '#FFD100' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FFDB33';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FFD100';
              }}
            >
              <Send className="h-4 w-4 text-[#003DA5]" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
