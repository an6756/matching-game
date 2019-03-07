/*
 * cards is an array variable to store the list of all cards, each card is
 *stored twice, we have a total of 16 cards
 */
 var cards = [
   'fa-diamond', 'fa-diamond',
   'fa-paper-plane-o', 'fa-paper-plane-o',
   'fa-bolt', 'fa-bolt',
   'fa-anchor', 'fa-anchor',
   'fa-cube', 'fa-cube',
   'fa-leaf', 'fa-leaf',
   'fa-bomb', 'fa-bomb',
   'fa-bicycle', 'fa-bicycle'
 ];

/* This fnction getHtmlForCard returns the html for each of the card prefixed
 * with a 'fa' string. This is a test.
 */
 function getHtmlForCard(card) {
   return '<li class="card"><i class="fa ' + card + '"></i></li>'
 }

/* Display the cards on the page. Shuffles the list using the shuffle method,
 * calls the getHtmlForCard function which gets the HTML for each card, uses
 * the jquery to first empty the deck and appends it to the deck.
 */
 function display(cards) {
   shuffle(cards);
   var deck = $('.deck');
   deck.empty();
   cards.forEach(function(card, index) {
     var cardHtml = getHtmlForCard(card);
     deck.append(cardHtml);
   });
 }

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * List of Global Variables used, openCards is an array to store all openCards,
 * moveCOunter to increase for each move, matchedCardCount to count for each
 * match (max 8), timeTaken to calculate time, and intervalid to calculate time
 * lapse
 */
var openCards = [];
var moveCounter = 0;
var matchedCardCount = 0;
var timeTaken = 0;
var intervalId = null;

/* The function cardMatch is to check if the cards clicked (first and second
 * order) and returns true if there is a matcg
 */
function cardsMatch() {
  return openCards[0] === openCards[1];
}


/* The function lockCards is add match attr to the class, not enable the click,
 *  for open cards, initialize opencards to empty, increase matchcount and if
 *the card passed is not in matched then enable the user to click
 */
function lockCards(cardName) {
  $('.' + openCards[0]).parent().addClass('match');
  $('.card').off('click');
  openCards = [];
  matchedCardCount += 1;
  $('.card').not('.match').click(cardClickListener);
}

/* Function showCardSymbol takes in a card element and adds the open show class
 */
function showCardSymbol(cardElem) {
  cardElem.addClass('open show');
}

/* Function displayScore calls the stopTimer and toggles the display modal*/
function displayFinalScore() {
  stopTimer();
  $('.modal').toggle();
}

/* Function handleCloseRequest will toggle the display modal*/
function handleCloseRequest() {
  $('.modal').toggle();
}

/*Function handlePlayAgain will call the refreshGame function to allow the user
 * to refresh the game and also toggles the modal thereby not displaying the modal*/
function handlePlayAgain() {
  $('.modal').toggle();
  refreshGame();
}

/* Function refreshGame intializes all variales, calls the updateMoveCounter
 * stops the timer, displays the cards and allows the click on the cards using
 * the clickListener event handler*/
function refreshGame() {
  openCards = [];
  moveCounter = 0;
  matchedCardCount = 0;
  timeTaken = 0;
  updateMoveCounter();
  stopTimer();
  display(cards);
  $( ".card" ).click(cardClickListener);
}

/**
 * This is a function to stop the timer that has been started, clear the
 * interval and call the updateTimer function
 */
function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  updateTimer();
}

/**
 * function to close the open cards,remove the class open and show and call
 * the setTimeout after keeping the card open for 1000 secs
 */
function closeOpenCards() {
  var openCardElements = $('.card.open.show');
  setTimeout(function() {
    openCardElements.removeClass('open show');
  }, 1000);
  openCards = [];
}

/*function to add the card to open list of cards after each card is clicked,
save them in an array opencards*/
function addCardToOpenCardList(cardElem) {
  var className = cardElem.children().attr('class').substr(3);
  openCards.push(className);
}

/*function to update Timer and write out the time*/
function updateTimer() {
  $('.time').text(timeTaken);
}

/*function to update the MoveCounter for every move, check for stars, start at
3 and lower them as per the number of moves, pass the number of stars depending
on the variable score*/
function updateMoveCounter() {
  $('.moves').text(moveCounter);
  var score = 3;
  if (moveCounter < 10) {
    score = 3;
  } else if (moveCounter < 20) {
    score = 2;
  } else {
    score = 1;
  }
  var starsElement = $('.stars');
  starsElement.empty();
  for (var i=1; i <= score; i++) {
    starsElement.append('<li><i class="fa fa-star"></i></li>');
  }
}
/*function called StartTimer to start the timer, calculate intervalId which is
the timetaken is current time-startime in sec, and call update Timer*/
function startTimer() {
  if (intervalId !== null) {
    return;
  }
  var startTime = Date.now();
  intervalId = setInterval(function() {
    timeTaken = Math.round((Date.now() - startTime) / 1000);
    updateTimer();
  }, 1000);
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


 /**
  * function to execute on cardclick, start timer, show the card clicked,
  * add the card to open card list, match the first two open cards, if matched,
  * lock it from clicking further, check for match card count if >= 8,
  * call final score display function else call close the open card functions,
  * increase the move counter for everymove and also update the moveCounter.
  */
 function cardClickListener(event) {
   var cardClicked = $(event.target);
   startTimer();
   showCardSymbol(cardClicked);
   addCardToOpenCardList(cardClicked);
   if (openCards.length > 1) {
     if (cardsMatch()) {
       lockCards()
       if (matchedCardCount >= 8) {
         displayFinalScore();
       }
     } else {
       closeOpenCards();
     }
     moveCounter += 1;
     updateMoveCounter();
   }
 }

/* This is the main funtion of the program. The main function displays cards,
 *registers the click event and registers the refresh Game on click, registers
 * the click event on the 'yes' and 'no' click on the modal
 *References include 'https://gist.github.com/blackfalcon/8428401'
 *http://api.jquery.com
 *https://www.w3schools.com
 * https://stackoverflow.com/questions
 **/
function main() {
  display(cards);
  $( ".card" ).click(cardClickListener);
  $('.restart').click(refreshGame);
  $('#yesButton').click(handlePlayAgain);
  $('#noButton').click(handleCloseRequest);
  $('.close').click(handleCloseRequest);
}

/* calling the main function of the program */
main();
