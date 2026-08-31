const Settings = require('../../models/admin/Settings.js');
const Legals = require('../../models/admin/Legals.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getGeneralSettings();

  const publicSettings = {
    appName: settings.appName || 'RVNP Campus Hub',
    tagline: settings.tagline || 'RVNP Connected',
    supportEmail: settings.supportEmail || 'support@rvnp.ac.ke',
    supportPhone: settings.supportPhone || '+254700000000',
    logoUrl: settings.logoUrl || null,
    faviconUrl: settings.faviconUrl || null,
    emailLogoUrl: settings.emailLogoUrl || null,
    registrationEnabled: settings.registrationEnabled !== undefined ? settings.registrationEnabled : true,
  };

  res.json(ApiResponse.ok(publicSettings));
});

const getPublicLegals = asyncHandler(async (req, res) => {
  const legals = await Legals.getAll();

  const formattedLegals = legals.map((legal) => ({
    id: legal.id,
    type: legal.type,
    title: legal.title,
    content: legal.content,
    updatedAt: legal.updatedAt,
  }));

  res.json(ApiResponse.ok(formattedLegals));
});

const getPublicLegalByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  const legalType = type.toUpperCase();

  const legals = await Legals.getAll();
  const legal = legals.find((l) => l.type === legalType);

  if (!legal) {
    return res.json(ApiResponse.ok(null, 'No content found'));
  }

  res.json(
    ApiResponse.ok({
      id: legal.id,
      type: legal.type,
      title: legal.title,
      content: legal.content,
      updatedAt: legal.updatedAt,
    })
  );
});

module.exports = {
  getPublicSettings,
  getPublicLegals,
  getPublicLegalByType,
};