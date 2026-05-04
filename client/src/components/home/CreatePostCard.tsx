import { useState } from 'react';
import '../../styles/home/CreatePostCard.css';

type CreatePostCardProps = {
  onCreatePost: (content: string, mediaUrl?: string) => Promise<void> | void;
  loading?: boolean;
};

function CreatePostCard({ onCreatePost, loading = false }: CreatePostCardProps) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const cleanContent = content.trim();
    const cleanMediaUrl = mediaUrl.trim();

    if (!cleanContent && !cleanMediaUrl) {
      setError('Escribe algo o agrega una imagen/video antes de publicar.');
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
  };

  return (
    <article className="create-post-card">
      <div className="create-post-main">
        <div className="create-post-avatar">T</div>

        <div className="create-post-box">
          <textarea
            placeholder="¿Qué quieres compartir?"
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

      <div className="create-post-actions">
        <button
          type="button"
          className="create-post-option"
          disabled={loading}
          onClick={() => setShowMediaInput((prev) => !prev)}
        >
          Imagen / Video
        </button>

        <button type="button" className="create-post-option" disabled={loading}>
          Evento
        </button>

        <button
          type="button"
          className="create-post-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </article>
  );
}

export default CreatePostCard;