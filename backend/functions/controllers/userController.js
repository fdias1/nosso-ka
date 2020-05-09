

module.exports = (db,env) => {
    const collection = `${env}-userdata`
    return {

        /**
         * HTTP: POST
         * Create a new user in database, if the username is already in use, the the user will not te created
         * req.body:
         * -> username: Unique user identifier string
         * -> Name: Name shown by system frontend
         */
        createUser: async (req,res) => {
            username = req.body.username;
            name = req.body.name;
            const newData = {
                username,
                name
            }
            if (!await (await db.collection(collection).doc(req.body.username).get()).data()) {
                await db.collection(collection).doc(req.body.username).create(newData)
                const result = await (await db.collection(collection).doc(req.body.username).get()).data()
                res.status(200).send(result)
            } else {
                res.status(500).send({err:"Username already exists"})
            }
        },

        /**
         * HTTP: GET
         * Get a specific user data in database.
         * req.params:
         * -> username: the unique identifier of a user
         */
        getUser: async (req,res) => {
            const result = await (await db.collection(collection).doc(req.params.username).get()).data()
            if (result) {
                res.status(200).send(result)
            } else {
                res.status(400).send("not found")
            }
        },

        /**
         * HTTP: GET
         * Get all users data
         */
        getAllUsers: async (req,res) => {
            let query = db.collection(collection)
            let response = []
            let snapshot = await query.get()
            let docs = await snapshot.docs
            for (let doc of docs) {
                const selectedItem = await doc.data()
                response.push(selectedItem)
            }
            res.status(200).send(response)
        },

        /**
         * HTTP: GET
         * Returns a boolean if there is such username in database.
         * req.params:
         * -> username: user unique identifier.
         */
        login: async (req,res) => {
            res.send(!await(await db.collection(collection).where('username','==',req.params.username).get()).empty)
        },
    }
}
