const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://Boyan:asd@ds119090.mlab.com:19090/pusherpollapp')
    .then(() => {
    console.log('MongoDB Connected!')
})
    .catch((err) => {
        console.log(err)
    })