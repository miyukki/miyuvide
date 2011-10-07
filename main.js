var express = require('express');
var ejs = require('ejs');
var mv = require('./miyukkiVideo.js')

var app = express.createServer();
app.configure(function(){
	app.set('view engine', 'ejs');
	app.set('view options', {layout: false});
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.set('views', __dirname + '/templates');
	app.use(express.static(__dirname + '/public'));
	makeVideoListCache();
	setInterval(makeVideoListCache, 1000 * 60 * 1);
});
app.get('/', function(req, res) {
	var tempVars = {};
	tempVars.page = 'index';
	tempVars.title = 'みゆびで！';
	
	tempVars.cache = mv.getCache();
	
	res.render('index.ejs', {locals: tempVars});
	console.log('IndexLoaded / ' + req.client.remoteAddress);
});
app.get('/watch/:vid([0-9]+)', function(req, res) {
	var vid = req.params.vid;
	var tempVars = {};
	tempVars.page = "watch";
	
	var videoInfo = mv.getVideoInfo(vid);
	videoInfo.playcount = videoInfo.playcount + 1;
	mv.setVideoInfo(vid, videoInfo);
	tempVars.videoInfo = videoInfo;
	
	tempVars.title = 'みゆびで！ - ' + videoInfo.title;
	
	res.render('watch.ejs', {locals: tempVars});
	console.log('WatchLoaded / ' +  vid + ' / '  + req.client.remoteAddress);
});

var io = require('socket.io').listen(app);
var realtime = io.of('/realtime').on('connection', function(socket) {
	socket.on('add', function(data) {
		var vid = data.vid;
		var time = data.time;
		
		var videoInfo = mv.getVideoInfo(vid);
		videoInfo.likeit[Number(time)] = Number(videoInfo.likeit[time]) + 1;
		videoInfo.likeitcount = videoInfo.likeitcount + 1;
		mv.setVideoInfo(vid, videoInfo);
		
		realtime.emit('added', {vid: vid, likeitdata: videoInfo.likeit});
		
		//console.log('AddLikePosted / ' + vid);
	});
});

app.listen(3456);

function makeVideoListCache() {
	var cache = {};
	
	var videoinfolists = [];
	var videolists = mv.getVideoLists();
	for (i in videolists) {
		var videoinfo = mv.getVideoInfo(videolists[i])
		var compressedvideoinfo = {
			id: videoinfo.id,
			title: videoinfo.title,
			description: videoinfo.description,
			thumbpath: videoinfo.thumbpath,
			likeitcount: videoinfo.likeitcount,
			playcount: videoinfo.playcount
		}
		videoinfolists.push(compressedvideoinfo);
	}
	
	cache.id_sorted = mv.geSortVideoLists(videoinfolists, 'id');
	cache.likeitcount_sorted = mv.geSortVideoLists(videoinfolists, 'likeitcount');
	cache.playcount_sorted = mv.geSortVideoLists(videoinfolists, 'playcount');
	
	mv.setCache(cache);
	
	//console.log('CacheUpdated');
}