export async function getCaptions() {

    try {

        const response = await fetch('./the_bear.vtt');
        const data = await response.text();

        const result = data.split("\n\n").map(function (item) {
            var parts = item.split("\n");
            let [startTime, endTime] = parts[1].split(" --> ");
            // console.log(endTime);

            startTime = vttTimestampToSeconds(startTime);
            endTime = vttTimestampToSeconds(endTime);
			// console.log(endTime);

            // startTime = Math.floor10(startTime, -1);
            // endTime = Math.floor10(endTime, -1);

            return {
                number: parts[0],
                start: startTime,
                end: endTime,
                text: { speaker: parts[2], text: parts[3] ?? '' },
            };
        });

        return result;

        
    } catch (error) {

        console.log(error);
        return false;
        
    }
}

// function vttTimestampToSeconds(timestamp) {
//   const timeComponents = timestamp.split(':').map(parseFloat);
//   const hours = timeComponents[0];
//   const minutes = timeComponents[1];
//   const seconds = timeComponents[2];
//   const milliseconds = parseInt(timestamp.split('.')[1], 10);

//   return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
// }

function vttTimestampToSeconds(timestamp) {
  const timeComponents = timestamp.split(/[:.]/).map(parseFloat);
  const hours = timeComponents[0];
  const minutes = timeComponents[1];
  const seconds = timeComponents[2] + timeComponents[3] / 1000;
  return hours * 3600 + minutes * 60 + seconds;
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