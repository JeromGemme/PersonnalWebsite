document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let count = 0;
    let autoInterval = null;
    let timerAnimation = null;
    let lastTickTime = 0;
    let accumulatedTimeMs = 0; // Total time of fully COMPLETED loops
    let isRunning = false;
    let isPaused = false;

    // --- DOM Elements ---
    const countDisplay = document.getElementById('actual-count');
    const maxLimitInput = document.getElementById('max-limit');
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const startText = document.getElementById('start-text');
    
    // Timers
    const loopTimerDisplay = document.getElementById('loop-timer');
    const globalChronoDisplay = document.getElementById('global-chrono');
    
    // Inputs
    const autoAmountInput = document.getElementById('auto-amount');
    const autoTimeInput = document.getElementById('auto-time');

    // Calculator Elements
    const cSec = document.getElementById('calc-sec');
    const cInch = document.getElementById('calc-inch');
    const cSLen = document.getElementById('calc-sheet-len');
    const cQty = document.getElementById('calc-qty');
    const resSheet = document.getElementById('res-per-sheet');
    const resTotal = document.getElementById('res-total');

    // --- Core Updates & Max Limit Stop Logic ---
    function updateDisplay(newCount) {
        const maxLimit = parseFloat(maxLimitInput.value);
        let hitLimit = false;

        // If a Maximum Limit is set and we hit it
        if (!isNaN(maxLimit) && newCount >= maxLimit) {
            count = maxLimit; 
            hitLimit = true;
        } else {
            count = newCount;
        }

        countDisplay.textContent = Number.isInteger(count) ? count : parseFloat(count.toFixed(4));

        // Auto Stop EVERYTHING if limit is reached
        if (hitLimit && isRunning) {
            clearInterval(autoInterval);
            cancelAnimationFrame(timerAnimation);
            isRunning = false;
            isPaused = false;
            
            btnStart.classList.remove('running');
            startText.textContent = 'Start the Auto-Loop';
            btnPause.disabled = true;
            autoTimeInput.disabled = false;
            
            // Lock the global chrono to the final exact completed time
            globalChronoDisplay.textContent = formatTimeMs(accumulatedTimeMs);
            loopTimerDisplay.textContent = "0.000s";
            
            setTimeout(() => alert(`Target Reached! Total Loop Time: ${formatTimeMs(accumulatedTimeMs)}`), 100);
        }
    }

    // --- Formatting Tools ---
    function formatTimeMs(totalMs) {
        if (isNaN(totalMs) || !isFinite(totalMs)) return "00:00:00:000";
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        const ms = Math.floor(totalMs % 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`;
    }

    // --- Live Timer Engine ---
    function updateTimerUI() {
        if (!isRunning || isPaused) return;
        const now = Date.now();
        const elapsedSinceTick = now - lastTickTime;
        
        // Update small button timer
        loopTimerDisplay.textContent = (elapsedSinceTick / 1000).toFixed(3) + 's';
        
        // Update global chrono (Accumulated completed loops + Current ongoing loop)
        const currentTotalMs = accumulatedTimeMs + elapsedSinceTick;
        globalChronoDisplay.textContent = formatTimeMs(currentTotalMs);
        
        timerAnimation = requestAnimationFrame(updateTimerUI);
    }

    function triggerTick() {
        const amount = parseFloat(autoAmountInput.value) || 0;
        const timeInSeconds = parseFloat(autoTimeInput.value) || 0;
        
        // Add exact config time to accumulation to avoid millisecond drift
        accumulatedTimeMs += (timeInSeconds * 1000);
        lastTickTime = Date.now(); 
        
        updateDisplay(count + amount);
    }

    function startLoop() {
        const timeInSeconds = parseFloat(autoTimeInput.value);
        if (isNaN(timeInSeconds) || timeInSeconds <= 0) return;
        
        lastTickTime = Date.now();
        autoInterval = setInterval(triggerTick, timeInSeconds * 1000);
        updateTimerUI();
    }

    // --- Loop Buttons ---
    btnStart.addEventListener('click', () => {
        if (isRunning) {
            // STOP Manually
            clearInterval(autoInterval);
            cancelAnimationFrame(timerAnimation);
            isRunning = false;
            isPaused = false;
            btnStart.classList.remove('running');
            startText.textContent = 'Start the Auto-Loop';
            btnPause.disabled = true;
            autoTimeInput.disabled = false;
            
            // Discard the unfinished loop time and lock the display
            globalChronoDisplay.textContent = formatTimeMs(accumulatedTimeMs);
            loopTimerDisplay.textContent = "0.000s";
        } else {
            // START (Fresh)
            accumulatedTimeMs = 0; 
            globalChronoDisplay.textContent = formatTimeMs(0);
            
            isRunning = true;
            isPaused = false;
            btnStart.classList.add('running');
            startText.textContent = 'Stop the Auto-Loop';
            btnPause.disabled = false;
            btnPause.textContent = 'Pause the Auto-loop';
            autoTimeInput.disabled = true;
            startLoop();
        }
    });

    btnPause.addEventListener('click', () => {
        if (!isRunning) return;
        
        if (isPaused) {
            // UNPAUSE: Restart the loop completely
            isPaused = false;
            btnPause.textContent = 'Pause the Auto-loop';
            startLoop(); 
        } else {
            // PAUSE: Stop exactly where we are
            isPaused = true;
            clearInterval(autoInterval);
            cancelAnimationFrame(timerAnimation);
            btnPause.textContent = 'UnPause (Restart Loop)';
            
            // CRITICAL: Force global chrono to revert to accumulated time (discarding unfinished loop)
            globalChronoDisplay.textContent = formatTimeMs(accumulatedTimeMs);
        }
    });

    // --- Manual & Direct Actions ---
    document.getElementById('btn-minus').addEventListener('click', () => {
        updateDisplay(count - (parseFloat(document.getElementById('manual-step').value) || 1));
    });
    
    document.getElementById('btn-plus').addEventListener('click', () => {
        updateDisplay(count + (parseFloat(document.getElementById('manual-step').value) || 1));
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the count to 0?')) {
            updateDisplay(0);
            accumulatedTimeMs = 0;
            if (!isRunning) globalChronoDisplay.textContent = formatTimeMs(0);
        }
    });

    document.getElementById('btn-apply-edit').addEventListener('click', () => {
        const val = parseFloat(document.getElementById('direct-edit-input').value);
        if (!isNaN(val) && confirm(`Set exact count to ${val}?`)) updateDisplay(val);
    });

    // --- Production Calculator Engine ---
    function runCalculation() {
        const sec = parseFloat(cSec.value) || 0;
        const inch = parseFloat(cInch.value) || 0;
        const sLen = parseFloat(cSLen.value) || 0;
        const qty = parseFloat(cQty.value) || 0;

        if (inch <= 0) {
            resSheet.textContent = "0.00s";
            resTotal.textContent = "00:00:00:000";
            return;
        }

        const timePerSheet = (sec / inch) * sLen;
        const totalTime = timePerSheet * qty;

        resSheet.textContent = timePerSheet.toFixed(2) + "s";
        resTotal.textContent = formatTimeMs(totalTime * 1000); // Reusing the global format tool!
    }

    // Attach event listeners to calculator inputs
    [cSec, cInch, cSLen, cQty].forEach(input => {
        input.addEventListener('input', runCalculation);
    });
});
