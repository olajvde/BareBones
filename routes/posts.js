var express = require("express");
var router = express.Router();
const {requireAuth, checkUser} = require("../middleware/auth");

const {
  post,
  homePosts,
  getPost,
  yourPosts,
  allPosts,
} = require("../controllers/posts");

router.get("/create-post", checkUser, requireAuth, (req, res) => {
  res.render("createPost");
});
router.post("/create-post", post);
router.get("/all-posts", allPosts);
router.get("/your-posts", checkUser, yourPosts);
router.get("/:id", getPost);

router.get("/", homePosts);

module.exports = router;
