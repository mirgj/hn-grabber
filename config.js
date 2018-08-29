import { ObjectID } from 'mongodb';

export default {
  base_url: 'https://hn.algolia.com/api/v1/search?query=',
  to_find: 'cryptocurrency|cryptocurrencies|bitcoin|ethereum|solidity|blockchain|smart contract',
  importers: {
    mongo: {
      url: 'mongodb://localhost:27017/',
      db: 'pico-news',
      collections: {
        stories: {
          name: 'stories',
          mapper: 'storyMapper',
          mappings: [{
            from: 'title',
            to: 'title',
            transformer: {
              name: 'replacer',
              config: {
                old_string: 'HN',
                new_string: 'PN',
              },
            },
          }, {
            from: 'url',
            to: 'url',
            transformer: 'unescape',
          }, {
            from: 'url',
            to: 'base_url',
            transformer: 'baseUrl',
          }, {
            from: 'points',
            to: 'karma',
          }, {
            from: 'created_at',
            to: 'created_on',
            transformer: 'dateParser',
          }, {
            to: 'user_id',
            default: new ObjectID(),
          }],
        },
      },
    },
  },
};
