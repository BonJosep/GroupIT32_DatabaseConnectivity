# Number Sprint

**Group number and members:** Group IT32 – 
Mangaron, Von Joseph L.
Mendoza, Karl Louie
Realon, Jaspher
Uy, Joshua Isaac

## Description
A browser math game. The player enters a name, picks a level, and answers as many sums as possible in 30 seconds. The score is saved to a database and the top 10 saved scores are displayed in the app.

## Tools and technologies
HTML, CSS, JavaScript, Visual Studio Code, Git and GitHub, GitHub Pages (hosting).

## Database or storage used
**IndexedDB** (browser database). Database `number_sprint_db`, store `player_scores`. No credentials are needed, so none are committed.

## How to run
1. Clone the repository.
2. Open `index.html` in a browser (or use VS Code Live Server).
3. Or visit the GitHub Pages link: _(add link after enabling Settings → Pages → main branch)_.

## Data saved and retrieved
| Field | Type | Description |
|---|---|---|
| player_id | Auto number | Unique record ID (primary key) |
| player_name | Text | Player name |
| score | Number | Correct answers |
| level | Number | Level played |
| remarks | Text | Excellent / Good / Keep practicing |
| created_at | Text (ISO date) | Date and time saved |

Save: `saveScore()` in `db.js`, triggered by the **Save score** button. Retrieve: `getScores()` in `db.js`, displayed by `showScores()` in `script.js`.

## Known limitations
- IndexedDB data lives in one browser on one device; scores are not shared between players.
- Clearing browser data deletes the scores.

## References
- MDN Web Docs: IndexedDB API
