const timeEl = document.querySelector('[data-time]'); //the time elements, depending on the page, values will be different.
const showTimes = document.querySelectorAll('.sleep-now__time');

function calcTime() {
	//  will call this function when you click recalculate, refresh the page or change the input value.
	const calledTime = timeEl.dataset.time;

	if (calledTime == 'wake') {
		// call this on wake-at page.
		const wakeArr = timeEl.value.split(':');
		// split the value I get from input, so I can set the hour, min and day.
		const now = new Date();
		const wakeUpAt = new Date(); // ? date methods mutates now
		wakeUpAt.setHours(parseInt(wakeArr[0]));
		wakeUpAt.setMinutes(parseInt(wakeArr[1]));
		if (now.getHours() > wakeUpAt.getHours()) {
			// if the current hour is bigger than set time, go to another day. And if that day is bigger than the last day of month, set the day to 1 and go to next month.
			const lastday = new Date(now.getYear(), now.getMonth() + 1, 0).getDay();
			wakeUpAt.setDate(now.getDate() + 1);

			if (wakeUpAt.getDay() > lastday) {
				wakeUpAt.setDate(1);
				wakeUpAt.setMonth(now.getMonth() + 1);
			}
		}
		const wakeUpSecs = wakeUpAt.getTime();
		displayTime(wakeUpSecs);
	} else {
		// call this on sleep-now page
		const now = Date.now();
		displayTime(now);
	}
}

function displayTime(seconds) {}
