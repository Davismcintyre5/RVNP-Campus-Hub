const Marketplace = require('../../models/client/Marketplace.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const createListing = asyncHandler(async (req, res) => {
  const { title, description, price, category, images, campusId } = req.body;
  const userId = req.user.id;

  if (!title || !price || !category) {
    throw ApiError.badRequest('Title, price, and category are required');
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const listing = await Marketplace.create({
    title,
    description,
    price: parseFloat(price),
    category,
    images: images || [],
    userId,
    campusId: campusId || req.user.campusId,
    expiresAt,
  });

  res.status(201).json(ApiResponse.created(listing));
});

const getAllListings = asyncHandler(async (req, res) => {
  const { page, limit, campusId, category, search, minPrice, maxPrice, status } = req.query;

  const data = await Marketplace.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    campusId,
    category,
    search,
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    status: status || 'ACTIVE',
  });

  res.json(ApiResponse.ok(data));
});

const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const listing = await Marketplace.findById(id);

  if (!listing || listing.status === 'REMOVED') {
    throw ApiError.notFound('Listing not found');
  }

  res.json(ApiResponse.ok(listing));
});

const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, images } = req.body;
  const userId = req.user.id;

  const listing = await Marketplace.findById(id);

  if (!listing || listing.status === 'REMOVED') {
    throw ApiError.notFound('Listing not found');
  }

  if (listing.userId !== userId) {
    throw ApiError.forbidden('You can only update your own listings');
  }

  const data = {};
  if (title) data.title = title;
  if (description !== undefined) data.description = description;
  if (price) data.price = parseFloat(price);
  if (category) data.category = category;
  if (images) data.images = images;

  const updated = await Marketplace.update(id, data);

  res.json(ApiResponse.ok(updated, 'Listing updated successfully'));
});

const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const listing = await Marketplace.findById(id);

  if (!listing || listing.status === 'REMOVED') {
    throw ApiError.notFound('Listing not found');
  }

  if (listing.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own listings');
  }

  await Marketplace.softDelete(id);

  res.json(ApiResponse.ok(null, 'Listing removed successfully'));
});

const markAsSold = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const listing = await Marketplace.findById(id);

  if (!listing || listing.status === 'REMOVED') {
    throw ApiError.notFound('Listing not found');
  }

  if (listing.userId !== userId) {
    throw ApiError.forbidden('You can only mark your own listings as sold');
  }

  await Marketplace.markAsSold(id);

  res.json(ApiResponse.ok(null, 'Listing marked as sold'));
});

const markAsActive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const listing = await Marketplace.findById(id);

  if (!listing) {
    throw ApiError.notFound('Listing not found');
  }

  if (listing.userId !== userId) {
    throw ApiError.forbidden('You can only update your own listings');
  }

  await Marketplace.markAsActive(id);

  res.json(ApiResponse.ok(null, 'Listing reactivated'));
});

const getMyListings = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;

  const data = await Marketplace.findByUser(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
  });

  res.json(ApiResponse.ok(data));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Marketplace.getCategories();

  res.json(ApiResponse.ok(categories));
});

const addOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, message } = req.body;
  const userId = req.user.id;

  if (!amount) {
    throw ApiError.badRequest('Offer amount is required');
  }

  const listing = await Marketplace.findById(id);

  if (!listing || listing.status !== 'ACTIVE') {
    throw ApiError.notFound('Listing not found or not active');
  }

  if (listing.userId === userId) {
    throw ApiError.badRequest('You cannot make an offer on your own listing');
  }

  const offer = await Marketplace.addOffer(id, userId, parseFloat(amount), message);

  await notificationService.createNotification({
    userId: listing.userId,
    type: 'MARKETPLACE',
    title: 'New Offer',
    body: `${req.user.fullName} offered KSh ${amount} for "${listing.title}"`,
    data: { listingId: id },
  });

  res.json(ApiResponse.ok(offer, 'Offer submitted'));
});

const getOffers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const listing = await Marketplace.findById(id);

  if (!listing) {
    throw ApiError.notFound('Listing not found');
  }

  if (listing.userId !== userId) {
    throw ApiError.forbidden('Only seller can view offers');
  }

  const offers = await Marketplace.getOffers(id);

  res.json(ApiResponse.ok(offers));
});

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  markAsSold,
  markAsActive,
  getMyListings,
  getCategories,
  addOffer,
  getOffers,
};