import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import ProfileTabs from '../components/profile/ProfileTabs.jsx';
import PostCard from '../components/posts/PostCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import userApi from '../api/userApi.js';
import postApi from '../api/postApi.js';
import uploadApi from '../api/uploadApi.js';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, refreshUser } = useAuth();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userId = id || currentUser?.id;
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchReels();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const response = await userApi.getUserById(userId);

      if (response.data.success) {
        setUser(response.data.data);
        setIsFollowing(response.data.data.isFollowing || false);
      }
    } catch (error) {
      console.error('Failed to load profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await postApi.getUserPosts(userId);

      if (response.data.success) {
        setPosts(response.data.data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error.message);
    }
  };

  const fetchReels = async () => {
    try {
      const response = await userApi.getUserById(userId);

      if (response.data.success) {
        setReels(response.data.data.reels || []);
      }
    } catch (error) {
      console.error('Failed to load reels:', error.message);
    }
  };

  const handleFollow = async () => {
    try {
      await userApi.followUser(userId);
      setIsFollowing(true);
      fetchProfile();
    } catch (error) {
      console.error('Follow failed:', error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await userApi.unfollowUser(userId);
      setIsFollowing(false);
      fetchProfile();
    } catch (error) {
      console.error('Unfollow failed:', error.message);
    }
  };

  const handleMessage = () => {
    window.location.href = `/messages?recipientId=${userId}`;
  };

  const handleCoverChange = async (file) => {
    setUploading(true);

    try {
      const response = await uploadApi.uploadSingle(file);

      if (response.data.success) {
        const coverUrl = response.data.data.url;

        await userApi.updateProfile({ coverUrl });

        if (isOwnProfile) {
          await refreshUser();
        }

        setUser((prev) => ({ ...prev, coverUrl }));
      }
    } catch (error) {
      console.error('Cover upload failed:', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarChange = async (file) => {
    setUploading(true);

    try {
      const response = await uploadApi.uploadSingle(file);

      if (response.data.success) {
        const avatarUrl = response.data.data.url;

        await userApi.updateProfile({ avatarUrl });

        if (isOwnProfile) {
          await refreshUser();
        }

        setUser((prev) => ({ ...prev, avatarUrl }));
      }
    } catch (error) {
      console.error('Avatar upload failed:', error.message);
    } finally {
      setUploading(false);
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
      <div className="max-w-3xl mx-auto">
        <ProfileHeader
          user={user}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onMessage={handleMessage}
          onCoverChange={handleCoverChange}
          onAvatarChange={handleAvatarChange}
        />

        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4 space-y-4 pb-16 lg:pb-4">
          {activeTab === 'posts' ? (
            posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <EmptyState
                title="No posts yet"
                description="This user hasn't posted anything."
              />
            )
          ) : reels.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  className="aspect-video rounded-lg overflow-hidden bg-bg-secondary"
                >
                  <video
                    src={reel.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reels yet"
              description="This user hasn't posted any reels."
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;