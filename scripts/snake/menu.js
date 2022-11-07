var menuOpen = document.getElementById("openMenu")
var menuClose = document.getElementById("closeMenu")
var menu = document.getElementById("menu")
var root = document.getElementById("menu-root")
var multiplayer = document.getElementById("menu-multiplayer")
var roomList = document.getElementById("roomList")


var menuActive = true;

function toggleMenu(state) {
    if (state) {
        menuActive = true;
        menuOpen.style.display = "none";
        menuClose.style.display = "block";
        menu.style.display = "block";
    } else {
        menuActive = false;
        menuOpen.style.display = "block"
        menuClose.style.display = "none"
        menu.style.display = "none";
        if (!isMultiplayer) {
            start_movement();
        }
    }
}

function menu_multiplayer(state) {
    if (state) {
        root.style.display = "none"
        multiplayer.style.display = "block"
    } else {
        root.style.display = "block"
        multiplayer.style.display = "none"
    }
}

function fill_colour_picker(element) {
    console.log(element)
}
