const mongoose = require('mongoose')
const { exec } = require('shelljs')
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
mongoose.connection.on('open',async (ref) => {
    console.log('Connected to mongo server.');
    collections = await mongoose.connection.db.collections()
    await Promise.all(collections.map(collection => {
        try {
          return collection.remove();
        } catch(err) {
            console.log(`failed to drop collection: ${collection}, with error: ${err}`)
        }
    })); 
    mongoose.disconnect()
    try {
      await exec(`npmx pm2 restart content`)
      await exec(`npm run populate-db`)
    } catch(err) {
      console.log(`failed to insert data with error: ${err}`)
    }
})
