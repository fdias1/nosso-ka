const collection = 'entries'


module.exports = (db) => {
    return {

        newEntry: async (req,res) => {
            username = req.body.username;
            value = req.body.value;
            type = req.body.type;
            date = new Date()

            const newData = {
                username,
                value,
                type,
                date,
                active:true,
            }
            const result = await db.collection(collection).add(newData)
            res.status(200).send(result)
        },

        getAllEntries: async (req,res) => {
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