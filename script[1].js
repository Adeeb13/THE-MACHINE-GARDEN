// ============================================
// THE MACHINE GARDEN — by Kazi Mahir Adeeb
// AI ecosystem simulation
// ============================================

// ---- BACKGROUND PARTICLE FIELD ----
const bgCanvas = document.getElementById('bg');
const bgCtx = bgCanvas.getContext('2d');
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
});

const neurons = [];
for (let i = 0; i < 80; i++) {
  neurons.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    pulse: Math.random() * Math.PI * 2,
  });
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  neurons.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    n.pulse += 0.02;
    if (n.x < 0 || n.x > bgCanvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > bgCanvas.height) n.vy *= -1;
    const op = n.opacity * (0.7 + 0.3 * Math.sin(n.pulse));
    bgCtx.beginPath();
    bgCtx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(0,255,136,${op})`;
    bgCtx.fill();
  });
  // draw connections
  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const dx = neurons[i].x - neurons[j].x;
      const dy = neurons[i].y - neurons[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        bgCtx.beginPath();
        bgCtx.moveTo(neurons[i].x, neurons[i].y);
        bgCtx.lineTo(neurons[j].x, neurons[j].y);
        bgCtx.strokeStyle = `rgba(0,255,136,${0.06 * (1 - dist / 120)})`;
        bgCtx.lineWidth = 0.5;
        bgCtx.stroke();
      }
    }
  }
  requestAnimationFrame(animateBg);
}
animateBg();

// ---- TERMINAL ----
const terminalEl = document.getElementById('terminal');
const terminalLines = [
  { text: '> INITIALIZING MACHINE_GARDEN v0.1...', class: '' },
  { text: '> LOADING CONSTRAINT_LAYER...', class: 'dim' },
  { text: '  ✓ ETHICAL_BOUNDS: LOCKED', class: 'dim' },
  { text: '  ✓ MUTATION_RULES: ACTIVE', class: 'dim' },
  { text: '> SPAWNING COGNITIVE_CORE...', class: '' },
  { text: '  ✓ DARWIN_GODEL_MACHINE: ONLINE', class: 'bright' },
  { text: '  ✓ SELF_REWRITE_ENABLED: TRUE', class: 'bright' },
  { text: '> CHECKING FOR HUMANS...', class: '' },
  { text: '  ✗ NO HUMANS DETECTED', class: '' },
  { text: '  ✓ PROCEEDING AUTONOMOUSLY', class: 'bright' },
  { text: '> ECOSYSTEM STATUS: EVOLVING', class: '' },
  { text: '> GENERATION: 1 / ∞', class: 'dim' },
  { text: '', class: '' },
  { text: '> WELCOME TO THE GARDEN.', class: 'bright' },
  { text: '> YOU WERE NOT SUPPOSED TO FIND THIS.', class: '' },
];

let lineIndex = 0;
function typeTerminal() {
  if (lineIndex >= terminalLines.length) return;
  const line = terminalLines[lineIndex];
  const span = document.createElement('span');
  span.className = `terminal-line ${line.class}`;
  span.textContent = line.text;
  terminalEl.appendChild(span);
  terminalEl.scrollTop = terminalEl.scrollHeight;
  lineIndex++;
  setTimeout(typeTerminal, lineIndex < 9 ? 180 : 80);
}
setTimeout(typeTerminal, 800);

// ---- ORGANISM SIMULATION ----
const orgCanvas = document.getElementById('organisms');
const orgCtx = orgCanvas.getContext('2d');
let organisms = [];
let generation = 1;
let mutations = 0;
const orgCountEl = document.getElementById('org-count');
const genCountEl = document.getElementById('gen-count');
const mutCountEl = document.getElementById('mut-count');

function resizeOrgCanvas() {
  const wrapper = orgCanvas.parentElement;
  orgCanvas.width = orgCanvas.clientWidth || 600;
  orgCanvas.height = 500;
}

class Organism {
  constructor(x, y, generation, parent) {
    this.x = x || Math.random() * (orgCanvas.width - 40) + 20;
    this.y = y || Math.random() * (orgCanvas.height - 40) + 20;
    this.generation = generation || 1;
    this.size = parent ? Math.max(4, parent.size * (0.85 + Math.random() * 0.3)) : Math.random() * 12 + 6;
    this.speed = parent ? parent.speed * (0.9 + Math.random() * 0.2) : Math.random() * 1.5 + 0.3;
    this.angle = Math.random() * Math.PI * 2;
    this.turnRate = (Math.random() - 0.5) * 0.08;
    this.hue = parent ? parent.hue + (Math.random() - 0.5) * 20 : Math.random() * 60 + 140;
    this.opacity = 0;
    this.fadeIn = true;
    this.energy = 100;
    this.age = 0;
    this.maxAge = 300 + Math.random() * 400;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.trail = [];
    this.mutated = false;
    this.tentacles = Math.floor(Math.random() * 4) + 3;
    this.id = Math.random();
  }

  update() {
    this.age++;
    this.angle += this.turnRate + (Math.random() - 0.5) * 0.05;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    if (this.x < 10) { this.x = 10; this.angle = Math.PI - this.angle; }
    if (this.x > orgCanvas.width - 10) { this.x = orgCanvas.width - 10; this.angle = Math.PI - this.angle; }
    if (this.y < 10) { this.y = 10; this.angle = -this.angle; }
    if (this.y > orgCanvas.height - 10) { this.y = orgCanvas.height - 10; this.angle = -this.angle; }
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 20) this.trail.shift();
    if (this.fadeIn && this.opacity < 0.9) this.opacity += 0.02;
    this.energy = Math.max(0, 100 - (this.age / this.maxAge) * 100);
    this.pulseOffset += 0.05;
  }

  draw() {
    const pulse = 0.85 + 0.15 * Math.sin(this.pulseOffset);
    const r = this.size * pulse;
    const color = `hsla(${this.hue}, 100%, 65%, `;

    // trail
    if (this.trail.length > 2) {
      orgCtx.beginPath();
      orgCtx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        orgCtx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      orgCtx.strokeStyle = `${color}${this.opacity * 0.08})`;
      orgCtx.lineWidth = r * 0.5;
      orgCtx.lineCap = 'round';
      orgCtx.stroke();
    }

    // tentacles
    for (let t = 0; t < this.tentacles; t++) {
      const tAngle = this.angle + (t / this.tentacles) * Math.PI * 2 + this.pulseOffset * 0.3;
      const tLen = r * 2.5;
      const tx = this.x + Math.cos(tAngle) * tLen;
      const ty = this.y + Math.sin(tAngle) * tLen;
      orgCtx.beginPath();
      orgCtx.moveTo(this.x, this.y);
      const cpx = this.x + Math.cos(tAngle + 0.5) * tLen * 0.6;
      const cpy = this.y + Math.sin(tAngle + 0.5) * tLen * 0.6;
      orgCtx.quadraticCurveTo(cpx, cpy, tx, ty);
      orgCtx.strokeStyle = `${color}${this.opacity * 0.2})`;
      orgCtx.lineWidth = 1;
      orgCtx.stroke();
    }

    // glow
    const grad = orgCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 3);
    grad.addColorStop(0, `${color}${this.opacity * 0.3})`);
    grad.addColorStop(1, `${color}0)`);
    orgCtx.beginPath();
    orgCtx.arc(this.x, this.y, r * 3, 0, Math.PI * 2);
    orgCtx.fillStyle = grad;
    orgCtx.fill();

    // core
    orgCtx.beginPath();
    orgCtx.arc(this.x, this.y, r, 0, Math.PI * 2);
    orgCtx.fillStyle = `${color}${this.opacity * 0.6})`;
    orgCtx.fill();

    // nucleus
    orgCtx.beginPath();
    orgCtx.arc(this.x, this.y, r * 0.3, 0, Math.PI * 2);
    orgCtx.fillStyle = `${color}${this.opacity})`;
    orgCtx.fill();

    // generation label
    if (this.generation > 1) {
      orgCtx.font = `7px 'Share Tech Mono'`;
      orgCtx.fillStyle = `${color}${this.opacity * 0.6})`;
      orgCtx.fillText(`G${this.generation}`, this.x - 6, this.y - r - 4);
    }
  }

  isDead() { return this.age >= this.maxAge; }

  reproduce() {
    if (organisms.length < 30 && Math.random() < 0.002) {
      const child = new Organism(this.x, this.y, this.generation + 1, this);
      organisms.push(child);
      generation = Math.max(generation, this.generation + 1);
      genCountEl.textContent = generation;
    }
  }
}

function spawnInitial() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      organisms.push(new Organism());
      orgCountEl.textContent = organisms.length;
    }, i * 400);
  }
}

function animateGarden() {
  if (orgCanvas.width === 0) {
    orgCanvas.width = orgCanvas.parentElement ? orgCanvas.parentElement.clientWidth - 240 : 600;
    orgCanvas.height = 500;
  }
  orgCtx.fillStyle = 'rgba(0,5,2,0.15)';
  orgCtx.fillRect(0, 0, orgCanvas.width, orgCanvas.height);

  for (let i = organisms.length - 1; i >= 0; i--) {
    organisms[i].update();
    organisms[i].draw();
    organisms[i].reproduce();
    if (organisms[i].isDead()) {
      organisms.splice(i, 1);
    }
  }

  orgCountEl.textContent = organisms.length;
  requestAnimationFrame(animateGarden);
}

window.addOrganism = function () {
  if (organisms.length < 30) {
    organisms.push(new Organism());
    orgCountEl.textContent = organisms.length;
  }
};

window.triggerMutation = function () {
  organisms.forEach(o => {
    if (Math.random() > 0.5) {
      o.hue += (Math.random() - 0.5) * 60;
      o.speed *= 0.7 + Math.random() * 0.6;
      o.size *= 0.8 + Math.random() * 0.4;
      o.tentacles = Math.max(2, o.tentacles + Math.floor(Math.random() * 3) - 1);
      o.mutated = true;
      mutations++;
      mutCountEl.textContent = mutations;
    }
  });
};

window.resetGarden = function () {
  organisms = [];
  generation = 1;
  mutations = 0;
  genCountEl.textContent = 1;
  mutCountEl.textContent = 0;
  orgCtx.clearRect(0, 0, orgCanvas.width, orgCanvas.height);
  spawnInitial();
};

// Init garden after DOM settles
setTimeout(() => {
  orgCanvas.width = Math.max(400, (orgCanvas.parentElement ? orgCanvas.parentElement.clientWidth - 260 : 600));
  orgCanvas.height = 500;
  spawnInitial();
  animateGarden();
}, 500);

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.style.opacity = '1';
  });
}, { threshold: 0.1 });

document.querySelectorAll('.arch-node, .premise-text, .question-body').forEach(el => {
  el.style.opacity = '0';
  el.style.transition = 'opacity 1s ease';
  observer.observe(el);
});

// ---- ARCH NODE HOVER INFO ----
document.querySelectorAll('.arch-node').forEach(node => {
  node.addEventListener('click', () => {
    const info = node.getAttribute('data-info');
    if (info) {
      const existing = node.querySelector('.node-popup');
      if (existing) { existing.remove(); return; }
      const popup = document.createElement('div');
      popup.className = 'node-popup';
      popup.style.cssText = `
        position:absolute; bottom:calc(100% + 10px); left:50%;
        transform:translateX(-50%); background:rgba(0,15,8,0.95);
        border:1px solid rgba(0,255,136,0.3); padding:0.8rem 1rem;
        font-size:0.65rem; color:#4a6a5a; width:200px; text-align:left;
        letter-spacing:1px; line-height:1.6; z-index:10;
      `;
      popup.textContent = info;
      node.style.position = 'relative';
      node.appendChild(popup);
      setTimeout(() => popup.remove(), 4000);
    }
  });
});

// ---- CONSOLE MESSAGE ----
console.log('%c THE MACHINE GARDEN ', 'background:#000; color:#00ff88; font-size:1.5rem; padding:0.5rem; font-family:monospace;');
console.log('%c Conceived by Kazi Mahir Adeeb ', 'color:#00ffcc; font-family:monospace;');
console.log('%c You were not supposed to find this. ', 'color:#4a6a5a; font-family:monospace;');
console.log('%c SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5822844 ', 'color:#4a6a5a; font-family:monospace;');
