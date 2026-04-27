// ==============================
// The Shiny Hunting Guide
// Tyler Million
// ITEC 2380 Final Project
// ==============================

(function () {

  // --- Element references ---
  var mainCount       = document.getElementById('main-count');
  var btnIncrement    = document.getElementById('full-increment');
  var btnFound        = document.getElementById('full-found');
  var btnPhase        = document.getElementById('full-phase');
  var btnReset        = document.getElementById('full-reset');
  var phaseCountEl    = document.getElementById('phase-count');
  var totalPhasesEl   = document.getElementById('total-phases');
  var totalEncEl      = document.getElementById('total-encounters');
  var historyBody     = document.getElementById('history-body');
  var contextLabel    = document.getElementById('counter-context');
  var targetInput     = document.getElementById('target-pokemon');
  var gameSelect      = document.getElementById('target-game');
  var methodSelect    = document.getElementById('hunt-method');

  if (!mainCount) return;

  // --- State ---
  var count         = 0;
  var currentPhase  = 0;
  var totalPhaseNum = 0;
  var grandTotal    = 0;
  var sessionNum    = 0;
  var sessions      = [];   // array of session objects for history

  // --- Save all state to localStorage ---
  function saveState() {
    var state = {
      count:         count,
      currentPhase:  currentPhase,
      totalPhaseNum: totalPhaseNum,
      grandTotal:    grandTotal,
      sessionNum:    sessionNum,
      sessions:      sessions,
      target:        targetInput.value,
      game:          gameSelect.value,
      method:        methodSelect.value
    };
    localStorage.setItem('shinyCounterState', JSON.stringify(state));
  }

  // --- Load state from localStorage and restore UI ---
  function loadState() {
    var raw = localStorage.getItem('shinyCounterState');
    if (!raw) return;

    try {
      var state = JSON.parse(raw);
      count         = state.count         || 0;
      currentPhase  = state.currentPhase  || 0;
      totalPhaseNum = state.totalPhaseNum || 0;
      grandTotal    = state.grandTotal    || 0;
      sessionNum    = state.sessionNum    || 0;
      sessions      = state.sessions      || [];

      // Restore form inputs
      if (state.target) targetInput.value = state.target;
      if (state.game)   gameSelect.value   = state.game;
      if (state.method) methodSelect.value = state.method;

      // Restore display numbers
      mainCount.textContent     = count.toLocaleString();
      phaseCountEl.textContent  = currentPhase.toLocaleString();
      totalPhasesEl.textContent = totalPhaseNum.toLocaleString();
      totalEncEl.textContent    = grandTotal.toLocaleString();

      // Rebuild history table
      if (sessions.length > 0) {
        historyBody.innerHTML = '';
        sessions.forEach(function (s) {
          appendHistoryRow(s.num, s.target, s.game, s.method, s.encounters, s.result);
        });
      }

      updateContext();
    } catch (e) {
      // Corrupted state — start fresh
      localStorage.removeItem('shinyCounterState');
    }
  }

  // --- Update context label from form inputs ---
  function updateContext() {
    var target = targetInput.value.trim();
    var game   = gameSelect.value;
    var method = methodSelect.value;
    if (target) {
      contextLabel.textContent = 'Hunting ' + target +
        (game   ? ' in ' + game   : '') +
        (method ? ' via ' + method : '');
    } else {
      contextLabel.textContent = 'Set your target above to get started';
    }
  }

  targetInput.addEventListener('input',  function () { updateContext(); saveState(); });
  gameSelect.addEventListener('change',  function () { updateContext(); saveState(); });
  methodSelect.addEventListener('change',function () { updateContext(); saveState(); });

  // --- Increment ---
  btnIncrement.addEventListener('click', function () {
    count        += 1;
    currentPhase += 1;
    grandTotal   += 1;
    mainCount.textContent     = count.toLocaleString();
    phaseCountEl.textContent  = currentPhase.toLocaleString();
    totalEncEl.textContent    = grandTotal.toLocaleString();
    mainCount.classList.add('counter-bump');
    setTimeout(function () { mainCount.classList.remove('counter-bump'); }, 150);
    saveState();
  });

  // --- Found Target ---
  btnFound.addEventListener('click', function () {
    if (count === 0) return;
    logHistory('Found Target!');
    count        = 0;
    currentPhase = 0;
    mainCount.textContent    = '0';
    phaseCountEl.textContent = '0';
    mainCount.classList.add('counter-found');
    setTimeout(function () { mainCount.classList.remove('counter-found'); }, 600);
    saveState();
  });

  // --- Log Phase ---
  btnPhase.addEventListener('click', function () {
    if (count === 0) return;
    logHistory('Phase (non-target shiny)');
    totalPhaseNum += 1;
    totalPhasesEl.textContent = totalPhaseNum.toLocaleString();
    count        = 0;
    currentPhase = 0;
    mainCount.textContent    = '0';
    phaseCountEl.textContent = '0';
    saveState();
  });

  // --- Reset ---
  btnReset.addEventListener('click', function () {
    if (count === 0) return;
    logHistory('Reset');
    count        = 0;
    currentPhase = 0;
    mainCount.textContent    = '0';
    phaseCountEl.textContent = '0';
    saveState();
  });

  // --- Append a row to the history table DOM ---
  function appendHistoryRow(num, target, game, method, encounters, result) {
    var emptyRow = document.querySelector('.history-empty');
    if (emptyRow) emptyRow.parentNode.removeChild(emptyRow);

    var row = document.createElement('tr');
    row.innerHTML =
      '<td>' + num + '</td>' +
      '<td>' + target + '</td>' +
      '<td>' + game + '</td>' +
      '<td>' + method + '</td>' +
      '<td>' + (typeof encounters === 'number' ? encounters.toLocaleString() : encounters) + '</td>' +
      '<td>' + result + '</td>';
    historyBody.appendChild(row);
  }

  // --- Log a session to history and sessions array ---
  function logHistory(result) {
    sessionNum += 1;
    var target   = targetInput.value.trim() || 'Unknown';
    var game     = gameSelect.value         || 'Not set';
    var method   = methodSelect.value       || 'Not set';

    sessions.push({
      num:       sessionNum,
      target:    target,
      game:      game,
      method:    method,
      encounters: count,
      result:    result
    });

    appendHistoryRow(sessionNum, target, game, method, count, result);
  }

  // --- Clear saved data ---
  var btnClear = document.getElementById('clear-save');
  if (btnClear) {
    btnClear.addEventListener('click', function () {
      if (!confirm('Clear all saved progress? This cannot be undone.')) return;
      localStorage.removeItem('shinyCounterState');
      count = 0; currentPhase = 0; totalPhaseNum = 0; grandTotal = 0; sessionNum = 0; sessions = [];
      mainCount.textContent     = '0';
      phaseCountEl.textContent  = '0';
      totalPhasesEl.textContent = '0';
      totalEncEl.textContent    = '0';
      targetInput.value = '';
      gameSelect.value  = '';
      methodSelect.value = '';
      historyBody.innerHTML = '<tr class="history-empty"><td colspan="6">No sessions logged yet. Start counting to track your hunts.</td></tr>';
      updateContext();
    });
  }

  // --- Load saved state on page load ---
  loadState();

}());