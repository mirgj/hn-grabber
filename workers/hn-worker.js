import request from 'request-promise-native';
import config from '../config';
import MongoImporter from '../importers/mongo-importer';
import mapper from '../mappers/index';

const process = async(word) => {
  const importer = new MongoImporter(config.importers.mongo);

  try {
    let page = 0;
    let elements = 0;
    let hasResult = true;

    do {
      const url = config.base_url + word + '&page=' + (page++);

      try {
        const jsonResult = await request(url);
        const parsedResult = JSON.parse(jsonResult);
        hasResult = parsedResult.hits.length > 0;

        for (let i = 0; i < parsedResult.hits.length; i++) {
          const item = parsedResult.hits[i];
          if (!item) console.error('empty item, will be skipped');
          if (item && item.title && item.url) {
            const mappedObject = mapper(config.importers.mongo.collections.stories.mapper)(config.importers.mongo.collections.stories.mappings, item);
            await importer.import(config.importers.mongo.collections.stories, mappedObject);
            elements++;
          }
        }
      } catch (err) {
        console.error(`Error processing the items: ${err}`);
      }
    } while (hasResult);

    await importer.close();

    console.log(`Finished: ${elements} elements has been imported`);
  } catch (err) {
    console.error(`Generic error: ${err}`);
  }
};

export default process;
