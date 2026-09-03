import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPeople, IoAdd } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input from '../components/ui/Input.jsx';
import groupApi from '../api/groupApi.js';

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);

    try {
      const response = await groupApi.getAllGroups();

      if (response.data.success) {
        setGroups(response.data.data.groups || []);
      }
    } catch (error) {
      console.error('Failed to load groups:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newGroup.name.trim()) return;

    setCreating(true);

    try {
      const response = await groupApi.createGroup(newGroup);

      if (response.data.success) {
        setShowCreate(false);
        setNewGroup({ name: '', description: '' });
        fetchGroups();
      }
    } catch (error) {
      console.error('Failed to create group:', error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Groups
          </h1>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <IoAdd className="inline mr-1" size={16} />
            Create
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={IoPeople}
            title="No groups yet"
            description="Create or join a group to connect with others!"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="p-4 rounded-xl border border-border-color bg-bg-primary text-left hover:bg-bg-secondary transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-bg-secondary">
                    <IoPeople size={24} className="text-text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">
                      {group.name}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {group._count?.members || 0} members
                    </p>
                  </div>
                </div>
                {group.description && (
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                    {group.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        <Modal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          title="Create Group"
          size="sm"
        >
          <div className="space-y-4">
            <Input
              label="Group Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              placeholder="Enter group name"
              required
            />
            <Input
              label="Description"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              placeholder="What's this group about?"
            />
            <Button fullWidth onClick={handleCreate} loading={creating}>
              Create Group
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Groups;