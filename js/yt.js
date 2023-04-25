var player;

import { getCaptions } from "./captions.js";

window.onYouTubeIframeAPIReady = function () {
	player = new YT.Player('video-placeholder', {
		width: 600,
		height: 400,
		videoId: '1K3z62yoiOA',
		playerVars: {
			color: 'white',
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
        textEl.classList.add('p' + key);
        textEl.classList.add('cc__item');

		if (captionItem.cc_class) {
			textEl.classList.add(`${captionItem.cc_class}`);
		}

        textEl.setAttribute('data-cc-item', '');

		let htmlString = '';

		captionItem.text.forEach((textObject) => {
			htmlString += `
				<p ${ textObject.text_class ? 'class="' + textObject.text_class  + '"' : ''}>
				
					${ textObject.speaker ? '<span class="cc__speaker">' + textObject.speaker + (textObject.emotion ? '<span class="cc__extra">(' + textObject.emotion + ')</span>' : '') + ':</span>' : '' }
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

	//Officer K D 6 - 3 . 7. Let’s begin. Ready?
	var i = 0;
	while( i < captions.length) {
		pTimes(i,captions[i].start, captions[i].end,t);
		i++;
	}

	var i = 0;

	// while( i < sounds.length) {
	// 	sTimes(i,sounds[i],t);
	// 	i++;
	// }

    // Change 136.1 to the length of your own video in seconds
	if ( t < 120.6) {
		setTimeout(() => {
			updateTimerDisplay(captions);
		}, 100);
	}
	
}
function pTimes(num,startT,endT,curT) {
	var curP = document.querySelector('.p' + num);

    // const curT = 0.07795503623962402;
    // const startT = vttTimestampToSeconds(vttTimestamp);

    console.log(curT);
    // console.log(endT);

    if(curT > endT && !curP.classList.contains('off')) {
        curP.classList.add('off');
    }

    if(curT < endT && curP.classList.contains('off')) {
        curP.classList.remove('off');
    }

    if( curT > startT && !curP.classList.contains('on')) {
        curP.classList.add('on');
    }

    if( curT < startT && curP.classList.contains('on')) {
        curP.classList.remove('on');
    }
        
}

function sTimes(num,soundStarts,curT) {
	var soundClass = 'sound' + num;
	var b = document.querySelector('body');
	if( curT > soundStarts && !b.classList.contains(soundClass)) {
		b.classList.add(soundClass);
	}
	if( curT < soundStarts && b.classList.contains(soundClass)) {
		b.classList.remove(soundClass);
	}
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
