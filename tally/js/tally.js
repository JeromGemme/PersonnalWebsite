document.addEventListener('DOMContentLoaded', () => {
    // State
    let count = 0;
    let autoInterval = null;
    let isRunning = false;
    let isPaused = false;

    // DOM Elements
    const countDisplay = document.getElementById('actual-count');
    const maxLimitInput = document.getElementById('max-limit');
    
    // Auto Elements
    const autoAmountInput = document.getElementById('auto-amount');
    const autoTimeInput = document.getElementById('auto-time');
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnRestart = document.getElementById('btn-restart');
    const startText = document.getElementById('start-text');

    // Direct Edit Elements
    const directEditInput = document.getElementById('direct-edit-input');
    const btnApplyEdit = document.getElementById('btn-apply-edit');

    // Manual Elements
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const manualStepInput = document.getElementById('manual-step');

    // Update Display Logic
    function updateDisplay(newCount) {
        const maxLimit = parseFloat(maxLimitInput.value);
        
        // Check if we hit the maximum limit
        if (!isNaN(maxLimit) && newCount >= maxLimit) {
            count = 0; // Restart count
        } else {
            count = newCount;
        }

        // Format to avoid long decimal trailing
        countDisplay.textContent = Number.isInteger(count) ? count : parseFloat(count.toFixed(4));
    }

    // Loop Engine
    function triggerTick() {
        const amount = parseFloat(autoAmountInput.value) || 0;
        updateDisplay(count + amount);
    }

    function startLoop() {
        const timeInSeconds = parseFloat(autoTimeInput.value);
        if (isNaN(timeInSeconds) || timeInSeconds <= 0) return;

        const timeInMs = timeInSeconds * 1000;
        autoInterval = setInterval(triggerTick, timeInMs);
    }

    // Button Logic: Start / Stop
    btnStart.addEventListener('click', () => {
        if (isRunning) {
            // Stop the loop
            clearInterval(autoInterval);
            isRunning = false;
            isPaused = false;
            
            btnStart.classList.remove('running');
            startText.textContent = 'Start the Auto-Loop';
            btnPause.textContent = 'Pause the Auto-loop';
            btnPause.disabled = true;
            
            // Re-enable inputs
            autoTimeInput.disabled = false;
        } else {
            // Start the loop
            isRunning = true;
            isPaused = false;
            startLoop();
            
            btnStart.classList.add('running');
            startText.textContent = 'Stop the Auto-Loop';
            btnPause.textContent = 'Pause the Auto-loop';
            btnPause.disabled = false;
            
            // Disable time input while running
            autoTimeInput.disabled = true; 
        }
    });

    // Button Logic: Pause / Unpause
    btnPause.addEventListener('click', () => {
        if (!isRunning) return;

        if (isPaused) {
            // Unpause
            isPaused = false;
            btnPause.textContent = 'Pause the Auto-loop';
            btnStart.classList.add('running');
            startText.textContent = 'Stop the Auto-Loop';
            startLoop();
        } else {
            // Pause
            isPaused = true;
            clearInterval(autoInterval);
            btnPause.textContent = 'UnPause the Auto-loop';
            btnStart.classList.remove('running');
            startText.textContent = 'Auto-Loop is Paused';
        }
    });

    // Button Logic: Restart Current Count
    btnRestart.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the count to 0?')) {
            updateDisplay(0);
        }
    });

    // Logic: Direct Edit Apply
    function applyDirectEdit() {
        const newCount = parseFloat(directEditInput.value);
        if (!isNaN(newCount)) {
            if (confirm(`Are you sure you want to set the actual tally count to ${newCount}?`)) {
                updateDisplay(newCount);
                directEditInput.value = ''; // Clear input after successful apply
            }
        }
    }

    btnApplyEdit.addEventListener('click', applyDirectEdit);
    
    // Allow pressing "Enter" on the direct edit input
    directEditInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyDirectEdit();
        }
    });

    // Button Logic: Manual - / +
    btnMinus.addEventListener('click', () => {
        const step = parseFloat(manualStepInput.value) || 1;
        updateDisplay(count - step);
    });

    btnPlus.addEventListener('click', () => {
        const step = parseFloat(manualStepInput.value) || 1;
        updateDisplay(count + step);
    });
});