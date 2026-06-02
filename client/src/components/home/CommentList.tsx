import type { Comment } from '../../types/post.types';

type CommentListProps = {
  comments: Comment[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="comment-empty">
        Todavia no hay comentarios. Se el primero en comentar.
      </p>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-avatar">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>

          <div className="comment-bubble">
            <div className="comment-meta">
              <h4>{comment.authorName}</h4>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
