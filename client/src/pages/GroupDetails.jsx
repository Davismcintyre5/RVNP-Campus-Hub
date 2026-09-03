import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoPeople, IoLogOut, IoLogIn } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Button from '../components/ui/Button.jsx';
import groupApi from '../api/groupApi.js';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchGroup();
    fetchMembers();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await groupApi.getGroupById(id);

      if (response.data.success) {
        setGroup(response.data.data);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/groups')}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary"
          >
            <IoArrowBack size={20} />
          </button>
          <h1 className="text-2xl font-heading font-bold text-text-primary truncate">
            {group?.name}
          </h1>
        </div>

        <div className="bg-bg-primary border border-border-color rounded-xl p-4 mb-4">
          {group?.description && (
            <p className="text-text-secondary">{group.description}</p>
          )}

          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm text-text-muted">
              {group?._count?.members || 0} members
            </span>
            {group?.campus && (
              <span className="text-sm text-text-muted">
                📍 {group.campus.name}
              </span>
            )}
          </div>

          <div className="mt-4">
            {isMember ? (
              <Button variant="secondary" size="sm" onClick={handleLeave}>
                <IoLogOut className="inline mr-1" size={16} />
                Leave Group
              </Button>
            ) : (
              <Button size="sm" onClick={handleJoin}>
                <IoLogIn className="inline mr-1" size={16} />
                Join Group
              </Button>
            )}
          </div>
        </div>

        <h3 className="font-heading font-semibold text-text-primary mb-2">
          Members
        </h3>

        <div className="space-y-1">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => navigate(`/profile/${member.user?.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-bg-secondary transition-all"
            >
              <Avatar src={member.user?.avatarUrl} name={member.user?.fullName} size="sm" />
              <div>
                <span className="font-medium text-text-primary">
                  {member.user?.fullName}
                </span>
                {member.role === 'admin' && (
                  <span className="text-xs text-text-muted ml-2">Admin</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default GroupDetails;