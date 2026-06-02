import { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../../services/authService';
import { PlusSquareIcon } from '../icons/AppIcons';
import '../../styles/home/CreatePostCard.css';

type CreatePostCardProps = {
  onCreatePost: (content: string, mediaUrl?: string) => Promise<void> | void;
  loading?: boolean;
  highlightComposer?: boolean;
};

function CreatePostCard({
  onCreatePost,
  loading = false,
  highlightComposer = false,
}: CreatePostCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  const currentUser = getCurrentUser();
  const avatarLetter =
    currentUser?.profile?.fullName?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    'G';

  useEffect(() => {
    if (!highlightComposer || !textareaRef.current) {
      return;
    }

    textareaRef.current.focus();
    textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightComposer]);

  const handleSubmit = async () => {
    const cleanContent = content.trim();
    const cleanMediaUrl = mediaUrl.trim();

    if (!cleanContent && !cleanMediaUrl) {
      setError('Escribe algo o agrega una imagen o video antes de publicar.');
      return;
    }

    if (cleanMediaUrl && !cleanMediaUrl.startsWith('http')) {
      setError('La URL debe comenzar con http o https.');
      return;
    }

    await onCreatePost(cleanContent || ' ', cleanMediaUrl || undefined);

    setContent('');
    setMediaUrl('');
    setShowMediaInput(false);
    setError('');
    setNote('Tu publicacion ya esta en el feed.');
  };

  const handleUseEventTemplate = () => {
    setContent((prev) =>
      prev.trim()
        ? `${prev}\n\nEvento UCB:\nFecha:\nLugar:\nInvitados:\n`
        : 'Evento UCB:\nFecha:\nLugar:\nInvitados:\n',
    );
    setNote('Se agrego una plantilla rapida para eventos.');
    textareaRef.current?.focus();
  };

  return (
    <article className="create-post-card">
      <div className="create-post-main">
        <div className="create-post-avatar">{avatarLetter}</div>

        <div className="create-post-box">
          <textarea
            ref={textareaRef}
            placeholder="Que quieres compartir hoy?"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={loading}
          />

          {showMediaInput && (
            <div className="create-post-media-box">
              <input
                type="url"
                placeholder="Pega una URL de imagen o video..."
                value={mediaUrl}
                onChange={(event) => setMediaUrl(event.target.value)}
                disabled={loading}
              />

              {mediaUrl && (
                <div className="create-post-media-preview">
                  {mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={mediaUrl} controls />
                  ) : (
                    <img src={mediaUrl} alt="Vista previa" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && <p className="create-post-error">{error}</p>}
      {note && <p className="create-post-note">{note}</p>}

      <div className="create-post-actions">
        <button
          type="button"
          className="create-post-option"
          disabled={loading}
          onClick={() => setShowMediaInput((prev) => !prev)}
        >
          Imagen / Video
        </button>

        <button
          type="button"
          className="create-post-option"
          disabled={loading}
          onClick={handleUseEventTemplate}
        >
          Evento
        </button>

        <button
          type="button"
          className="create-post-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          <PlusSquareIcon size={16} />
          <span>{loading ? 'Publicando...' : 'Publicar'}</span>
        </button>
      </div>
    </article>
  );
}

export default CreatePostCard;
