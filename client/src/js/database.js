import { openDB } from 'idb';

const initdb = async () =>
  // we are creating a new db named 'jate' which will be using version 1 of the db.
  openDB('jate', 1, {
    // add our db schema if it has not already been initialized.
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      // create a new object store for the data and give it a key name of 'id' which needs to increment automatically.
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database

// it's interesting how it's like one after the other, calling each other.

export const putDb = async (content) => {
  console.log('adding to database (put).');
  // create a connection to the database and version we want to use.
  const jateDb = await openDB('jate', 1);
  // create a new transaction and specify the db and data privileges.
  const tx = jateDb.transaction('jate', 'readwrite');
  // open up the desired object store.
  const store = tx.objectStore('jate');
  // use the .put() method on the store and pass in the context.
  const request = store.put({ jate: content });
  // confirmation of the request.
  const result = await request;
  console.log('nice. data saved to database.', result);
};

// TODO: Add logic for a method that gets all the content from the database

export const getDb = async () => {
  console.log('getting from database.');
  // create connection to the db and version.
  const jateDb = await openDB('jate', 1);
  // create new tx and specify the db and data privileges.
  const tx = jateDb.transaction('jate', 'readwrite');
  // open the desired object store.
  const store = tx.objectStore('jate');
  // use .getAll() method to get data in db.
  const request = store.getAll();
  // confirmation of request.
  const result = await request;
  console.log('result.value', result);
  return result.jate;
}

initdb();
