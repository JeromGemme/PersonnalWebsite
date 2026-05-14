document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let count = 0;
    let autoInterval = null;
    let timerAnimation = null;
    let lastTickTime = 0;
    let isRunning = false;
    let isPaused = false;

    // --- DOM Elements ---
    const countDisplay = document.getElementById('actual-count');
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const startText = document.getElementById('start-text');
    const loopTimerDisplay = document.getElementById('loop-timer');
    const autoAmountInput = document.getElementById('auto-amount');
    const autoTimeInput = document.getElementById('auto-time');

    // Calculator Elements
    const cSec = document.getElementById('calc-sec');
    const cInch = document.getElementById('calc-inch');
    const cSLen = document.getElementById('calc-sheet-len');
    const cQty = document.getElementById('calc-qty');
    const resSheet = document.getElementById('res-per-sheet');
    const resTotal = document.getElementById('res-total');

    // --- Core Updates ---
    function updateDisplay(newCount) {
        count = newCount;
        countDisplay.textContent = Number.isInteger(count) ? count : parseFloat(count.toFixed(4));
    }

    // --- Live Timer Engine ---
    function updateTimerUI() {
        if (!isRunning || isPaused) return;
        const now = Date.now();
        const elapsed = (now - lastTickTime) / 1000;
        loopTimerDisplay.textContent = elapsed.toFixed(3) + 's';
        timerAnimation = requestAnimationFrame(updateTimerUI);
    }

    function triggerTick() {
        const amount = parseFloat(autoAmountInput.value) || 0;
        updateDisplay(count + amount);
        lastTickTime = Date.now(); // Reset timer visually for the new loop
    }

    function startLoop() {
        const timeInSeconds = parseFloat(autoTimeInput.value);
        if (isNaN(timeInSeconds) || timeInSeconds <= 0) return;
        
        lastTickTime = Date.now();
        autoInterval = setInterval(triggerTick, timeInSeconds * 1000);
        updateTimerUI(); // Start the visual millisecond timer
    }

    // --- Loop Buttons ---
    btnStart.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(autoInterval);
            cancelAnimationFrame(timerAnimation);
            isRunning = false;
            isPaused = false;
            btnStart.classList.remove('running');
            startText.textContent = 'Start the Auto-Loop';
            btnPause.disabled = true;
            autoTimeInput.disabled = false;
        } else {
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
            // Unpause: Restart the loop completely from 0
            isPaused = false;
            btnPause.textContent = 'Pause the Auto-loop';
            startLoop(); 
        } else {
            // Pause: Stop exactly where we are
            isPaused = true;
            clearInterval(autoInterval);
            cancelAnimationFrame(timerAnimation);
            btnPause.textContent = 'UnPause (Restart Loop)';
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
        if (confirm('Are you sure you want to reset the count to 0?')) updateDisplay(0);
    });

    document.getElementById('btn-apply-edit').addEventListener('click', () => {
        const val = parseFloat(document.getElementById('direct-edit-input').value);
        if (!isNaN(val) && confirm(`Set exact count to ${val}?`)) updateDisplay(val);
    });

    // --- Production Calculator Engine ---
    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || !isFinite(totalSeconds)) return "00:00:00:000";
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        const ms = Math.floor((totalSeconds % 1) * 1000);
        
        // Format: hh:mm:ss:msmsms
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`;
    }

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

        // Logic: (Sec / Inch) * SheetLen = Time per sheet
        const timePerSheet = (sec / inch) * sLen;
        // Logic: Time per sheet * Qty = Total Time
        const totalTime = timePerSheet * qty;

        resSheet.textContent = timePerSheet.toFixed(2) + "s";
        resTotal.textContent = formatTime(totalTime);
    }

    // Attach event listeners to calculator inputs
    [cSec, cInch, cSLen, cQty].forEach(input => {
        input.addEventListener('input', runCalculation);
    });
});
