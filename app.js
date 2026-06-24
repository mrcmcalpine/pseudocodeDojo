/* Pseudocode Dojo - Phase 1 MVP
   Front-end only: HTML, CSS and JavaScript. No frameworks. */

// =========================
// Configuration and levels
// =========================
const CONFIG = {
  xpThresholdsEditableHere: true,
  teacherPasswordHashSha256: "b6f50b03717b314a858b40d96ab657cf4fbc5ea062629d68f1c2578e2b10ab9a",
  recentQuestionMemory: 4,
  levels: [
    { name: "Bit", xp: 0, belt: "white", theme: "theme-bit" },
    { name: "Nibble", xp: 60, belt: "yellow", theme: "theme-nibble" },
    { name: "Byte", xp: 150, belt: "orange", theme: "theme-byte" },
    { name: "Kibibyte", xp: 300, belt: "green", theme: "theme-kibibyte" },
    { name: "Mebibyte", xp: 520, belt: "blue", theme: "theme-mebibyte" },
    { name: "Gibibyte", xp: 820, belt: "purple", theme: "theme-gibibyte" },
    { name: "Tebibyte", xp: 1200, belt: "brown", theme: "theme-tebibyte", locked: true, requiredActivities: 2 },
    { name: "Pebibyte", xp: 1700, belt: "red", theme: "theme-pebibyte", locked: true, requiredActivities: 4 },
    { name: "Exbibyte", xp: 2300, belt: "black", theme: "theme-exbibyte", locked: true, requiredActivities: 5 }
  ]
};

// =========================
// App state
// =========================
const state = {
  xp: 0,
  currentLevelIndex: 0,
  correct: 0,
  wrong: 0,
  approvedActivityCount: 0,
  questionHistory: [],
  incorrectQuestionIds: [],
  answeredCurrent: false,
  currentQuestion: null,
  revisionMode: false,
  unlockedLevelIndexes: new Set(),
  badges: new Set(["White Belt Starter"])
};

// =========================
// Question bank
// =========================
const questions = [
  { id:"Q001", topic:"Declaring variables", difficulty:"easy", minLevel:0, maxLevel:2, questionText:"Which declaration correctly creates an integer variable called Score?", type:"mcq", options:["DECLARE Score : INTEGER","DECLARE INTEGER : Score","Score DECLARE INTEGER","DECLARE Score AS INTEGER"], answer:"DECLARE Score : INTEGER", explanation:"Cambridge-style declarations use DECLARE, then the identifier, a colon, and the data type.", xp:20 },
  { id:"Q002", topic:"Identifying data types", difficulty:"easy", minLevel:0, maxLevel:2, questionText:"A student's name should normally be stored using which data type?", type:"mcq", options:["INTEGER","REAL","BOOLEAN","STRING"], answer:"STRING", explanation:"Names contain characters, so STRING is the most suitable data type.", xp:20 },
  { id:"Q003", topic:"Declaring variables", difficulty:"easy", minLevel:0, maxLevel:2, questionText:"Fill in the missing data type: <code>DECLARE IsComplete : ____</code>", type:"fill", options:[], answer:"BOOLEAN", explanation:"A value that is true or false should be stored as BOOLEAN.", xp:20 },
  { id:"Q004", topic:"Declaring variables", difficulty:"easy", minLevel:0, maxLevel:2, questionText:"Write a declaration for a variable called Name that stores text.", type:"short", options:[], answer:"DECLARE Name : STRING", explanation:"Text is stored as STRING, so the full declaration is DECLARE Name : STRING.", xp:25 },
  { id:"Q005", topic:"Interpreting declarations", difficulty:"easy", minLevel:0, maxLevel:2, questionText:"What data type is used in <code>DECLARE Temperature : REAL</code>?", type:"short", options:[], answer:"REAL", explanation:"The data type appears after the colon.", xp:20 },
  { id:"Q006", topic:"Syntax errors", difficulty:"easy", minLevel:0, maxLevel:2, questionText:"Fix this declaration: <code>DECLARE Score INTEGER</code>", type:"fix", options:[], answer:"DECLARE Score : INTEGER", explanation:"A colon is needed between the identifier and the data type.", xp:30 },
  { id:"Q007", topic:"Declaring variables", difficulty:"easy", minLevel:1, maxLevel:3, questionText:"Which declaration is best for storing a whole number count of lives left in a game?", type:"mcq", options:["DECLARE Lives : STRING","DECLARE Lives : INTEGER","DECLARE Lives : BOOLEAN","DECLARE Lives : CHAR"], answer:"DECLARE Lives : INTEGER", explanation:"A whole number count should use INTEGER.", xp:25 },
  { id:"Q008", topic:"Identifying data types", difficulty:"easy", minLevel:1, maxLevel:3, questionText:"A single keyboard character such as Y or N is usually stored as which data type?", type:"mcq", options:["CHAR","STRING","INTEGER","REAL"], answer:"CHAR", explanation:"A single character can be stored as CHAR.", xp:20 },

  { id:"Q009", topic:"1D arrays", difficulty:"medium", minLevel:2, maxLevel:5, questionText:"Write a declaration for a 1D array called Scores that stores 10 integers using indexes 1 to 10.", type:"short", options:[], answer:"DECLARE Scores : ARRAY[1:10] OF INTEGER", explanation:"A 1D array uses ARRAY[start:end] OF data type.", xp:45 },
  { id:"Q010", topic:"1D arrays", difficulty:"medium", minLevel:2, maxLevel:5, questionText:"Which declaration creates an array with 30 real numbers called Heights?", type:"mcq", options:["DECLARE Heights : ARRAY[1:30] OF REAL","DECLARE Heights : REAL[1:30]","DECLARE ARRAY Heights : REAL 1 TO 30","DECLARE Heights : ARRAY[30] INTEGER"], answer:"DECLARE Heights : ARRAY[1:30] OF REAL", explanation:"The Cambridge style is DECLARE name : ARRAY[start:end] OF type.", xp:40 },
  { id:"Q011", topic:"Interpreting declarations", difficulty:"medium", minLevel:2, maxLevel:5, questionText:"In <code>DECLARE Scores : ARRAY[1:10] OF INTEGER</code>, how many values can the array store?", type:"short", options:[], answer:["10","ten"], explanation:"The indexes run from 1 to 10 inclusive, so there are 10 values.", xp:35 },
  { id:"Q012", topic:"Syntax errors", difficulty:"medium", minLevel:2, maxLevel:5, questionText:"Fix the syntax: <code>DECLARE Names : ARRAY(1:20) OF STRING</code>", type:"fix", options:[], answer:"DECLARE Names : ARRAY[1:20] OF STRING", explanation:"Cambridge pseudocode array bounds should use square brackets.", xp:45 },
  { id:"Q013", topic:"Declaring variables", difficulty:"medium", minLevel:2, maxLevel:5, questionText:"Declare a variable called AverageMark that stores a decimal value.", type:"short", options:[], answer:"DECLARE AverageMark : REAL", explanation:"Decimal values should use REAL.", xp:35 },
  { id:"Q014", topic:"1D arrays", difficulty:"medium", minLevel:3, maxLevel:5, questionText:"Fill the blank: <code>DECLARE Animals : ARRAY[1:50] OF ____</code> for storing animal names.", type:"fill", options:[], answer:"STRING", explanation:"Animal names are text, so STRING is suitable.", xp:35 },
  { id:"Q015", topic:"2D arrays", difficulty:"medium", minLevel:3, maxLevel:5, questionText:"Which declaration creates a 2D array called Seats with 10 rows and 6 columns of BOOLEAN values?", type:"mcq", options:["DECLARE Seats : ARRAY[1:10, 1:6] OF BOOLEAN","DECLARE Seats : ARRAY[1:10] OF ARRAY[1:6] BOOLEAN","DECLARE Seats : BOOLEAN[10,6]","DECLARE ARRAY Seats : [1:10,1:6] BOOLEAN"], answer:"DECLARE Seats : ARRAY[1:10, 1:6] OF BOOLEAN", explanation:"A 2D array uses two index ranges inside the square brackets.", xp:50 },
  { id:"Q016", topic:"Interpreting declarations", difficulty:"medium", minLevel:3, maxLevel:6, questionText:"In <code>DECLARE Grid : ARRAY[1:5, 1:4] OF INTEGER</code>, how many integer values can be stored?", type:"short", options:[], answer:["20","twenty"], explanation:"There are 5 rows and 4 columns, so 5 × 4 = 20 values.", xp:50 },

  { id:"Q017", topic:"2D arrays", difficulty:"hard", minLevel:4, maxLevel:8, questionText:"Write a declaration for a 2D array named Grid that stores usernames and passwords for 200 people.", type:"short", options:[], answer:"DECLARE Grid : ARRAY[1:200, 1:2] OF STRING", explanation:"There are 200 people and 2 text fields per person, so use ARRAY[1:200, 1:2] OF STRING.", xp:80 },
  { id:"Q018", topic:"Syntax errors", difficulty:"hard", minLevel:4, maxLevel:8, questionText:"Fix all errors: <code>DECLARE Grid ARRAY[1:200,1:2] STRING</code>", type:"fix", options:[], answer:"DECLARE Grid : ARRAY[1:200, 1:2] OF STRING", explanation:"The declaration needs a colon after the identifier and OF before the data type.", xp:75 },
  { id:"Q019", topic:"2D arrays", difficulty:"hard", minLevel:4, maxLevel:8, questionText:"A game stores 12 teams, each with 5 player names. Write a suitable 2D array declaration called TeamPlayers.", type:"short", options:[], answer:"DECLARE TeamPlayers : ARRAY[1:12, 1:5] OF STRING", explanation:"The first dimension stores teams and the second dimension stores player names.", xp:75 },
  { id:"Q020", topic:"Interpreting declarations", difficulty:"hard", minLevel:5, maxLevel:8, questionText:"What is the data type of each element in <code>DECLARE Results : ARRAY[1:100] OF BOOLEAN</code>?", type:"short", options:[], answer:"BOOLEAN", explanation:"The type of each element appears after OF.", xp:45 },
  { id:"Q021", topic:"Syntax errors", difficulty:"hard", minLevel:5, maxLevel:8, questionText:"Which option correctly fixes <code>DECLARE Prices : ARRAY[1-20] OF REAL</code>?", type:"mcq", options:["DECLARE Prices : ARRAY[1:20] OF REAL","DECLARE Prices : ARRAY[1,20] OF REAL","DECLARE Prices ARRAY[1:20] REAL","DECLARE Prices : REAL ARRAY[1:20]"], answer:"DECLARE Prices : ARRAY[1:20] OF REAL", explanation:"A colon separates the lower and upper array bounds.", xp:60 },
  { id:"Q022", topic:"Declaring variables", difficulty:"hard", minLevel:5, maxLevel:8, questionText:"Declare a Boolean variable called HasSubmitted.", type:"short", options:[], answer:"DECLARE HasSubmitted : BOOLEAN", explanation:"A true/false value should be declared using BOOLEAN.", xp:45 },
  { id:"Q023", topic:"2D arrays", difficulty:"hard", minLevel:5, maxLevel:8, questionText:"Declare a 2D array called Marks for 25 students and 3 test scores per student. Each score is an integer.", type:"short", options:[], answer:"DECLARE Marks : ARRAY[1:25, 1:3] OF INTEGER", explanation:"Use two dimensions: students and tests. Each stored value is an INTEGER.", xp:75 },
  { id:"Q024", topic:"Syntax errors", difficulty:"hard", minLevel:6, maxLevel:8, questionText:"Fix this declaration: <code>DECLARE Passwords : ARRAY[1:200] STRING</code>", type:"fix", options:[], answer:"DECLARE Passwords : ARRAY[1:200] OF STRING", explanation:"An array declaration needs OF before the element data type.", xp:65 },
  { id:"Q025", topic:"1D arrays", difficulty:"medium", minLevel:3, maxLevel:6, questionText:"Declare a 1D array called Flags that stores 8 BOOLEAN values.", type:"short", options:[], answer:"DECLARE Flags : ARRAY[1:8] OF BOOLEAN", explanation:"Eight true/false values can be stored in ARRAY[1:8] OF BOOLEAN.", xp:45 },
  { id:"Q026", topic:"Interpreting declarations", difficulty:"hard", minLevel:5, maxLevel:8, questionText:"In <code>DECLARE Codes : ARRAY[1:6, 1:4] OF CHAR</code>, what do the two index ranges represent?", type:"mcq", options:["A 2D array with 6 by 4 positions","A 1D array with 10 positions","A STRING with 24 characters","A BOOLEAN table"], answer:"A 2D array with 6 by 4 positions", explanation:"Two ranges inside the brackets indicate a 2D array.", xp:55 },
  { id:"Q027", topic:"Syntax errors", difficulty:"medium", minLevel:2, maxLevel:5, questionText:"Fix this declaration: <code>DECLARE ClassName = STRING</code>", type:"fix", options:[], answer:"DECLARE ClassName : STRING", explanation:"Use a colon, not an equals sign, when declaring a data type.", xp:35 }
];

// =========================
// DOM references
// =========================
const els = {
  currentLevel: document.getElementById("currentLevel"), beltLabel: document.getElementById("beltLabel"), beltSwatch: document.getElementById("beltSwatch"), xpDisplay: document.getElementById("xpDisplay"),
  nextLevelText: document.getElementById("nextLevelText"), progressFill: document.getElementById("progressFill"), levelMessage: document.getElementById("levelMessage"),
  modeLabel: document.getElementById("modeLabel"), difficultyPill: document.getElementById("difficultyPill"), questionTopic: document.getElementById("questionTopic"), questionText: document.getElementById("questionText"), answerArea: document.getElementById("answerArea"),
  answerForm: document.getElementById("answerForm"), submitBtn: document.getElementById("submitBtn"), nextBtn: document.getElementById("nextBtn"), revisionBtn: document.getElementById("revisionBtn"), feedback: document.getElementById("feedback"),
  correctCount: document.getElementById("correctCount"), wrongCount: document.getElementById("wrongCount"), masteryPercent: document.getElementById("masteryPercent"), activityCountDisplay: document.getElementById("activityCountDisplay"), badgeList: document.getElementById("badgeList"),
  teacherToggleBtn: document.getElementById("teacherToggleBtn"), teacherPanel: document.getElementById("teacherPanel"), teacherPassword: document.getElementById("teacherPassword"), approvedActivities: document.getElementById("approvedActivities"), unlockBtn: document.getElementById("unlockBtn"), unlockFeedback: document.getElementById("unlockFeedback"), lockStatusList: document.getElementById("lockStatusList")
};

// =========================
// Question selection
// =========================
function selectQuestion() {
  if (state.revisionMode) {
    const revisionQuestions = state.incorrectQuestionIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
    if (revisionQuestions.length === 0) {
      state.revisionMode = false;
      showFeedback("info", "Revision complete! No incorrect questions are waiting. Brilliant dojo discipline.");
      awardBadge("Revision Reset");
      return selectQuestion();
    }
    return revisionQuestions[Math.floor(Math.random() * revisionQuestions.length)];
  }
  const levelIndex = state.currentLevelIndex;
  let pool = questions.filter(q => levelIndex >= q.minLevel && levelIndex <= q.maxLevel);
  const recentIds = state.questionHistory.slice(-CONFIG.recentQuestionMemory).map(h => h.id);
  const nonRecent = pool.filter(q => !recentIds.includes(q.id));
  if (nonRecent.length) pool = nonRecent;
  return pool[Math.floor(Math.random() * pool.length)] || questions[0];
}

function renderQuestion() {
  state.answeredCurrent = false;
  state.currentQuestion = selectQuestion();
  const q = state.currentQuestion;
  els.modeLabel.textContent = state.revisionMode ? "Revision training" : "Standard training";
  els.difficultyPill.textContent = `${q.difficulty.toUpperCase()} • ${q.xp} XP`;
  els.questionTopic.textContent = q.topic;
  els.questionText.innerHTML = q.questionText;
  els.answerArea.innerHTML = "";
  els.feedback.className = "feedback";
  els.feedback.innerHTML = "";
  els.submitBtn.disabled = false;

  if (q.type === "mcq") {
    q.options.forEach((option, index) => {
      const id = `option-${index}`;
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="answer" id="${id}" value="${escapeHtml(option)}" ${index === 0 ? "checked" : ""}> <span>${escapeHtml(option)}</span>`;
      els.answerArea.appendChild(label);
    });
  } else {
    const input = document.createElement(q.type === "fix" ? "textarea" : "input");
    input.id = "typedAnswer";
    input.name = "typedAnswer";
    if (input.tagName === "INPUT") input.type = "text";
    input.placeholder = q.type === "fill" ? "Type the missing word" : "Type your answer using 0478 pseudocode";
    els.answerArea.appendChild(input);
    input.focus();
  }
}

// =========================
// Answer checking and normalization
// =========================
function normalizeAnswer(value) {
  return String(value).trim().toUpperCase().replace(/;/g, "").replace(/\s+/g, "").replace(/，/g, ",").replace(/：/g, ":");
}

function getStudentAnswer() {
  if (state.currentQuestion.type === "mcq") {
    return document.querySelector("input[name='answer']:checked")?.value || "";
  }
  return document.getElementById("typedAnswer")?.value || "";
}

function isCorrect(studentAnswer, expectedAnswer) {
  const acceptable = Array.isArray(expectedAnswer) ? expectedAnswer : [expectedAnswer];
  return acceptable.some(ans => normalizeAnswer(studentAnswer) === normalizeAnswer(ans));
}

function submitAnswer(event) {
  event.preventDefault();
  if (state.answeredCurrent) return;
  const q = state.currentQuestion;
  const studentAnswer = getStudentAnswer();
  const correct = isCorrect(studentAnswer, q.answer);
  state.answeredCurrent = true;
  state.submitBtnDisabled = true;
  els.submitBtn.disabled = true;

  state.questionHistory.push({ id: q.id, correct, topic: q.topic, difficulty: q.difficulty, xp: correct ? q.xp : 0 });

  if (correct) {
    state.correct += 1;
    const beforeLevel = state.currentLevelIndex;
    state.xp += q.xp;
    removeFromRevision(q.id);
    updateLevelProgression(beforeLevel);
    showFeedback("correct", `Correct! +${q.xp} XP<br><strong>Answer:</strong> <code>${formatAnswer(q.answer)}</code><br>${q.explanation}`);
  } else {
    state.wrong += 1;
    addToRevision(q.id);
    showFeedback("wrong", `Not quite yet. Add this to your revision list and try again later.<br><strong>Correct answer:</strong> <code>${formatAnswer(q.answer)}</code><br>${q.explanation}`);
  }
  updateStats();
}

// =========================
// XP, levels and theme updates
// =========================
function updateLevelProgression(previousLevelIndex = state.currentLevelIndex) {
  const targetByXp = getLevelIndexForXp(state.xp);
  state.currentLevelIndex = applyLockedLevelCap(targetByXp);
  if (state.currentLevelIndex > previousLevelIndex) {
    const level = CONFIG.levels[state.currentLevelIndex];
    showLevelMessage(`Level up! You reached ${level.name} ${capitalise(level.belt)} Belt.`);
    awardBadge(`${level.name} Belt`);
  } else if (targetByXp > state.currentLevelIndex) {
    const locked = CONFIG.levels[state.currentLevelIndex + 1];
    showLevelMessage(`${locked.name} is locked. Earn approval activities and ask your teacher to unlock it.`);
  }
  updateLevelCard();
  updateTheme();
  updateLockStatus();
}

function getLevelIndexForXp(xp) {
  let index = 0;
  CONFIG.levels.forEach((level, i) => { if (xp >= level.xp) index = i; });
  return index;
}

function applyLockedLevelCap(targetIndex) {
  for (let i = 0; i <= targetIndex; i++) {
    const level = CONFIG.levels[i];
    if (level.locked && !state.unlockedLevelIndexes.has(i)) return i - 1;
  }
  return targetIndex;
}

function updateLevelCard() {
  const current = CONFIG.levels[state.currentLevelIndex];
  const next = CONFIG.levels[state.currentLevelIndex + 1];
  els.currentLevel.textContent = current.name;
  els.beltLabel.textContent = `${capitalise(current.belt)} belt`;
  els.xpDisplay.textContent = `${state.xp} XP`;
  document.documentElement.style.setProperty("--belt", current.belt);
  if (next) {
    const startXp = current.xp;
    const needed = next.xp - startXp;
    const gained = Math.max(0, state.xp - startXp);
    const percent = Math.min(100, Math.round((gained / needed) * 100));
    els.progressFill.style.width = `${percent}%`;
    els.nextLevelText.textContent = next.locked && !state.unlockedLevelIndexes.has(state.currentLevelIndex + 1)
      ? `Next: ${next.name} locked at ${next.xp} XP`
      : `Next: ${next.name} at ${next.xp} XP`;
  } else {
    els.progressFill.style.width = "100%";
    els.nextLevelText.textContent = "Maximum rank reached";
  }
}

function updateTheme() {
  CONFIG.levels.forEach(level => document.body.classList.remove(level.theme));
  document.body.classList.add(CONFIG.levels[state.currentLevelIndex].theme);
}

function showLevelMessage(message) { els.levelMessage.textContent = message; }

// =========================
// Revision mode
// =========================
function toggleRevisionMode() {
  if (!state.revisionMode && state.incorrectQuestionIds.length === 0) {
    showFeedback("info", "No revision questions yet. Any incorrect answers will appear here for focused retry practice.");
    return;
  }
  state.revisionMode = !state.revisionMode;
  els.revisionBtn.textContent = state.revisionMode ? "Exit revision mode" : "Revision mode";
  renderQuestion();
}

function addToRevision(id) { if (!state.incorrectQuestionIds.includes(id)) state.incorrectQuestionIds.push(id); }
function removeFromRevision(id) { state.incorrectQuestionIds = state.incorrectQuestionIds.filter(qid => qid !== id); }

// =========================
// Teacher unlock logic and hashing
// =========================
/* IMPORTANT SECURITY COMMENT TO INCLUDE IN THE CODE:
This hashed client-side password approach is only obfuscation, not real security.
A determined student could still inspect or modify the JavaScript.
This is acceptable only for a Phase 1 front-end prototype.
In a future version, this should be replaced with backend or Firebase-based validation.
*/
async function sha256(text) {
  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return demoOnlyFallbackHash(text);
}

function demoOnlyFallbackHash(text) {
  // Demonstration fallback only. Prefer Web Crypto API; replace with backend validation in Phase 2.
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash) + text.charCodeAt(i) | 0;
  return String(hash);
}

async function attemptTeacherUnlock() {
  state.approvedActivityCount = Number(els.approvedActivities.value || 0);
  const enteredHash = await sha256(els.teacherPassword.value);
  const passwordOk = enteredHash === CONFIG.teacherPasswordHashSha256;
  if (!passwordOk) {
    showUnlockFeedback("wrong", "Password check failed. No locked levels were unlocked.");
    updateStats(); updateLockStatus(passwordOk);
    return;
  }
  let unlockedNames = [];
  CONFIG.levels.forEach((level, index) => {
    if (level.locked && isLevelEligible(level)) {
      state.unlockedLevelIndexes.add(index);
      unlockedNames.push(level.name);
    }
  });
  updateLevelProgression();
  updateStats();
  updateLockStatus(passwordOk);
  showUnlockFeedback(unlockedNames.length ? "correct" : "info", unlockedNames.length ? `Unlocked: ${unlockedNames.join(", ")}.` : "Password accepted, but no locked level currently meets both XP and activity requirements.");
}

function isLevelEligible(level) {
  return state.xp >= level.xp && state.approvedActivityCount >= level.requiredActivities;
}

function updateLockStatus(passwordKnownOk = null) {
  els.lockStatusList.innerHTML = "";
  CONFIG.levels.forEach((level, index) => {
    if (!level.locked) return;
    const xpOk = state.xp >= level.xp;
    const activityOk = state.approvedActivityCount >= level.requiredActivities;
    const unlocked = state.unlockedLevelIndexes.has(index);
    const li = document.createElement("li");
    li.innerHTML = `<strong>${level.name}</strong>: ${unlocked ? "✅ Unlocked" : "🔒 Locked"} — XP ${xpOk ? "✅" : "❌"} (${state.xp}/${level.xp}), activities ${activityOk ? "✅" : "❌"} (${state.approvedActivityCount}/${level.requiredActivities})${passwordKnownOk === false ? " — password ❌" : ""}`;
    els.lockStatusList.appendChild(li);
  });
}

// =========================
// Stats, badges and helpers
// =========================
function updateStats() {
  const total = state.correct + state.wrong;
  els.correctCount.textContent = state.correct;
  els.wrongCount.textContent = state.wrong;
  els.masteryPercent.textContent = total ? `${Math.round((state.correct / total) * 100)}%` : "0%";
  els.activityCountDisplay.textContent = state.approvedActivityCount;
  if (state.correct >= 5) awardBadge("Five Correct Forms");
  if (state.correct >= 10) awardBadge("Declaration Specialist");
  if (state.incorrectQuestionIds.length === 0 && total > 0) awardBadge("Clean Revision Deck");
  renderBadges();
}

function awardBadge(name) { state.badges.add(name); renderBadges(); }
function renderBadges() { els.badgeList.innerHTML = Array.from(state.badges).map(b => `<li>${escapeHtml(b)}</li>`).join(""); }
function formatAnswer(answer) { return escapeHtml(Array.isArray(answer) ? answer[0] : answer); }
function capitalise(word) { return word.charAt(0).toUpperCase() + word.slice(1); }
function escapeHtml(value) { return String(value).replace(/[&<>"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[char])); }
function showFeedback(type, html) { els.feedback.className = `feedback show ${type}`; els.feedback.innerHTML = html; }
function showUnlockFeedback(type, html) { els.unlockFeedback.className = `feedback compact show ${type}`; els.unlockFeedback.innerHTML = html; }

// =========================
// Event listeners and startup
// =========================
els.answerForm.addEventListener("submit", submitAnswer);
els.nextBtn.addEventListener("click", renderQuestion);
els.revisionBtn.addEventListener("click", toggleRevisionMode);
els.teacherToggleBtn.addEventListener("click", () => {
  const hidden = els.teacherPanel.classList.toggle("hidden");
  els.teacherToggleBtn.setAttribute("aria-expanded", String(!hidden));
});
els.unlockBtn.addEventListener("click", attemptTeacherUnlock);
els.approvedActivities.addEventListener("input", () => { state.approvedActivityCount = Number(els.approvedActivities.value || 0); updateStats(); updateLockStatus(); });

updateLevelCard();
updateStats();
updateLockStatus();
renderQuestion();

// =========================
// Phase 2 placeholders
// =========================
// Future upgrade: localStorage progress saving so students can resume training on the same browser.
// Future upgrade: student login so progress follows a student across devices.
// Future upgrade: backend or Firebase teacher validation so passwords and approvals are not handled on the client.
// Future upgrade: secure teacher approval dashboard with proper roles, audit logs and class lists.
// Future upgrade: more Cambridge IGCSE 0478 Paper 2 topics: loops, procedures, functions, file handling and validation.
// Future upgrade: analytics by topic so teachers can identify class-wide misconceptions.
// Future upgrade: stronger teacher admin system with server-side permissions and protected unlock rules.
