
module.exports = (db,env) => {
    const collection = `${env}-entries`
    return {
        /**
         * HTTP: POST
         * Create a new entry in database
         * req.body:
         * -> username: Username of the user of that entry
         * -> value: Numerical value of the entry (the real meaning depends of the type of entry)
         * -> type: the type of entry ('km', 'gas' or 'balance')
         */
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

        /**
         * HTTP: POST
         * Get all entries based on a query (where '=='), if no argument is passed, it will return all entries
         * req.body:
         * -> username (optional)
         * -> type (optional)
         * -> active (optional)
         */
        getEntriesByQuery: async (req,res) => {
            let query = db.collection(collection)
            /**
             * For technical limitations in firestore database, the filter by date 
             * will be a frontend resposability
             */
            /*
            if (req.body.before) {
                query = query.where('date','<=', timeStamp.fromDate(new Date(req.body.before)))
            }
            if (req.body.after) {
                query = query.where('date','>=', timeStamp.fromDate(new Date(req.body.after)))
            }
            */

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

        /**
         * HTTP: GET
         * Close all active entries of some type in database.
         * req.params:
         * -> type: the type os the data you want to close
         */
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