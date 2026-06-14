/* =============================================
   script.js — 드라마틱 에필로그 : GOAT (야고보서 1:12-18)
   ============================================= */

// ─── 카카오 JavaScript 키 (발급받은 키로 교체하여 사용하세요) ───
const KAKAO_APP_KEY = 'YOUR_KAKAO_JAVASCRIPT_KEY';

// ─── 전체 씬 수 (scene-0 ~ scene-12) ───
const TOTAL_SCENES = 13;

let currentScene = 0;
let soundOn = false;

const bgm = document.getElementById('bgm');
const soundBtn = document.getElementById('sound-btn');

// ─── 초기화 ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 카카오 SDK 초기화
  if (KAKAO_APP_KEY && KAKAO_APP_KEY !== 'YOUR_KAKAO_JAVASCRIPT_KEY') {
    try { Kakao.init(KAKAO_APP_KEY); } catch (e) { console.warn('Kakao init 실패:', e); }
  }

  showScene(0);

  // 첫 터치나 클릭 시 BGM 자동 시작 권장 (브라우저 차단 우회)
  document.addEventListener('touchstart', tryAutoPlay, { once: true });
  document.addEventListener('click', tryAutoPlay, { once: true });
});

let isPlayPending = false;

function tryAutoPlay() {
  if (soundOn || isPlayPending) return;
  isPlayPending = true;
  bgm.volume = 0.42;
  bgm.play().then(() => {
    soundOn = true;
    soundBtn.textContent = '🔊';
    isPlayPending = false;
  }).catch((err) => {
    console.warn('BGM play blocked or aborted:', err);
    isPlayPending = false;
  });
}

function startApp() {
  tryAutoPlay();
  goNext(0);
}

// ─── 씬 이동 ─────────────────────────────────
function showScene(index) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('scene-' + index);
  if (target) {
    target.classList.add('active');
    // 스크롤 상단 리셋
    const textBlock = target.querySelector('.text-block');
    if (textBlock) textBlock.scrollTop = 0;
  }
  currentScene = index;
}

// 씬 변경 버튼 직접 연결용
function selectOption(nextIndex) {
  showScene(nextIndex);
}

function goNext(from) {
  const next = from + 1;
  if (next < TOTAL_SCENES) showScene(next);
}

// 씬에서 커스텀 이동을 위해 goNextTo 사용 가능
function goNextTo(targetIndex) {
  showScene(targetIndex);
}

function goPrev(from) {
  const prev = from - 1;
  if (prev >= 0) showScene(prev);
}

// ─── 사운드 ──────────────────────────────────
function toggleSound() {
  if (soundOn) {
    bgm.pause(); soundOn = false; soundBtn.textContent = '🔇';
  } else {
    bgm.volume = 0.42;
    bgm.play().then(() => {
      soundOn = true; soundBtn.textContent = '🔊';
    }).catch(() => {});
  }
}

// ─── 카카오 공유 ─────────────────────────────
function shareKakao() {
  let pageUrl = window.location.href.split('?')[0];
  if (pageUrl.endsWith('index.html')) {
    pageUrl = pageUrl.replace('index.html', '');
  }
  if (!pageUrl.endsWith('/')) {
    pageUrl += '/';
  }

  if (!KAKAO_APP_KEY || KAKAO_APP_KEY === 'YOUR_KAKAO_JAVASCRIPT_KEY'
      || typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
    copyLink(pageUrl); return;
  }

  try {
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '드라마틱 에필로그 — GOAT',
        description: '내가 내 삶을 이 악물고 완벽히 통제하지 않아도 괜찮습니다. 우리는 이미 존재 자체로 하나님의 실패하지 않는 첫사랑입니다.',
        imageUrl: pageUrl + 'images/0.jpeg',
        link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
      },
      buttons: [{
        title: '에필로그 보기',
        link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
      }],
    });
  } catch (e) {
    console.warn('카카오 공유 실패:', e);
    copyLink(pageUrl);
  }
}

// 링크 복사 fallback
function copyLink(url) {
  const copy = () => showToast('링크가 복사됐어요! 카카오톡에 붙여넣기 해주세요 🌸');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(copy);
  } else {
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta); copy();
  }
}

// 토스트 메시지
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = [
      'position:fixed', 'bottom:110px', 'left:50%', 'transform:translateX(-50%)',
      'background:rgba(26, 17, 39, 0.95)', 'color:white', 'padding:12px 24px',
      'border-radius:50px', 'font-size:14px', "font-family:sans-serif",
      'z-index:9999', 'white-space:nowrap', 'box-shadow:0 10px 30px rgba(0,0,0,0.3)',
      'border:1px solid rgba(229,193,88,0.2)',
      'backdrop-filter:blur(8px)', 'transition:opacity 0.4s', 'letter-spacing:0.03em',
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 400);
  }, 2800);
}
