# DnD Companion

A Flask web app for D&D 5e tables: roll dice, create characters, and browse saved
character sheets.

## Features

- **Dice roller** — the standard polyhedral set (`DICE_TYPES`), the app's landing page
- **Character creation** — build a sheet through a form
- **Character browser** — list and view saved characters

Characters persist to a JSON store on disk (`load_characters` / `save_characters`),
so there's no database to set up.

## Run it

```bash
git clone https://github.com/Zephyr4772/DnD.git
cd DnD
pip install -r requirements.txt
python app.py        # http://127.0.0.1:5000
```

## Routes

| Route | Page |
|---|---|
| `/` | Dice roller |
| `/dice` | Dice roller |
| `/characters` | Saved characters |
| `/create-character` | Character creation form |

## Layout

```
app.py              routes, dice logic, character persistence
templates/          dice.html, characters.html, create_character.html
static/             characters.css, characters.js
dnd book.txt        reference text
```

## Limitations

- **Single-user.** No accounts — everyone shares one character store.
- **Flask dev server only.** Not configured for production serving.
- **5e subset.** Character fields cover common cases, not the full ruleset.
- No tests.

## Note

`dnd book.txt` and `New Text Document.txt` are byte-identical copies of the same
reference text; only one is needed.
