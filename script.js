let board = document.querySelector(".game-board");
let scoreDisplay = document.querySelector("#score");
let restart = document.querySelector("button");

let score = 0;
let tiles = [];

// Function initialising the game when started or game restart
function initializeGame() {
    board.innerHTML = "";
    tiles = [];
    document.querySelector(".box").innerHTML = "<h3>START</h3>";
    score = 0;
    //Creating structure of the game-board
    for (i=0; i<16; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tiles");
        tiles.push(tile);
        tile.dataset.value = 0;
        board.appendChild(tile);
    }
    addRandomTiles();
    addRandomTiles();
    updateBoard();
}

// Function for add random tiles at empty places
function addRandomTiles() {
    // filtering the empty tiles
    const empty = tiles.filter(e => e.dataset.value == 0)
    // nothing happens if there is no empty tiles
    if (empty.length == 0) return;
    // randomly generates tiles at empty places
    const randomTile = empty[Math.floor(Math.random()*empty.length)];
    // only 2 or 4 generates rendomly according to condition
    randomTile.dataset.value = Math.random() < 0.5? 2 : 4;
}

// Function for updating the board
function updateBoard() {
    tiles.forEach(tile =>{
        // parsing the vlalues of each tiles
        const value = parseInt(tile.dataset.value);
        // updating the value on each tiles 
        tile.textContent = value > 0 ? value : "";
        // updating the styling of tile according to the value 
        tile.className = "tiles";
        if (value) tile.classList.add(`tile-${value}`);
    })
    scoreDisplay.innerHTML = score;
}

// giving controls to the game 
document.addEventListener("keydown", function(dets){
    switch(dets.key){
        case "ArrowUp":
            move("up");
            document.querySelector(".box").innerHTML = "<h3>UP</h3>"
            break;
        case "ArrowDown":
            move("down");
            document.querySelector(".box").innerHTML = "<h3>DOWN</h3>"
            break;
        case "ArrowLeft":
            move("left");
            document.querySelector(".box").innerHTML = "<h3>LEFT</h3>"
            break;
        case "ArrowRight":
            move("right");
            document.querySelector(".box").innerHTML = "<h3>RIGHT</h3>"
            break;
    }
})

// Function for tile moving 
function move(direction) {
    let moved = false
    //choosing single row or single column according to direction
    for(let i = 0; i < 4; i++){
        let line = [];
        for(let j = 0; j < 4; j++){
            // up and down for columns and right and left for rows
            // For rows = i * 4 + j and columns = j * 4 + i.
            let index = direction == "up" || direction == "down" ? j * 4 + i : i * 4 + j;
            let value = parseInt(tiles[index].dataset.value);
            if(value !== 0) line.push(value);
        }

        // reversing lines for right and down direction
        if (direction == "right" || direction == "down") {
            line.reverse();
        }

        // merging the line
        let mergedLine = mergeLine(line);
        if (direction == "right" || direction == "down") {
            mergedLine.reverse();
        }

        for(let j = 0; j < 4; j++){
            let index = direction == "up" || direction == "down" ? j * 4 + i : i * 4 + j;
            let newValue = mergedLine[j] || 0;
            if(tiles[index].dataset.value != newValue) {
                tiles[index].dataset.value = newValue;
                moved = true;
            }
        }
    }
    
    // if move happens then only new tiles are added
    if(moved) {
        addRandomTiles();
        updateBoard();
        checkGameOver();
    }
}

// function for merging the lines
function mergeLine(line) {
    // merging if adjacent tiles in line is same 
    for(let i = 0; i < line.length; i++) {
        if (line[i] === line[i+1]){
            score += line[i];
            line[i] *= 2;
            line.splice(i+1,1);
        }
    }
    // adding 0s in rest tiles
    while (line.length < 4) {
        line.push(0);
    }
    return line;
}

//giving controls for mobile touches
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  event.preventDefault();
}

function handleTouchEnd(event) {
  let touchEndX = event.changedTouches[0].clientX;
  let touchEndY = event.changedTouches[0].clientY;

  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      // Swipe right
      move("right");
    } else {
      // Swipe left
      move("left");
    }
  } else {
    if (deltaY > 0) {
      // Swipe down
      move("down");
    } else {
      // Swipe up
      move("up");
    }
  }
}

function checkGameOver() {
    // Check if there are any empty tiles
    const hasEmpty = tiles.some(tile => tile.dataset.value == 0);
    if (hasEmpty) return; // Game not over if there's an empty space

    // Check for possible merges horizontally and vertically
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            const currentValue = parseInt(tiles[index].dataset.value);

            // Check right neighbor
            if (j < 3) {
                const rightValue = parseInt(tiles[i * 4 + (j + 1)].dataset.value);
                if (currentValue === rightValue) return; // Merge possible
            }

            // Check down neighbor
            if (i < 3) {
                const downValue = parseInt(tiles[(i + 1) * 4 + j].dataset.value);
                if (currentValue === downValue) return; // Merge possible
            }
        }
    }

    // If no empty tile and no merge possible, game over
    setTimeout(() => {
        alert(`Game Over! Your final score: ${score}`);
    }, 100); // slight delay so the last move renders
}

//Function call for starting the game.
initializeGame();

//game borad initializes when the restart button clicks
restart.addEventListener("click", initializeGame);
