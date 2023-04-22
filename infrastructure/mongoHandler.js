const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');

const { username, userPassword, host, database } = require('../environmentVariableImporter');

const connectionString = `mongodb+srv://${username}:${userPassword}@${host}/?retryWrites=true&w=majority`

/**
 * Creates a mongo db client using the system's environment variables
 * @returns {Promise<MongoClient|*>}
 */
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

/**
 * Curried function that performs an operation on a collection
 * @param collectionName - collection name to perform the operation on
 * @param collectionOperation - async callback function that receives a collection and operates on it
 * @returns {Promise<*>} - promise that returns the output of the collectionOperation callback
 */
const performCollectionOperation = async (collectionName, collectionOperation) => {
    const client = await createClient();
    try {
        const db = await client.db(database);
        const collection = db.collection(collectionName);
        return await collectionOperation(collection);
    } catch (error) {
        console.error(error);
        return error;
    } finally {
        await client.close();
    }
}

const getAllFromCollection = async (collectionName) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.find({}).toArray()
);

const getDocumentFromCollectionById = async (collectionName, id) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.find({ 'id': id }).toArray()
);

const insertIdIntoDocument = (document) => ({ ...document, id: uuidv4() })
const postDocumentIntoCollection = async (collectionName, document) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.insertOne(insertIdIntoDocument(document))
);

const postDocumentsIntoCollection = async (collectionName, documents) => await performCollectionOperation(
    collectionName,
    async (collection) => await collection.insertMany(documents)
);

module.exports = {
    getAllFromCollection,
    getDocumentFromCollectionById,
    postDocumentIntoCollection,
    postDocumentsIntoCollection
}
