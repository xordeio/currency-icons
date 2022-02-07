import fs, { promises as fsp } from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { Config } from './interfaces/config';
import { recursiveDir } from './helpers/recursiveDir';

const config: Config = JSON.parse(fs.readFileSync('config.json').toString());

const convertSvg2Png = async (svgFilepath: string, pngRootpath: string, resize: number) => {
	let svgdata = await fsp.readFile(svgFilepath, 'utf-8');
	let pngfile = path.join(pngRootpath, path.parse(svgFilepath).name + '.png');
	let img = await sharp(Buffer.from(svgdata.replace('1em', '100em').replace('1em', '100em')));
	let resized = await img.resize(resize);
	fs.mkdirSync(pngRootpath, { recursive: true });
	await resized.toFile(pngfile);
	return true;
};

let count = 0;

config.types.forEach((t) => {
	recursiveDir(`./src/svg/${t}`, (file) => {
		config.sizes.forEach((s) => {
			count++;
			convertSvg2Png(file, path.join('.', config.destDir, s.label, t), s.size);
		});
	});
});

console.log(`Processing ${count} files...`);
