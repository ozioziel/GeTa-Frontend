import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../services/notificationService';
import type { NotificationItem } from '../../types/social.types';
import '../../styles/home/DashboardPanels.css';

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function NotificationsPanel() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las notificaciones.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleOpenNotification = async (notification: NotificationItem) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo abrir la notificación.',
      );
    }
  };

  const handleMarkAll = async () => {
    try {
      setBusy(true);
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron marcar como leídas.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="dashboard-panel-stack">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <p className="dashboard-eyebrow">Centro de alertas</p>
            <h2>Notificaciones</h2>
            <p>Likes, comentarios, seguidores y mensajes nuevos.</p>
          </div>
          <button type="button" onClick={handleMarkAll} disabled={busy}>
            Marcar todo como leído
          </button>
        </div>

        {error && <p className="dashboard-error">{error}</p>}
        {loading ? (
          <div className="dashboard-empty">Cargando notificaciones...</div>
        ) : notifications.length === 0 ? (
          <div className="dashboard-empty">Todavía no tienes notificaciones.</div>
        ) : (
          <div className="dashboard-list">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className={
                  notification.isRead
                    ? 'dashboard-list-item'
                    : 'dashboard-list-item unread'
                }
                onClick={() => handleOpenNotification(notification)}
              >
                <div>
                  <strong>{notification.message}</strong>
                  <p>{notification.actor?.profile?.fullName || 'Actividad de la comunidad'}</p>
                </div>
                <span>{formatDate(notification.createdAt)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NotificationsPanel;
