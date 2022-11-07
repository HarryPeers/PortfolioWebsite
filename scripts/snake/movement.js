var delay = 100

const player_1_start = [3, Math.round(total_y/2)]
var player_1_position = document.getElementById(`${player_1_start[0]},${player_1_start[1]}`)
var player_1_direction = "E"
var player_1_true_direction = player_1_direction
var player_1_length = 3
var player_1_trail = []
var player_1_body = []

previousColour = player_1_position.style.backgroundColor
player_1_position.style.backgroundColor = "red"

create_fruit()

document.addEventListener("keypress", (ev) => {
    let key = ev.key.toUpperCase()
    if (key=="W" && player_1_true_direction != "S") {
        player_1_direction = "N"
    } else if (key=="D" && player_1_true_direction != "W") {
        player_1_direction = "E"
    } else if (key=="S" && player_1_true_direction != "N") {
        player_1_direction = "S"
    } else if (key=="A" && player_1_true_direction != "E") {
        player_1_direction = "W"
    }
});

async function start_movement() {
    while (!menuActive) {
        player_1_current_position = player_1_position.id.split(",")
        player_1_trail.push([player_1_current_position, player_1_direction])
        player_1_current_position = [parseInt(player_1_current_position[0]), parseInt(player_1_current_position[1])]
        
        if (player_1_direction.toUpperCase() == "N") {
            player_1_current_position[1] -= 1
        } else if (player_1_direction.toUpperCase() == "E") {
            player_1_current_position[0] += 1
        } else if (player_1_direction.toUpperCase() == "S") {
            player_1_current_position[1] += 1
        } else if (player_1_direction.toUpperCase() == "W") {
            player_1_current_position[0] -= 1
        } else {
            continue
        };

        player_1_position.style.backgroundColor = previousColour
        player_1_position = grid_coords[player_1_current_position[1]][player_1_current_position[0]]

        if (player_1_position.innerHTML.includes("div")) {
            break
        };

        player_1_body.forEach((position)=>{
            grid_coords[position[1]][position[0]].innerHTML = ""
        })

        player_1_body = []

        var previousDirection = player_1_direction;
        var previousBodyPostion = null;

        if (player_1_trail.length>player_1_length+1) {
            player_1_trail.splice(0, player_1_trail.length-player_1_length-1)
        }

        for (var x=1; x < player_1_length+1; x++) {
            if (x > player_1_trail.length) {
                break
            } else {
                var position = player_1_trail.at(0-x)
                var block = grid_coords[position[0][1]][position[0][0]]
                var body_part = document.createElement("div")
                if (previousDirection != position[1]) {
                    previousDirection = position[1]
                    previousBodyPostion.classList.remove("body")
                    previousBodyPostion.classList.add("body-corner")
                }
                body_part.classList.add("body")
                if (position[1] == "N" || position[1] == "S") {
                    body_part.classList.add("rotated90")
                };
                previousBodyPostion = body_part
                block.appendChild(body_part)
                player_1_body.push(position[0])
            };
        };

        previousColour = player_1_position.style.backgroundColor

        if (player_1_position.innerHTML.includes("img")) {
            delay -= 3
            player_1_length += 1
            player_1_position.innerHTML = ""
            create_fruit()
        };

        player_1_position.style.backgroundColor = "red"
        player_1_true_direction = player_1_direction

        await sleep(delay)
    };
}
