import { getCaptions } from "./captions.js";

let captions;
export { captions };

function insertCaptions(captionsObject) {

    const ccContainer = document.querySelector('[data-cc-container]');

    for (const key in captionsObject) {
        const captionItem = captionsObject[key];

        const textEl = document.createElement('p');
        textEl.classList.add('off');
        textEl.setAttribute('data-cc-item', '');

        const htmlString = `${captionItem.text}`;
        textEl.innerHTML = htmlString;

        ccContainer.appendChild(textEl);
    }

    console.log('inserted captions in html');
}
