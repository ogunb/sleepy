const timeEl = document.querySelector('[data-time]'); //the time elements, depending on the page, values will be different.
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
	// Take the time grid.
	const showTimes = document.querySelector('.sleep-now__times');
	// Map over the times array and spit out hours and minutes into the time grid.
	times.map(
		time =>
			(showTimes.innerHTML += `<li>${time[0] < 10 ? '0' : ''}${time[0]}:${
				time[1] < 10 ? '0' : ''
			}${time[1]}</li>`)
	);
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGltZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGltZV0nKTsgLy90aGUgdGltZSBlbGVtZW50cywgZGVwZW5kaW5nIG9uIHRoZSBwYWdlLCB2YWx1ZXMgd2lsbCBiZSBkaWZmZXJlbnQuXHJcbmNvbnN0IGNhbGxlZFRpbWUgPSB0aW1lRWwuZGF0YXNldC50aW1lO1xyXG5cclxuZnVuY3Rpb24gdGltZSgpIHtcclxuXHQvLyAgd2lsbCBjYWxsIHRoaXMgZnVuY3Rpb24gd2hlbiB5b3UgY2xpY2sgcmVjYWxjdWxhdGUsIHJlZnJlc2ggdGhlIHBhZ2Ugb3IgY2hhbmdlIHRoZSBpbnB1dCB2YWx1ZS5cclxuXHRjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG5cclxuXHRpZiAoY2FsbGVkVGltZSA9PSAnd2FrZScpIHtcclxuXHRcdC8vIGNhbGwgdGhpcyBvbiB3YWtlLWF0IHBhZ2UuXHJcblx0XHRjb25zdCB3YWtlQXJyID0gdGltZUVsLnZhbHVlLnNwbGl0KCc6Jyk7XHJcblx0XHQvLyBzcGxpdCB0aGUgdmFsdWUgSSBnZXQgZnJvbSBpbnB1dCwgc28gSSBjYW4gc2V0IHRoZSBob3VyLCBtaW4gYW5kIGRheS5cclxuXHRcdGNvbnN0IHdha2VVcEF0ID0gbmV3IERhdGUoKTsgLy8gPyBkYXRlIG1ldGhvZHMgbXV0YXRlcyBub3dcclxuXHRcdHdha2VVcEF0LnNldEhvdXJzKHBhcnNlSW50KHdha2VBcnJbMF0pKTtcclxuXHRcdHdha2VVcEF0LnNldE1pbnV0ZXMocGFyc2VJbnQod2FrZUFyclsxXSkpO1xyXG5cdFx0aWYgKG5vdy5nZXRIb3VycygpID4gd2FrZVVwQXQuZ2V0SG91cnMoKSkge1xyXG5cdFx0XHQvLyBpZiB0aGUgY3VycmVudCBob3VyIGlzIGJpZ2dlciB0aGFuIHNldCB0aW1lLCBnbyB0byBhbm90aGVyIGRheS5cclxuXHRcdFx0Ly8gQW5kIGlmIHRoYXQgZGF5IGlzIGJpZ2dlciB0aGFuIHRoZSBsYXN0IGRheSBvZiBtb250aCwgc2V0IHRoZSBkYXkgdG8gMSBhbmQgZ28gdG8gbmV4dCBtb250aC5cclxuXHRcdFx0Y29uc3QgbGFzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRZZWFyKCksIG5vdy5nZXRNb250aCgpICsgMSwgMCkuZ2V0RGF5KCk7XHJcblx0XHRcdHdha2VVcEF0LnNldERhdGUobm93LmdldERhdGUoKSArIDEpO1xyXG5cclxuXHRcdFx0aWYgKHdha2VVcEF0LmdldERheSgpID4gbGFzdGRheSkge1xyXG5cdFx0XHRcdHdha2VVcEF0LnNldERhdGUoMSk7XHJcblx0XHRcdFx0d2FrZVVwQXQuc2V0TW9udGgobm93LmdldE1vbnRoKCkgKyAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y29uc3Qgd2FrZVVwU2VjcyA9IHdha2VVcEF0LmdldFRpbWUoKTtcclxuXHRcdGNhbGNUaW1lKHdha2VVcFNlY3MpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHQvLyBjYWxsIHRoaXMgb24gc2xlZXAtbm93IHBhZ2VcclxuXHRcdGNvbnN0IG91dHB1dCA9IGAke25vdy5nZXRIb3VycygpIDwgMTAgPyAnMCcgOiAnJ30ke25vdy5nZXRIb3VycygpfToke1xyXG5cdFx0XHRub3cuZ2V0TWludXRlcygpIDwgMTAgPyAnMCcgOiAnJ1xyXG5cdFx0fSR7bm93LmdldE1pbnV0ZXMoKX1gO1xyXG5cdFx0dGltZUVsLmlubmVySFRNTCA9IG91dHB1dDtcclxuXHRcdGNhbGNUaW1lKG5vdy5nZXRUaW1lKCkpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY1RpbWUoc2Vjb25kcykge1xyXG5cdC8vIGNvbnZlcnQgOTAgYW5kIDE1IG1pbnV0ZXMgdG8gbWlsaXNlY29uZHMgZm9yIGNhbGN1bGF0aW9uLlxyXG5cdGNvbnN0IG5pbmV0eU1pbiA9IDkwICogNjAgKiAxMDAwO1xyXG5cdGNvbnN0IGZpZnRlZW5NaW4gPSAxNSAqIDYwICogMTAwMDtcclxuXHQvLyBjaGVjayB3aGV0ZXIgd2Ugc2hvdWxkIGFkZCBvciBzdWJzdHJhY3QgZm9yIHRoZSBmaXJzdCBob3VyIGFuZCBwdXQgaXQgaW50byBhbiBhcnJheS5cclxuXHRjb25zdCBmaXJzdEhvdXIgPVxyXG5cdFx0Y2FsbGVkVGltZSA9PT0gJ3NsZWVwJ1xyXG5cdFx0XHQ/IHNlY29uZHMgKyBmaWZ0ZWVuTWluICsgbmluZXR5TWluXHJcblx0XHRcdDogc2Vjb25kcyAtIGZpZnRlZW5NaW4gLSBuaW5ldHlNaW47XHJcblx0bGV0IHRpbWVzID0gW2ZpcnN0SG91cl07XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuXHRcdC8vIGFnYWluIHdoZXRlciB3ZSBzaG91bGQgYWRkIG9yIHN1YnN0cmFjdC5cclxuXHRcdGxldCB0aW1lID1cclxuXHRcdFx0Y2FsbGVkVGltZSA9PT0gJ3NsZWVwJ1xyXG5cdFx0XHRcdD8gc2Vjb25kcyArIGZpZnRlZW5NaW4gKyBuaW5ldHlNaW4gKyAodGltZXNbaV0gLSBzZWNvbmRzIC0gZmlmdGVlbk1pbilcclxuXHRcdFx0XHQ6IHNlY29uZHMgLSBmaWZ0ZWVuTWluIC0gbmluZXR5TWluICsgKHRpbWVzW2ldIC0gc2Vjb25kcyArIGZpZnRlZW5NaW4pO1xyXG5cdFx0Ly8gcHVzaCB0aGUgaG91ciBpbiB0aW1lcyBhcnJheSBmb3IgbGF0ZXIgdXNlXHJcblx0XHR0aW1lcy5wdXNoKHRpbWUpO1xyXG5cdFx0Ly8gY29udmVydCB0aGUgbWlsaXNlY29uZHMgdG8gaG91ciBhbmQgc2Vjcy5cclxuXHRcdHRpbWVzW2ldID0gW25ldyBEYXRlKHRpbWVzW2ldKS5nZXRIb3VycygpLCBuZXcgRGF0ZSh0aW1lc1tpXSkuZ2V0TWludXRlcygpXTtcclxuXHR9XHJcblx0Ly8gY29udmVydCB0aGUgbGFzdCBmaXJzdEhvdXIgdG8gaG91ciBhbmQgc2Vjcy5cclxuXHR0aW1lc1s1XSA9IFtuZXcgRGF0ZSh0aW1lc1s1XSkuZ2V0SG91cnMoKSwgbmV3IERhdGUodGltZXNbNV0pLmdldE1pbnV0ZXMoKV07XHJcblx0Ly8gaWYgdGhlIHRpbWVzIGFyZSBkZWNyZWFzaW5nLCB0aGV5IHdpbGwgYmUgb24gd3Jvbmcgb3JkZXIgZm9yIGRpc3BsYXksIHdlJ2xsIGZpeCBpdC5cclxuXHRjYWxsZWRUaW1lID09PSAnd2FrZScgPyB0aW1lcy5yZXZlcnNlKCkgOiB0aW1lcztcclxuXHJcblx0ZGlzcGxheVRpbWUodGltZXMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5VGltZSh0aW1lcykge1xyXG5cdC8vIFRha2UgdGhlIHRpbWUgZ3JpZC5cclxuXHRjb25zdCBzaG93VGltZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xlZXAtbm93X190aW1lcycpO1xyXG5cdC8vIE1hcCBvdmVyIHRoZSB0aW1lcyBhcnJheSBhbmQgc3BpdCBvdXQgaG91cnMgYW5kIG1pbnV0ZXMgaW50byB0aGUgdGltZSBncmlkLlxyXG5cdHRpbWVzLm1hcChcclxuXHRcdHRpbWUgPT5cclxuXHRcdFx0KHNob3dUaW1lcy5pbm5lckhUTUwgKz0gYDxsaT4ke3RpbWVbMF0gPCAxMCA/ICcwJyA6ICcnfSR7dGltZVswXX06JHtcclxuXHRcdFx0XHR0aW1lWzFdIDwgMTAgPyAnMCcgOiAnJ1xyXG5cdFx0XHR9JHt0aW1lWzFdfTwvbGk+YClcclxuXHQpO1xyXG59XHJcbiJdLCJmaWxlIjoiYXBwLmpzIn0=
