import mongoose from 'mongoose';

let db;

connect();

async function connect() {
  if (db) return db;

  if (process.env.NODE_ENV === 'production') {
    db = await mongoose.connect(process.env.DATABASE_URL, (error) => {
      if (!error) return console.info('Mongo connected');
      console.error(error);
    });
  } else {
    // in development, need to store the db connection in a global variable
    // this is because the dev server purges the require cache on every request
    // and will cause multiple connections to be made
    if (!global.__db) {
      global.__db = await mongoose.connect(process.env.DATABASE_URL, (error) => {
        if (!error) return console.info('Mongo connected');
        console.error(error);
      });
    }
    db = global.__db;
  }
  return db;
}

export { mongoose, connect };
