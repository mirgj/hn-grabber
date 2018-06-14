import cluster from 'cluster';
import os from 'os';
import request from 'request-promise-native';
import config from './config';
import worker from './workers/hn-worker';

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  const now = Math.floor(Date.now() / 1000);
  const years = 365 * 24 * 60 * 60 * 2; // 2 years
  const buffer = 30 * 24 * 60 * 60 * 4; // 4 months
  let keep = true;

  (async() => {
    console.log('Getting the max_id basing on the time of the news to import...');
    let actual_max = await request(config.base_url + 'maxitem.json');
    let max_id = Number(actual_max);
    actual_max = Number(actual_max);

    do {
      const url = config.base_url + 'item/' + max_id + '.json';
      let item = await request(url);
      item = JSON.parse(item);
      if (!item || !item.time) {
        max_id = Math.floor(max_id / 2);
        continue;
      }
      keep = (Number(item.time) - buffer) > (now - years);

      if ((Number(item.time) + buffer) < (now - years)) {
        max_id += Math.floor(max_id / 2);
        keep = true;
      } else if (keep) {
        max_id = Math.floor(max_id / 2);
      }
    } while (keep);

    const cpus = os.cpus().length;
    const segment = Math.floor((actual_max - max_id) / cpus);

    console.log('Creating sub process...');

    for (let i = 0; i < cpus; i++) {
      cluster.fork({
        max_id: actual_max,
        min_id: actual_max - segment,
      });

      actual_max -= segment - 1;
    }

  })();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const max_id = Number(process.env['max_id']);
  const min_id = Number(process.env['min_id']);

  console.log(`Worker ${process.pid} started with max: ${max_id} and min: ${min_id}`);

  worker(max_id, min_id).then(() => {
    process.exit();
  });
}
