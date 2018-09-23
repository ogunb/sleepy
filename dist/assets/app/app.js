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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGltZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGltZV0nKTsgLy90aGUgdGltZSBlbGVtZW50cywgZGVwZW5kaW5nIG9uIHRoZSBwYWdlLCB2YWx1ZXMgd2lsbCBiZSBkaWZmZXJlbnQuXHJcbmNvbnN0IHNob3dUaW1lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGVlcC1ub3dfX3RpbWUnKTtcclxuY29uc3QgY2FsbGVkVGltZSA9IHRpbWVFbC5kYXRhc2V0LnRpbWU7XHJcblxyXG5mdW5jdGlvbiB0aW1lKCkge1xyXG5cdC8vICB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvbiB3aGVuIHlvdSBjbGljayByZWNhbGN1bGF0ZSwgcmVmcmVzaCB0aGUgcGFnZSBvciBjaGFuZ2UgdGhlIGlucHV0IHZhbHVlLlxyXG5cdGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcblxyXG5cdGlmIChjYWxsZWRUaW1lID09ICd3YWtlJykge1xyXG5cdFx0Ly8gY2FsbCB0aGlzIG9uIHdha2UtYXQgcGFnZS5cclxuXHRcdGNvbnN0IHdha2VBcnIgPSB0aW1lRWwudmFsdWUuc3BsaXQoJzonKTtcclxuXHRcdC8vIHNwbGl0IHRoZSB2YWx1ZSBJIGdldCBmcm9tIGlucHV0LCBzbyBJIGNhbiBzZXQgdGhlIGhvdXIsIG1pbiBhbmQgZGF5LlxyXG5cdFx0Y29uc3Qgd2FrZVVwQXQgPSBuZXcgRGF0ZSgpOyAvLyA/IGRhdGUgbWV0aG9kcyBtdXRhdGVzIG5vd1xyXG5cdFx0d2FrZVVwQXQuc2V0SG91cnMocGFyc2VJbnQod2FrZUFyclswXSkpO1xyXG5cdFx0d2FrZVVwQXQuc2V0TWludXRlcyhwYXJzZUludCh3YWtlQXJyWzFdKSk7XHJcblx0XHRpZiAobm93LmdldEhvdXJzKCkgPiB3YWtlVXBBdC5nZXRIb3VycygpKSB7XHJcblx0XHRcdC8vIGlmIHRoZSBjdXJyZW50IGhvdXIgaXMgYmlnZ2VyIHRoYW4gc2V0IHRpbWUsIGdvIHRvIGFub3RoZXIgZGF5LlxyXG5cdFx0XHQvLyBBbmQgaWYgdGhhdCBkYXkgaXMgYmlnZ2VyIHRoYW4gdGhlIGxhc3QgZGF5IG9mIG1vbnRoLCBzZXQgdGhlIGRheSB0byAxIGFuZCBnbyB0byBuZXh0IG1vbnRoLlxyXG5cdFx0XHRjb25zdCBsYXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFllYXIoKSwgbm93LmdldE1vbnRoKCkgKyAxLCAwKS5nZXREYXkoKTtcclxuXHRcdFx0d2FrZVVwQXQuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpICsgMSk7XHJcblxyXG5cdFx0XHRpZiAod2FrZVVwQXQuZ2V0RGF5KCkgPiBsYXN0ZGF5KSB7XHJcblx0XHRcdFx0d2FrZVVwQXQuc2V0RGF0ZSgxKTtcclxuXHRcdFx0XHR3YWtlVXBBdC5zZXRNb250aChub3cuZ2V0TW9udGgoKSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRjb25zdCB3YWtlVXBTZWNzID0gd2FrZVVwQXQuZ2V0VGltZSgpO1xyXG5cdFx0Y2FsY1RpbWUod2FrZVVwU2Vjcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vIGNhbGwgdGhpcyBvbiBzbGVlcC1ub3cgcGFnZVxyXG5cdFx0Y29uc3Qgb3V0cHV0ID0gYCR7XHJcblx0XHRcdG5vdy5nZXRIb3VycygpIDwgMTAgPyAnMCcgOiAnJ1xyXG5cdFx0fSR7bm93LmdldEhvdXJzKCl9OiR7bm93LmdldE1pbnV0ZXMoKX1gO1xyXG5cdFx0dGltZUVsLmlubmVySFRNTCA9IG91dHB1dDtcclxuXHRcdGNhbGNUaW1lKG5vdy5nZXRUaW1lKCkpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY1RpbWUoc2Vjb25kcykge1xyXG5cdC8vIGNvbnZlcnQgOTAgYW5kIDE1IG1pbnV0ZXMgdG8gbWlsaXNlY29uZHMgZm9yIGNhbGN1bGF0aW9uLlxyXG5cdGNvbnN0IG5pbmV0eU1pbiA9IDkwICogNjAgKiAxMDAwO1xyXG5cdGNvbnN0IGZpZnRlZW5NaW4gPSAxNSAqIDYwICogMTAwMDtcclxuXHQvLyBjaGVjayB3aGV0ZXIgd2Ugc2hvdWxkIGFkZCBvciBzdWJzdHJhY3QgZm9yIHRoZSBmaXJzdCBob3VyIGFuZCBwdXQgaXQgaW50byBhbiBhcnJheS5cclxuXHRjb25zdCBmaXJzdEhvdXIgPVxyXG5cdFx0Y2FsbGVkVGltZSA9PT0gJ3NsZWVwJ1xyXG5cdFx0XHQ/IHNlY29uZHMgKyBmaWZ0ZWVuTWluICsgbmluZXR5TWluXHJcblx0XHRcdDogc2Vjb25kcyAtIGZpZnRlZW5NaW4gLSBuaW5ldHlNaW47XHJcblx0bGV0IHRpbWVzID0gW2ZpcnN0SG91cl07XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuXHRcdC8vIGFnYWluIHdoZXRlciB3ZSBzaG91bGQgYWRkIG9yIHN1YnN0cmFjdC5cclxuXHRcdGxldCB0aW1lID1cclxuXHRcdFx0Y2FsbGVkVGltZSA9PT0gJ3NsZWVwJ1xyXG5cdFx0XHRcdD8gc2Vjb25kcyArIGZpZnRlZW5NaW4gKyBuaW5ldHlNaW4gKyAodGltZXNbaV0gLSBzZWNvbmRzIC0gZmlmdGVlbk1pbilcclxuXHRcdFx0XHQ6IHNlY29uZHMgLSBmaWZ0ZWVuTWluIC0gbmluZXR5TWluICsgKHRpbWVzW2ldIC0gc2Vjb25kcyArIGZpZnRlZW5NaW4pO1xyXG5cdFx0Ly8gcHVzaCB0aGUgaG91ciBpbiB0aW1lcyBhcnJheSBmb3IgbGF0ZXIgdXNlXHJcblx0XHR0aW1lcy5wdXNoKHRpbWUpO1xyXG5cdFx0Ly8gY29udmVydCB0aGUgbWlsaXNlY29uZHMgdG8gaG91ciBhbmQgc2Vjcy5cclxuXHRcdHRpbWVzW2ldID0gW25ldyBEYXRlKHRpbWVzW2ldKS5nZXRIb3VycygpLCBuZXcgRGF0ZSh0aW1lc1tpXSkuZ2V0TWludXRlcygpXTtcclxuXHR9XHJcblx0Ly8gY29udmVydCB0aGUgbGFzdCBmaXJzdEhvdXIgdG8gaG91ciBhbmQgc2Vjcy5cclxuXHR0aW1lc1s1XSA9IFtuZXcgRGF0ZSh0aW1lc1s1XSkuZ2V0SG91cnMoKSwgbmV3IERhdGUodGltZXNbNV0pLmdldE1pbnV0ZXMoKV07XHJcblxyXG5cdGNhbGxlZFRpbWUgPT09ICd3YWtlJyA/IHRpbWVzLnJldmVyc2UoKSA6IHRpbWVzO1xyXG5cclxuXHRkaXNwbGF5VGltZSh0aW1lcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lKHRpbWUpIHtcclxuXHRjb25zb2xlLmxvZyh0aW1lKTtcclxufVxyXG4iXSwiZmlsZSI6ImFwcC5qcyJ9
