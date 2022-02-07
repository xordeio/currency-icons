import { DOMParser, XMLSerializer } from 'xmldom';
import * as fs from 'fs';
import { recursiveDir } from './helpers/recursiveDir';

const fixViewport = (s) => {
	let svg = s;
	if (svg.startsWith('<svg')) {
		var doc = new DOMParser().parseFromString(s, 'image/svg+xml');
		if (!doc.documentElement.attributes.getNamedItem('viewBox')) {
			const width = doc.documentElement.attributes.getNamedItem('width').value;
			const height = doc.documentElement.attributes.getNamedItem('height').value;
			const viewBox = [0, 0, width, height].join(' ');
			doc.documentElement.setAttribute('viewBox', viewBox);
			svg = new XMLSerializer().serializeToString(doc);
		}
	}
	return svg;
};

recursiveDir('./svg', (file) => {
	console.log(`Processed file ${file}`);
	var contents = fs.readFileSync(file, 'utf8');
	fs.writeFileSync(file, fixViewport(contents));
});
