const db = require("../data/config")

function findPostsByUserId(userId) {
        /*translates to 
			SELECT posts.id, posts.contents, users.username
			FROM posts
			JOIN users ON users.id = posts.user_id
			WHERE posts.user_id = ?;
        */  
        //remove const post = await and replace with a return
        //replace req.params.id with the parameter userId
		return db('posts as p')
			.innerJoin("users as u", "u.id", "p.user_id")
			.where("p.user_id", userId)
			.select("p.id", "p.contents", "u.username")
}

module.exports = {
    findPostsByUserId
}