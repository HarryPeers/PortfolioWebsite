
const messageBox = document.getElementById("message-box")

async function highlight_message_box() {
    messageBox.style.borderColor = "rgba(16,16,16,0)";
    await sleep(500) //Characteristics.js line 6
    messageBox.style.borderColor = "#7E0BFF";
}
