let timeEl;
let calledTime;
let showTimes;

function time() {
	timeEl = document.querySelector('[data-time]');
	calledTime = timeEl.dataset.time;
	const submitForm = document.querySelector('form');
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
		// if a new input is submitted.
		submitForm.addEventListener('submit', e => {
			e.preventDefault();
			showTimes.innerHTML = '';
			time();
		});
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
function getPage(page) {
	// the function to fetch the route html.
	const route = document.querySelector('.route');
	const routeHtml = document.querySelector('.inner-html');
	const routeBg = document.querySelector('.route__bg');

	fetch(page)
		.then(res => res.text())
		.then(data => {
			routeHtml.innerHTML = data;
		})
		.then(() => {
			// animate new content in.
			route.classList.add('active');
			page == 'sleep-now.html'
				? routeBg.classList.add('sleep-now__bg')
				: routeBg.classList.add('sleep-at__bg');
		})
		.then(() => time()) // make the calculations and put them in the html.)
		.then(() => {
			// add new buttons into a node-list
			const newButtons = document.querySelectorAll(
				'[data-recalculate], [data-fetch]'
			);

			newButtons.forEach(button =>
				button.addEventListener('click', () => {
					showTimes.innerHTML = ''; // clear the calculated times grid.
					// check if it's a recalculation.
					if (button.hasAttribute('data-recalculate')) {
						time(); // if it is, then run the time function again.
					} else {
						// if not, change the background image and run the getPage function again for the new content.
						page == 'sleep-now.html'
							? routeBg.classList.remove('sleep-now__bg')
							: routeBg.classList.remove('sleep-at__bg');
						getPage(button.dataset.fetch);
					}
				})
			);
		});
}

const buttons = document.querySelectorAll('button');
buttons.forEach(button =>
	button.addEventListener('click', () => getPage(button.dataset.fetch))
);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpbWVFbDtcclxubGV0IGNhbGxlZFRpbWU7XHJcbmxldCBzaG93VGltZXM7XHJcblxyXG5mdW5jdGlvbiB0aW1lKCkge1xyXG5cdHRpbWVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRpbWVdJyk7XHJcblx0Y2FsbGVkVGltZSA9IHRpbWVFbC5kYXRhc2V0LnRpbWU7XHJcblx0Y29uc3Qgc3VibWl0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcclxuXHQvLyAgd2lsbCBjYWxsIHRoaXMgZnVuY3Rpb24gd2hlbiB5b3UgY2xpY2sgcmVjYWxjdWxhdGUsIHJlZnJlc2ggdGhlIHBhZ2Ugb3IgY2hhbmdlIHRoZSBpbnB1dCB2YWx1ZS5cclxuXHRjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG5cclxuXHRpZiAoY2FsbGVkVGltZSA9PSAnd2FrZScpIHtcclxuXHRcdC8vIGNhbGwgdGhpcyBvbiB3YWtlLWF0IHBhZ2UuXHJcblx0XHRjb25zdCB3YWtlQXJyID0gdGltZUVsLnZhbHVlLnNwbGl0KCc6Jyk7XHJcblx0XHQvLyBzcGxpdCB0aGUgdmFsdWUgSSBnZXQgZnJvbSBpbnB1dCwgc28gSSBjYW4gc2V0IHRoZSBob3VyLCBtaW4gYW5kIGRheS5cclxuXHRcdGNvbnN0IHdha2VVcEF0ID0gbmV3IERhdGUoKTsgLy8gPyBkYXRlIG1ldGhvZHMgbXV0YXRlcyBub3dcclxuXHRcdHdha2VVcEF0LnNldEhvdXJzKHBhcnNlSW50KHdha2VBcnJbMF0pKTtcclxuXHRcdHdha2VVcEF0LnNldE1pbnV0ZXMocGFyc2VJbnQod2FrZUFyclsxXSkpO1xyXG5cdFx0aWYgKG5vdy5nZXRIb3VycygpID4gd2FrZVVwQXQuZ2V0SG91cnMoKSkge1xyXG5cdFx0XHQvLyBpZiB0aGUgY3VycmVudCBob3VyIGlzIGJpZ2dlciB0aGFuIHNldCB0aW1lLCBnbyB0byBhbm90aGVyIGRheS5cclxuXHRcdFx0Ly8gQW5kIGlmIHRoYXQgZGF5IGlzIGJpZ2dlciB0aGFuIHRoZSBsYXN0IGRheSBvZiBtb250aCwgc2V0IHRoZSBkYXkgdG8gMSBhbmQgZ28gdG8gbmV4dCBtb250aC5cclxuXHRcdFx0Y29uc3QgbGFzdGRheSA9IG5ldyBEYXRlKG5vdy5nZXRZZWFyKCksIG5vdy5nZXRNb250aCgpICsgMSwgMCkuZ2V0RGF5KCk7XHJcblx0XHRcdHdha2VVcEF0LnNldERhdGUobm93LmdldERhdGUoKSArIDEpO1xyXG5cdFx0XHRpZiAod2FrZVVwQXQuZ2V0RGF5KCkgPiBsYXN0ZGF5KSB7XHJcblx0XHRcdFx0d2FrZVVwQXQuc2V0RGF0ZSgxKTtcclxuXHRcdFx0XHR3YWtlVXBBdC5zZXRNb250aChub3cuZ2V0TW9udGgoKSArIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL2NvbnZlcnQgdGhlIHdha2UgZGF0ZSB0byBtaWxpc2Vjb25kcyBhbmQgcHN1aCB0aGF0IHZhcmlhYmxlIGRvd24gdG8gY2FsY3VsYXRpb24gZnVuY3Rpb24uXHJcblx0XHRjb25zdCB3YWtlVXBTZWNzID0gd2FrZVVwQXQuZ2V0VGltZSgpO1xyXG5cdFx0Y2FsY1RpbWUod2FrZVVwU2Vjcyk7XHJcblx0XHQvLyBpZiBhIG5ldyBpbnB1dCBpcyBzdWJtaXR0ZWQuXHJcblx0XHRzdWJtaXRGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHNob3dUaW1lcy5pbm5lckhUTUwgPSAnJztcclxuXHRcdFx0dGltZSgpO1xyXG5cdFx0fSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vIGNhbGwgdGhpcyBvbiBzbGVlcC1ub3cgcGFnZVxyXG5cdFx0Y29uc3Qgb3V0cHV0ID0gYCR7bm93LmdldEhvdXJzKCkgPCAxMCA/ICcwJyA6ICcnfSR7bm93LmdldEhvdXJzKCl9OiR7XHJcblx0XHRcdG5vdy5nZXRNaW51dGVzKCkgPCAxMCA/ICcwJyA6ICcnXHJcblx0XHR9JHtub3cuZ2V0TWludXRlcygpfWA7XHJcblx0XHR0aW1lRWwuaW5uZXJIVE1MID0gb3V0cHV0O1xyXG5cdFx0Y2FsY1RpbWUobm93LmdldFRpbWUoKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjYWxjVGltZShzZWNvbmRzKSB7XHJcblx0Ly8gY29udmVydCA5MCBhbmQgMTUgbWludXRlcyB0byBtaWxpc2Vjb25kcyBmb3IgY2FsY3VsYXRpb24uXHJcblx0Y29uc3QgbmluZXR5TWluID0gOTAgKiA2MCAqIDEwMDA7XHJcblx0Y29uc3QgZmlmdGVlbk1pbiA9IDE1ICogNjAgKiAxMDAwO1xyXG5cdC8vIGNoZWNrIHdoZXRlciB3ZSBzaG91bGQgYWRkIG9yIHN1YnN0cmFjdCBmb3IgdGhlIGZpcnN0IGhvdXIgYW5kIHB1dCBpdCBpbnRvIGFuIGFycmF5LlxyXG5cdGNvbnN0IGZpcnN0SG91ciA9XHJcblx0XHRjYWxsZWRUaW1lID09PSAnc2xlZXAnXHJcblx0XHRcdD8gc2Vjb25kcyArIGZpZnRlZW5NaW4gKyBuaW5ldHlNaW5cclxuXHRcdFx0OiBzZWNvbmRzIC0gZmlmdGVlbk1pbiAtIG5pbmV0eU1pbjtcclxuXHRsZXQgdGltZXMgPSBbZmlyc3RIb3VyXTtcclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG5cdFx0Ly8gYWdhaW4gd2hldGVyIHdlIHNob3VsZCBhZGQgb3Igc3Vic3RyYWN0LlxyXG5cdFx0bGV0IHRpbWUgPVxyXG5cdFx0XHRjYWxsZWRUaW1lID09PSAnc2xlZXAnXHJcblx0XHRcdFx0PyBzZWNvbmRzICsgZmlmdGVlbk1pbiArIG5pbmV0eU1pbiArICh0aW1lc1tpXSAtIHNlY29uZHMgLSBmaWZ0ZWVuTWluKVxyXG5cdFx0XHRcdDogc2Vjb25kcyAtIGZpZnRlZW5NaW4gLSBuaW5ldHlNaW4gKyAodGltZXNbaV0gLSBzZWNvbmRzICsgZmlmdGVlbk1pbik7XHJcblx0XHQvLyBwdXNoIHRoZSBob3VyIGluIHRpbWVzIGFycmF5IGZvciBsYXRlciB1c2VcclxuXHRcdHRpbWVzLnB1c2godGltZSk7XHJcblx0XHQvLyBjb252ZXJ0IHRoZSBtaWxpc2Vjb25kcyB0byBob3VyIGFuZCBzZWNzLlxyXG5cdFx0dGltZXNbaV0gPSBbbmV3IERhdGUodGltZXNbaV0pLmdldEhvdXJzKCksIG5ldyBEYXRlKHRpbWVzW2ldKS5nZXRNaW51dGVzKCldO1xyXG5cdH1cclxuXHQvLyBjb252ZXJ0IHRoZSBsYXN0IGZpcnN0SG91ciB0byBob3VyIGFuZCBzZWNzLlxyXG5cdHRpbWVzWzVdID0gW25ldyBEYXRlKHRpbWVzWzVdKS5nZXRIb3VycygpLCBuZXcgRGF0ZSh0aW1lc1s1XSkuZ2V0TWludXRlcygpXTtcclxuXHQvLyBpZiB0aGUgdGltZXMgYXJlIGRlY3JlYXNpbmcsIHRoZXkgd2lsbCBiZSBvbiB3cm9uZyBvcmRlciBmb3IgZGlzcGxheSwgd2UnbGwgZml4IGl0LlxyXG5cdGNhbGxlZFRpbWUgPT09ICd3YWtlJyA/IHRpbWVzLnJldmVyc2UoKSA6IHRpbWVzO1xyXG5cclxuXHRkaXNwbGF5VGltZSh0aW1lcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlUaW1lKHRpbWVzKSB7XHJcblx0c2hvd1RpbWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsZWVwLW5vd19fdGltZXMnKTtcclxuXHQvLyBNYXAgb3ZlciB0aGUgdGltZXMgYXJyYXkgYW5kIHNwaXQgb3V0IGhvdXJzIGFuZCBtaW51dGVzIGludG8gdGhlIHRpbWUgZ3JpZC5cclxuXHR0aW1lcy5tYXAoXHJcblx0XHR0aW1lID0+XHJcblx0XHRcdChzaG93VGltZXMuaW5uZXJIVE1MICs9IGA8bGk+JHt0aW1lWzBdIDwgMTAgPyAnMCcgOiAnJ30ke3RpbWVbMF19OiR7XHJcblx0XHRcdFx0dGltZVsxXSA8IDEwID8gJzAnIDogJydcclxuXHRcdFx0fSR7dGltZVsxXX08L2xpPmApXHJcblx0KTtcclxufVxyXG5mdW5jdGlvbiBnZXRQYWdlKHBhZ2UpIHtcclxuXHQvLyB0aGUgZnVuY3Rpb24gdG8gZmV0Y2ggdGhlIHJvdXRlIGh0bWwuXHJcblx0Y29uc3Qgcm91dGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm91dGUnKTtcclxuXHRjb25zdCByb3V0ZUh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5uZXItaHRtbCcpO1xyXG5cdGNvbnN0IHJvdXRlQmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm91dGVfX2JnJyk7XHJcblxyXG5cdGZldGNoKHBhZ2UpXHJcblx0XHQudGhlbihyZXMgPT4gcmVzLnRleHQoKSlcclxuXHRcdC50aGVuKGRhdGEgPT4ge1xyXG5cdFx0XHRyb3V0ZUh0bWwuaW5uZXJIVE1MID0gZGF0YTtcclxuXHRcdH0pXHJcblx0XHQudGhlbigoKSA9PiB7XHJcblx0XHRcdC8vIGFuaW1hdGUgbmV3IGNvbnRlbnQgaW4uXHJcblx0XHRcdHJvdXRlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRwYWdlID09ICdzbGVlcC1ub3cuaHRtbCdcclxuXHRcdFx0XHQ/IHJvdXRlQmcuY2xhc3NMaXN0LmFkZCgnc2xlZXAtbm93X19iZycpXHJcblx0XHRcdFx0OiByb3V0ZUJnLmNsYXNzTGlzdC5hZGQoJ3NsZWVwLWF0X19iZycpO1xyXG5cdFx0fSlcclxuXHRcdC50aGVuKCgpID0+IHRpbWUoKSkgLy8gbWFrZSB0aGUgY2FsY3VsYXRpb25zIGFuZCBwdXQgdGhlbSBpbiB0aGUgaHRtbC4pXHJcblx0XHQudGhlbigoKSA9PiB7XHJcblx0XHRcdC8vIGFkZCBuZXcgYnV0dG9ucyBpbnRvIGEgbm9kZS1saXN0XHJcblx0XHRcdGNvbnN0IG5ld0J1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG5cdFx0XHRcdCdbZGF0YS1yZWNhbGN1bGF0ZV0sIFtkYXRhLWZldGNoXSdcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdG5ld0J1dHRvbnMuZm9yRWFjaChidXR0b24gPT5cclxuXHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdFx0XHRzaG93VGltZXMuaW5uZXJIVE1MID0gJyc7IC8vIGNsZWFyIHRoZSBjYWxjdWxhdGVkIHRpbWVzIGdyaWQuXHJcblx0XHRcdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgcmVjYWxjdWxhdGlvbi5cclxuXHRcdFx0XHRcdGlmIChidXR0b24uaGFzQXR0cmlidXRlKCdkYXRhLXJlY2FsY3VsYXRlJykpIHtcclxuXHRcdFx0XHRcdFx0dGltZSgpOyAvLyBpZiBpdCBpcywgdGhlbiBydW4gdGhlIHRpbWUgZnVuY3Rpb24gYWdhaW4uXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBpZiBub3QsIGNoYW5nZSB0aGUgYmFja2dyb3VuZCBpbWFnZSBhbmQgcnVuIHRoZSBnZXRQYWdlIGZ1bmN0aW9uIGFnYWluIGZvciB0aGUgbmV3IGNvbnRlbnQuXHJcblx0XHRcdFx0XHRcdHBhZ2UgPT0gJ3NsZWVwLW5vdy5odG1sJ1xyXG5cdFx0XHRcdFx0XHRcdD8gcm91dGVCZy5jbGFzc0xpc3QucmVtb3ZlKCdzbGVlcC1ub3dfX2JnJylcclxuXHRcdFx0XHRcdFx0XHQ6IHJvdXRlQmcuY2xhc3NMaXN0LnJlbW92ZSgnc2xlZXAtYXRfX2JnJyk7XHJcblx0XHRcdFx0XHRcdGdldFBhZ2UoYnV0dG9uLmRhdGFzZXQuZmV0Y2gpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdCk7XHJcblx0XHR9KTtcclxufVxyXG5cclxuY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xyXG5idXR0b25zLmZvckVhY2goYnV0dG9uID0+XHJcblx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZ2V0UGFnZShidXR0b24uZGF0YXNldC5mZXRjaCkpXHJcbik7XHJcbiJdLCJmaWxlIjoiYXBwLmpzIn0=
