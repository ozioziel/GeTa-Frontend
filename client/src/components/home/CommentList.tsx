import type { Comment } from '../../types/post.types';

type CommentListProps = {
  comments: Comment[];
};

function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="comment-empty">
        Todavía no hay comentarios. Sé el primero en comentar.
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
            <h4>{comment.authorName}</h4>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;