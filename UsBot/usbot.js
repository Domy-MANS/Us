const bot = document.createElement('div');
bot.id = 'usbot';

bot.innerHTML = `
  <div class="robot">
    <div class="head">
      <div class="eyes"></div>
    </div>
    <div class="body">
      <div class="logo-heart"><img src="UsBot/UsBotHeart.png" /></div>
    </div>
    <div class="arms"></div>
    <div class="legs"></div>
  </div>
  <div id="usbot-speech"></div>
  <div id="usbot-zzz" style="display:none;">zzz</div>
`;

document.body.appendChild(bot);

let isDragging = false;
let offsetX, offsetY;

bot.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - bot.offsetLeft;
  offsetY = e.clientY - bot.offsetTop;
  bot.style.cursor = 'grabbing';
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    bot.style.left = `${e.clientX - offsetX}px`;
    bot.style.top = `${e.clientY - offsetY}px`;
    const zzz = document.getElementById('usbot-zzz');
    if (zzz) {
      zzz.style.left = `${bot.offsetLeft + bot.offsetWidth - 10}px`;
      zzz.style.top = `${bot.offsetTop - 10}px`;
    }
  }
});
document.addEventListener('mouseup', () => {
  isDragging = false;
  bot.style.cursor = 'grab';
});

bot.addEventListener('click', () => {
  bot.classList.add('usbot-jump');
  setTimeout(() => bot.classList.remove('usbot-jump'), 400);
});

bot.addEventListener('dblclick', () => {
  if (!isLoggedIn) return;
  const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Help U'));
  if (btn) btn.click();
});

const userId = 'testUser001';
async function loadTodayStats() {
  try {
    const res = await fetch(`http://localhost:4000/daily-stats/${userId}`);
    const data = await res.json();
    updateUsBotState(data);
  } catch (e) {
    document.getElementById('usbot-speech').innerText = 'Us is waking up...';
    console.error(e);
  }
}

let usBotSleeping = true;

function setUsBotSleep(isSleeping) {
  usBotSleeping = isSleeping;
  const eyes = bot.querySelector('.eyes');
  const heart = bot.querySelector('.logo-heart img');
  const robot = bot.querySelector('.robot');
  const speech = document.getElementById('usbot-speech');

  if (isSleeping) {
    eyes.style.height = '2px';
    eyes.style.opacity = '0.5';
    robot.style.filter = 'grayscale(0.7) brightness(0.8)';
    heart.style.animation = 'breathe 6s ease-in-out infinite';
    robot.classList.add('usbot-idle');
    if (speech) {
  speech.innerText = 'zzz';
  speech.classList.add('breathing');
}

  } else {
    eyes.style.height = '6px';
    eyes.style.opacity = '1';
    robot.style.filter = '';

    if (
      !robot.classList.contains('usbot-sad') &&
      !robot.classList.contains('usbot-happy') &&
      !robot.classList.contains('usbot-anxious')
    ) {
      heart.style.animation = 'softbeat 3s ease-in-out infinite';
      robot.classList.add('usbot-idle');
    } else {
      heart.style.animation = '';
    }

    if (speech) {
  speech.innerText = '';
  speech.classList.add('breathing');
}

    setTimeout(() => loadTodayStats(), 100);
  }
}
window.setUsBotSleep = setUsBotSleep;

function showSpeech(text) {
  const speech = document.getElementById('usbot-speech');
  if (!speech) return;
  speech.innerText = usBotSleeping ? 'zzz' : text;
  speech.classList.add('breathing');
}

function updateUsBotState(data) {
  if (usBotSleeping) {
    showSpeech('zzz');
    return;
  }
  const { interact = 0, mood_A = 0, mood_B = 0, mood_C = 0 } = data;
  const negative = mood_A + mood_C;
  const positive = mood_B;

  if (interact === 0) {
    showSpeech('Join Us?');
  } else if (interact < 3) {
    showSpeech('I need U, Us need U~');
  } else {
    if (negative > positive) {
      showSpeech('Us can Help U');
    } else {
      showSpeech('U can Help Us');
    }
  }
}

window.reactToEmotion = function (mood) {
  if (usBotSleeping) return;

  const robot = bot.querySelector('.robot');
  const heart = bot.querySelector('.logo-heart img');
  const arms = bot.querySelector('.arms');

  robot.classList.remove('usbot-sad', 'usbot-happy', 'usbot-anxious');
  heart.style.animation = 'softbeat 3s ease-in-out infinite';
  arms.style.animation = '';
  void robot.offsetWidth;

  if (mood === 'A') {
    robot.classList.add('usbot-sad');
  }
  if (mood === 'B') {
    robot.classList.add('usbot-happy');
    arms.style.animation = 'clap 0.4s ease-in-out 3';
  }
  if (mood === 'C') {
    robot.classList.add('usbot-anxious');
    heart.style.animation = 'heartbeat 0.6s ease-in-out 3';
  }

  setTimeout(() => {
    robot.classList.remove('usbot-sad', 'usbot-happy', 'usbot-anxious');
    heart.style.animation = 'softbeat 3s ease-in-out infinite';
    arms.style.animation = '';
  }, 2000);
};

const robotEyes = bot.querySelector('.eyes');
const robotMain = bot.querySelector('.robot');
robotMain.classList.add('usbot-idle');

function blinkEyes() {
  if (bot.querySelector('.robot').style.filter) return;
  robotEyes.classList.add('blink');
  setTimeout(() => {
    robotEyes.classList.remove('blink');
  }, 200);
}
function scheduleBlink() {
  const delay = 6000 + Math.random() * 4000;
  setTimeout(() => {
    blinkEyes();
    scheduleBlink();
  }, delay);
}
scheduleBlink();

setUsBotSleep(true);
setTimeout(() => setUsBotSleep(usBotSleeping), 0);
loadTodayStats();

const zzzAnim = document.createElement('style');
zzzAnim.innerHTML = `@keyframes zzz-float {0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}`;
document.head.appendChild(zzzAnim);

window.usbotShowThanks = function () {
  if (window.usBotSleeping) return;
  const thanksArr = [
    "💙Thank U!❤️",
    "💙Appreciated!❤️",
    "💙Much love❤️",
    "💙You're kind.❤️",
    "💙That helps :)❤️"
  ];
  const speech = document.getElementById('usbot-speech');
  if (!speech) return;
  const prev = speech.innerText;
  const msg = thanksArr[Math.floor(Math.random() * thanksArr.length)];
  speech.innerText = msg;
  clearTimeout(window._usbotThanksTimer);
  window._usbotThanksTimer = setTimeout(() => {
    if (!window.usBotSleeping) speech.innerText = prev;
  }, 3000);
};
