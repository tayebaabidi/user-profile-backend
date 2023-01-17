const express = require('express')
const User = require('../models/User.js')
const router = express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({ user })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    const users = await User.find()
    res.status(200).send({ users })
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            throw new Error('user not found')
        }
        res.status(200).send(user)
    } catch (e) {
        throw new Error(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const user = await User.findById(req.params.id)
    const history = {
        first_name: user.first_name == req.body.first_name ? undefined : user.first_name,
        last_name: user.last_name == req.body.last_name ? undefined : user.last_name,
        username: user.username == req.body.username ? undefined : user.username,
        height: user.height === req.body.height ? undefined : user.height,
        weight: user.weight === req.body.weight ? undefined : user.weight,
        modified_at: user.createdAt,
        modifications: user.__v
    }

    user.notes = user.notes.concat(history)
// to restrict that only these fields value can be updated. 
    const allowedUpdates = ['first_name', 'last_name', 'username', 'dob', 'email', 'height', 'weight']
// check validation for updates. 
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!user) {
        res.status(400).send({ error: 'No user found with the entered id.' })
    }
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }

        await user.remove()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
