import fs from 'fs';

export const recursiveDir = (startPath: string, callback) => {
	const dirContents = fs.readdirSync(startPath);

	dirContents.forEach((entry) => {
		const fullPath = startPath + '/' + entry;
		if (fs.lstatSync(fullPath).isDirectory()) {
			recursiveDir(fullPath, callback);
		} else {
			callback(fullPath);
		}
	});
};
