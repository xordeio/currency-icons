import { Config } from './interfaces/config';
import fs from 'fs';

const config: Config = JSON.parse(fs.readFileSync('config.json').toString());


const files = ['manifest.json'];

files.forEach(f => {
	const destFile = config.destDir + '/' + f;
	console.log(`Copying ${f} to ${destFile} ...`);
	fs.copyFileSync(f, destFile);
})
