
// // CARD FLIP MECHANISM
// var card = document.querySelector('.game');

// card.addEventListener('click', function(e) {
//     if (e.target.classList.contains('card__side--front')) {
//         e.target.classList.add('card__side--front--flip');
//         e.target.nextSibling.nextSibling.classList.add('card__side--back--flip');
//     } else if (e.target.classList.contains('icon')) {
//         e.target.parentNode.classList.add('card__side--front--flip');
//         e.target.parentNode.nextSibling.nextSibling.classList.add('card__side--back--flip');
//     }
// })


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var model = (function() {
    var cardList, data, current, matchedCounter;

    function Card(id, hex) {
        this.id = id,
        this.hex = hex
    }

    data = []; // All cards data

    current = []; // Current card selection

    matchedCounter = 0;

    function getRandomHex() {
        var randomHex = [];
        for (i = 0; i < 6; i++) {
            var hexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                             'a', 'b', 'c', 'd', 'e', 'f'];
            randomHex.push(hexValues[Math.floor(Math.random() * 16)]);
        }
        var randomHexString = '#' + randomHex.join('');
        return randomHexString;
    }

    function shuffleCards(cards) {
        var j, x, i;
        for (i = cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = cards[i];
            cards[i] = cards[j];
            cards[j] = x;
        }
        return cards;
    }

    function emptySelection() {
        current = [];
    }

    function checkCurrentSelection() {
        if (current.length === 2) { // If two cards have been selected
            if (current[0] === current[1]) { // If two cards are a match
                matchedCounter++;
                // Empty current selection
                emptySelection();
                console.log(matchedCounter);

                // Update score
                

                // Display message

                // Return matched value

            } else { // If two cards dont match
                // Empty current selection
                emptySelection();
                // Turn cards over


                // Display message
            }
        }
    }

    return {
        getRandomCards: function() {
            cardList = [];
            for (ii = 0; ii < (controller.numberOfCards / 2); ii++) {
                var newHex = getRandomHex();
                cardList.push(newHex);
            }
            // Create pairs of cards
            cardList = cardList.concat(cardList);

            // Shuffle cards
            cardList = shuffleCards(cardList);
            return cardList;
        },

        setCardData: function() {
            for (i = 0; i < controller.numberOfCards; i++) {
                var card = new Card(i, cardList[i]);
                data.push(card);
            }
            console.log(data);
        },

        currentSelection: function(e) {
            current.push(e.target.nextSibling.textContent);
            checkCurrentSelection();
            console.log(current);
        },
        
        returnData: function() {
            return data;
        }
    }
})();

var view = (function() { 
    var HTMLCardTemplate;

    HTMLCardTemplate = '<div class="card card-%0%"><div class="card__side card__side--front">?</div><div class="card__side card__side--back">%hex%</div></div>';

    return {
        flipCard: function(e) {
            if (e.target.classList.contains('card__side--front')) {
                e.target.classList.add('card__side--front--flip');
                e.target.nextSibling.classList.add('card__side--back--flip');
            } // else if (e.target.classList.contains('icon')) {
            //     // In case user clicks on icon, change DOM path
            //     e.target.parentNode.classList.add('card__side--front--flip');
            //     e.target.parentNode.nextSibling.classList.add('card__side--back--flip');
            // }
        },

        showCards: function(cardList) {
            var cardContainer, cardBackNodeList, cardBackArray;
            cardContainer = document.querySelector('.container');
    
            // Display cards with unique ID and hex value on back
            for (y = 0; y < controller.numberOfCards; y++) {
                var newCard = HTMLCardTemplate.replace('%0%', y).replace('%hex%', cardList[y]);
                cardContainer.insertAdjacentHTML('beforeend', newCard);
            }
            // Set background color of each card to hex value
            for (y = 0; y < controller.numberOfCards; y++) {
                cardBackNodeList = document.querySelectorAll('.card__side--back');
                cardBackArray = Array.from(cardBackNodeList);
                cardBackArray[y].style.backgroundColor = cardList[y];
                console.log(cardBackArray[y]);
            }
        }

        // turnBackCards
    }
})();

var controller = (function(model, view) {

    function setEventListeners() {
        var card = document.querySelector('.game');

        // Flip card on click
        card.addEventListener('click', view.flipCard);

        // Store card value in array on click
        card.addEventListener('click', model.currentSelection);
    }


    return {
        numberOfCards: 12,

        init: function() {
            // Set event listeners
            setEventListeners();

            // Get new set of randomised cards
            var newCards = model.getRandomCards();
            console.log(newCards);

            // Display randomised cards on UI
            view.showCards(newCards);
            model.setCardData();

            // Update UI score
        }

        // check selection on click

        //
    }

})(model, view);

controller.init();
