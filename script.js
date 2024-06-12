let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let betAmount = 10;
let playerMoney = 1000;
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'default';
    document.body.className = theme;
    updateBetSlider();
});

function navigateTo(page) {
    window.location.href = page;
}

function changeTheme() {
    const theme = document.getElementById('theme').value;
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

function updateBetAmount() {
    betAmount = parseInt(document.getElementById('bet-slider').value);
    document.getElementById('bet-amount').innerText = `Сумма ставки: ${betAmount}`;
}

function betAll() {
    betAmount = playerMoney;
    updateBetSlider();
}

function clearBet() {
    betAmount = 10;
    updateBetSlider();
}

function updateBetSlider() {
    const betSlider = document.getElementById('bet-slider');
    betSlider.max = playerMoney;
    betSlider.value = betAmount;
    document.getElementById('bet-amount').innerText = `Сумма ставки: ${betAmount}`;
    document.getElementById('player-money').innerText = `Монеты: ${playerMoney}`;
}

function startGame() {
    if (betAmount > playerMoney) {
        showAlert('Недостаточно монет для ставки');
        return;
    }
    playerMoney -= betAmount;
    resetGame();
    dealCard('player');
    dealCard('dealer');
    dealCard('player');
    dealCard('dealer', true);
    updateScores();
    navigateTo('game.html');
}

function dealCard(player, hidden = false) {
    const card = getRandomCard();
    if (player === 'player') {
        playerCards.push(card);
        addCardToUI(card, 'player-cards', hidden);
        playerScore = calculateScore(playerCards);
    } else {
        dealerCards.push(card);
        addCardToUI(card, 'dealer-cards', hidden);
        dealerScore = calculateScore(dealerCards);
    }
}

function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { suit, value };
}

function addCardToUI(card, elementId, hidden) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    if (!hidden) {
        cardElement.innerHTML = `<span class="${card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'}">${card.value}<br>${card.suit}</span>`;
    }
    document.getElementById(elementId).appendChild(cardElement);
}

function calculateScore(cards) {
    let score = 0;
    let aces = 0;
    cards.forEach(card => {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function updateScores() {
    document.getElementById('player-score').innerText = `Счёт: ${playerScore}`;
    if (dealerCards.length > 1) {
        document.getElementById('dealer-score').innerText = `Счёт: ${dealerScore}`;
    }
}

function hit() {
    dealCard('player');
    updateScores();
    checkWinConditions();
}

function stand() {
    while (dealerScore < 17) {
        dealCard('dealer');
    }
    updateScores();
    checkWinConditions();
}

function double() {
    if (betAmount * 2 > playerMoney) {
        showAlert('Недостаточно монет для двойной ставки');
        return;
    }
    playerMoney -= betAmount;
    betAmount *= 2;
    updateBetSlider();
    dealCard('player');
    stand();
}

function checkWinConditions() {
    if (playerScore > 21) {
        showAlert('Вы проиграли!');
        resetGame();
    } else if (dealerScore > 21) {
        showAlert('Вы выиграли!');
        playerMoney += betAmount * 2;
        resetGame();
    } else if (playerScore === 21) {
        showAlert('Blackjack! Вы выиграли!');
        playerMoney += betAmount * 2.5;
        resetGame();
    } else if (dealerScore === 21) {
        showAlert('Дилер имеет Blackjack. Вы проиграли!');
        resetGame();
    } else if (dealerScore >= 17 && dealerScore > playerScore) {
        showAlert('Вы проиграли!');
        resetGame();
    } else if (dealerScore >= 17 && dealerScore < playerScore) {
        showAlert('Вы выиграли!');
        playerMoney += betAmount * 2;
        resetGame();
    }
}

function resetGame() {
    playerScore = 0;
    dealerScore = 0;
    playerCards = [];
    dealerCards = [];
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    updateBetSlider();
    navigateTo('index.html');
}

function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        document.body.removeChild(alertBox);
    }, 3000);
}

function exitGame() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.close();
    }
}
