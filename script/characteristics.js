const characteristics = ["dedicated", "enthusiastic", "motivated"]
const element = document.getElementById("characteristics")
const flickerElement = document.getElementById("flickerCharacteristics")
const times = 5 //Amount of times to flicker cursor
const delay = 2000 / times / 2
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function idle() {
    flickerElement.style.left = element.offsetLeft + element.offsetWidth + 5
    for (const x of Array(times).keys()) {
        await sleep(delay);
        flickerElement.innerText = "|"
        await sleep(delay);
        flickerElement.innerText = ""
    }
}

async function reset() {
    while (element.innerText.length > 4) {
        await sleep(100)
        element.innerText = element.innerText.substr(0, element.innerText.length-1) 
    }
}

async function _main() {
  for (var characteristic of characteristics) {
    characteristic = characteristic+"..."
    for (var i = 0; i < characteristic.length; i++) {
        await sleep(100)
        element.innerHTML += characteristic[i]
    }
    //   await idle() // needs improving
    await sleep(1000)
    await reset()
    await sleep(500)
  }
}

async function main() {
    while (true) {await _main()}
}

main()
