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
		submitInput.addEventListener('change', debounce(newInput, 20, true));
		function newInput(e) {
			e.preventDefault();
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
			route.classList.add('active');
			page == 'sleep-now.html'
				? routeBg.classList.add('sleep-now__bg')
				: routeBg.classList.add('sleep-at__bg');
		})
		.then(() => time()) // make the calculations and put them in the html.)
		.then(() => {
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

function cleanState() {
	const route = document.querySelector('.route');
	const routeHtml = route.querySelector('.inner-html');
	const routeBg = route.querySelector('.route__bg');

	route.classList.remove('active');
	routeBg.classList.remove('sleep-now__bg');
	routeBg.classList.remove('sleep-at__bg');
	routeHtml.innerHTML = '';
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpbWVFbDtcclxubGV0IGNhbGxlZFRpbWU7XHJcbmxldCBzaG93VGltZXM7XHJcbi8vIGRlYm91bmNlIGZ1bmN0aW9uIHRvIHByZXZlbnQgY3Jhc2hpbmcgZXZlbnRzLlxyXG5mdW5jdGlvbiBkZWJvdW5jZShhLCBiLCBjKSB7XHJcblx0dmFyIGQ7XHJcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGUgPSB0aGlzLFxyXG5cdFx0XHRmID0gYXJndW1lbnRzO1xyXG5cdFx0Y2xlYXJUaW1lb3V0KGQpLFxyXG5cdFx0XHQoZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0KGQgPSBudWxsKSwgYyB8fCBhLmFwcGx5KGUsIGYpO1xyXG5cdFx0XHR9LCBiKSksXHJcblx0XHRcdGMgJiYgIWQgJiYgYS5hcHBseShlLCBmKTtcclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aW1lKCkge1xyXG5cdHRpbWVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRpbWVdJyk7XHJcblx0Y2FsbGVkVGltZSA9IHRpbWVFbC5kYXRhc2V0LnRpbWU7XHJcblx0Y29uc3Qgc3VibWl0SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGltZScpO1xyXG5cdC8vICB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvbiB3aGVuIHlvdSBjbGljayByZWNhbGN1bGF0ZSwgcmVmcmVzaCB0aGUgcGFnZSBvciBjaGFuZ2UgdGhlIGlucHV0IHZhbHVlLlxyXG5cdGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcblxyXG5cdGlmIChjYWxsZWRUaW1lID09ICd3YWtlJykge1xyXG5cdFx0Ly8gY2FsbCB0aGlzIG9uIHdha2UtYXQgcGFnZS5cclxuXHRcdGNvbnN0IHdha2VBcnIgPSB0aW1lRWwudmFsdWUuc3BsaXQoJzonKTtcclxuXHRcdC8vIHNwbGl0IHRoZSB2YWx1ZSBJIGdldCBmcm9tIGlucHV0LCBzbyBJIGNhbiBzZXQgdGhlIGhvdXIsIG1pbiBhbmQgZGF5LlxyXG5cdFx0Y29uc3Qgd2FrZVVwQXQgPSBuZXcgRGF0ZSgpOyAvLyA/IGRhdGUgbWV0aG9kcyBtdXRhdGVzIG5vd1xyXG5cdFx0d2FrZVVwQXQuc2V0SG91cnMocGFyc2VJbnQod2FrZUFyclswXSkpO1xyXG5cdFx0d2FrZVVwQXQuc2V0TWludXRlcyhwYXJzZUludCh3YWtlQXJyWzFdKSk7XHJcblx0XHRpZiAobm93LmdldEhvdXJzKCkgPiB3YWtlVXBBdC5nZXRIb3VycygpKSB7XHJcblx0XHRcdC8vIGlmIHRoZSBjdXJyZW50IGhvdXIgaXMgYmlnZ2VyIHRoYW4gc2V0IHRpbWUsIGdvIHRvIGFub3RoZXIgZGF5LlxyXG5cdFx0XHQvLyBBbmQgaWYgdGhhdCBkYXkgaXMgYmlnZ2VyIHRoYW4gdGhlIGxhc3QgZGF5IG9mIG1vbnRoLCBzZXQgdGhlIGRheSB0byAxIGFuZCBnbyB0byBuZXh0IG1vbnRoLlxyXG5cdFx0XHRjb25zdCBsYXN0ZGF5ID0gbmV3IERhdGUobm93LmdldFllYXIoKSwgbm93LmdldE1vbnRoKCkgKyAxLCAwKS5nZXREYXkoKTtcclxuXHRcdFx0d2FrZVVwQXQuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpICsgMSk7XHJcblx0XHRcdGlmICh3YWtlVXBBdC5nZXREYXkoKSA+IGxhc3RkYXkpIHtcclxuXHRcdFx0XHR3YWtlVXBBdC5zZXREYXRlKDEpO1xyXG5cdFx0XHRcdHdha2VVcEF0LnNldE1vbnRoKG5vdy5nZXRNb250aCgpICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vY29udmVydCB0aGUgd2FrZSBkYXRlIHRvIG1pbGlzZWNvbmRzIGFuZCBwc3VoIHRoYXQgdmFyaWFibGUgZG93biB0byBjYWxjdWxhdGlvbiBmdW5jdGlvbi5cclxuXHRcdGNvbnN0IHdha2VVcFNlY3MgPSB3YWtlVXBBdC5nZXRUaW1lKCk7XHJcblx0XHRjYWxjVGltZSh3YWtlVXBTZWNzKTtcclxuXHRcdC8vIGlmIHRoZXJlIGlzIGEgbmV3IGlucHV0LCBjbGVhciB0aGUgdGltZXMgZ3JpZCBhbmQgcnVuIHRoZSB0aW1lIGZ1bmN0aW9uIGFnYWluLlxyXG5cdFx0Ly8gYWxzbyBkZWJvdW5jZSBpdCwgc28gaXQgd29uJ3QgY3Jhc2ggdGhlIGJyb3dzZXIgaWYgdGhlcmUgaXMgdG9vIG1hbnkgY2FsbHMuXHJcblx0XHRzdWJtaXRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBkZWJvdW5jZShuZXdJbnB1dCwgMjAsIHRydWUpKTtcclxuXHRcdGZ1bmN0aW9uIG5ld0lucHV0KGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRzaG93VGltZXMuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdHRpbWUoKTtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0Ly8gY2FsbCB0aGlzIG9uIHNsZWVwLW5vdyBwYWdlXHJcblx0XHRjb25zdCBvdXRwdXQgPSBgJHtub3cuZ2V0SG91cnMoKSA8IDEwID8gJzAnIDogJyd9JHtub3cuZ2V0SG91cnMoKX06JHtcclxuXHRcdFx0bm93LmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJydcclxuXHRcdH0ke25vdy5nZXRNaW51dGVzKCl9YDtcclxuXHRcdHRpbWVFbC5pbm5lckhUTUwgPSBvdXRwdXQ7XHJcblx0XHRjYWxjVGltZShub3cuZ2V0VGltZSgpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGNUaW1lKHNlY29uZHMpIHtcclxuXHQvLyBjb252ZXJ0IDkwIGFuZCAxNSBtaW51dGVzIHRvIG1pbGlzZWNvbmRzIGZvciBjYWxjdWxhdGlvbi5cclxuXHRjb25zdCBuaW5ldHlNaW4gPSA5MCAqIDYwICogMTAwMDtcclxuXHRjb25zdCBmaWZ0ZWVuTWluID0gMTUgKiA2MCAqIDEwMDA7XHJcblx0Ly8gY2hlY2sgd2hldGVyIHdlIHNob3VsZCBhZGQgb3Igc3Vic3RyYWN0IGZvciB0aGUgZmlyc3QgaG91ciBhbmQgcHV0IGl0IGludG8gYW4gYXJyYXkuXHJcblx0Y29uc3QgZmlyc3RIb3VyID1cclxuXHRcdGNhbGxlZFRpbWUgPT09ICdzbGVlcCdcclxuXHRcdFx0PyBzZWNvbmRzICsgZmlmdGVlbk1pbiArIG5pbmV0eU1pblxyXG5cdFx0XHQ6IHNlY29uZHMgLSBmaWZ0ZWVuTWluIC0gbmluZXR5TWluO1xyXG5cdGxldCB0aW1lcyA9IFtmaXJzdEhvdXJdO1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcblx0XHQvLyBhZ2FpbiB3aGV0ZXIgd2Ugc2hvdWxkIGFkZCBvciBzdWJzdHJhY3QuXHJcblx0XHRsZXQgdGltZSA9XHJcblx0XHRcdGNhbGxlZFRpbWUgPT09ICdzbGVlcCdcclxuXHRcdFx0XHQ/IHNlY29uZHMgKyBmaWZ0ZWVuTWluICsgbmluZXR5TWluICsgKHRpbWVzW2ldIC0gc2Vjb25kcyAtIGZpZnRlZW5NaW4pXHJcblx0XHRcdFx0OiBzZWNvbmRzIC0gZmlmdGVlbk1pbiAtIG5pbmV0eU1pbiArICh0aW1lc1tpXSAtIHNlY29uZHMgKyBmaWZ0ZWVuTWluKTtcclxuXHRcdC8vIHB1c2ggdGhlIGhvdXIgaW4gdGltZXMgYXJyYXkgZm9yIGxhdGVyIHVzZVxyXG5cdFx0dGltZXMucHVzaCh0aW1lKTtcclxuXHRcdC8vIGNvbnZlcnQgdGhlIG1pbGlzZWNvbmRzIHRvIGhvdXIgYW5kIHNlY3MuXHJcblx0XHR0aW1lc1tpXSA9IFtuZXcgRGF0ZSh0aW1lc1tpXSkuZ2V0SG91cnMoKSwgbmV3IERhdGUodGltZXNbaV0pLmdldE1pbnV0ZXMoKV07XHJcblx0fVxyXG5cdC8vIGNvbnZlcnQgdGhlIGxhc3QgZmlyc3RIb3VyIHRvIGhvdXIgYW5kIHNlY3MuXHJcblx0dGltZXNbNV0gPSBbbmV3IERhdGUodGltZXNbNV0pLmdldEhvdXJzKCksIG5ldyBEYXRlKHRpbWVzWzVdKS5nZXRNaW51dGVzKCldO1xyXG5cdC8vIGlmIHRoZSB0aW1lcyBhcmUgZGVjcmVhc2luZywgdGhleSB3aWxsIGJlIG9uIHdyb25nIG9yZGVyIGZvciBkaXNwbGF5LCB3ZSdsbCBmaXggaXQuXHJcblx0Y2FsbGVkVGltZSA9PT0gJ3dha2UnID8gdGltZXMucmV2ZXJzZSgpIDogdGltZXM7XHJcblxyXG5cdGRpc3BsYXlUaW1lKHRpbWVzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheVRpbWUodGltZXMpIHtcclxuXHRzaG93VGltZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xlZXAtbm93X190aW1lcycpO1xyXG5cdC8vIE1hcCBvdmVyIHRoZSB0aW1lcyBhcnJheSBhbmQgc3BpdCBvdXQgaG91cnMgYW5kIG1pbnV0ZXMgaW50byB0aGUgdGltZSBncmlkLlxyXG5cdHRpbWVzLm1hcChcclxuXHRcdHRpbWUgPT5cclxuXHRcdFx0KHNob3dUaW1lcy5pbm5lckhUTUwgKz0gYDxsaT4ke3RpbWVbMF0gPCAxMCA/ICcwJyA6ICcnfSR7dGltZVswXX06JHtcclxuXHRcdFx0XHR0aW1lWzFdIDwgMTAgPyAnMCcgOiAnJ1xyXG5cdFx0XHR9JHt0aW1lWzFdfTwvbGk+YClcclxuXHQpO1xyXG59XHJcbmZ1bmN0aW9uIGdldFBhZ2UocGFnZSkge1xyXG5cdC8vIHRoZSBmdW5jdGlvbiB0byBmZXRjaCB0aGUgcm91dGUgaHRtbC5cclxuXHRjb25zdCByb3V0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3V0ZScpO1xyXG5cdGNvbnN0IHJvdXRlSHRtbCA9IHJvdXRlLnF1ZXJ5U2VsZWN0b3IoJy5pbm5lci1odG1sJyk7XHJcblx0Y29uc3Qgcm91dGVCZyA9IHJvdXRlLnF1ZXJ5U2VsZWN0b3IoJy5yb3V0ZV9fYmcnKTtcclxuXHJcblx0ZmV0Y2gocGFnZSlcclxuXHRcdC50aGVuKHJlcyA9PiByZXMudGV4dCgpKVxyXG5cdFx0LnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdHJvdXRlSHRtbC5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0fSlcclxuXHRcdC50aGVuKCgpID0+IHtcclxuXHRcdFx0Ly8gYW5pbWF0ZSBuZXcgY29udGVudCBpbi5cclxuXHRcdFx0cm91dGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdHBhZ2UgPT0gJ3NsZWVwLW5vdy5odG1sJ1xyXG5cdFx0XHRcdD8gcm91dGVCZy5jbGFzc0xpc3QuYWRkKCdzbGVlcC1ub3dfX2JnJylcclxuXHRcdFx0XHQ6IHJvdXRlQmcuY2xhc3NMaXN0LmFkZCgnc2xlZXAtYXRfX2JnJyk7XHJcblx0XHR9KVxyXG5cdFx0LnRoZW4oKCkgPT4gdGltZSgpKSAvLyBtYWtlIHRoZSBjYWxjdWxhdGlvbnMgYW5kIHB1dCB0aGVtIGluIHRoZSBodG1sLilcclxuXHRcdC50aGVuKCgpID0+IHtcclxuXHRcdFx0Ly8gYWRkIG5ldyBidXR0b25zIGludG8gYSBub2RlLWxpc3RcclxuXHRcdFx0Y29uc3QgbmV3QnV0dG9ucyA9IHJvdXRlLnF1ZXJ5U2VsZWN0b3JBbGwoXHJcblx0XHRcdFx0J1tkYXRhLXJlY2FsY3VsYXRlXSwgW2RhdGEtZmV0Y2hdJ1xyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0bmV3QnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PlxyXG5cdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0XHRcdHNob3dUaW1lcy5pbm5lckhUTUwgPSAnJzsgLy8gY2xlYXIgdGhlIGNhbGN1bGF0ZWQgdGltZXMgZ3JpZC5cclxuXHRcdFx0XHRcdC8vIGNoZWNrIGlmIGl0J3MgYSByZWNhbGN1bGF0aW9uLlxyXG5cdFx0XHRcdFx0aWYgKGJ1dHRvbi5oYXNBdHRyaWJ1dGUoJ2RhdGEtcmVjYWxjdWxhdGUnKSkge1xyXG5cdFx0XHRcdFx0XHR0aW1lKCk7IC8vIGlmIGl0IGlzLCB0aGVuIHJ1biB0aGUgdGltZSBmdW5jdGlvbiBhZ2Fpbi5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIGlmIG5vdCwgY2hhbmdlIHRoZSBiYWNrZ3JvdW5kIGltYWdlIGFuZCBydW4gdGhlIGdldFBhZ2UgZnVuY3Rpb24gYWdhaW4gZm9yIHRoZSBuZXcgY29udGVudC5cclxuXHRcdFx0XHRcdFx0cGFnZSA9PSAnc2xlZXAtbm93Lmh0bWwnXHJcblx0XHRcdFx0XHRcdFx0PyByb3V0ZUJnLmNsYXNzTGlzdC5yZW1vdmUoJ3NsZWVwLW5vd19fYmcnKVxyXG5cdFx0XHRcdFx0XHRcdDogcm91dGVCZy5jbGFzc0xpc3QucmVtb3ZlKCdzbGVlcC1hdF9fYmcnKTtcclxuXHRcdFx0XHRcdFx0Z2V0UGFnZShidXR0b24uZGF0YXNldC5mZXRjaCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0KTtcclxuXHRcdH0pO1xyXG59XHJcblxyXG5jb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyk7XHJcbmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT5cclxuXHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBnZXRQYWdlKGJ1dHRvbi5kYXRhc2V0LmZldGNoKSlcclxuKTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFuU3RhdGUoKSB7XHJcblx0Y29uc3Qgcm91dGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm91dGUnKTtcclxuXHRjb25zdCByb3V0ZUh0bWwgPSByb3V0ZS5xdWVyeVNlbGVjdG9yKCcuaW5uZXItaHRtbCcpO1xyXG5cdGNvbnN0IHJvdXRlQmcgPSByb3V0ZS5xdWVyeVNlbGVjdG9yKCcucm91dGVfX2JnJyk7XHJcblxyXG5cdHJvdXRlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdHJvdXRlQmcuY2xhc3NMaXN0LnJlbW92ZSgnc2xlZXAtbm93X19iZycpO1xyXG5cdHJvdXRlQmcuY2xhc3NMaXN0LnJlbW92ZSgnc2xlZXAtYXRfX2JnJyk7XHJcblx0cm91dGVIdG1sLmlubmVySFRNTCA9ICcnO1xyXG59XHJcbiJdLCJmaWxlIjoiYXBwLmpzIn0=
