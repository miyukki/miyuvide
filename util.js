var fs = require('fs');

exports.readDir = function (dirpath) {
	return fs.readdirSync(dirpath);
};

exports.readJsonData = function (filepath) {
	var data = fs.readFileSync(filepath, 'utf-8');
	return JSON.parse(data);
};


exports.writeJsonData = function (filepath, data) {
	data = JSON.stringify(data);
	fs.writeFileSync(filepath, data, 'utf-8');
};
