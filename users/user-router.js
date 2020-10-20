const express = require("express")
const db = require("../data/config")
const { validateUserId } = require("./user-middleware")
const userModel = require("./user-model")

const router = express.Router()

router.get("/users", async (req, res, next) => {
	try {
		res.json(await db("users"))
	} catch(err) {
		next(err)
	}
})

router.get("/users/:id", validateUserId(), async (req, res, next) => {
	try {
		res.json(req.user)
	} catch(err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const [id] = await db("users").insert(req.body)
		const user = await db("users").where({ id }).first()

		res.status(201).json(user)
	} catch(err) {
		next(err)
	}
})

router.put("/users/:id", validateUserId(), async (req, res, next) => {
	try {
		const { id } = req.params
		await db("users").where({ id }).update(req.body)
		const user = await db("users").where({ id }).first()
		
		res.json(user)
	} catch(err) {
		next(err)
	}
})

router.delete("/users/:id", validateUserId(), async (req, res, next) => {
	try {
		const { id } = req.params
		await db("users").where({ id }).del()

		res.status(204).end()
	} catch(err) {
		next(err)
	}
})

router.get("/users/:id/posts", async (req, res, next) => {
	try {
		//moved the function over to model file and called the function
		///*translates to 
		// 	SELECT posts.id, posts.contents, users.username
		// 	FROM posts
		// 	JOIN users ON users.id = posts.user_id
		// 	WHERE posts.user_id = ?;
		// */
		// const posts = await db('posts as p')
		// 	.innerJoin("users as u", "u.id", "p.user_id")
		// 	.where("p.user_id", req.params.id)
		// 	.select("p.id", "p.contents", "u.username")
		const posts = await userModel.findPostsByUserId(req.params.id)

		res.json(posts)
	} catch(err) {
		next(err)
	}
})

module.exports = router
