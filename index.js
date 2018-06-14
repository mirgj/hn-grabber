import cluster from 'cluster';
import os from 'os';
import request from 'request-promise-native';
import config from './config';
import worker from './workers/hn-worker';

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  request(config.base_url + 'maxitem.json').then((data) => {
    const cpus = os.cpus().length;
    let max_id = Number(data);
    const segment = Math.floor(max_id / cpus);

    for (let i = 0; i < cpus; i++) {
      cluster.fork({
        max_id: max_id,
        min_id: max_id - segment,
      });

      max_id -= segment - 1;
    }

  });

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
