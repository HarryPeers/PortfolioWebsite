// const languagesHeaderElement = document.getElementById("languages-header")
// const languagesElement = document.getElementById("languages-items")


// function resize() {
//     offset = languagesHeaderElement.offsetLeft
//     languagesElement.style.left = offset + (languagesElement.offsetWidth/4)
//     console.log("abc")
// }

// document.onresize = resize;

// resize()

const languagesElement = document.getElementById("languages-items");
const reveals = document.getElementsByClassName("languages-reveal");

languagesElement.childNodes.forEach((child)=>{
    if (child.localName == "span") {
        child.addEventListener("click", (ev)=> {
            Array.prototype.forEach.call(reveals, (item)=>{
                item.style.display = "none";
            });
            document.getElementById(`languages-reveal-${ev.target.innerText.toLowerCase()}`).style.display = "block";
        })
    };
});