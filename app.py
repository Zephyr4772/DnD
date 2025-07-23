from flask import Flask, render_template, jsonify, request
import random
import json
import os
from datetime import datetime

app = Flask(__name__)

# Define all D&D dice types
DICE_TYPES = {
    'd2': {'name': 'D2 (Coin)', 'sides': 2, 'description': 'Coin flip or 2-sided die'},
    'd3': {'name': 'D3', 'sides': 3, 'description': '3-sided die'},
    'd4': {'name': 'D4 (Tetrahedron)', 'sides': 4, 'description': '4-sided die'},
    'd6': {'name': 'D6 (Cube)', 'sides': 6, 'description': 'Standard 6-sided die'},
    'd8': {'name': 'D8 (Octahedron)', 'sides': 8, 'description': '8-sided die'},
    'd10': {'name': 'D10 (Pentagonal Trapezohedron)', 'sides': 10, 'description': '10-sided die'},
    'd12': {'name': 'D12 (Dodecahedron)', 'sides': 12, 'description': '12-sided die'},
    'd14': {'name': 'D14', 'sides': 14, 'description': '14-sided die'},
    'd16': {'name': 'D16', 'sides': 16, 'description': '16-sided die'},
    'd18': {'name': 'D18', 'sides': 18, 'description': '18-sided die'},
    'd20': {'name': 'D20 (Icosahedron)', 'sides': 20, 'description': '20-sided die'},
    'd30': {'name': 'D30', 'sides': 30, 'description': '30-sided die'},
    'd50': {'name': 'D50', 'sides': 50, 'description': '50-sided die'},
    'd60': {'name': 'D60', 'sides': 60, 'description': '60-sided die'},
    'd100': {'name': 'D100 (Zocchihedron)', 'sides': 100, 'description': '100-sided die'},
    'd120': {'name': 'D120 (Disdyakis Triacontahedron)', 'sides': 120, 'description': '120-sided die'},
    'd144': {'name': 'D144', 'sides': 144, 'description': '144-sided die'},
    'd200': {'name': 'D200', 'sides': 200, 'description': '200-sided die'},
    'd500': {'name': 'D500', 'sides': 500, 'description': '500-sided die'},
    'd1000': {'name': 'D1000', 'sides': 1000, 'description': '1000-sided die'},
    'd10000': {'name': 'D10000', 'sides': 10000, 'description': '10000-sided die'},
    'd100000': {'name': 'D100000', 'sides': 100000, 'description': '100000-sided die'},
    'd1000000': {'name': 'D1000000', 'sides': 1000000, 'description': '1000000-sided die'}
}

# Character data file path
CHARACTERS_FILE = 'characters.json'

# Load characters from file or use default
def load_characters():
    if os.path.exists(CHARACTERS_FILE):
        try:
            with open(CHARACTERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {
        'eryndor': {
            'name': '💀 Eryndor — The Root-King',
            'race': 'Mythic Wood Elf',
            'class': 'Mythic NPC Villain (Former Ranger)',
            'background': 'Child of the Rotwood Sanctuary (Ascended)',
            'role': 'God-tier endboss NPC, rules from within the God-Tree',
            'backstory': 'Eryndor was born during a Skybloom—a rare event where floating forests awaken. The Enclave believes he\'s bonded to the Fracture\'s core ecosystem, and some even whisper he\'s the reincarnation of a Seedcaller Druid.',
            'signature_item': {
                'name': 'Verdant Pulse',
                'type': 'Living Bow',
                'description': 'Made from the Root Cradle itself, it draws from the land\'s strength.',
                'grants': '+1 longbow; once per long rest, cast Hunter\'s Mark without concentration while in natural terrain.'
            },
            'character_bond': 'Brinn the Leafcaller, a mentor-turned-recluse, entrusted Eryndor with the first known memory seed, capable of storing a living moment.',
            'special_abilities': {
                'spawn_leviathans': {
                    'name': 'Spawn Skyroot Leviathans',
                    'description': 'Can summon massive flying tree-beasts as champions'
                },
                'speak_through_roots': {
                    'name': 'Speak Through Rooted People',
                    'description': 'Can speak, see, and act through any root-touched mortal'
                },
                'manipulate_world': {
                    'name': 'Manipulate Weather, Terrain, and Memory',
                    'description': 'God-tier control over natural forces and memories'
                },
                'lock_down_world': {
                    'name': 'Lock Down Parts of the World',
                    'description': 'Can lock down parts of the world by thought alone'
                },
                'rewrite_minds': {
                    'name': 'Rewrite Minds with Time-Lagged Vines',
                    'description': 'Can rewrite minds and memories with temporal root magic'
                }
            },
            'weapons': {
                'pulse_of_virenanthe': {
                    'name': 'Pulse of Virenanthe',
                    'type': 'Divine Weapon - Shifting Bow-Scythe',
                    'description': 'A shifting bow-scythe made from the original godseed core',
                    'grants': 'Can channel god-magic: Entangle, Command, Feeblemind, and Rootbirth (a spell that turns corpses into root-servants)'
                },
                'god_tree_control': {
                    'name': 'God-Tree Control',
                    'type': 'Divine Authority',
                    'description': 'Direct control over the Worldtree and all its aspects',
                    'grants': 'Complete dominion over the living forest and its inhabitants'
                }
            },
            'stats': {
                'strength': 14,
                'dexterity': 18,
                'constitution': 12,
                'intelligence': 10,
                'wisdom': 16,
                'charisma': 8,
                'hp': 32,
                'ac': 16,
                'speed': 35,
                'initiative': 4
            }
        },
        'thalia': {
            'name': '⛪ Thalia Bronzebrook',
            'race': 'Mountain Dwarf',
            'class': 'Cleric (Forge/Divine Echo Domain Hybrid)',
            'background': 'Sanctified Archivist of the Skyward Cathedral',
            'role': 'Moral compass, healer, wielder of ancient divine echoes',
            'backstory': 'Thalia\'s monastery is built on the floating remains of a divine engine—her faith has always been tangled with broken relics. Moradin\'s whispers lately seem…warped.',
            'signature_item': {
                'name': 'Echoplate of Virelda',
                'type': 'Radiant Half-Plate',
                'description': 'Light-forged armor worn by a martyr-paladin who once resisted the Choir\'s song.',
                'grants': 'Resistance to radiant damage, and once per long rest, you may force an enemy to reroll a saving throw against a Cleric spell.'
            },
            'character_conflict': 'The Skybone Chapel\'s guardians believe she\'s meant to seal the god-seed, not protect it.',
            'special_abilities': {
                'vow_of_stillness': {
                    'name': 'Vow of Stillness',
                    'type': '1/day',
                    'description': 'DC 17 — Silence, pacify, and nullify spellcasting in 20 ft for 1 min'
                },
                'crusade_against_chaos': {
                    'name': 'Crusade Against Chaos',
                    'description': 'Double radiant damage against chaotic-aligned casters or surge-users'
                },
                'unforgiven_soul': {
                    'name': 'Unforgiven Soul',
                    'description': 'Absorb radiant magic to heal or counterattack'
                },
                'echo_smite': {
                    'name': 'Echo Smite',
                    'type': '1/day',
                    'description': '+4d8 psychic + Paralyze on invocation of "Duskwind"'
                },
                'whisper_brand': {
                    'name': 'Whisper Brand',
                    'description': 'Grants access to root-locked vaults and attracts divine attention (Eryndor trace)'
                }
            },
            'weapons': {
                'ebonbrand': {
                    'name': 'Ebonbrand',
                    'type': 'Starsteel Maul',
                    'description': 'Starsteel maul; +2 magic, Destructive Wave (force/necrotic) 1/day',
                    'grants': 'Counts as +2 magical weapon. Once per day, cast Destructive Wave (force/necrotic). Radiates anti-divinity aura in 10 ft radius.'
                },
                'plate_of_peacebound': {
                    'name': 'Plate of the Peacebound',
                    'type': 'Artifact Armor',
                    'description': 'Immune to charm/divine possession, +2 saves vs divine effects',
                    'grants': 'Immune to charm, immune to divine possession. Adds +2 to saving throws vs divine magic.'
                },
                'memory_echo_token': {
                    'name': 'Memory Echo Token',
                    'type': 'Consumable Item',
                    'description': 'Can auto-pass a roll ≤DC 15 or reroll a failed save',
                    'grants': '1 use remaining'
                }
            },
            'stats': {
                'strength': 16,
                'dexterity': 10,
                'constitution': 14,
                'intelligence': 12,
                'wisdom': 18,
                'charisma': 14,
                'hp': 28,
                'ac': 18,
                'speed': 25,
                'initiative': 0
            }
        },
        'nixie': {
            'name': '🎪 Nixie Fizzlespark',
            'race': 'Gnome',
            'class': 'Wild Magic Sorcerer',
            'background': 'Ex-Carnival Chaos Artist',
            'role': 'Arcane mayhem, reality breaker, walking hazard',
            'backstory': 'Nixie was adopted by the Gilded Mirage after being found in a crater made of laughter and fire. She never aged normally. She\'s secretly tethered to a carnival engine fragment, now drifting toward the Fracture.',
            'signature_item': {
                'name': 'Cracklejack\'s Sparkplug',
                'type': 'Sentient Trinket',
                'description': 'A giggling magical coin that causes a Wild Magic Surge every time you roll a natural 1—or natural 20.',
                'grants': 'Once per session, you may swap two random players\' locations (including NPCs) on the battlefield.'
            },
            'character_drive': 'She believes the Fracture is "the final ride" of the Gilded Mirage—one last performance that could free her or end the world in glitter.',
            'special_abilities': {
                'spectacle_surge': {
                    'name': 'Spectacle Surge',
                    'description': 'Nat 1 or 20 triggers massive show-stopping surge (custom effects)'
                },
                'joke_of_gods': {
                    'name': 'Joke of the Gods',
                    'type': '1/day',
                    'description': 'Tasha\'s Otherworldly Guise + AoE dancing WIS save (DC 18)'
                },
                'chorus_of_undoing': {
                    'name': 'Chorus of Undoing',
                    'type': '3 rounds',
                    'description': 'Hostile casters get disadvantage, laughter effects cause psychic AoE, Nixie resists psychic, doesn\'t die when hitting 0 HP — instead explodes into illusions and reforms after 1 minute'
                },
                'fracture_madness': {
                    'name': 'Fracture Madness',
                    'description': 'Hears laughter when magic is too quiet'
                },
                'sparkplug_ascended': {
                    'name': 'Sparkplug (Ascended)',
                    'description': 'May override her decision or cast Suggestion at will'
                }
            },
            'weapons': {
                'spotlight_staff': {
                    'name': 'Spotlight Staff',
                    'type': 'Shape-shifting Weapon',
                    'description': 'Reshapes daily; channels Wild Surge once/day on demand',
                    'grants': 'Can be a cane, parasol, baton, or whip. Can channel Wild Magic Surge manually (no roll needed) once per long rest.'
                },
                'memory_echo_token': {
                    'name': 'Memory Echo Token',
                    'type': 'Consumable Item',
                    'description': '1 in possession',
                    'grants': 'Can auto-pass a roll ≤DC 15 or reroll a failed save'
                },
                'whimsy_wreck_circus': {
                    'name': 'Whimsy Wreck Circus',
                    'type': 'Mobile Stronghold',
                    'description': 'Mobile stronghold/carnival base',
                    'grants': 'Portable carnival base with various facilities'
                }
            },
            'stats': {
                'strength': 8,
                'dexterity': 14,
                'constitution': 12,
                'intelligence': 16,
                'wisdom': 10,
                'charisma': 18,
                'hp': 24,
                'ac': 12,
                'speed': 25,
                'initiative': 2
            }
        },
        'kaelen': {
            'name': '🐍 Kaelen Vire',
            'race': 'Half-Elf',
            'class': 'Warlock (The Fiend / Great Old One Hybrid Patron)',
            'background': 'Exiled Diplomatic Spy',
            'role': 'Secrets broker, dark caster, conflicted destiny bearer',
            'backstory': 'Kaelen once helped forge pacts between sky-lords and demonic patrons. Now, he\'s hunted by the Infernal Vein and whispered to by a sentient mirror—a possible future self known only as The Sovereign of Echoes.',
            'signature_item': {
                'name': 'Sealshard Mirror',
                'type': 'Pact Focus',
                'description': 'A handheld obsidian mirror that contains old contract fragments.',
                'grants': 'Once per day, you may force a creature to speak truth or reveal a hidden memory. If used twice, the mirror cracks and reveals a potential future instead.'
            },
            'patron_mechanic': 'Once per session, Kaelen can request a boon from his patron, but must accept a consequence by the session\'s end (corruption, nightmare, weakened ally, etc.)',
            'special_abilities': {
                'soul_mirror_debt': {
                    'name': 'Soul Mirror\'s Debt',
                    'type': '1/day',
                    'description': 'Force WIS save or stun + psychic vulnerability (DC 18)'
                },
                'unbound_pact': {
                    'name': 'Unbound Pact',
                    'type': '1/session',
                    'description': 'Boon from patron with hidden cost'
                },
                'flicker_form': {
                    'name': 'Flicker Form',
                    'description': 'Bonus action to vanish, next spell does +2d8 psychic'
                },
                'sealshard_mirror_evolved': {
                    'name': 'Sealshard Mirror (Evolved)',
                    'description': 'Ask 1 yes/no question about upcoming choice (1/day). Each use risks memory fracture (DC 14 WIS save or take 1d4 psychic and forget something)'
                }
            },
            'weapons': {
                'liars_thorn': {
                    'name': 'Liar\'s Thorn',
                    'type': 'Psychic Dagger',
                    'description': 'Psychic dagger, reads surface thoughts on hit',
                    'grants': 'Deals psychic damage and reveals a target\'s surface thought on hit'
                },
                'memory_echo_token': {
                    'name': 'Memory Echo Token',
                    'type': 'Consumable Item',
                    'description': '1 use remaining',
                    'grants': 'Can auto-pass a roll ≤DC 15 or reroll a failed save'
                },
                'root_whisper_mark': {
                    'name': 'Root Whisper Mark',
                    'type': 'Hidden Mark',
                    'description': 'Eryndor knows Kaelen betrayed him',
                    'grants': 'Hidden mark that reveals betrayal to Eryndor'
                }
            },
            'stats': {
                'strength': 10,
                'dexterity': 14,
                'constitution': 12,
                'intelligence': 16,
                'wisdom': 12,
                'charisma': 18,
                'hp': 26,
                'ac': 14,
                'speed': 30,
                'initiative': 2
            }
        }
    }

# Save characters to file
def save_characters(characters):
    with open(CHARACTERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(characters, f, indent=2, ensure_ascii=False)

# Initialize characters
CHARACTERS = load_characters()

# Character template for new characters
CHARACTER_TEMPLATE = {
    'name': '',
    'race': '',
    'class': '',
    'background': '',
    'role': '',
    'image_url': '',
    'backstory': '',
    'signature_item': {
        'name': '',
        'type': '',
        'description': '',
        'grants': ''
    },
    'character_bond': '',
    'character_conflict': '',
    'character_drive': '',
    'patron_mechanic': '',
    'special_abilities': {},
    'weapons': {},
    'stats': {
        'strength': 10,
        'dexterity': 10,
        'constitution': 10,
        'intelligence': 10,
        'wisdom': 10,
        'charisma': 10,
        'hp': 10,
        'ac': 10,
        'speed': 30,
        'initiative': 0
    }
}

@app.route('/')
def index():
    return render_template('dice.html', dice_types=DICE_TYPES)

@app.route('/characters')
def characters():
    return render_template('characters.html', characters=CHARACTERS)

@app.route('/create-character')
def create_character_page():
    return render_template('create_character.html')

@app.route('/dice')
def dice_page():
    return render_template('dice.html', dice_types=DICE_TYPES)

# Turn Taker Wheel Page
@app.route('/turn-taker')
def turn_taker_page():
    """Display the turn taker wheel with current characters."""
    return render_template('turn_taker.html', characters=CHARACTERS)

@app.route('/roll', methods=['POST'])
def roll_dice():
    data = request.get_json()
    dice_type = data.get('dice_type')
    quantity = data.get('quantity', 1)
    
    if dice_type not in DICE_TYPES:
        return jsonify({'error': 'Invalid dice type'}), 400
    
    sides = DICE_TYPES[dice_type]['sides']
    rolls = []
    total = 0
    
    for _ in range(quantity):
        roll = random.randint(1, sides)
        rolls.append(roll)
        total += roll
    
    return jsonify({
        'dice_type': dice_type,
        'quantity': quantity,
        'sides': sides,
        'rolls': rolls,
        'total': total,
        'dice_name': DICE_TYPES[dice_type]['name']
    })

@app.route('/api/dice')
def get_dice_types():
    return jsonify(DICE_TYPES)

@app.route('/api/characters')
def get_characters():
    return jsonify(CHARACTERS)

@app.route('/api/characters/<character_id>')
def get_character(character_id):
    if character_id in CHARACTERS:
        return jsonify(CHARACTERS[character_id])
    return jsonify({'error': 'Character not found'}), 404

@app.route('/api/characters/<character_id>/stats', methods=['PUT'])
def update_character_stats(character_id):
    if character_id not in CHARACTERS:
        return jsonify({'error': 'Character not found'}), 404
    
    data = request.get_json()
    CHARACTERS[character_id]['stats'].update(data)
    save_characters(CHARACTERS)
    return jsonify(CHARACTERS[character_id]['stats'])

@app.route('/api/characters', methods=['POST'])
def create_character():
    data = request.get_json()
    
    # Generate a unique ID based on character name
    base_id = ''.join(c.lower() for c in data.get('name', '') if c.isalnum())
    if not base_id:
        base_id = 'character'
    
    # Ensure unique ID
    char_id = base_id
    counter = 1
    while char_id in CHARACTERS:
        char_id = f"{base_id}_{counter}"
        counter += 1
    
    # Create new character with template structure
    new_character = CHARACTER_TEMPLATE.copy()
    new_character.update(data)
    
    # Ensure all required fields exist
    if 'signature_item' not in new_character:
        new_character['signature_item'] = CHARACTER_TEMPLATE['signature_item'].copy()
    if 'stats' not in new_character:
        new_character['stats'] = CHARACTER_TEMPLATE['stats'].copy()
    if 'special_abilities' not in new_character:
        new_character['special_abilities'] = {}
    if 'weapons' not in new_character:
        new_character['weapons'] = {}
    
    # Convert arrays to proper format if they exist
    if 'special_abilities' in data and isinstance(data['special_abilities'], list):
        abilities_dict = {}
        for i, ability in enumerate(data['special_abilities']):
            if ability and isinstance(ability, dict) and ability.get('name'):
                abilities_dict[f'ability_{i}'] = ability
        new_character['special_abilities'] = abilities_dict
    
    if 'weapons' in data and isinstance(data['weapons'], list):
        weapons_dict = {}
        for i, weapon in enumerate(data['weapons']):
            if weapon and isinstance(weapon, dict) and weapon.get('name'):
                weapons_dict[f'weapon_{i}'] = weapon
        new_character['weapons'] = weapons_dict
    
    CHARACTERS[char_id] = new_character
    save_characters(CHARACTERS)
    
    return jsonify({
        'id': char_id,
        'character': new_character,
        'message': 'Character created successfully'
    }), 201

@app.route('/api/characters/<character_id>', methods=['PUT'])
def update_character(character_id):
    if character_id not in CHARACTERS:
        return jsonify({'error': 'Character not found'}), 404
    
    data = request.get_json()
    CHARACTERS[character_id].update(data)
    save_characters(CHARACTERS)
    
    return jsonify({
        'character': CHARACTERS[character_id],
        'message': 'Character updated successfully'
    })

@app.route('/api/characters/<character_id>', methods=['DELETE'])
def delete_character(character_id):
    if character_id not in CHARACTERS:
        return jsonify({'error': 'Character not found'}), 404
    
    deleted_character = CHARACTERS.pop(character_id)
    save_characters(CHARACTERS)
    
    return jsonify({
        'message': 'Character deleted successfully',
        'deleted_character': deleted_character
    })

@app.route('/api/characters/<character_id>/abilities/<ability_id>', methods=['DELETE'])
def delete_character_ability(character_id, ability_id):
    if character_id not in CHARACTERS:
        return jsonify({'error': 'Character not found'}), 404
    
    if 'special_abilities' not in CHARACTERS[character_id]:
        return jsonify({'error': 'No abilities found'}), 404
    
    if ability_id not in CHARACTERS[character_id]['special_abilities']:
        return jsonify({'error': 'Ability not found'}), 404
    
    deleted_ability = CHARACTERS[character_id]['special_abilities'].pop(ability_id)
    save_characters(CHARACTERS)
    
    return jsonify({
        'message': 'Ability removed successfully',
        'deleted_ability': deleted_ability
    })

@app.route('/api/characters/<character_id>/weapons/<weapon_id>', methods=['DELETE'])
def delete_character_weapon(character_id, weapon_id):
    if character_id not in CHARACTERS:
        return jsonify({'error': 'Character not found'}), 404
    
    if 'weapons' not in CHARACTERS[character_id]:
        return jsonify({'error': 'No weapons found'}), 404
    
    if weapon_id not in CHARACTERS[character_id]['weapons']:
        return jsonify({'error': 'Weapon not found'}), 404
    
    deleted_weapon = CHARACTERS[character_id]['weapons'].pop(weapon_id)
    save_characters(CHARACTERS)
    
    return jsonify({
        'message': 'Weapon removed successfully',
        'deleted_weapon': deleted_weapon
    })

@app.route('/api/characters/template')
def get_character_template():
    return jsonify(CHARACTER_TEMPLATE)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 