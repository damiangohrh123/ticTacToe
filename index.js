'use strict';

const GameElements = (() => {
  const title = document.querySelector('.title');
  const btnStart = document.querySelector('.btnStart');
  const btnRestart = document.querySelector('.btnRestart');
  const currentPlayer = document.querySelector('.currentPlayer');
  const gameOverMessage = document.querySelector('.gameOverMessage');

  return {
    title,
    btnStart,
    btnRestart,
    currentPlayer,
    gameOverMessage
  }
})();

const GameBoard = (() => {

  const gameBoardArray = ['','','','','','','','',''];

  const render = () => {
    const gameBoardElement = document.querySelector('.gameBoard');
    gameBoardElement.textContent = '';

    /**
     * Loops through gameBoardArray and appends 9 gridElements to the gameBoardElement.
     * Sets the textContent of the gridElement equal to the value of grid.
     * Adds eventListeners to each of the gridElement.
     */
    gameBoardArray.forEach((grid, index) => { 
      const gridElement = document.createElement('div');
      gridElement.classList.add('gridElement');
      gridElement.id = `grid-${index}`;
      gridElement.textContent = grid;

      //Setting color of 'X' = red, 'O' = blue
      if (gridElement.textContent === 'X') {
        gridElement.classList.add('colorRed');
      }
      else if (gridElement.textContent === 'O') {
        gridElement.classList.add('colorBlue');
      }

      gameBoardElement.appendChild(gridElement);
    });

    const grids = document.querySelectorAll('.gridElement');
    grids.forEach((grid) => {
      grid.addEventListener('click', (event) => { 
        Game.handleClick(event);
      })
    })
  }

  //Update the gridElement according to the player's mark.
  const update = (index, value) => {
    gameBoardArray[index] = value;
    render();
  }

  //Allow other modules to gain access to the gameBoardArray.
  const getGameBoardArray = () => {
    return gameBoardArray;
  }

  return {
    render,
    update,
    getGameBoardArray,
  }
})();

//Handle the game logic
const Game = (() => {
  const gameBoardArray = GameBoard.getGameBoardArray();
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  GameElements.btnStart.addEventListener('click', () => {
    start();
  })

  //Player creation factory function
  const createPlayer = (name, mark) => {
    return {
      name,
      mark
    }
  }

  //Create 2 players and calls render()
  const start = () => {
    players = [
      createPlayer('player1', 'X' ),
      createPlayer('player2', 'O'),
    ]
    currentPlayerIndex = 0;
    gameOver = false;
    GameElements.title.textContent = '';
    GameElements.btnStart.style.display = 'none';
    GameElements.gameOverMessage.textContent = '';
    GameElements.currentPlayer.textContent = `player1's turn`;
    GameBoard.render();
  }

  const handleClick = (event) => {
    //Get the id from gridElement. (E.g. Gets '1' from 'grid-1')
    let index = parseInt(event.target.id.split('-')[1]);
    if (gameBoardArray[index] === '' && !isFilled(gameBoardArray) && !gameOver) {
      GameBoard.update(index, players[currentPlayerIndex].mark);

      if (checkForWin(GameBoard.getGameBoardArray())) {
        gameOver = true;
        GameElements.btnRestart.style.display = 'block';
        GameElements.gameOverMessage.textContent = `${players[currentPlayerIndex].name} WON!`
        GameElements.currentPlayer.style.display = `none`;
      }
      else if (isFilled(gameBoardArray)) {
        gameOver = true;
        GameElements.btnRestart.style.display = 'block';
        GameElements.gameOverMessage.textContent = `It's a tie!`
        GameElements.currentPlayer.style.display = `none`;
      }

      //Alternate between players ('X' and 'O')
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      GameElements.currentPlayer.textContent = `${players[currentPlayerIndex].name}'s turn`;
    }
  }

  //Check to see if array is filled.
  const isFilled = (array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === '') {
        return false;
      }
    }
    return true;
  }

  /**
   * Hard coded all the possible winning combinations.
   * 
   */
  const checkForWin = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    for (let i = 0; i < winningCombinations.length; i++ ) {
      /** 
       * Destructuring method. Normally it would be: 
       * 
       * const a = winningCombinations[0];
       * const b = winningCombinations[1];
       * const c = winningCombinations[2];
       */
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }

  GameElements.btnRestart.addEventListener('click', () => {
    restart();
  });

  //Clear the gameBoardArray and run render(). Essentially resetting gameBoard.
  const restart = () => {
    for (let i = 0; i < gameBoardArray.length; i ++) {
      gameBoardArray[i] = '';
    }
    GameBoard.render();
    currentPlayerIndex = 0;
    gameOver = false;
    GameElements.btnRestart.style.display = 'none';
    GameElements.gameOverMessage.textContent = '';
  }

  return {
    start,
    handleClick,
    checkForWin,
    restart
  }
})();