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

  const listing = await Marketplace.create({
    title,
    description,
    price: parseFloat(price),
    category,
    images,
    userId,
    campusId: campusId || req.user.campusId,
  });

  res.status(201).json(ApiResponse.created(listing));
});

const getAllListings = asyncHandler(async (req, res) => {
  const { page, limit, campusId, category, search } = req.query;

  const data = await Marketplace.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    campusId,
    category,
    search,
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

const getMyListings = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await Marketplace.findByUser(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Marketplace.getCategories();

  res.json(ApiResponse.ok(categories));
});

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  markAsSold,
  getMyListings,
  getCategories,
};