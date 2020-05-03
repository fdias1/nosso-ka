const express = require('express')
module.exports = function setDatabase(db,timeStamp){

    const controllers = require('./controllers/dbController')(db)
    const userController = require('./controllers/userController')(db)
    const entryController = require('./controllers/entryController')(db,timeStamp)
    const routes = express.Router()
    
    /**
     * TEST ENDPOINTS
     */
    
     routes.get('/welcome',(req,res) => res.send('welcome!'))
    
    
     /**
     * OLD ENDPOINTS
     */
    
     routes.post('/new',controllers.CreateUser) //replaced by /users/new
    routes.post('/addkm', controllers.addKm) // replaced by /entry/new
    routes.post('/addgas', controllers.addGas) // replaced by /entry/new
    routes.post('/updatebalance', controllers.updateBalance) // replaced by /entry/new
    routes.get('/get', controllers.getUsersData) // replaced by /users/getall
    routes.get('/get/:username', controllers.getUsersData) // replaced by /users/get
    routes.get('/reset', controllers.reset) // replaced by /summary
    routes.get('/resetbalance', controllers.resetBalance) // replaced by /summary
    

    /**
     * NEW ENDPOINTS
     */

    // USER ENDPOINTS
    routes.post('/users/new', userController.createUser)
    routes.get('/users/get/:username', userController.getUser)
    routes.get('/users/getall', userController.getAllUsers)
    // ENTRY ENDPOINTS
    routes.post('/entry/new', entryController.newEntry)
    routes.post('/entry/query', entryController.getEntriesByQuery)
    // SUMMARY ENDPOINT
    routes.get('/summary/:type', entryController.closeEntries)


    return routes
}