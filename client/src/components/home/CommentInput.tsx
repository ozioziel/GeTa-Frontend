import { useState } from 'react';

type CommentInputProps = {
  onAddComment: (content: string) => Promise<void> | void;
  disabled?: boolean;
};

function CommentInput({ onAddComment, disabled = false }: CommentInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const cleanContent = content.trim();

    if (!cleanContent || disabled) return;

    await onAddComment(cleanContent);

    setContent('');
  };

  return (
    <div className="comment-input-wrapper">
      <div className="comment-input-avatar">T</div>

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