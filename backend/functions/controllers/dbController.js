

module.exports = function dbcontroller (db,env) {
    const collection = `${env}-users`
    return {

        CreateUser: async (req,res) => {
            const newData = {
                km:0,
                gas:0,
                balance:0,
                username:req.body.username,
            }
            await db.collection(collection).doc(req.body.username).create(newData)
            const result = await (await db.collection(collection).doc(req.body.username).get()).data()
            res.status(200).send(result)
        },

        addKm: async (req,res) => {
            const username = req.body.username
            const kmToAdd = req.body.value
            const currentKm = (await (await db.collection(collection).doc(username).get()).data()).km
            const sum = currentKm+kmToAdd
            await db.collection(collection).doc(username).update({km:sum})
            const result = await (await db.collection(collection).doc(username).get()).data()
            res.status(200).send(result)
        },

        addGas: async (req,res) => {
            const username = req.body.username
            const gasToAdd = req.body.value
            const currentGas = (await (await db.collection(collection).doc(username).get()).data()).gas
            const sum = currentGas+gasToAdd
            await db.collection(collection).doc(username).update({gas:sum})
            const result = await (await db.collection(collection).doc(username).get()).data()
            res.status(200).send(result)
        },

        updateBalance: async (req,res) => {
            const username = req.body.username
            const amount = req.body.value
            const currentBalance = (await (await db.collection(collection).doc(username).get()).data()).balance
            const sum = currentBalance+amount
            await db.collection(collection).doc(username).update({balance:sum})
            const result = await (await db.collection(collection).doc(username).get()).data()
            res.status(200).send(result)
        },

        getUsersData: async (req,res) => {
            if(req.params.username){
                const username = req.params.username
                response = await (await db.collection(collection).doc(username).get()).data()
                res.status(200).send(response)
            } else {
                let query = db.collection(collection)
                let response = []
                let snapshot = await query.get()
                let docs = await snapshot.docs
                for (let doc of docs) {
                    const selectedItem = await doc.data()
                    response.push(selectedItem)
                }
                const allUsers = []
                response.forEach(data => allUsers.push(data))
                res.status(200).send(allUsers)
            }
        },

        reset: async (req,res) => {
            if(req.params.username){
                const username = req.params.username
                response = await db.collection(collection).doc(username).update({
                    km:0,
                    gas:0,
                })
                res.status(200).send(response)
            } else {
                let query = db.collection(collection)
                let response = []
                let snapshot = await query.get()
                let docs = await snapshot.docs
                for (let doc of docs) {
                    const selectedItem = await doc.data()
                    response.push(selectedItem)
                }
                const allUsers = []
                response.forEach(data => allUsers.push(data.username))
                allUsers.forEach(async user => {
                    await db.collection(collection).doc(user).update({
                        km:0,
                        gas:0,
                    })
                })
                res.status(200).send(allUsers)
            }
        },

        resetBalance: async (req,res) => {
            if(req.params.username){
                const username = req.params.username
                response = await db.collection(collection).doc(username).update({
                    balance:0,
                })
                res.status(200).send(response)
            } else {
                let query = db.collection(collection)
                let response = []
                let snapshot = await query.get()
                let docs = await snapshot.docs
                for (let doc of docs) {
                    const selectedItem = await doc.data()
                    response.push(selectedItem)
                }
                const allUsers = []
                response.forEach(data => allUsers.push(data.username))
                allUsers.forEach(async user => {
                    await db.collection(collection).doc(user).update({
                        balance:0,
                    })
                })
                res.status(200).send(allUsers)
            }
        },

    }
}