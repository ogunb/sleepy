const timeEl = document.querySelector('[data-time]'); //the time elements, depending on the page, values will be different.
const showTimes = document.querySelectorAll('.sleep-now__time');
const calledTime = timeEl.dataset.time;

function time() {
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
		const wakeUpSecs = wakeUpAt.getTime();
		calcTime(wakeUpSecs);
	} else {
		// call this on sleep-now page
		const output = `${
			now.getHours() < 10 ? '0' : ''
		}${now.getHours()}:${now.getMinutes()}`;
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

	calledTime === 'wake' ? times.reverse() : times;

	displayTime(times);
}

function displayTime(time) {
	console.log(time);
}
