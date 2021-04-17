const { DOMParser, XMLSerializer } = require('xmldom');
const fs = require("fs");

const fixViewport = (s) => {
	let svg = s;
	if (svg.startsWith("<svg")) {
		var doc = new DOMParser().parseFromString(s, 'image/svg+xml');
		if (!doc.documentElement.attributes.getNamedItem("viewBox")) {
			const width = doc.documentElement.attributes.getNamedItem("width").value;
			const height = doc.documentElement.attributes.getNamedItem("height").value;
			const viewBox = [0, 0, width, height].join(" ");
			doc.documentElement.setAttribute("viewBox", viewBox);
			svg = new XMLSerializer().serializeToString(doc);
		}
	}	
	return svg;
}

const recursiveDir = (startPath, callback) => {
	const dirContents = fs.readdirSync(startPath);
  
	dirContents.forEach((entry) => {
		const fullPath = startPath + "/" + entry;
	  	if (fs.lstatSync(fullPath).isDirectory()) {
			recursiveDir(fullPath, callback);
	  	} else {
			callback(fullPath);
		}
	});
};

//recursiveDir("./svg", (file) => {console.log(file)});

recursiveDir("./svg", (file) => {
	console.log(`Processed file ${file}`);
	var contents = fs.readFileSync(file, 'utf8');
	fs.writeFileSync(file, fixViewport(contents));
});
