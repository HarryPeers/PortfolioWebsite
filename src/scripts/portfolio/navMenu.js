const starting_transparency = 0.1;
const hamburgerElement = document.getElementById("hamburgerMenu")
var previous_transparency = 0.1

window.onscroll = () => {
    let transparency = starting_transparency + document.body.scrollTop / 1500
    if (transparency > 1) {
        transparency = 1;
    };
    if (transparency-previous_transparency > 0.05 || previous_transparency-transparency > 0.05) { //is slow if you dont cap how often it updates.
        previous_transparency = transparency
        hamburgerElement.style.color = `rgba(255,255,255,${transparency})`;
    };
}