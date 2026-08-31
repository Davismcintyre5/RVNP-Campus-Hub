const Legals = require('../../models/admin/Legals.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAll = asyncHandler(async (req, res) => {
  const legals = await Legals.getAll();
  res.json(ApiResponse.ok(legals));
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const legal = await Legals.getById(id);

  if (!legal) {
    throw ApiError.notFound('Legal document not found');
  }

  res.json(ApiResponse.ok(legal));
});

const create = asyncHandler(async (req, res) => {
  const { type, title, content } = req.body;

  if (!type || !title || !content) {
    throw ApiError.badRequest('Type, title, and content are required');
  }

  const legal = await Legals.create({
    type,
    title,
    content,
  });

  res.status(201).json(ApiResponse.created(legal));
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const data = {};
  if (title) data.title = title;
  if (content) data.content = content;

  const legal = await Legals.update(id, data);

  res.json(ApiResponse.ok(legal, 'Legal document updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Legals.remove(id);

  res.json(ApiResponse.ok(null, 'Legal document deleted successfully'));
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};