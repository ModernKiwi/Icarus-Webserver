import { mongoose } from '@typegoose/typegoose';

let db;

async function connect() {
  if (db) return db;

  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  const onConnected = (error) => {
    if (!error) return console.info('Mongo connected');
    console.error(error);
  };

  if (process.env.NODE_ENV === 'production') {
    db = await mongoose.connect(process.env.DATABASE_URL, connectionOptions, onConnected);
  } else {
    // In development, store the db connection in a global variable.
    // This is because the dev server purges the require cache on every request
    // and will cause multiple connections to be made.
    if (!global.__db) {
      global.__db = await mongoose.connect(
        process.env.DATABASE_URL,
        connectionOptions,
        onConnected
      );
    }
    db = global.__db;
  }
  return db;
}

export { mongoose, connect };
