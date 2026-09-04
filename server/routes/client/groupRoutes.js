const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/client/groupController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', groupController.createGroup);
router.get('/', groupController.getAllGroups);
router.get('/my-groups', groupController.getMyGroups);
router.get('/:id', groupController.getGroupById);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.get('/:id/members', groupController.getGroupMembers);
router.post('/:id/join', groupController.joinGroup);
router.delete('/:id/leave', groupController.leaveGroup);
router.post('/:id/invite', groupController.inviteToGroup);
router.post('/:id/posts', groupController.createGroupPost);
router.get('/:id/posts', groupController.getGroupPosts);

module.exports = router;