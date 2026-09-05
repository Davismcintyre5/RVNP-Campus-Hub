const express = require('express');
const router = express.Router();
const marketplaceController = require('../../controllers/client/marketplaceController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', marketplaceController.createListing);
router.get('/', marketplaceController.getAllListings);
router.get('/categories', marketplaceController.getCategories);
router.get('/my-listings', marketplaceController.getMyListings);
router.get('/:id', marketplaceController.getListingById);
router.put('/:id', marketplaceController.updateListing);
router.delete('/:id', marketplaceController.deleteListing);
router.put('/:id/sold', marketplaceController.markAsSold);
router.put('/:id/active', marketplaceController.markAsActive);
router.post('/:id/offers', marketplaceController.addOffer);
router.get('/:id/offers', marketplaceController.getOffers);

module.exports = router;