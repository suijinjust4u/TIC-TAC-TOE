let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // X always starts
let isGameActive = true;
let isVsAI = false;
let humanPlayer = 'X';
let aiPlayer = 'O';

const statusDisplay = document.getElementById('status');
const gameModeSelection = document.getElementById('gameModeSelection');
const playerSelection = document.getElementById('playerSelection');
const gameContainer = document.getElementById('gameContainer');

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Game mode selection (Player vs Player or Player vs AI)
document.getElementById('vsPlayerBtn').addEventListener('click', () => {
  isVsAI = false;
  startGame();
});

document.getElementById('vsAiBtn').addEventListener('click', () => {
  isVsAI = true;
  gameModeSelection.style.display = 'none';
  playerSelection.style.display = 'block'; // Show X/O selection
});

// Player chooses to be X or O in AI mode
document.getElementById('chooseXBtn').addEventListener('click', () => {
  humanPlayer = 'X';
  aiPlayer = 'O';
  startGame();
});

document.getElementById('chooseOBtn').addEventListener('click', () => {
  humanPlayer = 'O';
  aiPlayer = 'X';
  startGame();
  setTimeout(aiMove, 1000); // Ensure AI makes the first move immediately after setup
});

function startGame() {
  gameModeSelection.style.display = 'none';
  playerSelection.style.display = 'none';
  gameContainer.style.display = 'block';
  resetGame();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  // If the clicked cell is not empty or the game is over, do nothing
  if (board[clickedCellIndex] !== '' || !isGameActive) {
    return;
  }

  // Player's move (humanPlayer or in 2-player mode)
  board[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
  clickedCell.classList.add(currentPlayer);

  checkResult();

  if (isGameActive) {
    if (isVsAI) {
      // If it's AI's turn after the player moves
      if (currentPlayer === humanPlayer) {
        currentPlayer = aiPlayer;
        statusDisplay.innerHTML = "AI is thinking...";
        setTimeout(aiMove, 1000);  // AI moves after 1 second
      }
    } else {
      // In Player vs Player, switch turns
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
    }
  }
}

// AI makes a move
function aiMove() {
  // Find all available (empty) cells
  const availableCells = board
    .map((cell, index) => cell === '' ? index : null)
    .filter(index => index !== null);

  // Randomly choose a cell for AI
  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const aiCellIndex = availableCells[randomIndex];

  // AI places its symbol
  board[aiCellIndex] = aiPlayer;
  const aiCell = document.querySelector(`.cell[data-index='${aiCellIndex}']`);
  aiCell.innerHTML = aiPlayer;
  aiCell.classList.add(aiPlayer);

  checkResult();

  if (isGameActive) {
    // Switch back to human player's turn
    currentPlayer = humanPlayer;
    statusDisplay.innerHTML = `Player ${humanPlayer}'s turn`;
  }
}

// Check the game result for win or draw
function checkResult() {
  let roundWon = false;

  // Check for all win conditions
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    const a = board[winCondition[0]];
    const b = board[winCondition[1]];
    const c = board[winCondition[2]];

    if (a === '' || b === '' || c === '') {
      continue;
    }

    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerHTML = `Player ${currentPlayer} wins!`;
    isGameActive = false;
    return;
  }

  // Check for a draw
  if (!board.includes('')) {
    statusDisplay.innerHTML = "It's a draw!";
    isGameActive = false;
    return;
  }
}

// Reset the game to its initial state
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  isGameActive = true;
  currentPlayer = 'X';  // X always starts
  statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerHTML = '';
    cell.classList.remove('X', 'O');
  });
}

// Attach event listeners to cells and reset button
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('resetBtn').addEventListener('click', resetGame);
