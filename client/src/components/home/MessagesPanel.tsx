import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getConversation,
  getConversations,
  sendMessage,
} from '../../services/messageService';
import type {
  ConversationDetail,
  ConversationSummary,
} from '../../types/social.types';
import '../../styles/home/DashboardPanels.css';

type MessagesPanelProps = {
  selectedUserId?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MessagesPanel({ selectedUserId }: MessagesPanelProps) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationDetail | null>(
    null,
  );
  const [messageText, setMessageText] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const activeUserId =
    selectedUserId || conversations[0]?.user?.id || '';

  const activeTitle = useMemo(() => {
    return (
      activeConversation?.user?.profile?.fullName ||
      activeConversation?.user?.email ||
      'Selecciona una conversación'
    );
  }, [activeConversation]);

  const loadConversations = async () => {
    try {
      setLoadingList(true);
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudieron cargar los mensajes.',
      );
    } finally {
      setLoadingList(false);
    }
  };

  const loadConversation = async (userId: string) => {
    if (!userId) {
      return;
    }

    try {
      setLoadingConversation(true);
      setError('');
      const data = await getConversation(userId);
      setActiveConversation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo abrir la conversación.',
      );
    } finally {
      setLoadingConversation(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeUserId) {
      loadConversation(activeUserId);
    }
  }, [activeUserId]);

  const handleSend = async () => {
    const cleanText = messageText.trim();

    if (!cleanText || !activeUserId) {
      return;
    }

    try {
      setSending(true);
      await sendMessage(activeUserId, cleanText);
      setMessageText('');
      await Promise.all([loadConversation(activeUserId), loadConversations()]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo enviar el mensaje.',
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="dashboard-card messages-layout">
      <div className="messages-sidebar">
        <div className="dashboard-card-header">
          <div>
            <p className="dashboard-eyebrow">Bandeja</p>
            <h2>Mensajes</h2>
          </div>
        </div>

        {loadingList ? (
          <div className="dashboard-empty">Cargando conversaciones...</div>
        ) : conversations.length === 0 && !selectedUserId ? (
          <div className="dashboard-empty">
            Aún no hay conversaciones. Desde buscar o perfil podrás iniciar una.
          </div>
        ) : (
          <div className="dashboard-list compact">
            {conversations.map((conversation) => (
              <button
                key={conversation.user?.id || conversation.lastMessage.id}
                type="button"
                className={
                  activeUserId === conversation.user?.id
                    ? 'dashboard-list-item active'
                    : 'dashboard-list-item'
                }
                onClick={() =>
                  navigate(`/home?view=messages&userId=${conversation.user?.id || ''}`)
                }
              >
                <div>
                  <strong>
                    {conversation.user?.profile?.fullName || conversation.user?.email}
                  </strong>
                  <p>{conversation.lastMessage.content}</p>
                </div>
                <span>{conversation.unreadCount > 0 ? conversation.unreadCount : formatDate(conversation.lastMessage.createdAt)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="messages-thread">
        <div className="dashboard-card-header">
          <div>
            <p className="dashboard-eyebrow">Conversación activa</p>
            <h2>{activeTitle}</h2>
          </div>
          {activeConversation?.user?.id && (
            <button
              type="button"
              onClick={() => navigate(`/profile/${activeConversation.user?.id}`)}
            >
              Ver perfil
            </button>
          )}
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        {loadingConversation ? (
          <div className="dashboard-empty">Cargando conversación...</div>
        ) : !activeConversation ? (
          <div className="dashboard-empty">
            Selecciona una conversación o abre una desde el perfil de otro estudiante.
          </div>
        ) : (
          <>
            <div className="message-bubble-list">
              {activeConversation.messages.length === 0 ? (
                <div className="dashboard-empty">
                  No hay mensajes todavía. Escribe el primero.
                </div>
              ) : (
                activeConversation.messages.map((message) => (
                  <article
                    key={message.id}
                    className={
                      message.senderId === activeConversation.user?.id
                        ? 'message-bubble'
                        : 'message-bubble mine'
                    }
                  >
                    <p>{message.content}</p>
                    <span>{formatDate(message.createdAt)}</span>
                  </article>
                ))
              )}
            </div>

            <div className="message-composer">
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Escribe un mensaje..."
              />
              <button type="button" onClick={handleSend} disabled={sending}>
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MessagesPanel;
