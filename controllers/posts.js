const Post = require("../models/post");

const handleErrors = (err) => {
  const errors = {title: "", body: ""};

  if (err.message === "Please enter a title") {
    errors.title = "Please enter a title";
    return errors;
  }

  if (err.message === "Whats Your Post about?") {
    errors.body = "Whats Your Post about?";
    return errors;
  }

  if (err.message.includes("post validation failed")) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//create post 👀
module.exports.post = async (req, res) => {
  const {title, body, author} = req.body;
  try {
    const post = await Post.create({title, body, author});
    // res.status(200).json({msg: "Post Created"});
    req.flash("success", "Post Created");
    res.redirect("/");
  } catch (err) {
    const errors = handleErrors(err);
    if (errors.title) {
      req.flash("error", errors.title);
    }
    if (errors.body) {
      req.flash("error", errors.body);
    }

    res.redirect("/posts/create-post");
  }
};

//get the latest five posts

module.exports.homePosts = async (req, res) => {
  Post.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.send("Error!!");
    }
    res.render("index", {posts: docs});
  })
    .limit(5)
    .sort({createdAt: -1});
};

//get post by id

module.exports.getPost = async (req, res) => {
  Post.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("perPost", {posts: doc});
      console.log(res.locals.user.username);
    }
  });
};

//Every User's personal posts
module.exports.yourPosts = async (req, res) => {
  Post.find({author: res.locals.user.username}, (err, docs) => {
    if (err) {
      req.flash("error", "You Have not posted anything or Log in");
      res.redirect("/");
    } else {
      res.render("yourPosts", {yours: docs});
      
    }
  }).sort({createdAt: -1});
};

module.exports.allPosts = async (req, res) => {
  Post.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.send("Error!!");
    }
    res.render("index", {posts: docs});
  })
  .sort({createdAt: -1});
};
