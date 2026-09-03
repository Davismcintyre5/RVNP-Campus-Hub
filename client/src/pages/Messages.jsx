import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChatbubbleOutline, IoSearch } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import messageApi from '../api/messageApi.js';
import timeAgo from '../utils/timeAgo.js';

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);

    try {
      const response = await messageApi.getConversations();

      if (response.data.success) {
        setConversations(response.data.data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.participants?.find((p) => p.user?.id !== JSON.parse(localStorage.getItem('rvnp_user'))?.id);
    const name = otherUser?.user?.fullName || conv.group?.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const getOtherUser = (conv) => {
    const currentUser = JSON.parse(localStorage.getItem('rvnp_user'));
    return conv.participants?.find((p) => p.user?.id !== currentUser?.id)?.user;
  };

  const getLastMessage = (conv) => {
    return conv.messages?.[0]?.content?.text || 'No messages yet';
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Messages
          </h1>
        </div>

        <div className="relative mb-4">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-bg-secondary text-text-primary border border-border-color focus:outline-none placeholder:text-text-muted"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <EmptyState
            icon={IoChatbubbleOutline}
            title="No conversations"
            description="Start a conversation with someone!"
          />
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conv) => {
              const otherUser = getOtherUser(conv);
              return (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/messages/${conv.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-bg-secondary transition-all text-left"
                >
                  {conv.type === 'DIRECT' ? (
                    <Avatar
                      src={otherUser?.avatarUrl}
                      name={otherUser?.fullName}
                      size="md"
                    />
                  ) : (
                    <Avatar
                      src={conv.group?.avatarUrl}
                      name={conv.group?.name}
                      size="md"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-primary truncate">
                        {conv.type === 'DIRECT' ? otherUser?.fullName : conv.group?.name}
                      </span>
                      <span className="text-xs text-text-muted shrink-0">
                        {timeAgo(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted truncate">
                      {getLastMessage(conv)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;