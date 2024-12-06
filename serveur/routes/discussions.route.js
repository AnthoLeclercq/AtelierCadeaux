const express = require('express');
const {
    createDiscussion,
    getAllDiscussions,
    getDiscussionsByClientId,
    getDiscussionsByArtisanId,
    updateDiscussionById
} = require('../controllers/discussions.controller');

const router = express.Router();

router.post('', createDiscussion);
router.get('', getAllDiscussions);
router.get('/client/:client_id', getDiscussionsByClientId);
router.get('/artisan/:artisan_id', getDiscussionsByArtisanId);
router.put("/:discussion_id", updateDiscussionById);

module.exports = router;

