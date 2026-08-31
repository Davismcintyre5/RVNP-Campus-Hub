import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoShareOutline, IoEllipsisHorizontal } from 'react-icons/io5';
import Avatar from '../ui/Avatar.jsx';
import VerifiedBadge from '../ui/VerifiedBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCount } from '../../utils/formatNumber.js';
import timeAgo from '../../utils/timeAgo.js';

const PostCard = ({ post, onLike, onUnlike, onComment, onShare }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
      onUnlike?.(post.id);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      onLike?.(post.id);
    }
  };

  const content = post?.content;

  return (
    <div className="bg-bg-primary border border-border-color rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={post?.user?.avatarUrl}
            name={post?.user?.fullName}
            size="sm"
            onClick={() => navigate(`/profile/${post?.user?.id}`)}
          />

          <div>
            <div className="flex items-center gap-1">
              <span
                className="font-medium text-text-primary cursor-pointer hover:underline"
                onClick={() => navigate(`/profile/${post?.user?.id}`)}
              >
                {post?.user?.fullName}
              </span>
              {post?.user?.hdmVerified && <VerifiedBadge size={14} />}
            </div>
            <span className="text-xs text-text-muted">
              {timeAgo(post?.createdAt)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted"
        >
          <IoEllipsisHorizontal size={18} />
        </button>
      </div>

      {content?.text && (
        <p className="text-text-primary mt-3 whitespace-pre-wrap">
          {content.text}
        </p>
      )}

      {content?.images && content.images.length > 0 && (
        <div className={`mt-3 grid gap-2 ${content.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {content.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full rounded-lg object-cover max-h-96"
            />
          ))}
        </div>
      )}

      {content?.video && (
        <video
          src={content.video}
          controls
          className="w-full rounded-lg mt-3 max-h-96"
        />
      )}

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-color">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition-all ${
            liked ? 'text-red-500' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {liked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
          <span>{formatCount(likeCount)}</span>
        </button>

        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"
        >
          <IoChatbubbleOutline size={20} />
          <span>{formatCount(post?.commentCount || 0)}</span>
        </button>

        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"
        >
          <IoShareOutline size={20} />
          <span>{formatCount(post?.shareCount || 0)}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;