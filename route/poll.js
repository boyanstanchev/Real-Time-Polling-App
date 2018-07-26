const express = require('express')
const router = express.Router()
const Pusher = require('pusher')
const mongoose = require('mongoose')

const Vote = require('../models/Vote')

let pusher = new Pusher({
    appId: '524478',
    key: '8aba2941a0d822254a2a',
    secret: '61a1f0fe1abaf2e1eaf4',
    cluster: 'eu',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then((votes) => {
        res.json({success: true,
        votes: votes})
    })
})

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    }

    new Vote(newVote).save()
        .then((vote) => {
            pusher.trigger('os-poll', 'os-vote', {
                points: parseInt(vote.points),
                os: req.body.os
            });

            return res.json({
                success: true,
                message: "Thank you for voting"
            })
        })
})

module.exports = router