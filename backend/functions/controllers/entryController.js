const collection = 'entries'


module.exports = (db,timeStamp) => {
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

        getEntriesByQuery: async (req,res) => {
            let query = db.collection(collection)
            if (req.body.before) {
                query = query.where('date','<=', timeStamp.fromDate(new Date(req.body.before)))
            }
            if (req.body.after) {
                query = query.where('date','>=', timeStamp.fromDate(new Date(req.body.after)))
            }
            if (req.body.username) {
                query = query.where('username','==', req.body.username)
            }
            if (req.body.type) {
                query = query.where('type','==', req.body.type)
            }
            /**
             * the attribute 'active' can assume a boolean false value as a valid value,
             * so, when you query to find 'false' entries, the filter may be ignored because
             * the value of the attribute is considered and not just its existence.
             */
            if (req.body.active != undefined) {
                query = query.where('active','==', req.body.active)
            }

            let response = []
            let snapshot = await query.get()
            let docs = await snapshot.docs
            for (let doc of docs) {
                const selectedItem = await doc.data()
                response.push(selectedItem)
            }
            res.status(200).send(response)
        },

        closeEntries: async (req,res) => {
            let response = []
            let query = await db.collection(collection)
            .where('active','==',true)
            .where('type','==',req.params.type)
            .get()
            const docs = await query.docs.forEach(doc => response.push(doc.ref))
            response.forEach(document => document.update({active:false}))
            res.send(response)
        }
        
    }
}