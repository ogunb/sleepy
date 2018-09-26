let timeEl;
let calledTime;
let showTimes;
// debounce function to prevent crashing events.
function debounce(a, b, c) {
	var d;
	return function() {
		var e = this,
			f = arguments;
		clearTimeout(d),
			(d = setTimeout(function() {
				(d = null), c || a.apply(e, f);
			}, b)),
			c && !d && a.apply(e, f);
	};
}

function time() {
	timeEl = document.querySelector('[data-time]');
	calledTime = timeEl.dataset.time;
	const submitInput = document.querySelector('#time');
	//  will call this function when you click recalculate, refresh the page or change the input value.
	const now = new Date();

	if (calledTime == 'wake') {
		// call this on wake-at page.
		const wakeArr = timeEl.value.split(':');
		// split the value I get from input, so I can set the hour, min and day.
		const wakeUpAt = new Date(); // ? date methods mutates now
		wakeUpAt.setHours(parseInt(wakeArr[0]));
		wakeUpAt.setMinutes(parseInt(wakeArr[1]));
		if (now.getHours() > wakeUpAt.getHours()) {
			// if the current hour is bigger than set time, go to another day.
			// And if that day is bigger than the last day of month, set the day to 1 and go to next month.
			const lastday = new Date(now.getYear(), now.getMonth() + 1, 0).getDay();
			wakeUpAt.setDate(now.getDate() + 1);
			if (wakeUpAt.getDay() > lastday) {
				wakeUpAt.setDate(1);
				wakeUpAt.setMonth(now.getMonth() + 1);
			}
		}
		//convert the wake date to miliseconds and psuh that variable down to calculation function.
		const wakeUpSecs = wakeUpAt.getTime();
		calcTime(wakeUpSecs);
		// if there is a new input, clear the times grid and run the time function again.
		// also debounce it, so it won't crash the browser if there is too many calls.
		submitInput.addEventListener('change', debounce(newInput, 20));
		function newInput() {
			showTimes.innerHTML = '';
			time();
		}
	} else {
		// call this on sleep-now page
		const output = `${now.getHours() < 10 ? '0' : ''}${now.getHours()}:${
			now.getMinutes() < 10 ? '0' : ''
		}${now.getMinutes()}`;
		timeEl.innerHTML = output;
		calcTime(now.getTime());
	}
}

function calcTime(seconds) {
	// convert 90 and 15 minutes to miliseconds for calculation.
	const ninetyMin = 90 * 60 * 1000;
	const fifteenMin = 15 * 60 * 1000;
	// check wheter we should add or substract for the first hour and put it into an array.
	const firstHour =
		calledTime === 'sleep'
			? seconds + fifteenMin + ninetyMin
			: seconds - fifteenMin - ninetyMin;
	let times = [firstHour];
	for (let i = 0; i < 5; i++) {
		// again wheter we should add or substract.
		let time =
			calledTime === 'sleep'
				? seconds + fifteenMin + ninetyMin + (times[i] - seconds - fifteenMin)
				: seconds - fifteenMin - ninetyMin + (times[i] - seconds + fifteenMin);
		// push the hour in times array for later use
		times.push(time);
		// convert the miliseconds to hour and secs.
		times[i] = [new Date(times[i]).getHours(), new Date(times[i]).getMinutes()];
	}
	// convert the last firstHour to hour and secs.
	times[5] = [new Date(times[5]).getHours(), new Date(times[5]).getMinutes()];
	// if the times are decreasing, they will be on wrong order for display, we'll fix it.
	calledTime === 'wake' ? times.reverse() : times;

	displayTime(times);
}

function displayTime(times) {
	showTimes = document.querySelector('.sleep-now__times');
	// Map over the times array and spit out hours and minutes into the time grid.
	times.map(
		time =>
			(showTimes.innerHTML += `<li>${time[0] < 10 ? '0' : ''}${time[0]}:${
				time[1] < 10 ? '0' : ''
			}${time[1]}</li>`)
	);
}
const hero = document.querySelector('.hero');
function getPage(page) {
	// the function to fetch the route html.
	const route = document.querySelector('.route');
	const routeHtml = route.querySelector('.inner-html');
	const routeBg = route.querySelector('.route__bg');

	fetch(page)
		.then(res => res.text())
		.then(data => {
			routeHtml.innerHTML = data;
		})
		.then(() => {
			// animate new content in.
			if (route.classList.remove('reverse')) route.classList.remove('reverse');
			route.style.display = 'block';
			route.classList.add('active');
			page == 'sleep-now.html'
				? routeBg.classList.add('sleep-now__bg')
				: routeBg.classList.add('sleep-at__bg');
		})
		.then(() => time()) // make the calculations and put them in the html.)
		.then(() => {
			hero.style.opacity = '0';
			// add new buttons into a node-list
			const newButtons = route.querySelectorAll(
				'[data-recalculate], [data-fetch]'
			);

			newButtons.forEach(button =>
				button.addEventListener('click', () => {
					showTimes.innerHTML = ''; // clear the calculated times grid.
					// check if it's a recalculation.
					if (button.hasAttribute('data-recalculate')) {
						time(); // if it is, then run the time function again.
					} else {
						cleanState(button);
					}
				})
			);
		});
}

const buttons = document.querySelectorAll('button');
buttons.forEach(button =>
	button.addEventListener('click', () => getPage(button.dataset.fetch))
);

function cleanState(button) {
	const route = document.querySelector('.route');
	const routeHtml = route.querySelector('.inner-html');
	const routeBg = route.querySelector('.route__bg');

	route.classList.add('reverse');
	routeHtml.innerHTML = '';

	routeBg.addEventListener('animationend', animateOut);
	function animateOut() {
		routeBg.classList.remove('sleep-now__bg');
		routeBg.classList.remove('sleep-at__bg');
		route.classList.remove('active');
		route.classList.remove('reverse');
		route.style.display = 'none';
		routeBg.removeEventListener('animationend', animateOut, false);
		if (button === undefined) {
			hero.style.opacity = '1';
			return;
		}
		getPage(button.dataset.fetch);
	}
}
