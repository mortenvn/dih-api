import child from 'child_process';
import { loadFixtures } from './helpers';

loadFixtures()
    .then(() => child.exec('node dist/index.js'));
