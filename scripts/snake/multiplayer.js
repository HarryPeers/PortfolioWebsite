var ws = null;

function request(method, path, json=null) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, `http://127.0.0.1:9059${path}`, false);
    xmlHttp.send(json);
    return xmlHttp
};

function create_room() {
    var response = request("POST", "/api/snake/room/")

    if (response.status != 200) {
        alert("Could not make a room for an unkown reason!")
    } else {
        let payload = JSON.parse(response.responseText)
        window.location.href = `http://127.0.0.1:9059/projects/snake/room/${payload.Id}`
    }
}

function leave_game() {
    window.location.href = `http://127.0.0.1:9059/projects/snake`
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

function register_username() {
    ws.send(JSON.stringify([{"event": "register", "payload":{"username": defineUsernameInput.value, "snakeColour": defineSnakeColour.value, "bodyColour": defineBodyColour.value}}]))
}

function list_games() {
    var rsp = request("GET", "/api/snake/room/")
    if (rsp.status != 200) {
        alert("Could not fetch games!")
    } else {
        var payload = JSON.parse(rsp.response)

        Object.keys(payload).forEach((key) => {
            let div = document.createElement("div")

            let h = document.createElement("h")
            h.innerText = key

            div.appendChild(h)
            div.appendChild(document.createElement("br"))

            div.innerHTML += payload[key].join(", ")

            div.id = key

            div.onclick = (event) => {
                window.location.href = `http://127.0.0.1:9059/projects/snake/room/${key}`
            }

            roomList.appendChild(div)
        })
    };
}

function multiplayer_create_fruit() {
    create_fruit()
}

document.addEventListener("keydown", (ev) => {
    if (ev.key == "Escape") {
        if (menuActive) {
            toggleMenu(false)
        } else {
            toggleMenu(true)
        };
    };    
});

function calculate_position(payload) {
    console.log(payload)
}

async function multiplayer_movement() {
    document.onkeypress = (ev) => {
        let key = ev.key.toUpperCase()
        if (!menuActive) {
            if (key=="W" && myTrueDirection != "S") {
                myDirection = "N"
            } else if (key=="D" && myTrueDirection != "W") {
                myDirection = "E"
            } else if (key=="S" && myTrueDirection != "N") {
                myDirection = "S"
            } else if (key=="A" && myTrueDirection != "E") {
                myDirection = "W"
            } else {
                return
            };
            ws.send(JSON.stringify([{"event": "direction", "payload": {"direction": myDirection}}]))
        };
    };

    while (true) {
        var myPosition = [getRandomArbitrary(1, total_x-1), getRandomArbitrary(1, total_y-2)];
        var myCurrentPosition = grid_coords[myPosition[1]][myPosition[0]]
        var myDirection = choose(["N", "E", "S", "W"])
        var myTrueDirection = myDirection
        var myLength = 5
        var myTrail = []
        var myBody = []

        console.log(myPosition)

        ws.send(JSON.stringify([{"event": "position", "payload": {"position": myPosition}}, {"event": "direction", "payload": {"direction": myTrueDirection}}, {"event": "length", "payload": {"length": myLength}}]))

        previousColour = myCurrentPosition.style.backgroundColor
        myCurrentPosition.style.backgroundColor = defineSnakeColour.value

        while (true) {
            myTrail.push([[...myPosition], myDirection])
            if (myDirection.toUpperCase() == "N") {
                myPosition[1] -= 1
            } else if (myDirection.toUpperCase() == "E") {
                myPosition[0] += 1
            } else if (myDirection.toUpperCase() == "S") {
                myPosition[1] += 1
            } else if (myDirection.toUpperCase() == "W") {
                myPosition[0] -= 1
            } else {
                continue
            };

            myCurrentPosition.style.backgroundColor = previousColour

            if (myPosition[0] < 0 || myPosition[0] > total_x-1 || myPosition[1] < 0 || myPosition[1] > total_y-2) {
                break
            };

            myCurrentPosition = grid_coords[myPosition[1]][myPosition[0]];

            if (myCurrentPosition.innerHTML.includes("div")) {
                break
            };

            myBody.forEach((position)=>{
                grid_coords[position[0][1]][position[0][0]].innerHTML = ""
            })

            myBody = []

            var previousDirection = myDirection;
            var previousBodyPostion = null;

            if (myTrail.length>myLength+1) {
                myTrail.splice(0, myTrail.length-myLength-1)
            }

            for (var x=1; x < myLength+1; x++) {
                if (x > myTrail.length) {
                    break
                } else {
                    var position = myTrail.at(0-x)
                    var block = grid_coords[position[0][1]][position[0][0]]
                    var body_part = document.createElement("div")
                    var isCorner = false;
                    if (previousDirection != position[1]) {
                        previousDirection = position[1]
                        previousBodyPostion.classList.remove("body")
                        previousBodyPostion.classList.add("body-corner")
                        isCorner = true;
                    }
                    body_part.classList.add("body")
                    if (position[1] == "N" || position[1] == "S") {
                        body_part.classList.add("rotated90")
                    };
                    body_part.style.backgroundColor = `${defineBodyColour.value}`
                    previousBodyPostion = body_part
                    block.appendChild(body_part)
                    myBody.push([position[0], position[1], isCorner])
                };
            };

            previousColour = myCurrentPosition.style.backgroundColor

            if (myCurrentPosition.innerHTML.includes("img")) {
                myLength += 1
                myCurrentPosition.innerHTML = ""
                multiplayer_create_fruit()
            };

            myCurrentPosition.style.backgroundColor = defineSnakeColour.value
            myTrueDirection = myDirection
        
            await sleep(200)

        };
        myBody.forEach((position)=>{
            grid_coords[position[0][1]][position[0][0]].innerHTML = ""
        })
        myCurrentPosition.style.backgroundColor = previousColour
    };
};

async function multiplayer_sync() {
    while (true) {
        if (myId != null) { //Move self

        };

        //Move players according to their directions :)

        // console.log("abc")

        await sleep(200)
    };
};

if (document.URL.includes("room")) {
    var roomId = document.URL.split("/").at(-1)
    var players = {}; //uuid: username, snakeColour, bodyColour
    var isOwner = true;
    var isMultiplayer = true;
    var myId = null;

    ws = new WebSocket(`ws://127.0.0.1:9059/api/snake/room/${roomId}`)

    var defineUsernameInput = document.getElementById("defineUsernameInput")
    var defineSnakeColour = document.getElementById("snakeColourPicker")
    var defineBodyColour = document.getElementById("bodyColourPicker")


    defineUsernameInput.addEventListener("keydown", (event)=>{
        if (event.key == "Enter") {
            register_username()
        };
    });

    ws.addEventListener("close", (event) => {
        leave_game()
    })

    ws.addEventListener("open", (event) => {
        console.log("Opened")
    });

    ws.addEventListener("message", (event) => {
        var payload = JSON.parse(event.data)
        payload.forEach((payload)=>{
            if (payload.event == "registered") {

                isOwner = payload.payload.owner
                if (isOwner) {
                    multiplayer_create_fruit();
                };

                myId = payload.payload.uuid

                

                defineUsernameInput.parentElement.style.display = "none";
                root.style.display = "block";

                toggleMenu(false);
                menuActive = false;

                multiplayer_movement();

            } else if (payload.event == "syncPlayers") {
                //when event is called start running the update loop :)
                console.log("Syncing with players!")
                multiplayer_sync(payload.payload);
            };
        })
    });
} else {
    var isMultiplayer = false;
    list_games()
}