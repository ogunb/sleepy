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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGltZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGltZV0nKTsgLy90aGUgdGltZSBlbGVtZW50cywgZGVwZW5kaW5nIG9uIHRoZSBwYWdlLCB2YWx1ZXMgd2lsbCBiZSBkaWZmZXJlbnQuXHJcbmNvbnN0IHNob3dUaW1lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGVlcC1ub3dfX3RpbWUnKTtcclxuXHJcbmZ1bmN0aW9uIGNhbGNUaW1lKCkge1xyXG5cdC8vICB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvbiB3aGVuIHlvdSBjbGljayByZWNhbGN1bGF0ZSwgcmVmcmVzaCB0aGUgcGFnZSBvciBjaGFuZ2UgdGhlIGlucHV0IHZhbHVlLlxyXG5cdGNvbnN0IGNhbGxlZFRpbWUgPSB0aW1lRWwuZGF0YXNldC50aW1lO1xyXG5cclxuXHRpZiAoY2FsbGVkVGltZSA9PSAnd2FrZScpIHtcclxuXHRcdC8vIGNhbGwgdGhpcyBvbiB3YWtlLWF0IHBhZ2UuXHJcblx0XHRjb25zdCB3YWtlQXJyID0gdGltZUVsLnZhbHVlLnNwbGl0KCc6Jyk7XHJcblx0XHQvLyBzcGxpdCB0aGUgdmFsdWUgSSBnZXQgZnJvbSBpbnB1dCwgc28gSSBjYW4gc2V0IHRoZSBob3VyLCBtaW4gYW5kIGRheS5cclxuXHRcdGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcblx0XHRjb25zdCB3YWtlVXBBdCA9IG5ldyBEYXRlKCk7IC8vID8gZGF0ZSBtZXRob2RzIG11dGF0ZXMgbm93XHJcblx0XHR3YWtlVXBBdC5zZXRIb3VycyhwYXJzZUludCh3YWtlQXJyWzBdKSk7XHJcblx0XHR3YWtlVXBBdC5zZXRNaW51dGVzKHBhcnNlSW50KHdha2VBcnJbMV0pKTtcclxuXHRcdGlmIChub3cuZ2V0SG91cnMoKSA+IHdha2VVcEF0LmdldEhvdXJzKCkpIHtcclxuXHRcdFx0Ly8gaWYgdGhlIGN1cnJlbnQgaG91ciBpcyBiaWdnZXIgdGhhbiBzZXQgdGltZSwgZ28gdG8gYW5vdGhlciBkYXkuIEFuZCBpZiB0aGF0IGRheSBpcyBiaWdnZXIgdGhhbiB0aGUgbGFzdCBkYXkgb2YgbW9udGgsIHNldCB0aGUgZGF5IHRvIDEgYW5kIGdvIHRvIG5leHQgbW9udGguXHJcblx0XHRcdGNvbnN0IGxhc3RkYXkgPSBuZXcgRGF0ZShub3cuZ2V0WWVhcigpLCBub3cuZ2V0TW9udGgoKSArIDEsIDApLmdldERheSgpO1xyXG5cdFx0XHR3YWtlVXBBdC5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyAxKTtcclxuXHJcblx0XHRcdGlmICh3YWtlVXBBdC5nZXREYXkoKSA+IGxhc3RkYXkpIHtcclxuXHRcdFx0XHR3YWtlVXBBdC5zZXREYXRlKDEpO1xyXG5cdFx0XHRcdHdha2VVcEF0LnNldE1vbnRoKG5vdy5nZXRNb250aCgpICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNvbnN0IHdha2VVcFNlY3MgPSB3YWtlVXBBdC5nZXRUaW1lKCk7XHJcblx0XHRkaXNwbGF5VGltZSh3YWtlVXBTZWNzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Ly8gY2FsbCB0aGlzIG9uIHNsZWVwLW5vdyBwYWdlXHJcblx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG5cdFx0ZGlzcGxheVRpbWUobm93KTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lKHNlY29uZHMpIHt9XHJcbiJdLCJmaWxlIjoiYXBwLmpzIn0=
