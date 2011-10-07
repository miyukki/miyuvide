var socket = io.connect('');
socket.on('added', function (data) {
	console.log(data);
	if(data.vid = vid){
		TimeSlider.data = data.likeitdata;
	}
});

var Controller = {
	video : null,
	
	init : function() {
		Controller.video = document.getElementById("videoDisplay");
		
		Controller.video.addEventListener("click", function() {
			TimeSlider.data[Math.floor(Number(Controller.video.currentTime))] = TimeSlider.data[Math.floor(Number(Controller.video.currentTime))] + 1;
			TimeSlider.draw();
			socket.emit('add', { vid: vid, time: Math.floor(Controller.video.currentTime)});
		}, false);
		
		Controller.video.addEventListener("loadedmetadata", function() {
			TimeSlider.draw();
		}, false);
		
		document.getElementById("buttonPlay").addEventListener("click", function() {
			Controller.video.play();
		}, false);
		
		document.getElementById("buttonStop").addEventListener("click", function() {
			Controller.video.pause();
		}, false);
	}
};

var TimeSlider = {
	slider : null,
	seekbar : null,
	data : null,
	
	init : function() {
		TimeSlider.slider = document.getElementById("timeSliderCanvas");
		TimeSlider.seekbar = document.getElementById("seekBar");
		TimeSlider.data = likeitdata;
		
		TimeSlider.slider.addEventListener("click", function(evt) {
			Controller.video.currentTime = (evt.offsetX / TimeSlider.slider.width) * Controller.video.duration;
		}, false);
		
		setInterval(function(){
			TimeSlider.draw();
			TimeSlider.seekbar.style.left = TimeSlider.slider.getBoundingClientRect().left + ((Controller.video.currentTime / Controller.video.duration) * TimeSlider.slider.width) + 'px';
		}, 100)
	},
	
	draw : function() {
		var data = TimeSlider.data;
		var canvas = TimeSlider.slider;
		if (!canvas.getContext) return;
		var ctx = canvas.getContext('2d');
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		var ADJ = 1;
		var point = {
			x: {
				min: ADJ,
				max: canvas.width - ADJ
			},
			y: {
				min: canvas.height - ADJ,
				max: ADJ
			}
		};
		
		var axisLength = {
			x: point.x.max - point.x.min,
			y: point.y.min - point.y.max
		};
		
		var dataMax = 0;
			for (var i=0, l=Math.floor(Controller.video.duration); i<l; ++i) {
			if (data[i] == null) {
				data[i] = 0;
			}
			if (data[i] > dataMax) {
				dataMax = data[i];
			}
		}
		
		ctx.beginPath();
		ctx.lineWidth = 2
		ctx.strokeStyle = "#03C";
		for (var i=0, l=data.length; i<l; ++i) {
			var x = point.x.min + (axisLength.x / l * i);
			var y = point.y.min - (data[i] / dataMax * axisLength.y);
			
			var time = i * 5;
			ctx.arc(x, y, 0, 0, Math.PI * 2, false);
		}
		ctx.closePath();
		ctx.stroke();
	}
};

window.addEventListener("load", function() { Controller.init(); TimeSlider.init(); }, false);