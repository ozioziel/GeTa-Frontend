import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import { createComment, getCommentsByPost } from '../../services/commentService';
import {
  deletePost,
  likePost,
  savePost,
  unlikePost,
  unsavePost,
} from '../../services/postService';
import type { Comment, Post } from '../../types/post.types';
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MoreIcon,
  ShareIcon,
  UserIcon,
} from '../icons/AppIcons';
import FallbackImage from '../common/FallbackImage';
import '../../styles/home/PostCard.css';

type PostCardProps = {
  post: Post;
  highlight?: boolean;
  onPostUpdated?: (post: Post) => void;
  onPostDeleted?: (postId: string) => void;
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

function PostCard({
  post,
  highlight = false,
  onPostUpdated,
  onPostDeleted,
}: PostCardProps) {
  const navigate = useNavigate();

  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [saved, setSaved] = useState(post.savedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [creatingComment, setCreatingComment] = useState<boolean>(false);
  const [busyAction, setBusyAction] = useState<string>('');
  const [commentError, setCommentError] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string>('');
  const [hasLoadedComments, setHasLoadedComments] = useState(
    (post.comments || []).length > 0,
  );

  useEffect(() => {
    setComments(post.comments || []);
    setLiked(post.likedByCurrentUser);
    setSaved(post.savedByCurrentUser);
    setLikesCount(post.likesCount);
    setCommentsCount(post.commentsCount);
  }, [post]);

  useEffect(() => {
    const loadComments = async () => {
      if (!showComments || hasLoadedComments) {
        return;
      }

      try {
        setLoadingComments(true);
        setCommentError('');

        const commentsFromApi = await getCommentsByPost(post.id);
        setComments(commentsFromApi);
        setCommentsCount(commentsFromApi.length);
        setHasLoadedComments(true);
      } catch {
        setCommentError('No se pudieron cargar los comentarios');
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [hasLoadedComments, post.id, showComments]);

  const authorLetter = useMemo(
    () => post.authorName.charAt(0).toUpperCase(),
    [post.authorName],
  );

  const applyUpdatedPost = (updatedPost: Post) => {
    setLiked(updatedPost.likedByCurrentUser);
    setSaved(updatedPost.savedByCurrentUser);
    setLikesCount(updatedPost.likesCount);
    setCommentsCount(updatedPost.commentsCount);

    if (updatedPost.comments.length > 0) {
      setComments(updatedPost.comments);
      setHasLoadedComments(true);
    }

    onPostUpdated?.(updatedPost);
  };

  const handleAddComment = async (content: string) => {
    try {
      setCreatingComment(true);
      setCommentError('');

      const newComment = await createComment(post.id, content);

      setComments((prevComments) => [...prevComments, newComment]);
      setCommentsCount((prev) => prev + 1);
      setShowComments(true);
      setHasLoadedComments(true);
      setActionMessage('Comentario publicado.');
    } catch (err) {
      setCommentError(
        err instanceof Error ? err.message : 'No se pudo crear el comentario',
      );
    } finally {
      setCreatingComment(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      setBusyAction('like');
      const updatedPost = liked ? await unlikePost(post.id) : await likePost(post.id);
      applyUpdatedPost(updatedPost);
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : 'No se pudo actualizar el like.',
      );
    } finally {
      setBusyAction('');
    }
  };

  const handleSaveToggle = async () => {
    try {
      setBusyAction('save');
      const updatedPost = saved ? await unsavePost(post.id) : await savePost(post.id);
      applyUpdatedPost(updatedPost);
      setActionMessage(saved ? 'Se quito de guardados.' : 'Se guardo la publicacion.');
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : 'No se pudo actualizar guardados.',
      );
    } finally {
      setBusyAction('');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Esta publicacion se ocultara del feed. Deseas continuar?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyAction('delete');
      await deletePost(post.id);
      onPostDeleted?.(post.id);
    } catch (err) {
      setActionMessage(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la publicacion.',
      );
    } finally {
      setBusyAction('');
      setShowMenu(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/home?view=feed&postId=${post.id}`;
      await navigator.clipboard.writeText(url);
      setActionMessage('Enlace copiado al portapapeles.');
    } catch {
      setActionMessage('No se pudo copiar el enlace.');
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrl) {
      return null;
    }

    const isVideo = post.mediaUrl.match(/\.(mp4|webm|ogg)$/i);

    return (
      <div className="post-media-wrapper">
        {isVideo ? (
          <video src={post.mediaUrl} className="post-media" controls />
        ) : (
          <FallbackImage
            src={post.mediaUrl}
            alt="Publicacion"
            className="post-media"
            fallback={
              <div className="post-media-fallback">
                <strong>Imagen no disponible</strong>
                <span>El archivo ya no existe o la URL no responde.</span>
              </div>
            }
          />
        )}
      </div>
    );
  };

  return (
    <article
      id={`post-${post.id}`}
      className={highlight ? 'post-card post-card-highlight' : 'post-card'}
    >
      <div className="post-header">
        <button
          type="button"
          className="post-avatar post-avatar-button"
          onClick={() =>
            navigate(post.authorId ? `/profile/${post.authorId}` : '/profile')
          }
        >
          {authorLetter}
        </button>

        <div className="post-author-info">
          <button
            type="button"
            className="post-author-link"
            onClick={() =>
              navigate(post.authorId ? `/profile/${post.authorId}` : '/profile')
            }
          >
            {post.authorName}
          </button>

          <p>
            {post.authorCareer?.name || 'Estudiante UCB'} · {formatDate(post.createdAt)}
          </p>
        </div>

        <div className="post-header-actions">
          <button
            type="button"
            className="post-more-button"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreIcon size={18} />
          </button>

          {showMenu && (
            <div className="post-menu">
              <button
                type="button"
                onClick={() =>
                  navigate(post.authorId ? `/profile/${post.authorId}` : '/profile')
                }
              >
                <UserIcon size={14} />
                <span>Ver perfil</span>
              </button>

              {post.canDelete && (
                <button type="button" onClick={handleDelete}>
                  <span>Eliminar publicacion</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {highlight && <div className="post-highlight-chip">Publicacion destacada</div>}

      <p className="post-content">{post.content}</p>
      {renderMedia()}

      <div className="post-stats">
        <span>{likesCount > 0 ? `${likesCount} reacciones` : 'Sin reacciones aun'}</span>
        <span>{commentsCount} comentarios</span>
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={liked ? 'post-action active' : 'post-action'}
          onClick={handleLikeToggle}
          disabled={busyAction === 'like'}
        >
          <HeartIcon size={16} />
          <span>{liked ? 'Te gusta' : 'Me gusta'}</span>
        </button>

        <button
          type="button"
          className={showComments ? 'post-action active' : 'post-action'}
          onClick={() => setShowComments((prev) => !prev)}
        >
          <CommentIcon size={16} />
          <span>Comentar</span>
        </button>

        <button
          type="button"
          className={saved ? 'post-action active' : 'post-action'}
          onClick={handleSaveToggle}
          disabled={busyAction === 'save'}
        >
          <BookmarkIcon size={16} />
          <span>{saved ? 'Guardado' : 'Guardar'}</span>
        </button>

        <button type="button" className="post-action" onClick={handleShare}>
          <ShareIcon size={16} />
          <span>Compartir</span>
        </button>
      </div>

      {actionMessage && <p className="post-feedback">{actionMessage}</p>}

      {showComments && (
        <div className="post-comments">
          {commentError && <p className="comment-error">{commentError}</p>}

          {loadingComments ? (
            <p className="comment-empty">Cargando comentarios...</p>
          ) : (
            <CommentList comments={comments} />
          )}

          <CommentInput onAddComment={handleAddComment} disabled={creatingComment} />
        </div>
      )}
    </article>
  );
}

export default PostCard;
