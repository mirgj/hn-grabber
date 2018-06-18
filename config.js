import { ObjectID } from 'mongodb';

export default {
  base_url: 'https://hacker-news.firebaseio.com/v0/',
  to_find: '(cryptocurrency|cryptocurrencies|bitcoin|ethereum|solidity|blockchain|smart contract)',
  importers: {
    mongo: {
      url: 'mongodb://localhost:27017/',
      db: 'crypto-hn',
      collections: {
        stories: {
          name: 'stories',
          mapper: 'storyMapper',
          mappings: [{
            from: 'title',
            to: 'title',
          }, {
            from: 'url',
            to: 'url',
          }, {
            from: 'url',
            to: 'base_url',
            transformer: 'baseUrl',
          }, {
            from: 'score',
            to: 'karma',
            default: 1,
          }, {
            from: 'time',
            to: 'created_on',
            transformer: 'timestamp',
          }, {
            to: 'user_id',
            default: new ObjectID(),
          }],
        },
      },
    },
  },
};
