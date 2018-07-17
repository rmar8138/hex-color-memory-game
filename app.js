const model = (function() {
    let cardList = [];

    function getRandomHex() {
        let randomHex = [];
        for (i = 0; i < 6; i++) {
            let hexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                             'a', 'b', 'c', 'd', 'e', 'f'];
            randomHex.push(hexValues[Math.floor(Math.random() * 16)]);
        }
        let randomHexString = '#' + randomHex.join('');
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

    return {
        getRandomCards: function() {
            for (ii = 0; ii < (controller.numberOfCards / 2); ii++) {
                let newHex = getRandomHex();
                cardList.push(newHex);
            }
            // Create pairs of cards
            cardList = cardList.concat(cardList);

            // Shuffle cards
            cardList = shuffleCards(cardList);
            return cardList;
        }
    }
})();

const view = (function() {
    const cardContainer = document.querySelector('.container');
    const game = document.querySelector('.game');
    const popup = document.querySelector('.popup');
    const HTMLCardTemplate = '<div class="card"><div id="%0%" class="card__side card__side--front">&nbsp;</div><div class="card__side card__side--back">%hex%</div></div>'

    return {
        showMenu: function() {
            popup.classList.add('visible');
            game.classList.add('disable');
        },

        closeMenu: function() {
            popup.classList.remove('visible');
            game.classList.remove('disable');
        },

        showCards: function(cardList) {
            var cardBackNodeList, cardBackArray;
    
            // Display cards with unique ID and hex value on back
            for (y = 0; y < controller.numberOfCards; y++) {
                let newCard = HTMLCardTemplate.replace('%0%', y).replace('%hex%', cardList[y]);
                cardContainer.insertAdjacentHTML('beforeend', newCard);
            }
            // Set background color of each card to hex value
            for (y = 0; y < controller.numberOfCards; y++) {
                cardBackNodeList = document.querySelectorAll('.card__side--back');
                cardBackArray = Array.from(cardBackNodeList);
                cardBackArray[y].style.backgroundColor = cardList[y];
            }
        },
        
        flipCard: function(e) {
            if (e.target.classList.contains('card__side--front')) {
                e.target.classList.add('card__side--front--flip');
                e.target.nextSibling.classList.add('card__side--back--flip');
            } 
        },

        disableCards: function() {
            // Disable click on card while two cards are shown
            cardContainer.style.pointerEvents = 'none'
            // Enable click after cards have turned over
            setTimeout(function() {
                cardContainer.style.pointerEvents = 'auto'
            }, 1500);
        },

        noMatch: function(cardID) {
            // Find cards with matching ID and flip back
            let activeCardsNodeList = document.querySelectorAll('.card__side--front');
            activeCardsNodeList.forEach(function(i) {
                if (i.id === cardID[0] || i.id === cardID[1]) {
                    setTimeout(function() {
                        i.classList.remove('card__side--front--flip');
                        i.nextElementSibling.classList.remove('card__side--back--flip');
                    }, 1000);
                }
            });
        },

        updateScore: function(counter) {
            document.querySelector('.sidebar__score-number').textContent = 12 - (counter * 2);
        },

        winMessage: function() {
            document.querySelector('.sidebar__message').textContent = 'You win!';
        }
    }
})();

const controller = (function(model, view) {
    const numberOfCards = 12;
    let cardList;
    let currentHex;
    let currentID;
    let counter = 0;

    function setEventListeners() {
        const card = document.querySelector('.game');
        const menuButton = document.querySelector('.sidebar__help');
        const closeButton = document.querySelector('.popup__close');

        card.addEventListener('click', cardSelect);
        menuButton.addEventListener('click', view.showMenu);
        closeButton.addEventListener('click', view.closeMenu);
    }

    function cardSelect(e) {
        // IF target is a card:
        if (e.target.classList.contains('card__side--front')) {
            // VIEW: call flipCard to apply style classes to flip card in UI
            view.flipCard(e);
            
        // call currentSelection to push ID and hex into array
        currentSelection(e);
        }
    }

    function currentSelection(e) {
        // Push hex intp currentHex array
        currentHex.push(e.target.nextSibling.textContent);

        // Push ID into currentID array
        currentID.push(e.target.id);

        // call checkSelection
        checkSelection();
    }

    function checkSelection() {
        // if two cards have been selected (current.length === 2):
        if (currentHex.length === 2) {
            // if two cards are equal (current[0] === current[1])
            if (currentHex[0] === currentHex[1]) {
                // update counter
                counter++

                // update score in UI
                view.updateScore(counter);

                if (counter === numberOfCards / 2) {
                    view.winMessage();
                }
            } else {
                // stop user from being able to select another card
                view.disableCards();
                // call VIEW noMatch with currentID as arguments
                view.noMatch(currentID);

            }
            clearSelection();
        }
    }

    function clearSelection() {
        currentHex = [];
        currentID = [];
    }

    return {
        numberOfCards,

        init: function() {
            // Set event listeners
            setEventListeners();

            // MODEL: Create cards array and shuffle 
            cardList = model.getRandomCards();

            // VIEW: Display cards in dom by passing card data variable to view
            view.showCards(cardList);

            // VIEW: SHow score in dom
            view.updateScore(counter);

            clearSelection();
        }
    }
})(model, view);

controller.init();