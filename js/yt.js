var player;

console.log('HALLO');
import { getCaptions } from "./captions.js";

window.onYouTubeIframeAPIReady = function () {
	player = new YT.Player('video-placeholder', {
		width: 600,
		height: 400,
		videoId: '1K3z62yoiOA',
		playerVars: {
			color: 'white',
			'autoplay': 0,
			'rel' : 0,
			'fs' : 0,
			controls: 0,
			//start: 
			//autoplay: '1'
			//playlist: 'taJ60kskkns,FG0fTKAqZ5g'
		},
		events: {
			onReady: initialize
		}
	});
}

async function initialize(){
    console.log('INIT');
    const captions = await getCaptions();

    console.log(captions);
    // Update the controls on load
	insertCaptions(captions);
}

function insertCaptions(captionsObject){
    const ccContainer = document.querySelector('[data-cc-container]');

    for (const key in captionsObject) {
        const captionItem = captionsObject[key];

        const textEl = document.createElement('div');
        textEl.classList.add('cc__item');
        textEl.classList.add('cc__item--' + key);

		if (captionItem.cc_class) {
			textEl.classList.add(`${captionItem.cc_class}`);
		}

        textEl.setAttribute('data-cc-item', '');

		let htmlString = '';

		captionItem.text.forEach((textObject,i) => {
			htmlString += `
				<p class="p${i} ${ textObject.text_class ?  textObject.text_class : ''}">
				
					${ textObject.speaker ? '<span class="cc__speaker">' + textObject.speaker + (textObject.emotion ? ' <span class="cc__extra">(' + textObject.emotion + ')</span>' : '') + ':</span>' : '' }
					<span class="cc__text">${textObject.text_type == 'sound' ? '[' : ''}${textObject.speech}${textObject.text_type == 'sound' ? ']' : ''}</span>
				</p>
			`;
		});

        textEl.innerHTML = htmlString;

        ccContainer.appendChild(textEl);
    }

    console.log('inserted captions in html');

	updateTimerDisplay(captionsObject);
}

function updateTimerDisplay(captions){
	var t = player.getCurrentTime();
	t = Math.floor10(t,-1);

	var i = 0;

	while( i < captions.length) {
		const caption = captions[i];
		let textIndex = 0;

		while (textIndex < caption.text.length) {
			const textObject = caption.text[textIndex];
			// console.log(textObject);
			pTimes(
				i,
				caption.start,
				caption.end,
				t,
				textObject.start ?? null,
				textObject.end ?? null,
				textIndex
			);

			textIndex++;
		}

		i++;
	}

	if ( t < 120.6) {
		setTimeout(() => {
			updateTimerDisplay(captions);
		}, 100);
	}	
}

function pTimes(num, startTime, endTime, currentTime, textStartTime, textEndTime, textIndex) {
	console.log(currentTime);

	// credits naar nina
	const ccContainer = document.querySelector(`.cc__item--${num}`);
	const ccTextItem = ccContainer.querySelectorAll('p');

	ccContainer.classList.toggle('off', currentTime > endTime);
	ccContainer.classList.toggle('on', currentTime > startTime);

	ccTextItem.forEach((textItem, i) => {

		if (textStartTime && textEndTime) {
			if (i == textIndex) {
				
				if (currentTime > textStartTime && currentTime < textEndTime) {
					console.log('JAAA SHOW ON!!');
			
					textItem.classList.remove('off'); // remove the 'off' class if it was previously added
					textItem.classList.add('on');

				} else if (currentTime > textEndTime && !textItem.classList.contains('off')) { // check if the 'off' class has already been added
					console.log('HIDE!');
					
					textItem.classList.remove('on'); // remove the 'on' class if it was previously added
					textItem.classList.add('off');
				}
			}
			// textItem.classList.toggle('off', currentTime > textEndTime);
			// textItem.classList.toggle('on', currentTime > textStartTime && currentTime < textEndTime);

			
			
		} else {
			textItem.classList.toggle('off', currentTime > endTime);
			textItem.classList.toggle('on', currentTime > startTime);
		}

	});

}


(function() {
	/**
	 * Decimal adjustment of a number.
	 *
	 * @param {String}  type  The type of adjustment.
	 * @param {Number}  value The number.
	 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
	 * @returns {Number} The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
	// If the exp is undefined or zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// If the value is not a number or the exp is not an integer...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Shift
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Shift back
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function(value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Decimal floor
	if (!Math.floor10) {
		Math.floor10 = function(value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Decimal ceil
	if (!Math.ceil10) {
		Math.ceil10 = function(value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}
})();
