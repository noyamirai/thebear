import { captions } from "./cc_source.js";

export async function getCaptions() {

	const result = captions.map(function (item) {
		let [startTime, endTime] = item.vtt.split(" --> ");
		startTime = vttTimestampToSeconds(startTime);
		endTime = vttTimestampToSeconds(endTime);

		item.start = startTime;
		item.end = endTime;

		return item;
	});

	return result;
}

function vttTimestampToSeconds(timestamp) {
  const timeComponents = timestamp.split(/[:.]/).map(parseFloat);
  const hours = timeComponents[0];
  const minutes = timeComponents[1];
  const seconds = timeComponents[2] + timeComponents[3] / 1000;
  return hours * 3600 + minutes * 60 + seconds;
}