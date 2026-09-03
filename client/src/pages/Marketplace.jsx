import { useState, useEffect } from 'react';
import { IoStorefront, IoAdd, IoLocation } from 'react-icons/io5';
import Layout from '../components/layout/Layout.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input from '../components/ui/Input.jsx';
import Dropdown from '../components/ui/Dropdown.jsx';
import marketplaceApi from '../api/marketplaceApi.js';
import { formatPrice } from '../utils/formatNumber.js';
import timeAgo from '../utils/timeAgo.js';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
  });
  const [creating, setCreating] = useState(false);

  const categories = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Books', label: 'Books' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Services', label: 'Services' },
    { value: 'Other', label: 'Other' },
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);

    try {
      const response = await marketplaceApi.getAllListings();

      if (response.data.success) {
        setListings(response.data.data.listings || []);
      }
    } catch (error) {
      console.error('Failed to load listings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newListing.title.trim() || !newListing.price) return;

    setCreating(true);

    try {
      const response = await marketplaceApi.createListing({
        ...newListing,
        price: parseFloat(newListing.price),
      });

      if (response.data.success) {
        setShowCreate(false);
        setNewListing({ title: '', description: '', price: '', category: 'Electronics' });
        fetchListings();
      }
    } catch (error) {
      console.error('Failed to create listing:', error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Marketplace
          </h1>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <IoAdd className="inline mr-1" size={16} />
            Sell
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={IoStorefront}
            title="No listings"
            description="Buy and sell items within your campus!"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="p-4 rounded-xl border border-border-color bg-bg-primary"
              >
                <h3 className="font-medium text-text-primary truncate">
                  {listing.title}
                </h3>

                {listing.description && (
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {listing.description}
                  </p>
                )}

                <p className="font-semibold text-text-primary mt-2">
                  {formatPrice(listing.price)}
                </p>

                <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                  <span className="px-2 py-1 rounded bg-bg-secondary">
                    {listing.category}
                  </span>
                  <span>{timeAgo(listing.createdAt)}</span>
                </div>

                {listing.campus && (
                  <span className="flex items-center gap-1 text-xs text-text-muted mt-2">
                    <IoLocation size={12} />
                    {listing.campus.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          title="Create Listing"
          size="sm"
        >
          <div className="space-y-4">
            <Input
              label="Title"
              value={newListing.title}
              onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
              placeholder="What are you selling?"
              required
            />
            <Input
              label="Description"
              value={newListing.description}
              onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
              placeholder="Describe your item"
            />
            <Input
              label="Price (KSh)"
              type="number"
              value={newListing.price}
              onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
              placeholder="0"
              required
            />
            <Dropdown
              label="Category"
              options={categories}
              value={newListing.category}
              onChange={(value) => setNewListing({ ...newListing, category: value })}
            />
            <Button fullWidth onClick={handleCreate} loading={creating}>
              Create Listing
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Marketplace;