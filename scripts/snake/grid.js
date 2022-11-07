function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

const sleep = ms => new Promise(r => setTimeout(r, ms)); //https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

const grids = document.getElementById("grid")
var grid_coords = [[]]

const total_grids = 70
const grid_width = (grids.offsetWidth/total_grids)-1

var alternating = false;

const colour_one = "#AAD751"
const colour_two = "#A2D149"


for (var y=0; y < Math.round(grids.offsetHeight/Math.round(grids.offsetWidth/total_grids)); y++) {
    for (var x=0; x < total_grids; x++) {
        var grid = document.createElement("div")
        grids.appendChild(grid)
        grid.classList.add("grid")
        grid.style.height = `${grid.offsetWidth}px`
        grid.id = `${x},${y}`
        grid_coords[y].push(grid)
        if (alternating) {
            grid.style.backgroundColor = colour_one
            alternating = false;
        } else {
            grid.style.backgroundColor = colour_two
            alternating = true;
        };
        // grid.innerText = `(${x},${y})`
    };
    alternating = !alternating
    grid_coords.push([])
};

const total_y = 1+Math.round(grids.offsetHeight/Math.round(grids.offsetWidth/total_grids))
const total_x = total_grids

grids.style.height = "auto";

function create_fruit() {
    while (true) {
        var position = [getRandomArbitrary(0, total_x-1), getRandomArbitrary(0, total_y-2)]
        var fruit_position = grid_coords[position[1]][position[0]]
        if (fruit_position.innerHTML == "") {
            break
        }
    }
    image = document.createElement("img")
    image.src = "/resource/snake/apple.png"
    fruit_position.appendChild(image)
}
