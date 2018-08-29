import cluster from 'cluster';
import os from 'os';
import config from './config';
import worker from './workers/hn-worker';

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  const cpus = os.cpus().length;
  const words = config.to_find.split('|');
  const items = Math.floor(words.length / cpus);
  let difference = words.length - (cpus * items);
  let counter = 0;

  for (let i = 0; i < cpus; i++) {
    let currentWords = [];
    let inc = difference > 0 ? 1 : 0;
    difference--;

    for (let j = 0; j < items + inc; j++) {
      currentWords.push(words[counter++]);
    }

    cluster.fork({
      words: currentWords.join('|'),
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} finished with code ${code}`);
  });
} else {
  const words = process.env['words'].split('|');

  console.log(`Worker ${process.pid} started with words: ${words}`);

  const promises = [];
  words.forEach((q) => {
    promises.push(worker(q));
  });

  Promise.all(promises)
    .then(() => process.exit())
    .catch(console.log)
    .then(() => process.exit(1));
}
