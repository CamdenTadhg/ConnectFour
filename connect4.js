/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//make a player class that takes a string color name and stores it on that player instance
class Player {
  constructor(color) {
    this.color = color;
  }
}

//make form to set player colors
const colorButton = document.querySelector('#set-colors');
const p1Input = document.querySelector('#playerOne');
const p2Input = document.querySelector('#playerTwo');
//set up default colors so a game can be played without entering colors. 
let playerOne = new Player('purple');
let playerTwo = new Player('green');

colorButton.addEventListener('click', (event) => {
  event.preventDefault(); 
  playerOne.color = p1Input.value;
  playerTwo.color = p2Input.value;
  $('form').append('<span>Player colors set</span>')
})

class Game {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.currPlayer = playerOne.color; // active player instance
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.gameOver = false;
  }

  // makeBoard: create in-JS board structure: board = array of rows, each row is array of cells  (board[y][x])
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
    this.board.push(Array.from({ length: this.width }));
    }
  }

  //makeHtmlBoard: make HTML table and row of column tops.
  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener('click', this.handleGameClick);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  //findSpotForCol: given column x, return top empty y (null if filled)
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  //placeInTable: update DOM to place piece into HTML table of board
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // piece.classList.add(`${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  //endGame: announce game end
  endGame(msg) {
    alert(msg);
  }

  //handleClick: handle click of column to to play piece
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    //make it so you can't continue doing moves once a game has ended

    const y = this.findSpotForCol(x);
    if (y === null || this.gameOver === true) {
      return;
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    //add pause so that the piece appears before the alert runs
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`${this.currPlayer[0].toUpperCase()}${this.currPlayer.slice(1, this.currPlayer.length)} player won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver=true;
      return this.endGame('Tie!');
    }
    // switch players
    this.currPlayer = this.currPlayer === playerOne.color ? playerTwo.color : playerOne.color;
  }

  //checkForWin: check board cell-by-cell for "does a win start here?"
  checkForWin() {
    const _win = ((cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    });
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  
  //clear the existing board
  clearBoard() {
    const table = document.querySelector('table');
    table.innerHTML = '';
    this.currPlayer = playerOne.color;
    this.board = [];
    this.gameOver = false;
  }
}


//make a start game button
const startButton = document.querySelector('#start-game');
const newGame = new Game(6, 7);
startButton.addEventListener('click', () => {
  newGame.currPlayer = playerOne.color;
  newGame.clearBoard();
  newGame.makeBoard();
  newGame.makeHtmlBoard();
})



//figure out a better way to track players
//fix so the piece appears before the alert
//animate so the piece drops through the table