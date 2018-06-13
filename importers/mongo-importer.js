import { MongoClient } from 'mongodb';

class MongoImporter {

  constructor(importer) {
    this.mongoUrl = importer.url;
    this.defaultDb = importer.db;
  }

  async connect() {
    this.instance = await MongoClient.connect(this.mongoUrl);
    this.db = this.instance.db(this.defaultDb);
  }

  async close() {
    await this.instance.close();

    this.instance = null;
    this.db = null;
  }

  async import(configuration, item) {
    if (!this.instance) await this.connect();
    const collection = this.db.collection(configuration.name);

    await collection.insertOne(item);
  }

};

export default MongoImporter;
