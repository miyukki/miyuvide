var util = require('./util.js'); // 

var datas_dir = __dirname + '/data';

exports.getCache = function () {
	var filepath = datas_dir + '/cache.json';
	var data = util.readJsonData(filepath);
	return data;
};

exports.setCache = function (data) {
	var filepath = datas_dir + '/cache.json';
	util.writeJsonData(filepath, data);
};

exports.getVideoInfo = function (vid, count) {
	var filepath = datas_dir + '/videos/' + vid + '.json';
	var data = util.readJsonData(filepath);
	return data;
};

exports.setVideoInfo = function (vid, data) {
	var filepath = datas_dir + '/videos/' + vid + '.json';
	util.writeJsonData(filepath, data);
}

exports.getVideoLists = function () {
	var dirpath = datas_dir + '/videos';
	var dirlists = util.readDir(dirpath);
	var videolists = [];
	for (i in dirlists) {
		var filename = dirlists[i];
		var videoid = Number(filename.substring(0, filename.length - 5));
		videolists.push(videoid);
	}
	videolists.sort(function(a, b) { return (a - b) });
	return videolists;
};

exports.geSortVideoLists = function(data, key) {
	var data = JSON.parse(JSON.stringify(data));
	return data.sort(function(a, b) { return (b[key] - a[key]) });
};
