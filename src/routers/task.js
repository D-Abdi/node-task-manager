const express = require('express')
const Task = require('../models/task')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { route } = require('./user')
const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        author: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    
})

// GET /tasks?completed=true||false
// limit && skip
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)   
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, author: req.user._id })

        if (!task) {
            return res.status(404).send()
        } else {
            res.send(task)
        }
    } catch (e) {
            res.status(400).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    // update params
    const updates = Object.keys(req.body)
    // what fields are allowed to be changed
    const allowedUpdates = ['description', 'completed']
    // variable checks every update made. if 1 is not valid, returns false
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // Checks if update is valid
    if (!isValidOperation) {
        res.status(400).send()
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })

        // does task exist?
        if (!task) {
            res.status(400).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    
    } catch (e) {
            res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })

        if (!task) {
            res.status(404).send()
        } 

        await task.remove()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router