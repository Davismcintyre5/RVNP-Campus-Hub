import { useState, useEffect } from 'react';
import { IoSearch, IoPerson, IoGrid, IoVideocam, IoPeople, IoCalendar, IoStorefront } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import VerifiedBadge from '../components/ui/VerifiedBadge.jsx';
import searchApi from '../api/searchApi.js';
import timeAgo from '../utils/timeAgo.js';

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [results, setResults] = useState({
    users: [],
    posts: [],
    reels: [],
    groups: [],
    events: [],
    listings: [],
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const tabs = [
    { value: 'users', label: 'Users' },
    { value: 'posts', label: 'Posts' },
    { value: 'reels', label: 'Reels' },
    { value: 'groups', label: 'Groups' },
    { value: 'events', label: 'Events' },
    { value: 'marketplace', label: 'Marketplace' },
  ];

  useEffect(() => {
    if (query.trim() && searched) {
      handleSearch();
    }
  }, [activeTab]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      let response;

      switch (activeTab) {
        case 'users':
          response = await searchApi.searchUsers(query);
          if (response.data.success) {
            setResults((prev) => ({ ...prev, users: response.data.data.users }));
          }
          break;

        case 'posts':
          response = await searchApi.searchPosts(query);
          if (response.data.success) {
            setResults((prev) => ({ ...prev, posts: response.data.data.posts }));
          }
          break;

        case 'reels':
          response = await searchApi.searchReels(query);
          if (response.data.success) {
            setResults((prev) => ({ ...prev, reels: response.data.data.reels }));
          }
          break;

        case 'groups':
          response = await searchApi.searchGroups(query);
          if (response.data.success) {
            setResults((prev) => ({ ...prev, groups: response.data.data.groups }));
          }
          break;

        case 'events':
          response = await searchApi.searchEvents(query);
          if (response.data.success) {
            setResults((prev) => ({ ...prev, events: response.data.data.events }));
          }
          break;

        case 'marketplace':
          response = await searchApi.searchMarketplace(query);
          if (response.data.success) {
            setResults((prev) => ({ ...prev, listings: response.data.data.listings }));
          }
          break;
      }
    } catch (error) {
      console.error('Search failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearched(true);
    handleSearch();
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      );
    }

    if (!searched) {
      return (
        <EmptyState
          icon={IoSearch}
          title="Search"
          description="Search for users, posts, reels, groups, events, and marketplace items"
        />
      );
    }

    switch (activeTab) {
      case 'users':
        if (results.users.length === 0) {
          return <EmptyState title="No users found" />;
        }
        return (
          <div className="space-y-2">
            {results.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-color bg-bg-primary"
              >
                <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-text-primary">{user.fullName}</span>
                    {user.hdmVerified && <VerifiedBadge size={14} />}
                  </div>
                  {user.course && (
                    <span className="text-xs text-text-muted">{user.course}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'posts':
        if (results.posts.length === 0) {
          return <EmptyState title="No posts found" />;
        }
        return (
          <div className="space-y-2">
            {results.posts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl border border-border-color bg-bg-primary"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Avatar src={post.user?.avatarUrl} name={post.user?.fullName} size="sm" />
                  <span className="font-medium text-text-primary">{post.user?.fullName}</span>
                  <span className="text-xs text-text-muted">{timeAgo(post.createdAt)}</span>
                </div>
                <p className="text-text-primary">{post.content?.text}</p>
              </div>
            ))}
          </div>
        );

      case 'reels':
        if (results.reels.length === 0) {
          return <EmptyState title="No reels found" />;
        }
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.reels.map((reel) => (
              <div key={reel.id} className="aspect-video rounded-lg overflow-hidden bg-bg-secondary">
                <video src={reel.videoUrl} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );

      case 'groups':
        if (results.groups.length === 0) {
          return <EmptyState title="No groups found" />;
        }
        return (
          <div className="space-y-2">
            {results.groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-color bg-bg-primary"
              >
                <IoPeople size={24} className="text-text-muted" />
                <div>
                  <span className="font-medium text-text-primary">{group.name}</span>
                  <span className="text-xs text-text-muted ml-2">
                    {group._count?.members || 0} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'events':
        if (results.events.length === 0) {
          return <EmptyState title="No events found" />;
        }
        return (
          <div className="space-y-2">
            {results.events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-color bg-bg-primary"
              >
                <IoCalendar size={24} className="text-text-muted" />
                <div>
                  <span className="font-medium text-text-primary">{event.title}</span>
                  <span className="text-xs text-text-muted ml-2">{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'marketplace':
        if (results.listings.length === 0) {
          return <EmptyState title="No listings found" />;
        }
        return (
          <div className="space-y-2">
            {results.listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-color bg-bg-primary"
              >
                <IoStorefront size={24} className="text-text-muted" />
                <div>
                  <span className="font-medium text-text-primary">{listing.title}</span>
                  <span className="text-xs text-text-muted ml-2">
                    KSh {listing.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-4">
          Search
        </h1>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-4 py-2 rounded-lg bg-bg-secondary text-text-primary border border-border-color focus:outline-none placeholder:text-text-muted"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-bg-secondary text-text-primary border border-border-color hover:bg-bg-tertiary"
            >
              <IoSearch size={20} />
            </button>
          </div>
        </form>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4 pb-16 lg:pb-4">{renderResults()}</div>
      </div>
    </Layout>
  );
};

export default Search;