import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoSend, IoImage } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import messageApi from '../api/messageApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { formatMessageTime } from '../utils/formatDate.js';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversation();
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('new-message', (message) => {
        if (message.conversationId === conversationId) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        }
      });
    }

    return () => {
      socket?.off('new-message');
    };
  }, [socket, isConnected, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const response = await messageApi.getConversationById(conversationId);

      if (response.data.success) {
        setConversation(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error.message);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);

    try {
      const response = await messageApi.getMessages(conversationId);

      if (response.data.success) {
        setMessages(response.data.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const response = await messageApi.sendMessage(conversationId, {
        content: { text: newMessage.trim() },
        type: 'TEXT',
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to send message:', error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherUser = conversation?.participants?.find(
    (p) => p.user?.id !== user?.id
  )?.user;

  return (
    <Layout>
      <div className="w-full flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-7rem)]">
        <div className="flex items-center gap-3 p-3 border-b border-border-color">
          <button
            onClick={() => navigate('/messages')}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary lg:hidden"
          >
            <IoArrowBack size={20} />
          </button>

          {conversation?.type === 'DIRECT' ? (
            <Avatar src={otherUser?.avatarUrl} name={otherUser?.fullName} size="sm" />
          ) : (
            <Avatar src={conversation?.group?.avatarUrl} name={conversation?.group?.name} size="sm" />
          )}

          <div>
            <h2 className="font-medium text-text-primary">
              {conversation?.type === 'DIRECT'
                ? otherUser?.fullName
                : conversation?.group?.name}
            </h2>
            {isConnected && (
              <span className="text-xs text-green-500">Online</span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner size="md" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-text-muted py-10">
              No messages yet. Say hello!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] sm:max-w-[70%] px-4 py-2 rounded-2xl
                    ${
                      message.senderId === user?.id
                        ? 'bg-bg-secondary text-text-primary rounded-br-sm'
                        : 'bg-bg-tertiary text-text-primary rounded-bl-sm'
                    }
                  `}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                    {message.content?.text}
                  </p>
                  <span className="text-xs text-text-muted mt-1 block">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-border-color">
          <div className="flex items-end gap-2">
            <label className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted cursor-pointer shrink-0">
              <IoImage size={20} />
              <input type="file" accept="image/*" className="hidden" />
            </label>

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-bg-secondary text-text-primary rounded-lg p-2 sm:p-3 resize-none focus:outline-none placeholder:text-text-muted text-sm sm:text-base"
            />

            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              className="p-2.5 rounded-full bg-bg-secondary text-text-primary hover:bg-bg-tertiary disabled:opacity-50 shrink-0"
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;