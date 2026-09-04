import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoPeople, IoLogOut, IoLogIn, IoAdd } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input from '../components/ui/Input.jsx';
import groupApi from '../api/groupApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isMember, setIsMember] = useState(false);
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [postText, setPostText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchGroup();
    fetchMembers();
    fetchPosts();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await groupApi.getGroupById(id);
      if (response.data.success) {
        setGroup(response.data.data);
        setIsMember(response.data.data.isMember || false);
      }
    } catch (error) {
      console.error('Failed to load group:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await groupApi.getGroupMembers(id);
      if (response.data.success) {
        setMembers(response.data.data.members || []);
      }
    } catch (error) {
      console.error('Failed to load members:', error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await groupApi.getGroupPosts(id);
      if (response.data.success) {
        setPosts(response.data.data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error.message);
    }
  };

  const handleJoin = async () => {
    try {
      await groupApi.joinGroup(id);
      setIsMember(true);
      fetchGroup();
      fetchMembers();
    } catch (error) {
      console.error('Join failed:', error.message);
    }
  };

  const handleLeave = async () => {
    try {
      await groupApi.leaveGroup(id);
      setIsMember(false);
      fetchGroup();
      fetchMembers();
    } catch (error) {
      console.error('Leave failed:', error.message);
    }
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    setPosting(true);

    try {
      const response = await groupApi.createGroupPost(id, { text: postText.trim() });
      if (response.data.success) {
        setPostText('');
        setShowPostComposer(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('Post failed:', error.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/groups')} className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary">
            <IoArrowBack size={20} />
          </button>
          <h1 className="text-2xl font-heading font-bold text-text-primary truncate">{group?.name}</h1>
        </div>

        <div className="bg-bg-primary border border-border-color rounded-xl p-4 mb-4">
          {group?.description && <p className="text-text-secondary">{group.description}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
            <span>{group?._count?.members || 0} members</span>
            <span>{group?._count?.posts || 0} posts</span>
            <span className="px-2 py-0.5 rounded bg-bg-secondary">{group?.category || 'General'}</span>
            {group?.campus && <span>📍 {group.campus.name}</span>}
          </div>

          <div className="mt-4">
            {isMember ? (
              group?.createdBy !== user?.id && (
                <Button variant="secondary" size="sm" onClick={handleLeave}>
                  <IoLogOut className="inline mr-1" size={16} />
                  Leave Group
                </Button>
              )
            ) : (
              <Button size="sm" onClick={handleJoin}>
                <IoLogIn className="inline mr-1" size={16} />
                Join Group
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-4 border-b border-border-color">
          <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px ${activeTab === 'posts' ? 'border-rvnp-green text-rvnp-green' : 'border-transparent text-text-muted'}`}>
            Posts
          </button>
          <button onClick={() => setActiveTab('members')} className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px ${activeTab === 'members' ? 'border-rvnp-green text-rvnp-green' : 'border-transparent text-text-muted'}`}>
            Members ({members.length})
          </button>
        </div>

        {activeTab === 'posts' ? (
          <div className="space-y-3">
            {isMember && (
              <Button size="sm" onClick={() => setShowPostComposer(true)}>
                <IoAdd className="inline mr-1" size={16} />
                Post in Group
              </Button>
            )}

            {posts.length === 0 ? (
              <p className="text-center text-text-muted py-8">No posts yet</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="p-4 rounded-xl border border-border-color bg-bg-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar src={post.user?.avatarUrl} name={post.user?.fullName} size="sm" />
                    <span className="font-medium text-text-primary text-sm">{post.user?.fullName}</span>
                  </div>
                  <p className="text-text-primary">{post.content?.text}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => navigate(`/profile/${member.user?.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-bg-secondary transition-all"
              >
                <Avatar src={member.user?.avatarUrl} name={member.user?.fullName} size="sm" />
                <div>
                  <span className="font-medium text-text-primary">{member.user?.fullName}</span>
                  {member.role === 'ADMIN' && (
                    <span className="text-xs text-rvnp-green ml-2">Admin</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Post Composer Modal */}
      <Modal isOpen={showPostComposer} onClose={() => setShowPostComposer(false)} title="Post in Group" size="sm">
        <div className="space-y-3">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Share something with the group..."
            rows={3}
            className="w-full bg-bg-secondary text-text-primary rounded-lg p-3 resize-none focus:outline-none"
          />
          <Button fullWidth onClick={handlePost} loading={posting}>
            Post
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default GroupDetails;