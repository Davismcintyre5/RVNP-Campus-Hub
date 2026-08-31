const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAbout = asyncHandler(async (req, res) => {
  res.json(
    ApiResponse.ok({
      appName: 'RVNP Campus Hub',
      tagline: 'RVNP Connected',
      description: 'All-in-one social interaction app for Rift Valley National Polytechnic',
      campuses: [
        'Main Campus',
        'Nakuru City Campus',
        'Kericho Campus',
        'Mwachon Campus',
        'Kureisoi Campus',
      ],
      version: '1.0.0',
      developer: 'Davis Okoth',
      company: 'HDM',
    })
  );
});

const getTerms = asyncHandler(async (req, res) => {
  res.json(
    ApiResponse.ok({
      title: 'Terms of Service',
      lastUpdated: new Date().toISOString(),
      sections: [
        {
          heading: 'Acceptance of Terms',
          content: 'By using RVNP Campus Hub, you agree to these terms.',
        },
        {
          heading: 'User Conduct',
          content: 'Users must behave respectfully and follow community guidelines.',
        },
        {
          heading: 'Content Ownership',
          content: 'Users retain ownership of their content.',
        },
      ],
    })
  );
});

const getPrivacy = asyncHandler(async (req, res) => {
  res.json(
    ApiResponse.ok({
      title: 'Privacy Policy',
      lastUpdated: new Date().toISOString(),
      sections: [
        {
          heading: 'Data Collection',
          content: 'We collect data necessary for account management and app functionality.',
        },
        {
          heading: 'Data Usage',
          content: 'Your data is used to provide and improve our services.',
        },
        {
          heading: 'Data Protection',
          content: 'We implement security measures to protect your information.',
        },
      ],
    })
  );
});

module.exports = {
  getAbout,
  getTerms,
  getPrivacy,
};