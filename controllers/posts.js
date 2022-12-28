const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

module.exports = {
	getProfile: async (req, res) => {
		try {
			const posts = await Post.find({ user: req.user.id });
			res.render('profile.ejs', { posts: posts, user: req.user });
		} catch(error) {
			console.log(error);
		}
	},
	getFeed: async (req, res) => {
		try {
			const posts = await Post.find().sort({ createdAt: 'desc' }).lean();
			res.render('feed.ejs', { posts: posts });
		} catch (error) {
			console.log(error);
		}
	},
	createPost: async (req, res) => {
		try {
			// Upload image to cloudinary
			const result = await cloudinary.uploader.upload(req.file.path);

			await Post.create({
				title: req.body.title,
				image: result.secure_url,
				cloudinaryId: result.public_id,
				caption: req.body.caption,
				likes: 0,
				user: req.user.id,
			});
			console.log("Post has been added!");
			res.redirect("/profile");
		} catch (error) {
			console.log(error);
		}
	},
	getPost: async (req, res) => {
		try {
			const post = await Post.findById(req.params.id);
			res.render('post.ejs', { post: post, user: req.user });
		} catch (error) {
			console.log(error);
		}
	},
	likePost: async (req, res) => {
		try {
			const post = await Post.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } });
			console.log('likes +1');
			res.redirect('/post/' + req.params.id);
		} catch (error) {
			console.log(error);
		}
	}
};