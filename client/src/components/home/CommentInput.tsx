import { useState } from 'react';
import { getCurrentUser } from '../../services/authService';

type CommentInputProps = {
  onAddComment: (content: string) => Promise<void> | void;
  disabled?: boolean;
};

function CommentInput({ onAddComment, disabled = false }: CommentInputProps) {
  const [content, setContent] = useState('');

  const currentUser = getCurrentUser();
  const avatarLetter =
    currentUser?.profile?.fullName?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    'G';

  const handleSubmit = async () => {
    const cleanContent = content.trim();

    if (!cleanContent || disabled) return;

    await onAddComment(cleanContent);

    setContent('');
  };

  return (
    <div className="comment-input-wrapper">
      <div className="comment-input-avatar">{avatarLetter}</div>

      <input
        type="text"
        placeholder="Escribe un comentario..."
        value={content}
        disabled={disabled}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSubmit();
          }
        }}
      />

      <button type="button" onClick={handleSubmit} disabled={disabled}>
        {disabled ? '...' : 'Enviar'}
      </button>
    </div>
  );
}

export default CommentInput;
