import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChatbubbleOutline, IoShareOutline, IoEllipsisHorizontal } from 'react-icons/io5';
import Avatar from '../ui/Avatar.jsx';
import VerifiedBadge from '../ui/VerifiedBadge.jsx';
import ReactionPicker from '../reactions/ReactionPicker.jsx';
import ReactionSummary from '../reactions/ReactionSummary.jsx';
import CommentList from '../comments/CommentList.jsx';
import ShareModal from '../ui/ShareModal.jsx';
import Modal from '../ui/Modal.jsx';
import { formatCount } from '../../utils/formatNumber.js';
import timeAgo from '../../utils/timeAgo.js';
import reactionApi from '../../api/reactionApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const PostCard = ({ post, onReaction, onShare }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionCount, setReactionCount] = useState(post?.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post?.commentCount || 0);
  const [shareCount, setShareCount] = useState(post?.shareCount || 0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchMyReaction();
  }, [post?.id]);

  const fetchMyReaction = async () => {
    try {
      const response = await reactionApi.getPostReactions(post.id);

      if (response.data.success) {
        const reactions = response.data.data.reactions || [];
        const mine = reactions.find((r) => r.userId === user?.id);

        if (mine) {
          setCurrentReaction(mine.type);
        }
      }
    } catch (error) {
      console.error('Failed to fetch my reaction:', error.message);
    }
  };

  const handleReaction = (type) => {
    setCurrentReaction(type);
    setReactionCount((prev) => prev + 1);
    onReaction?.(post.id, type);
  };

  const handleRemoveReaction = () => {
    setCurrentReaction(null);
    setReactionCount((prev) => Math.max(0, prev - 1));
  };

  const handleShareOpen = () => {
    setShowShare(true);
  };

  const handleShared = () => {
    setShareCount((prev) => prev + 1);
  };

  const content = post?.content;

  return (
    <>
      <div className="bg-bg-primary border border-border-color rounded-xl p-3 sm:p-4 w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="shrink-0">
              <Avatar
                src={post?.user?.avatarUrl}
                name={post?.user?.fullName}
                size="sm"
                onClick={() => navigate(`/profile/${post?.user?.id}`)}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span
                  className="font-medium text-text-primary cursor-pointer hover:underline text-sm sm:text-base truncate"
                  onClick={() => navigate(`/profile/${post?.user?.id}`)}
                >
                  {post?.user?.fullName}
                </span>
                {post?.user?.hdmVerified && <VerifiedBadge size={14} />}
              </div>
              <span className="text-xs text-text-muted">{timeAgo(post?.createdAt)}</span>
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted"
            >
              <IoEllipsisHorizontal size={18} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-bg-primary border border-border-color rounded-lg shadow-lg py-1 w-40">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/profile/${post?.user?.id}`);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary"
                  >
                    View Profile
                  </button>
                  {post?.user?.id === user?.id && (
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-4 py-2 text-sm text-rvnp-red hover:bg-bg-secondary"
                    >
                      Delete Post
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {post?.sharedFrom && (
          <div className="mt-2 p-3 rounded-lg bg-bg-secondary border border-border-color">
            <div className="flex items-center gap-2">
              <Avatar
                src={post.sharedFrom.user?.avatarUrl}
                name={post.sharedFrom.user?.fullName}
                size="sm"
              />
              <span className="text-sm font-medium text-text-primary">
                {post.sharedFrom.user?.fullName}
              </span>
            </div>
            {post.sharedFrom.content?.text && (
              <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                {post.sharedFrom.content.text}
              </p>
            )}
            {post.sharedFrom.content?.images && post.sharedFrom.content.images.length > 0 && (
              <img
                src={post.sharedFrom.content.images[0]}
                alt="Shared"
                className="w-full rounded-lg mt-2 max-h-48 object-cover"
              />
            )}
          </div>
        )}

        {content?.text && (
          <p className="text-text-primary mt-3 whitespace-pre-wrap text-sm sm:text-base break-words">
            {content.text}
          </p>
        )}

        {content?.images && content.images.length > 0 && (
          <div className={`mt-3 grid gap-2 ${content.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {content.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post ${index + 1}`}
                className="w-full rounded-lg object-cover max-h-64 sm:max-h-96"
              />
            ))}
          </div>
        )}

        {content?.video && (
          <video
            src={content.video}
            controls
            className="w-full rounded-lg mt-3 max-h-64 sm:max-h-96"
          />
        )}

        {reactionCount > 0 && (
          <div className="mt-3">
            <ReactionSummary postId={post.id} />
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-color">
          <div className="flex items-center gap-1">
            <ReactionPicker
              currentReaction={currentReaction}
              onSelect={handleReaction}
              onRemove={handleRemoveReaction}
            />
            <span className="text-sm text-text-muted">{formatCount(reactionCount)}</span>
          </div>

          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"
          >
            <IoChatbubbleOutline size={20} />
            <span>{formatCount(commentCount)}</span>
          </button>

          <button
            onClick={handleShareOpen}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"
          >
            <IoShareOutline size={20} />
            <span>{formatCount(shareCount)}</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        title="Comments"
        size="md"
      >
        <CommentList
          postId={post.id}
          onCommentCountChange={setCommentCount}
        />
      </Modal>

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        post={post}
        onShared={handleShared}
      />
    </>
  );
};

export default PostCard;