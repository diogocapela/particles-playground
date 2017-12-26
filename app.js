(function () {

	'use strict'

	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');

	let canvasW = canvas.width;
	let canvasH = canvas.height;

	let show_fps = document.getElementById('show_fps');
	let fps = 0;
	let fpsLastCalledTime;

	let mouseX = null;
	let mouseY = null;

	canvas.addEventListener('mousemove', updateMousePosition);

	let particles = [];
	let number_of_particles = 500;

    function Particle(x, y) {
        this.positionX = x;
        this.positionY = y;
        this.radius = 5;
        this.color = 'black';
        this.velocityX = getNonZeroRandomNumber();
        this.velocityY = getNonZeroRandomNumber();
    }

	Particle.prototype = {
		constructor: Particle,
		update: function() {
			this.positionX += this.velocityX;
			this.positionY += this.velocityY;
		},
		render: function() {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
			ctx.fill();
		}
	}

    for(let i = 0; i < number_of_particles; i++) {
        let particle = new Particle((Math.random() * canvasW - 10) + 10, (Math.random() * canvasH - 10) + 10);
        particles.push(particle);
    }

	(function renderFrame() {

		requestAnimationFrame(renderFrame);

		ctx.clearRect(0, 0, canvasW, canvasH);

		drawParticles();

		drawMousePosition();

		if(!fpsLastCalledTime) {
			fpsLastCalledTime = performance.now();
			fps = 0;
		} else {
			let delta = (performance.now() - fpsLastCalledTime)/1000;
			fpsLastCalledTime = performance.now();
			fps = 1/delta;
		}

		show_fps.innerHTML = fps;

	}());

	function drawParticles() {
        for(let i = 0; i < particles.length; i++) {
            let particle = particles[i];
            goAwayFromMouse(particle);
            checkBorderColision(particle);
            particle.update();
            particle.render();
        }
	}

	function goAwayFromMouse(_particle) {
		let mouseRelativePositionX = Math.abs(mouseX - _particle.positionX);
		let mouseRelativePositionY = Math.abs(mouseY - _particle.positionY);
		if(mouseRelativePositionX < 5 && mouseRelativePositionY < 5) {
			_particle.velocityX *= -1;
			_particle.velocityY *= -1;
		}
	}

	function checkBorderColision(_particle) {
		if(_particle.positionX < 0 + _particle.radius / 2 || _particle.positionX > canvasW - _particle.radius / 2) {
			_particle.velocityX *= -1;
		} else if (_particle.positionY < 0 + _particle.radius / 2 || _particle.positionY > canvasH - _particle.radius / 2) {
			_particle.velocityY *= -1;
		}
	}

	function updateMousePosition(evt) {
		let rect = canvas.getBoundingClientRect();
		let root = document.documentElement;
		mouseX = evt.clientX - rect.left - root.scrollLeft;
		mouseY = evt.clientY - rect.top - root.scrollTop;
	}

	function drawMousePosition() {
		ctx.fillStyle = 'black';
		ctx.font = '18px Arial';
		ctx.fillText(`${mouseX}, ${mouseY}`, mouseX, mouseY);
	}

	function getNonZeroRandomNumber(){
	    let random = Math.floor(Math.random() * 11) - 5;
	    if(random == 0) return getNonZeroRandomNumber();
	    return random;
	}

})();