/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.currPlayer = 1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
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
    top.addEventListener('click', this.handleClick);
  
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

  //findSpotForCol: given column x, return rop empty y (null if filled)
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
    piece.classList.add(`p${this.currPlayer}`);
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
    console.log('the handleClick this is ', this);
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = newGame.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // place piece in board and add to HTML table
    newGame.board[y][x] = newGame.currPlayer;
    newGame.placeInTable(y, x);
    
    // check for win
    if (newGame.checkForWin()) {
      return newGame.endGame(`Player ${newGame.currPlayer} won!`);
    }
    
    // check for tie
    if (newGame.board.every(row => row.every(cell => cell))) {
      return newGame.endGame('Tie!');
    }
    // switch players
    newGame.currPlayer = newGame.currPlayer === 1 ? 2 : 1;
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
}


const newGame = new Game(6, 7);
newGame.makeBoard();
newGame.makeHtmlBoard();

const newGame2 = new Game(6, 7);
newGame2.makeBoard();
newGame2.makeHtmlBoard();

//rewrite the whole thing as a class that functions for the game
//add pause to endGame so that the piece appears before the alert runs
//make a start game button
//make it so you can't continue doing moves once a game has ended (use a property to do this)
//make a player class that takes a string color name and stores it on that player instance
//make game track the current player instance instead of current player number
//update the code so the pieces are the right color for each player
//add a form so users can enter colors for each player. 