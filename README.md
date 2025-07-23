# D&D Dice Roller

A comprehensive D&D dice rolling web application with support for all dice types from D2 to D1,000,000.

## Features

- **Complete Dice Set**: Roll any dice from D2 (coin flip) to D1,000,000
- **Easy Navigation**: Simply click on any dice card to roll it
- **Variable Quantities**: Choose how many dice to roll at once
- **Custom Dice Notation**: Use the quick roll feature for custom dice (e.g., 2d20+5)
- **Roll History**: Keep track of your recent rolls
- **Beautiful UI**: Modern, fantasy-themed interface with smooth animations

## Dice Types Included

- D2 (Coin flip)
- D3, D4, D6, D8, D10, D12, D20 (Standard D&D dice)
- D30, D50, D60, D100 (Extended dice)
- D120, D144, D200, D500 (Unconventional dice)
- D1000, D10000, D100000, D1000000 (Extreme dice)

## How to Use

1. **Simple Rolling**: Click on any dice card to roll that dice type
2. **Multiple Dice**: Change the quantity in the top-right corner before clicking
3. **Custom Rolls**: Use the "Quick Roll" section to enter custom dice notation like:
   - `d20` (single D20)
   - `2d6` (two D6 dice)
   - `3d10+5` (three D10 dice plus 5)

## Installation

1. Make sure you have Python 3.7+ installed
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open your browser and go to `http://localhost:5000`

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with fantasy theme
- **Fonts**: Google Fonts (Cinzel for headings, Roboto for body text)

## Features in Detail

### Dice Selection
- Click any dice card to select and roll it
- Visual feedback shows which dice is active
- Quantity selector allows rolling multiple dice

### Results Display
- Clear, easy-to-read results
- Shows individual rolls and totals
- Timestamp for each roll
- Animated entry effects

### Roll History
- Tracks your last 10 rolls
- Shows dice type, results, and time
- Automatically updates with new rolls

### Custom Dice Notation
- Supports standard D&D notation
- Examples: `d20`, `2d6`, `3d10+5`, `1d100`
- Maximum dice sides: 1,000,000
- Real-time validation and error messages

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License. 