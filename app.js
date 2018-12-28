// VARIABLES
const startButton = document.querySelector('.btn__reset');
const keyboard = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const phrases = [
  'down for the count',
  'shot in the dark',
  'cut to the chase',
  'in the red',
  'my cup of tea'
];
let missed = 0;
const lives = document.getElementsByTagName('img');
let firstGame = true;

// A random phrase is generated when the page loads and adds is to the display
let phraseArray = getRandomPhrasesArray(phrases);
addPhraseToDisplay(phraseArray);

// Event listener to watch for the start of the game & hide start screen
startButton.addEventListener('click', () => {
  // Reseting the board if the user has already played
  if (!firstGame) {
    // Removes the game board
    document.querySelector('#phrase ul').innerHTML = '';
    // Removes styles from selecteed letters
    let selectedButtons = Array.prototype.slice.call(document.getElementsByClassName('chosen'));
    for (let i = 0; i < selectedButtons.length; i++) {
      selectedButtons[i].classList.remove("chosen");
      selectedButtons[i].removeAttribute('disabled');
    }
    // Resets the amount of lives
    const lives = document.getElementsByTagName('img');
    for (let i = 0; i < lives.length; i++) {
      lives[i].src="images/liveHeart.png";
    }
    // Gets a new phrase and adds it to the board
    phraseArray = getRandomPhrasesArray(phrases);
    addPhraseToDisplay(phraseArray);
    // Resets missed attempts to 0
    missed = 0;
  }
  const startScreen = document.getElementById('overlay');
  startScreen.style.display = 'none';
  firstGame = false;
});

// Function to get a random phrase from an array
function getRandomPhrasesArray(arr) {
  const randomNum = Math.floor(Math.random() * (5));
  const randomPhrase = arr[randomNum];
  const phraseChars = randomPhrase.split('');
  return phraseChars;
}

// Function to set the game display
function addPhraseToDisplay(arr) {
  for (let i = 0; i < arr.length; i++) {
    const char = document.createTextNode(arr[i]);
    const charLI = document.createElement('li');
    charLI.appendChild(char);
    if (charLI.textContent !== ' ') {
      charLI.classList = 'letter';
    } else {
      charLI.classList = 'space';
    }
    document.querySelector('#phrase ul').appendChild(charLI);
  }
}

// Function to check the letter a user selects
function checkLetter(userLetter) {
  let chars = Array.prototype.slice.call(document.querySelectorAll('.letter'));

  // Filter used to test the selected letter against each letter on the game board
  const lettersFound = chars.filter((char) => {
    if (userLetter === char.textContent) {
        char.classList.add('show');
        return char;
      }
    });
  return lettersFound.length;
}

// Event listener for when a user selects a letter on the keyboard
keyboard.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {;
    let chosenLetter = e.target;
    chosenLetter.classList.add('chosen');
    chosenLetter.setAttribute('disabled', '');
    let letterFound = checkLetter(chosenLetter.textContent);
    // If the users letter is not found a life is removed
    if (letterFound === 0) {
      missed++;
      lives[missed - 1].src="images/lostHeart.png";
    }
    checkWin();
  }
});

// Event listener to allow the user to press letters on the keyboard
let lastKeyPressed = '';
window.onkeyup = (e) => {
  // If/Else statement to see if the key pressed has already been pressed
  if (lastKeyPressed === e.key) {
    return;
  } else {
    lastKeyPressed = e.key;
    const buttons = Array.prototype.slice.call(document.getElementsByTagName('button'));
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letterPressed = e.key;
      // Loops through the buttons to select the button associated with it 
      for (let i = 0; i < buttons.length; i++) {
        if (letterPressed === buttons[i].textContent) {
          buttons[i].classList.add('chosen');
          buttons[i].setAttribute('disabled', '');
          let letterFound = checkLetter(letterPressed);
          // If the users letter is not found a life is removed
          if (letterFound === 0) {
            missed++;
            lives[missed-1].src="images/lostHeart.png";
          }
        }
      }
      checkWin();
    }
  }
}

// Function to check if the user has won or lost
function checkWin() {
  const shownLetters = document.querySelectorAll('.show');
  const totalLetters = document.querySelectorAll('.letter');
  // What happens if the player loses all their lives
  if (missed >= 5) {
    const overlay = document.getElementById('overlay');
    overlay.style.display = '';
    overlay.classList.remove('start');
    overlay.classList.add('lose')
    startButton.innerHTML = 'Try Again';
  // What happens when the player wins the game
  } else if (shownLetters.length === totalLetters.length) {
    overlay.style.display = '';
    overlay.classList.add('win');
    startButton.innerHTML = 'Play Again';
  }
}