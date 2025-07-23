// Characters JavaScript - Immersive Theme
let abilityIndex = 1;
let weaponIndex = 1;

// Initialize the characters page
document.addEventListener('DOMContentLoaded', function() {
    // Add form submission handler
    const characterForm = document.getElementById('characterForm');
    if (characterForm) {
        characterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createCharacter();
        });
    }

    // Add stat input change handlers
    const statInputs = document.querySelectorAll('.stat-input');
    statInputs.forEach(input => {
        input.addEventListener('change', function() {
            const characterId = this.closest('.character-card').getAttribute('data-character');
            const stat = this.getAttribute('data-stat');
            const value = this.value;
            
            // Add visual feedback
            this.style.borderColor = '#48dbfb';
            this.style.boxShadow = '0 0 15px rgba(72, 219, 251, 0.3)';
            
            setTimeout(() => {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, 1000);
        });
    });
});

// Create a new character
function createCharacter() {
    const form = document.getElementById('characterForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['name', 'race', 'class', 'background', 'role', 'backstory'];
    for (let field of requiredFields) {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            showMessage(`Please fill in the ${field.replace('_', ' ')} field`, 'error');
            return;
        }
    }
    
    // Build character data
    const characterData = {
        name: formData.get('name'),
        race: formData.get('race'),
        class: formData.get('class'),
        background: formData.get('background'),
        role: formData.get('role'),
        backstory: formData.get('backstory'),
        image_url: formData.get('image_url') || '',
        signature_item: {
            name: formData.get('signature_item_name'),
            type: formData.get('signature_item_type'),
            description: formData.get('signature_item_description'),
            grants: formData.get('signature_item_grants')
        },
        character_bond: formData.get('character_bond') || '',
        character_conflict: formData.get('character_conflict') || '',
        character_drive: formData.get('character_drive') || '',
        patron_mechanic: formData.get('patron_mechanic') || '',
        special_abilities: {},
        weapons: {},
        stats: {
            strength: parseInt(formData.get('strength')),
            dexterity: parseInt(formData.get('dexterity')),
            constitution: parseInt(formData.get('constitution')),
            intelligence: parseInt(formData.get('intelligence')),
            wisdom: parseInt(formData.get('wisdom')),
            charisma: parseInt(formData.get('charisma')),
            hp: parseInt(formData.get('hp')),
            ac: parseInt(formData.get('ac')),
            speed: parseInt(formData.get('speed')),
            initiative: parseInt(formData.get('initiative'))
        }
    };
    
    // Process abilities
    const abilityEntries = document.querySelectorAll('.ability-entry');
    abilityEntries.forEach((entry, index) => {
        const name = entry.querySelector(`[name="ability_name_${index}"]`).value;
        const type = entry.querySelector(`[name="ability_type_${index}"]`).value;
        const description = entry.querySelector(`[name="ability_description_${index}"]`).value;
        
        if (name && description) {
            characterData.special_abilities[`ability_${index}`] = {
                name: name,
                type: type || '',
                description: description
            };
        }
    });
    
    // Process weapons
    const weaponEntries = document.querySelectorAll('.weapon-entry');
    weaponEntries.forEach((entry, index) => {
        const name = entry.querySelector(`[name="weapon_name_${index}"]`).value;
        const type = entry.querySelector(`[name="weapon_type_${index}"]`).value;
        const description = entry.querySelector(`[name="weapon_description_${index}"]`).value;
        const grants = entry.querySelector(`[name="weapon_grants_${index}"]`).value;
        
        if (name && type && description && grants) {
            characterData.weapons[`weapon_${index}`] = {
                name: name,
                type: type,
                description: description,
                grants: grants
            };
        }
    });
    
    // Send to server
    fetch('/api/characters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Character created successfully!', 'success');
            setTimeout(() => {
                window.location.href = '/characters';
            }, 1500);
        } else {
            showMessage(data.error || 'Failed to create character', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Failed to create character. Please try again.', 'error');
    });
}

// Add a new ability entry
function addAbility() {
    const container = document.getElementById('abilities-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'ability-entry';
    
    newEntry.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="ability_name_${abilityIndex}">Ability Name</label>
                <input type="text" id="ability_name_${abilityIndex}" name="ability_name_${abilityIndex}" required>
            </div>
            <div class="form-group">
                <label for="ability_type_${abilityIndex}">Ability Type</label>
                <input type="text" id="ability_type_${abilityIndex}" name="ability_type_${abilityIndex}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="ability_description_${abilityIndex}">Description</label>
                <textarea id="ability_description_${abilityIndex}" name="ability_description_${abilityIndex}" required></textarea>
            </div>
        </div>
        <button type="button" class="remove-entry-btn" onclick="removeEntry(this, 'ability')">🗑️ Remove Ability</button>
    `;
    
    container.appendChild(newEntry);
    abilityIndex++;
    
    // Add visual feedback
    newEntry.style.opacity = '0';
    newEntry.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newEntry.style.transition = 'all 0.3s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateY(0)';
    }, 10);
}

// Add a new weapon entry
function addWeapon() {
    const container = document.getElementById('weapons-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'weapon-entry';
    
    newEntry.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="weapon_name_${weaponIndex}">Weapon Name</label>
                <input type="text" id="weapon_name_${weaponIndex}" name="weapon_name_${weaponIndex}" required>
            </div>
            <div class="form-group">
                <label for="weapon_type_${weaponIndex}">Weapon Type</label>
                <input type="text" id="weapon_type_${weaponIndex}" name="weapon_type_${weaponIndex}" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="weapon_description_${weaponIndex}">Description</label>
                <textarea id="weapon_description_${weaponIndex}" name="weapon_description_${weaponIndex}" required></textarea>
            </div>
            <div class="form-group">
                <label for="weapon_grants_${weaponIndex}">Grants</label>
                <textarea id="weapon_grants_${weaponIndex}" name="weapon_grants_${weaponIndex}" required></textarea>
            </div>
        </div>
        <button type="button" class="remove-entry-btn" onclick="removeEntry(this, 'weapon')">🗑️ Remove Weapon</button>
    `;
    
    container.appendChild(newEntry);
    weaponIndex++;
    
    // Add visual feedback
    newEntry.style.opacity = '0';
    newEntry.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newEntry.style.transition = 'all 0.3s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateY(0)';
    }, 10);
}

// Remove an entry (ability or weapon)
function removeEntry(button, type) {
    const entry = button.closest('.ability-entry, .weapon-entry');
    
    // Add removal animation
    entry.style.transition = 'all 0.3s ease';
    entry.style.opacity = '0';
    entry.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        entry.remove();
    }, 300);
}

// Clear the form
function clearForm() {
    if (confirm('Are you sure you want to clear the form? All entered data will be lost.')) {
        const form = document.getElementById('characterForm');
        form.reset();
        
        // Remove all additional ability and weapon entries
        const abilityEntries = document.querySelectorAll('.ability-entry:not(:first-child)');
        const weaponEntries = document.querySelectorAll('.weapon-entry:not(:first-child)');
        
        abilityEntries.forEach(entry => entry.remove());
        weaponEntries.forEach(entry => entry.remove());
        
        // Reset indices
        abilityIndex = 1;
        weaponIndex = 1;
        
        showMessage('Form cleared!', 'success');
    }
}

// Save character stats
function saveStats(characterId) {
    const characterCard = document.querySelector(`[data-character="${characterId}"]`);
    const statInputs = characterCard.querySelectorAll('.stat-input');
    const stats = {};
    
    statInputs.forEach(input => {
        const stat = input.getAttribute('data-stat');
        stats[stat] = parseInt(input.value);
    });
    
    fetch(`/api/characters/${characterId}/stats`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats: stats })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Stats saved successfully!', 'success');
        } else {
            showMessage(data.error || 'Failed to save stats', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Failed to save stats. Please try again.', 'error');
    });
}

// Delete a character
function deleteCharacter(characterId) {
    if (confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
        fetch(`/api/characters/${characterId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const characterCard = document.querySelector(`[data-character="${characterId}"]`);
                
                // Add removal animation
                characterCard.style.transition = 'all 0.5s ease';
                characterCard.style.opacity = '0';
                characterCard.style.transform = 'translateY(-50px) scale(0.8)';
                
                setTimeout(() => {
                    characterCard.remove();
                    showMessage('Character deleted successfully!', 'success');
                }, 500);
            } else {
                showMessage(data.error || 'Failed to delete character', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Failed to delete character. Please try again.', 'error');
        });
    }
}

// Edit a character (redirect to create page with character data)
function editCharacter(characterId) {
    // For now, just redirect to the create page
    // In a full implementation, you'd load the character data into the form
    window.location.href = `/create-character?edit=${characterId}`;
}

// Remove a character ability
function removeCharacterAbility(characterId, abilityId) {
    if (confirm('Are you sure you want to remove this ability?')) {
        fetch(`/api/characters/${characterId}/abilities/${abilityId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const abilityItem = document.querySelector(`[data-ability-id="${abilityId}"]`);
                
                // Add removal animation
                abilityItem.style.transition = 'all 0.3s ease';
                abilityItem.style.opacity = '0';
                abilityItem.style.transform = 'translateX(-50px)';
                
                setTimeout(() => {
                    abilityItem.remove();
                    showMessage('Ability removed successfully!', 'success');
                }, 300);
            } else {
                showMessage(data.error || 'Failed to remove ability', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Failed to remove ability. Please try again.', 'error');
        });
    }
}

// Remove a character weapon
function removeCharacterWeapon(characterId, weaponId) {
    if (confirm('Are you sure you want to remove this weapon?')) {
        fetch(`/api/characters/${characterId}/weapons/${weaponId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const weaponItem = document.querySelector(`[data-weapon-id="${weaponId}"]`);
                
                // Add removal animation
                weaponItem.style.transition = 'all 0.3s ease';
                weaponItem.style.opacity = '0';
                weaponItem.style.transform = 'translateX(-50px)';
                
                setTimeout(() => {
                    weaponItem.remove();
                    showMessage('Weapon removed successfully!', 'success');
                }, 300);
            } else {
                showMessage(data.error || 'Failed to remove weapon', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Failed to remove weapon. Please try again.', 'error');
        });
    }
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
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 4000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + S to save stats (if on character page)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        const characterCard = document.querySelector('.character-card');
        if (characterCard) {
            const characterId = characterCard.getAttribute('data-character');
            saveStats(characterId);
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