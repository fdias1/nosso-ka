const collection = 'userdata'


module.exports = (db) => {
    return {

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

        getUser: async (req,res) => {
            const result = await (await db.collection(collection).doc(req.params.username).get()).data()
            if (result) {
                res.status(200).send(result)
            } else {
                res.status(400).send("not found")
            }
        },

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
    }
}
