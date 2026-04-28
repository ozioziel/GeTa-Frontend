import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DashboardLayout } from '../components/DashboardLayout';
import { Navbar } from '../components/Navbar';
import { Settings, User, BookOpen, Save, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { profileService, careerService, uploadService } from '../services/api';
import { Career } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    careerId: user?.careerId || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatar || '',
  });

  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    careerService
      .getCareers()
      .then(setCareers)
      .catch(() => setCareers([]));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes para el avatar');
      return;
    }

    try {
      setAvatarUploading(true);
      const result = await uploadService.upload(file);
      setFormData((prev) => ({ ...prev, avatarUrl: result.url }));
      toast.success('Foto de perfil actualizada');
    } catch {
      toast.error('Error al subir la imagen');
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await profileService.updateMyProfile({
        fullName: formData.name,
        bio: formData.bio || undefined,
        avatarUrl: formData.avatarUrl || undefined,
        careerId: formData.careerId || undefined,
      });
      await refreshUser();
      toast.success('Perfil actualizado exitosamente');
      navigate(`/profile/${user?.id}`);
    } catch {
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (!user) return null;

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
  };

  const inputFocusStyle = {
    borderColor: 'rgba(255,209,0,0.5)',
    background: 'rgba(255,255,255,0.07)',
  };

  return (
    <DashboardLayout>
      <Navbar />

      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/profile/${user.id}`)}
              className="mb-4 flex items-center gap-2 text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Perfil
            </button>

            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: 'rgba(0,61,165,0.3)',
                  border: '1px solid rgba(0,61,165,0.5)',
                  boxShadow: '0 0 20px rgba(0,61,165,0.2)',
                }}
              >
                <Settings className="h-8 w-8 text-[#FFD100]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Configuración del Perfil</h1>
                <p style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Actualiza tu información personal
                </p>
              </div>
            </div>
          </div>

          {/* Main form card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Card header */}
            <div
              className="p-6"
              style={{
                background: 'rgba(0,61,165,0.2)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <h2 className="text-white font-semibold text-lg">Editar Perfil</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm">
                Actualiza tu nombre, carrera y biografía
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar
                      className="h-32 w-32 border-4"
                      style={{
                        borderColor: '#FFD100',
                        boxShadow: '0 0 25px rgba(255,209,0,0.3)',
                      }}
                    >
                      <AvatarImage src={formData.avatarUrl} alt={formData.name} />
                      <AvatarFallback className="bg-[#003DA5] text-white text-4xl">
                        {getInitials(formData.name)}
                      </AvatarFallback>
                    </Avatar>
                    {avatarUploading && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FFD100]" />
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer">
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.8)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          'rgba(255,255,255,0.14)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          'rgba(255,255,255,0.08)';
                      }}
                    >
                      <Upload className="h-4 w-4 text-[#FFD100]" />
                      {avatarUploading ? 'Subiendo...' : 'Cambiar foto de perfil'}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={avatarUploading || loading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <User className="h-4 w-4 text-[#FFD100]" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200 disabled:opacity-50"
                    style={inputStyle}
                    onFocus={(e) => Object.assign((e.target as HTMLInputElement).style, inputFocusStyle)}
                    onBlur={(e) => Object.assign((e.target as HTMLInputElement).style, inputStyle)}
                  />
                </div>

                {/* Career */}
                <div className="space-y-2">
                  <label
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <BookOpen className="h-4 w-4 text-[#FFD100]" />
                    Carrera Universitaria
                  </label>
                  <Select
                    value={formData.careerId}
                    onValueChange={(value) => setFormData({ ...formData, careerId: value })}
                    disabled={loading || careers.length === 0}
                  >
                    <SelectTrigger
                      className="h-11 rounded-xl border text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.8)',
                      }}
                    >
                      <SelectValue
                        placeholder={
                          careers.length === 0
                            ? 'Cargando carreras...'
                            : 'Selecciona tu carrera'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: 'rgba(2, 12, 27, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {careers.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                          className="text-white"
                          style={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Biografía
                  </label>
                  <textarea
                    placeholder="Cuéntanos sobre ti, tus intereses académicos, proyectos..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all duration-200 disabled:opacity-50"
                    style={inputStyle}
                    onFocus={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor =
                        'rgba(255,209,0,0.5)';
                      (e.target as HTMLTextAreaElement).style.background =
                        'rgba(255,255,255,0.07)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor =
                        'rgba(255,255,255,0.1)';
                      (e.target as HTMLTextAreaElement).style.background =
                        'rgba(255,255,255,0.05)';
                    }}
                  />
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Comparte información sobre tus intereses y experiencia universitaria
                  </p>
                </div>

                {/* Email (readonly) */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Correo Institucional
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full h-11 px-4 rounded-xl text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.35)',
                      cursor: 'not-allowed',
                    }}
                  />
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    El correo institucional no puede ser modificado
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${user.id}`)}
                    disabled={loading}
                    className="flex-1 h-11 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        'rgba(255,255,255,0.06)';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: '#FFD100',
                      color: '#003DA5',
                      boxShadow: '0 0 20px rgba(255,209,0,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        (e.currentTarget as HTMLElement).style.background = '#FFDB33';
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          '0 0 30px rgba(255,209,0,0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#FFD100';
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        '0 0 20px rgba(255,209,0,0.2)';
                    }}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info card */}
          <div
            className="mt-6 p-5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#FFD100' }}>
              Acerca de esta sección
            </h3>
            <div className="text-sm space-y-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <p>• Tu perfil es visible para todos los estudiantes de la UCB</p>
              <p>• La carrera que selecciones aparecerá en todas tus publicaciones</p>
              <p>• Puedes actualizar tu información en cualquier momento</p>
              <p>• Los cambios se reflejarán inmediatamente en la plataforma</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
