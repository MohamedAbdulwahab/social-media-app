const Comment = require("../models/Comment");

module.exports = {
	createComment: async (req, res) => {
		console.log(req.body.comment);
		try {
			await Comment.create({
				comment: req.body.comment,
				likes: 0,
				post: req.params.id,
			});
			console.log('Comment Added');
			res.redirect("/post/" + req.params.id);
		} catch (error) {
			console.log(error);
		}
	},
};