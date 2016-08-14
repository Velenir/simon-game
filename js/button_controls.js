const power = document.getElementById('power');
const start = document.getElementById('start');
const strict = document.getElementById('strict');
const display = document.getElementById('display');
const outer = document.getElementById('outer');

// turn whole game on/off
power.addEventListener("change", function (e) {
	console.log(this, "changed", this.checked);
	display.textContent = this.checked ? "--" : "";
	outer.classList.toggle("on", this.checked);
});

strict.addEventListener("change", function (e) {
	console.log(this, "changed", this.checked);
});

start.addEventListener("click", function (e) {
	console.log(this, "clicked", this.checked);
});
