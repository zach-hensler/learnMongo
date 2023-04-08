const { MongoClient } = require('mongodb');
const { username, userPassword, host, database } = require('../environmentVariableImporter');

const connectionString = `mongodb+srv://${username}:${userPassword}@${host}/?retryWrites=true&w=majority`

const createClient = async () => {
    try {
        const client = new MongoClient(connectionString);
        await client.connect();
        return client;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const createDB = async (client) => client.db(database);

/**
 *
 * Curried function that performs an operation on a collection
 * @param collectionName - collection name to perform the operation on
 * @param collectionOperation - async callback function that receives a collection and operates on it
 * @returns {Promise<*>} - promise that returns the output of the collectionOperation callback
 */
const performCollectionOperation = async (collectionName, collectionOperation) => {
    const client = await createClient();
    try {
        const db = await createDB(client);
        const collection = db.collection(collectionName);
        return await collectionOperation(collection);
    } catch (error) {
        console.error(error);
        return error;
    } finally {
        await client.close();
    }
}

/**
 * Get all documents in collectionName
 * @param collectionName - Collection to get all documents from
 * @returns {Promise<*|undefined>} - Promise containing a list of documents
 */
const getAllFromCollection = async (collectionName) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.find({}).toArray()
);

const getDocumentFromCollectionById = async (collectionName, id) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.find({ 'id': id }).toArray()
);

const putDocumentInCollection = async (collectionName, document) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.insertOne(document)
);

const putDocumentsInCollection = async (collectionName, documents) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.insertMany(documents)
);

module.exports = {
    getAllFromCollection,
    getDocumentFromCollectionById,
    putDocumentInCollection,
    putDocumentsInCollection
}
