import { useEffect, useState } from 'react';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import {
  createComment,
  getCommentsByPost,
} from '../../services/commentService';
import type { Comment, Post } from '../../types/post.types';
import '../../styles/home/PostCard.css';

type PostCardProps = {
  post: Post;
};

function formatDate(date: string) {
  const value = new Date(date);

  return value.toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function PostCard({ post }: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [creatingComment, setCreatingComment] = useState<boolean>(false);
  const [commentError, setCommentError] = useState<string>('');

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoadingComments(true);
        setCommentError('');

        const commentsFromApi = await getCommentsByPost(post.id);
        setComments(commentsFromApi);
      } catch {
        setCommentError('No se pudieron cargar los comentarios');
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [post.id]);

  const handleAddComment = async (content: string) => {
    try {
      setCreatingComment(true);
      setCommentError('');

      const newComment = await createComment(post.id, content);

      setComments((prevComments) => [...prevComments, newComment]);
      setShowComments(true);
    } catch (err) {
      setCommentError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear el comentario'
      );
    } finally {
      setCreatingComment(false);
    }
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {post.authorName.charAt(0).toUpperCase()}
        </div>

        <div className="post-author-info">
          <h3>{post.authorName}</h3>

          <p>
            {post.authorCareer?.name || 'Estudiante UCB'} ·{' '}
            {formatDate(post.createdAt)}
          </p>
        </div>

        <button type="button" className="post-more-button">
          •••
        </button>
      </div>

      <p className="post-content">{post.content}</p>

      {post.mediaUrl && (
        <img src={post.mediaUrl} alt="Publicación" className="post-media" />
      )}

      <div className="post-stats">
        <span>{liked ? '1 reacción' : 'Sé el primero en reaccionar'}</span>
        <span>{comments.length} comentarios</span>
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={liked ? 'post-action active' : 'post-action'}
          onClick={() => setLiked((prev) => !prev)}
        >
          Me gusta
        </button>

        <button
          type="button"
          className="post-action"
          onClick={() => setShowComments((prev) => !prev)}
        >
          Comentar
        </button>

        <button type="button" className="post-action">
          Compartir
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          {commentError && <p className="comment-error">{commentError}</p>}

          {loadingComments ? (
            <p className="comment-empty">Cargando comentarios...</p>
          ) : (
            <CommentList comments={comments} />
          )}

          <CommentInput
            onAddComment={handleAddComment}
            disabled={creatingComment}
          />
        </div>
      )}
    </article>
  );
}

export default PostCard;