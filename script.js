const $ = id => document.getElementById(id);
let score = 0, time = 30, timer = null, answer = 0, level = 1, player = "";

function newQuestion() {
  const r = n => Math.floor(Math.random() * n) + 1;
  let a, b;
  if (level === 1) { a = r(10); b = r(10); answer = a + b; $("question").textContent = `${a} + ${b}`; }
  else if (level === 2) {
    a = r(20); b = r(20);
    if (Math.random() < 0.5) { answer = a + b; $("question").textContent = `${a} + ${b}`; }
    else { if (b > a) [a, b] = [b, a]; answer = a - b; $("question").textContent = `${a} − ${b}`; }
  } else { a = r(10); b = r(10); answer = a * b; $("question").textContent = `${a} × ${b}`; }
  $("answer").value = ""; $("answer").focus();
}

function startGame() {
  player = $("name").value.trim();
  if (!player) { $("startMsg").textContent = "Enter your name to start."; $("startMsg").className = "msg err"; return; }
  level = +$("level").value; score = 0; time = 30;
  $("score").textContent = 0; $("time").textContent = time;
  $("start").hidden = true; $("result").hidden = true; $("play").hidden = false;
  newQuestion();
  timer = setInterval(() => { $("time").textContent = --time; if (time <= 0) endGame(); }, 1000);
}

function submitAnswer() {
  if ($("answer").value === "") return;
  if (+$("answer").value === answer) { score++; $("score").textContent = score; }
  newQuestion();
}

function remarksFor(s) { return s >= 15 ? "Excellent" : s >= 8 ? "Good" : "Keep practicing"; }

function endGame() {
  clearInterval(timer);
  $("play").hidden = true; $("result").hidden = false;
  $("resultTitle").textContent = "Time is up";
  $("resultText").textContent = `${player}, you scored ${score} on level ${level} (${remarksFor(score)}).`;
  $("saveBtn").disabled = false; $("saveMsg").textContent = "";
}

async function onSave() {
  try {
    await saveScore({
      player_name: player, score, level,
      remarks: remarksFor(score), created_at: new Date().toISOString()
    });
    $("saveBtn").disabled = true;
    $("saveMsg").textContent = "Score saved to the database."; $("saveMsg").className = "msg ok";
    await showScores();
  } catch (e) {
    $("saveMsg").textContent = "Could not save: " + e.message; $("saveMsg").className = "msg err";
  }
}

async function showScores() {
  const tbody = $("rows");
  try {
    const data = (await getScores()).sort((a, b) => b.score - a.score).slice(0, 10);
    if (!data.length) { tbody.innerHTML = '<tr><td colspan="5">No scores yet. Play a round and save it.</td></tr>'; return; }
    tbody.innerHTML = "";
    for (const r of data) {
      const tr = document.createElement("tr");
      [r.player_name, r.score, r.level, r.remarks, new Date(r.created_at).toLocaleString()]
        .forEach(v => { const td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
      tbody.appendChild(tr);
    }
  } catch (e) { tbody.innerHTML = `<tr><td colspan="5">Could not load scores: ${e.message}</td></tr>`; }
}

function reset() { $("result").hidden = true; $("start").hidden = false; $("startMsg").textContent = ""; }

$("startBtn").onclick = startGame;
$("submitBtn").onclick = submitAnswer;
$("answer").onkeydown = e => { if (e.key === "Enter") submitAnswer(); };
$("saveBtn").onclick = onSave;
$("againBtn").onclick = reset;
$("clearBtn").onclick = async () => { if (confirm("Delete all saved scores?")) { await clearScores(); showScores(); } };
showScores();
