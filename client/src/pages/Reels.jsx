import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoShareOutline } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import VerifiedBadge from '../components/ui/VerifiedBadge.jsx';
import reelApi from '../api/reelApi.js';
import { formatCount } from '../utils/formatNumber.js';

const Reels = () => {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const videoRefs = useRef({});

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key, index) => {
      const video = videoRefs.current[key];
      if (video) {
        if (index === currentIndex) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  const fetchReels = async () => {
    setLoading(true);

    try {
      const response = await reelApi.getReelFeed();

      if (response.data.success) {
        setReels(response.data.data.reels || []);
      }
    } catch (error) {
      console.error('Failed to load reels:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reelId) => {
    if (liked[reelId]) {
      setLiked((prev) => ({ ...prev, [reelId]: false }));
      await reelApi.unlikeReel(reelId);
    } else {
      setLiked((prev) => ({ ...prev, [reelId]: true }));
      await reelApi.likeReel(reelId);
    }
  };

  const handleScroll = (e) => {
    const container = e.target;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setCurrentIndex(index);
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

  if (reels.length === 0) {
    return (
      <Layout>
        <EmptyState
          title="No reels yet"
          description="Short videos will appear here!"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="w-full h-[calc(100vh-10rem)] lg:h-[calc(100vh-7rem)] overflow-y-scroll snap-y snap-mandatory"
        onScroll={handleScroll}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="h-full snap-start relative bg-black flex items-center justify-center"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={reel.videoUrl}
              poster={reel.thumbnailUrl}
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar
                      src={reel.user?.avatarUrl}
                      name={reel.user?.fullName}
                      size="sm"
                      onClick={() => navigate(`/profile/${reel.user?.id}`)}
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-white font-medium text-sm">
                          {reel.user?.fullName}
                        </span>
                        {reel.user?.hdmVerified && <VerifiedBadge size={12} />}
                      </div>
                    </div>
                  </div>

                  {reel.caption && (
                    <p className="text-white text-sm mb-2">{reel.caption}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                  <button
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center text-white"
                  >
                    {liked[reel.id] ? (
                      <IoHeart size={28} className="text-red-500" />
                    ) : (
                      <IoHeartOutline size={28} />
                    )}
                    <span className="text-xs">{formatCount(reel.likeCount)}</span>
                  </button>

                  <button className="flex flex-col items-center text-white">
                    <IoChatbubbleOutline size={28} />
                    <span className="text-xs">{formatCount(reel.commentCount)}</span>
                  </button>

                  <button className="flex flex-col items-center text-white">
                    <IoShareOutline size={28} />
                    <span className="text-xs">{formatCount(reel.shareCount)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Reels;