import { useEffect, useState } from 'react';
import CreatePostCard from './CreatePostCard';
import PostCard from './PostCard';
import { createPost, getPosts } from '../../services/postService';
import type { Post } from '../../types/post.types';
import '../../styles/home/Feed.css';

function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [creatingPost, setCreatingPost] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      setError('');

      const postsFromApi = await getPosts();

      setPosts(postsFromApi);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al cargar las publicaciones',
      );
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

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
          : 'Ocurrió un error al crear la publicación',
      );
    } finally {
      setCreatingPost(false);
    }
  };

  return (
    <section className="home-feed">
      <CreatePostCard
        onCreatePost={handleCreatePost}
        loading={creatingPost}
      />

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
        <div className="feed-state">
          Todavía no hay publicaciones. Sé el primero en publicar.
        </div>
      ) : (
        <div className="feed-posts">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Feed;