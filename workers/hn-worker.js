import request from 'request-promise-native';
import config from '../config';
import MongoImporter from '../importers/mongo-importer';
import mapper from '../mappers/index';

const process = async(max_id, min_id) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const years = 365 * 24 * 60 * 60 * 2;
    const regex = new RegExp(config.to_find, 'i');
    const importer = new MongoImporter(config.importers.mongo);
    let keep = true;
    let elements = 0;

    do {
      const url = config.base_url + 'item/' + max_id + '.json';
      console.log('Getting: ' + url);

      const result = await request(url);
      const item = JSON.parse(result);
      if (!item) console.error('empty item, will be skipped');
      if (item && item.type === 'story' && item.url && !item.deleted) {
        if (regex.exec(item.title) !== null || regex.exec(item.url) !== null) {
          console.log('Item found. Importing...');
          const mappedObject = mapper(config.importers.mongo.collections.stories.mapper)(config.importers.mongo.collections.stories.mappings, item);
          await importer.import(config.importers.mongo.collections.stories, mappedObject);

          console.log('Item imported...');
          elements++;
        }

        keep = item.time + years > now || max_id > min_id;
      }

      max_id--;
    } while (keep);

    await importer.close();

    console.log(`Finished: ${elements} elements has been imported`);
  } catch (err) {
    console.error(`Generic error: ${err}`);
  }
};

export default process;
