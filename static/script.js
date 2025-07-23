// Dice Roller JavaScript - Immersive Theme
let rollHistory = [];

// Initialize the dice roller
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to dice cards
    const diceCards = document.querySelectorAll('.dice-card');
    diceCards.forEach(card => {
        card.addEventListener('click', function() {
            const diceType = this.getAttribute('data-dice');
            rollDice(diceType);
        });
    });

    // Load roll history from localStorage
    loadRollHistory();
});

// Roll a single dice
function rollDice(diceType) {
    const diceNumber = parseInt(diceType.substring(1));
    const result = Math.floor(Math.random() * diceNumber) + 1;
    
    const rollData = {
        dice: diceType.toUpperCase(),
        result: result,
        timestamp: new Date().toLocaleTimeString(),
        type: 'single'
    };
    
    addRollToHistory(rollData);
    displayRollResult(rollData);
    
    // Add visual feedback
    const diceCard = document.querySelector(`[data-dice="${diceType}"]`);
    if (diceCard) {
        diceCard.style.transform = 'translateY(-8px) scale(1.02)';
        setTimeout(() => {
            diceCard.style.transform = '';
        }, 200);
    }
}

// Add roll to history
function addRollToHistory(rollData) {
    rollHistory.unshift(rollData);
    
    // Keep only last 50 rolls
    if (rollHistory.length > 50) {
        rollHistory = rollHistory.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('rollHistory', JSON.stringify(rollHistory));
}

// Display roll result
function displayRollResult(rollData) {
    const resultsContainer = document.getElementById('rollResults');
    
    // Remove "no rolls" message if it exists
    const noRolls = resultsContainer.querySelector('.no-rolls');
    if (noRolls) {
        noRolls.remove();
    }
    
    const resultElement = document.createElement('div');
    resultElement.className = 'roll-result';
    
    let resultHTML = `
        <div class="roll-header">
            <span class="roll-dice">${rollData.dice}</span>
            <span class="roll-time">${rollData.timestamp}</span>
        </div>
    `;
    
    if (rollData.type === 'single') {
        resultHTML += `
            <div class="roll-numbers">Rolled: ${rollData.result}</div>
        `;
    } else {
        resultHTML += `
            <div class="roll-numbers">Rolls: [${rollData.results.join(', ')}]</div>
            <div class="roll-total">Total: ${rollData.total}</div>
        `;
    }
    
    resultElement.innerHTML = resultHTML;
    
    // Add to the top of the results
    resultsContainer.insertBefore(resultElement, resultsContainer.firstChild);
    
    // Add success message
    showMessage(`Rolled ${rollData.dice}: ${rollData.type === 'single' ? rollData.result : rollData.total}`, 'success');
}

// Clear roll history
function clearHistory() {
    rollHistory = [];
    localStorage.removeItem('rollHistory');
    
    const resultsContainer = document.getElementById('rollResults');
    resultsContainer.innerHTML = '<div class="no-rolls">No rolls yet. Start rolling to see your results!</div>';
    
    showMessage('Roll history cleared!', 'success');
}

// Load roll history from localStorage
function loadRollHistory() {
    const saved = localStorage.getItem('rollHistory');
    if (saved) {
        try {
            rollHistory = JSON.parse(saved);
            displayRollHistory();
        } catch (error) {
            console.error('Error loading roll history:', error);
            rollHistory = [];
        }
    }
}

// Display all roll history
function displayRollHistory() {
    const resultsContainer = document.getElementById('rollResults');
    
    if (rollHistory.length === 0) {
        resultsContainer.innerHTML = '<div class="no-rolls">No rolls yet. Start rolling to see your results!</div>';
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    rollHistory.forEach(rollData => {
        const resultElement = document.createElement('div');
        resultElement.className = 'roll-result';
        
        let resultHTML = `
            <div class="roll-header">
                <span class="roll-dice">${rollData.dice}</span>
                <span class="roll-time">${rollData.timestamp}</span>
            </div>
        `;
        
        if (rollData.type === 'single') {
            resultHTML += `
                <div class="roll-numbers">Rolled: ${rollData.result}</div>
            `;
        } else {
            resultHTML += `
                <div class="roll-numbers">Rolls: [${rollData.results.join(', ')}]</div>
                <div class="roll-total">Total: ${rollData.total}</div>
            `;
        }
        
        resultElement.innerHTML = resultHTML;
        resultsContainer.appendChild(resultElement);
    });
}

// Show message notification
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 3000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to roll d20
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        rollDice('d20');
    }
    
    // Space to roll d6
    if (event.code === 'Space' && !event.target.matches('input, textarea')) {
        event.preventDefault();
        rollDice('d6');
    }
    
    // Number keys for quick dice rolls
    if (event.key >= '1' && event.key <= '9' && !event.target.matches('input, textarea')) {
        const diceMap = {
            '1': 'd4',
            '2': 'd6',
            '3': 'd8',
            '4': 'd10',
            '5': 'd12',
            '6': 'd15',
            '7': 'd17',
            '8': 'd20',
            '9': 'd100'
        };
        
        const diceType = diceMap[event.key];
        if (diceType) {
            event.preventDefault();
            rollDice(diceType);
        }
    }
});

// Add form input effects
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#48dbfb';
            this.style.boxShadow = '0 0 15px rgba(72, 219, 251, 0.3)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });
}); 