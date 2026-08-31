import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChatbubble, IoPersonAdd, IoPersonRemove, IoSettings, IoCamera } from 'react-icons/io5';
import CoverPhoto from '../ui/CoverPhoto.jsx';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';
import VerifiedBadge from '../ui/VerifiedBadge.jsx';
import StatCard from '../ui/StatCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/formatDate.js';

const ProfileHeader = ({ user, isFollowing, onFollow, onUnfollow, onMessage, onCoverChange, onAvatarChange }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [showFullBio, setShowFullBio] = useState(false);
  const avatarInputRef = useRef(null);

  const isOwnProfile = currentUser?.id === user?.id;

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      avatarInputRef.current?.click();
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div>
      <CoverPhoto
        src={user?.coverUrl}
        editable={isOwnProfile}
        onImageSelect={onCoverChange}
      />

      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-14 px-4 relative z-10">
          <div className="relative inline-block">
            <Avatar
              src={user?.avatarUrl}
              name={user?.fullName}
              size="xl"
              onClick={handleAvatarClick}
            />

            {isOwnProfile && (
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-bg-primary border border-border-color text-text-secondary hover:text-text-primary"
              >
                <IoCamera size={14} />
              </button>
            )}

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileChange}
            />
          </div>

          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                <IoSettings className="inline mr-1" size={16} />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onMessage}>
                  <IoChatbubble className="inline mr-1" size={16} />
                  Message
                </Button>

                {isFollowing ? (
                  <Button variant="secondary" size="sm" onClick={onUnfollow}>
                    <IoPersonRemove className="inline mr-1" size={16} />
                    Unfollow
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={onFollow}>
                    <IoPersonAdd className="inline mr-1" size={16} />
                    Follow
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="px-4 mt-4">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              {user?.fullName}
            </h1>
            {user?.hdmVerified && <VerifiedBadge size={22} />}
          </div>

          {user?.course && (
            <p className="text-text-secondary mt-1">
              {user.course}
              {user?.yearOfStudy && ` • Year ${user.yearOfStudy}`}
            </p>
          )}

          {user?.campus && (
            <p className="text-text-secondary text-sm mt-0.5">
              📍 {user.campus.name}
            </p>
          )}

          {user?.department && (
            <p className="text-text-secondary text-sm">
              🏛️ {user.department.name}
            </p>
          )}

          {user?.bio && (
            <p className="text-text-primary mt-2">
              {showFullBio ? user.bio : `${user.bio.slice(0, 100)}${user.bio.length > 100 ? '...' : ''}`}
              {user.bio.length > 100 && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-text-muted hover:text-text-primary ml-1 text-sm"
                >
                  {showFullBio ? 'Show less' : 'Show more'}
                </button>
              )}
            </p>
          )}

          <p className="text-text-muted text-xs mt-2">
            Joined {formatDate(user?.createdAt, 'DD MMMM YYYY')}
          </p>

          <div className="flex gap-2 mt-4 border-t border-border-color pt-3">
            <StatCard label="Posts" value={user?._count?.posts || 0} />
            <StatCard label="Reels" value={user?._count?.reels || 0} />
            <StatCard label="Followers" value={user?._count?.followers || 0} />
            <StatCard label="Following" value={user?._count?.following || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;