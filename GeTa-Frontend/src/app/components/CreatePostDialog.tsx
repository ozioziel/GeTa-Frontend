import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { PlusCircle, Image as ImageIcon, Video, Upload, X, Loader2 } from 'lucide-react';
import { postService, uploadService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';
import { toast } from 'sonner';

interface CreatePostDialogProps {
  onPostCreated: (post: Post) => void;
}

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv|ogg)(\?.*)?$/i.test(url);
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadService.upload(file);
      setMediaUrl(result.url);
      toast.success('Archivo subido correctamente');
    } catch {
      toast.error('Error al subir el archivo. Intenta de nuevo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('El contenido no puede estar vacío');
      return;
    }

    if (!user?.careerId) {
      toast.error('No se pudo determinar tu carrera. Por favor recarga la página.');
      return;
    }

    try {
      setLoading(true);
      const newPost = await postService.createPost(
        content,
        user.careerId,
        mediaUrl || undefined,
      );
      onPostCreated(newPost);
      toast.success('Publicación creada exitosamente');
      setContent('');
      setMediaUrl('');
      setOpen(false);
    } catch {
      toast.error('Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: '#FFD100',
            color: '#003DA5',
            boxShadow: '0 0 20px rgba(255,209,0,0.25)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#FFDB33';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(255,209,0,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#FFD100';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(255,209,0,0.25)';
          }}
        >
          <PlusCircle className="h-5 w-5" />
          Crear Publicación
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px] border"
        style={{
          background: 'rgba(2, 12, 27, 0.98)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(255,255,255,0.1)',
        }}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            Nueva Publicación
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Content textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ¿Qué quieres compartir?
            </label>
            <textarea
              placeholder="Escribe algo interesante para la comunidad UCB..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
              }}
              onFocus={(e) => {
                (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,209,0,0.5)';
              }}
              onBlur={(e) => {
                (e.target as HTMLTextAreaElement).style.borderColor =
                  'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          {/* Media upload */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <ImageIcon className="h-4 w-4 text-[#FFD100]" />
              Imagen o Video (opcional)
            </label>

            {/* Upload area */}
            {!mediaUrl ? (
              <label
                className="cursor-pointer block"
                style={{ opacity: uploading ? 0.6 : 1 }}
              >
                <div
                  className="flex flex-col items-center justify-center w-full h-32 rounded-xl transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '2px dashed rgba(255,255,255,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      'rgba(255,209,0,0.4)';
                    (e.currentTarget as HTMLElement).style.background =
                      'rgba(255,209,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      'rgba(255,255,255,0.15)';
                    (e.currentTarget as HTMLElement).style.background =
                      'rgba(255,255,255,0.03)';
                  }}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2
                        className="h-8 w-8 animate-spin"
                        style={{ color: '#FFD100' }}
                      />
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Subiendo archivo...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-3 mb-2">
                        <ImageIcon
                          className="h-6 w-6"
                          style={{ color: 'rgba(255,255,255,0.25)' }}
                        />
                        <Video
                          className="h-6 w-6"
                          style={{ color: 'rgba(255,255,255,0.25)' }}
                        />
                      </div>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Haz clic o arrastra un archivo
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        Imágenes (JPG, PNG, GIF, WebP) · Videos (MP4, WebM, MOV) · Máx. 100MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={uploading || loading}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                {isVideo(mediaUrl) ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full max-h-56 rounded-xl"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Vista previa"
                    className="w-full max-h-56 object-cover rounded-xl"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center transition-all"
                  style={{ background: 'rgba(0,0,0,0.7)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.8)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.7)';
                  }}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 h-11 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
              style={{
                background: '#FFD100',
                color: '#003DA5',
              }}
              onMouseEnter={(e) => {
                if (!loading && content.trim())
                  (e.currentTarget as HTMLElement).style.background = '#FFDB33';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FFD100';
              }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
