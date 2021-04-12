var express = require("express");
var router = express.Router();
const {homePosts} = require("../controllers/posts");

/* GET home page. */
router.get("/", homePosts);

module.exports = router;
