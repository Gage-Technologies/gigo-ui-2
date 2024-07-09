function removeGoogleTranslate() {
    // remove google translate iframe
    const iframe = document.querySelector('iframe[class*="skiptranslate"]');
    // select iframe with class matching *skiptranslate regex
    if (iframe) {
        iframe.remove();
    }

    // remvoe google translate circle
    const circle = document.querySelector('div[class*="VIpgJd-ZVi9od-aZ2wEe"]');
    if (circle) {
        circle.remove();
    }

    // remove google translate widget
    const googleTranslateElement = document.getElementById(':0.container');
    if (googleTranslateElement) {
        googleTranslateElement.remove();
    }

    // remove google translate stylesheet
    const stylesheet = document.querySelector('link[href^="https://translate.googleapis.com/translate_static/css/translateelement.css"]');
    if (stylesheet) {
        stylesheet.remove();
    }
}

// run on load and periodically to ensure removal
window.addEventListener('load', removeGoogleTranslate);
setInterval(removeGoogleTranslate, 1000);