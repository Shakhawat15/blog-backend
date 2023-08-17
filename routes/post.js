const express = require('express');
const {auth} = require("../middlewares/auth");
const {create, list, read, remove, update, postByAuthor} = require("../controllers/PostController");
const router = express.Router();

router.post('/post', auth, create);
router.get('/posts', list);
router.get('/post/:id', read);
router.get('/postByAuthor', auth, postByAuthor);
router.delete('/post/:id', auth, remove);
router.put('/post/:id', auth, update);

module.exports = router;