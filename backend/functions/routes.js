const express = require('express')
module.exports = function setDatabase(db){

    const controllers = require('./controllers/dbController')(db)
    const userCOntroller = require('./controllers/userController')(db)
    const routes = express.Router()
    
    routes.get('/welcome',(req,res) => res.send('welcome!'))
    routes.post('/new',controllers.CreateUser)
    routes.post('/addkm', controllers.addKm)
    routes.post('/addgas', controllers.addGas)
    routes.post('/updatebalance', controllers.updateBalance)
    routes.get('/get', controllers.getUsersData)
    routes.get('/get/:username', controllers.getUsersData)
    routes.get('/reset', controllers.reset)
    routes.get('/resetbalance', controllers.resetBalance)
    routes.post('/users/new')

    return routes
}