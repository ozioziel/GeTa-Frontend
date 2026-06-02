import { useEffect, useState } from 'react';
import CreatePostCard from './CreatePostCard';
import PostCard from './PostCard';
import { createPost, getPosts, getSavedPosts } from '../../services/postService';
import type { Post } from '../../types/post.types';
import '../../styles/home/Feed.css';

type FeedMode = 'all' | 'career' | 'saved' | 'author';

type FeedProps = {
  title: string;
  subtitle: string;
  emptyMessage: string;
  mode?: FeedMode;
  careerId?: string;
  authorId?: string;
  showComposer?: boolean;
  focusComposer?: boolean;
};

function Feed({
  title,
  subtitle,
  emptyMessage,
  mode = 'all',
  careerId,
  authorId,
  showComposer = true,
  focusComposer = false,
}: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [creatingPost, setCreatingPost] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      setError('');

      let postsFromApi: Post[] = [];

      if (mode === 'saved') {
        postsFromApi = await getSavedPosts();
      } else {
        postsFromApi = await getPosts({
          ...(careerId ? { careerId } : {}),
          ...(authorId ? { authorId } : {}),
        });
      }

      setPosts(postsFromApi);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrio un error al cargar las publicaciones',
      );
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [mode, careerId, authorId]);

  const handleCreatePost = async (content: string, mediaUrl?: string) => {
    try {
      setCreatingPost(true);
      setError('');

      const newPost = await createPost(content, mediaUrl);

      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrio un error al crear la publicacion',
      );
      throw err;
    } finally {
      setCreatingPost(false);
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <section className="home-feed">
      <div className="feed-header-card">
        <p className="feed-label">Red social UCB</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {showComposer && (
        <CreatePostCard
          onCreatePost={handleCreatePost}
          loading={creatingPost}
          highlightComposer={focusComposer}
        />
      )}

      {error && (
        <div className="feed-error">
          <p>{error}</p>

          <button type="button" onClick={loadPosts}>
            Reintentar
          </button>
        </div>
      )}

      {loadingPosts ? (
        <div className="feed-state">Cargando publicaciones...</div>
      ) : posts.length === 0 ? (
        <div className="feed-state">{emptyMessage}</div>
      ) : (
        <div className="feed-posts">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Feed;
