// Turn Taker Wheel – Fantasy Neon Theme
// Uses global INIT_CHARACTERS injected by the template

let participants = [];          // Array of remaining participant IDs
let participantNames = [];      // Same order names (for drawing)
let isSpinning = false;
let selectedIndex = null; // index chosen for current spin

// Helper – shuffle arrays in sync
function shuffleParticipants(ids, names) {
    for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
        [names[i], names[j]] = [names[j], names[i]];
    }
}
let currentRotation = 0;        // Track cumulative rotation on canvas

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const winnerEl = document.getElementById('winnerDisplay');
const buildWheelBtn = document.getElementById('buildWheelBtn');
const resetWheelBtn = document.getElementById('resetWheelBtn');
const orderList = document.getElementById('turnOrderList');

const TWO_PI = Math.PI * 2;

// Palette matching app neon theme
const SLICE_COLORS = ['#ff6b9d', '#48dbfb', '#feca57', '#c44569', '#ff9ff3', '#0abde3'];

// Utility – convert HSL to string quickly
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

// Build wheel from selected checkboxes
function buildWheel() {
    const checked = document.querySelectorAll('.char-checkbox input:checked');
    if (!checked.length) {
        alert('Select at least one character.');
        return;
    }

    participants = Array.from(checked).map(c => c.value);
    participantNames = participants.map(id => INIT_CHARACTERS[id].name);

    // Randomize order every build to enhance unpredictability
    shuffleParticipants(participants, participantNames);

    orderList.innerHTML = '';
    spinBtn.classList.remove('disabled');
    spinBtn.disabled = false;

    currentRotation = 0;
    drawWheel();
}

// Draw wheel on canvas
function drawWheel() {
    const size = canvas.width; // square canvas
    ctx.clearRect(0, 0, size, size);

    const sliceAngle = TWO_PI / participantNames.length;

    participantNames.forEach((name, index) => {
        // Use predefined neon palette
        const color = SLICE_COLORS[index % SLICE_COLORS.length];
        ctx.beginPath();
        ctx.moveTo(size / 2, size / 2);
        ctx.arc(size / 2, size / 2, size / 2 - 5, index * sliceAngle, (index + 1) * sliceAngle);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#00000055';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate(index * sliceAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.fillText(name, size / 2 - 20, 6);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 40, 0, TWO_PI);
    ctx.fillStyle = '#0f0f23';
    ctx.fill();
    ctx.fillStyle = '#48dbfb';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', size / 2, size / 2 + 6);

    // Pointer
    ctx.beginPath();
    ctx.moveTo(size / 2, 10);
    ctx.lineTo(size / 2 - 12, 40);
    ctx.lineTo(size / 2 + 12, 40);
    ctx.closePath();
    ctx.fillStyle = '#ff6b9d';
    ctx.fill();
}

// Animate spin – winner is chosen BEFORE the wheel rotates, making the spin purely cosmetic
function spinWheel() {
    if (winnerEl) winnerEl.classList.remove('show');
    if (isSpinning || participantNames.length === 0) return;

    // Pick random winner index first
    selectedIndex = Math.floor(Math.random() * participantNames.length);

    isSpinning = true;
    const spins = Math.floor(Math.random() * 3) + 5; // 5–7 full spins
    const slice = 360 / participantNames.length;
    // Aim so pointer lands roughly at centre of selected slice
    const sliceCenter = selectedIndex * slice + slice / 2;
    // Add small random jitter inside slice for visual variety (±25% of slice)
    const jitter = (Math.random() - 0.5) * slice * 0.5;
    const pointerAngleTarget = (sliceCenter + jitter + 360) % 360;
    const targetRotation = currentRotation + spins * 360 + (360 - pointerAngleTarget);
    const duration = 4000; // ms
    const start = performance.now();

    function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const angle = currentRotation + (targetRotation - currentRotation) * easeOut;
        setCanvasRotation(angle);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentRotation = targetRotation % 360;
            finishSpin();
        }
    }
    requestAnimationFrame(animate);
}

function setCanvasRotation(deg) {
    canvas.style.transform = `rotate(${deg}deg)`;
}

function finishSpin() {
    // Use pre-determined selectedIndex
    const index = selectedIndex;
    const selectedId = participants[index];
    const selectedName = participantNames[index];

    // Announce
    const li = document.createElement('li');
    li.textContent = selectedName;
    orderList.appendChild(li);

    // Remove selected from arrays
    participants.splice(index, 1);
    participantNames.splice(index, 1);

    if (participantNames.length === 0) {
        spinBtn.classList.add('disabled');
        spinBtn.disabled = true;
    }

    // Show winner prominently
    if (winnerEl) {
        winnerEl.textContent = selectedName;
        setTimeout(() => winnerEl.classList.add('show'), 10);
    }

    drawWheel();
    isSpinning = false;
}

function resetWheel() {
    // Check all checkboxes again
    document.querySelectorAll('.char-checkbox input').forEach(cb => cb.checked = true);
    buildWheel();
}

// Event listeners
buildWheelBtn.addEventListener('click', buildWheel);
spinBtn.addEventListener('click', spinWheel);
resetWheelBtn.addEventListener('click', resetWheel);

// Auto-build wheel on initial load
window.addEventListener('DOMContentLoaded', buildWheel);
