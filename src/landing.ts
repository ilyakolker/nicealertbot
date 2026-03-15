export const landingHTML = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NiceAlert Bot — התראות פיקוד העורף</title>
<meta name="description" content="קבל התראות פיקוד העורף ישירות לטלגרם — מהר, אמין, עם צליל מותאם אישית.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0B1120;
    --bg-card: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --text: #E2E8F0;
    --text-dim: #94A3B8;
    --accent: #229ED9;
    --accent-glow: rgba(34,158,217,0.25);
    --shield: #3B82F6;
    --safe: #10B981;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Heebo', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Ambient background */
  .ambient {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .ambient::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    top: -200px; right: -100px;
    background: radial-gradient(circle, rgba(34,158,217,0.08) 0%, transparent 70%);
    animation: drift 20s ease-in-out infinite;
  }
  .ambient::after {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    bottom: -150px; left: -100px;
    background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
    animation: drift 25s ease-in-out infinite reverse;
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, 20px) scale(1.1); }
  }

  /* Grid texture */
  .grid-texture {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin: 0 auto;
    padding: 60px 24px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Shield icon */
  .shield {
    width: 80px; height: 80px;
    margin-bottom: 32px;
    position: relative;
    animation: fadeUp 0.8s ease-out both;
  }
  .shield svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 30px var(--accent-glow));
  }
  .shield-pulse {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 1.5px solid var(--accent);
    opacity: 0;
    animation: pulse 3s ease-out infinite;
  }
  .shield-pulse:nth-child(2) { animation-delay: 1s; }
  .shield-pulse:nth-child(3) { animation-delay: 2s; }

  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.6; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  /* Typography */
  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1.2;
    text-align: center;
    margin-bottom: 8px;
    animation: fadeUp 0.8s ease-out 0.1s both;
  }
  h1 span { color: var(--accent); }

  .subtitle {
    font-size: 1.05rem;
    font-weight: 300;
    color: var(--text-dim);
    text-align: center;
    margin-bottom: 40px;
    line-height: 1.7;
    max-width: 480px;
    animation: fadeUp 0.8s ease-out 0.2s both;
  }

  /* CTA Button */
  .cta-wrap {
    animation: fadeUp 0.8s ease-out 0.3s both;
    margin-bottom: 56px;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 40px;
    background: var(--accent);
    color: #fff;
    font-family: 'Heebo', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    border: none;
    border-radius: 16px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow:
      0 0 0 0 var(--accent-glow),
      0 4px 24px rgba(34,158,217,0.3);
  }
  .cta:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 4px var(--accent-glow),
      0 8px 32px rgba(34,158,217,0.4);
  }
  .cta:active { transform: translateY(0); }
  .cta svg { width: 24px; height: 24px; flex-shrink: 0; }

  /* Features */
  .features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    width: 100%;
    margin-bottom: 56px;
    animation: fadeUp 0.8s ease-out 0.4s both;
  }
  .feature {
    padding: 24px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    text-align: center;
    transition: all 0.3s ease;
  }
  .feature:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-2px);
  }
  .feature-icon {
    font-size: 1.6rem;
    margin-bottom: 12px;
    display: block;
  }
  .feature-title {
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .feature-desc {
    font-size: 0.8rem;
    color: var(--text-dim);
    font-weight: 300;
    line-height: 1.5;
  }

  /* How it works */
  .steps-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-dim);
    margin-bottom: 24px;
    text-align: center;
    animation: fadeUp 0.8s ease-out 0.5s both;
  }
  .steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    max-width: 400px;
    margin-bottom: 56px;
    animation: fadeUp 0.8s ease-out 0.55s both;
  }
  .step {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    position: relative;
  }
  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 19px;
    top: 52px;
    width: 2px;
    height: calc(100% - 36px);
    background: var(--border);
  }
  .step-num {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--accent);
    flex-shrink: 0;
  }
  .step-text {
    font-size: 0.95rem;
    font-weight: 400;
    line-height: 1.5;
  }
  .step-text small {
    display: block;
    color: var(--text-dim);
    font-size: 0.8rem;
    font-weight: 300;
  }

  /* Bottom CTA */
  .bottom-cta {
    animation: fadeUp 0.8s ease-out 0.6s both;
    text-align: center;
  }
  .bottom-cta p {
    font-size: 0.85rem;
    color: var(--text-dim);
    font-weight: 300;
    margin-top: 16px;
  }

  /* English toggle */
  .lang-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px 14px;
    color: var(--text-dim);
    font-family: 'Heebo', sans-serif;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }
  .lang-toggle:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.2);
  }

  .en { display: none; }
  .he { display: block; }
  body.english .en { display: block; }
  body.english .he { display: none; }
  body.english { direction: ltr; }
  body.english .step:not(:last-child)::after {
    right: auto;
    left: 19px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile */
  @media (max-width: 520px) {
    .container { padding: 48px 20px 64px; }
    h1 { font-size: 2rem; }
    .subtitle { font-size: 0.95rem; }
    .features { grid-template-columns: 1fr; gap: 12px; }
    .feature { padding: 20px; }
    .cta { padding: 14px 32px; font-size: 1.05rem; }
    .shield { width: 64px; height: 64px; }
  }
</style>
</head>
<body>

<div class="ambient"></div>
<div class="grid-texture"></div>

<button class="lang-toggle" onclick="document.body.classList.toggle('english'); this.textContent = document.body.classList.contains('english') ? 'עברית' : 'English'">English</button>

<div class="container">

  <div class="shield">
    <div class="shield-pulse"></div>
    <div class="shield-pulse"></div>
    <div class="shield-pulse"></div>
    <svg viewBox="0 0 80 80" fill="none">
      <path d="M40 8L12 22V42C12 58.5 24 72 40 76C56 72 68 58.5 68 42V22L40 8Z" fill="url(#shieldGrad)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <path d="M34 42L38 46L48 34" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="shieldGrad" x1="40" y1="8" x2="40" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#229ED9"/>
          <stop offset="1" stop-color="#1a6fa0"/>
        </linearGradient>
      </defs>
    </svg>
  </div>

  <h1>
    <span class="he"><span>NiceAlert</span> Bot</span>
    <span class="en"><span>NiceAlert</span> Bot</span>
  </h1>

  <p class="subtitle">
    <span class="he">התראות פיקוד העורף ישירות לטלגרם שלך.<br>מהיר. אמין. עם הצליל שלך.</span>
    <span class="en">Pikud HaOref alerts straight to your Telegram.<br>Fast. Reliable. With your custom sound.</span>
  </p>

  <div class="cta-wrap">
    <a href="https://t.me/NicelyAlertBot" class="cta" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.97 1.25-5.57 3.68-.53.36-1.01.54-1.43.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.98-1.73 6.64-2.88 7.97-3.43 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .38z"/></svg>
      <span class="he">התחל עכשיו</span>
      <span class="en">Start Now</span>
    </a>
  </div>

  <div class="features">
    <div class="feature">
      <span class="feature-icon">&#9889;</span>
      <div class="feature-title">
        <span class="he">~5 שניות</span>
        <span class="en">~5 Seconds</span>
      </div>
      <div class="feature-desc">
        <span class="he">השהייה ממוצעת מרגע האזעקה</span>
        <span class="en">Average delay from alert</span>
      </div>
    </div>
    <div class="feature">
      <span class="feature-icon">&#127961;</span>
      <div class="feature-title">
        <span class="he">מספר ערים</span>
        <span class="en">Multi-City</span>
      </div>
      <div class="feature-desc">
        <span class="he">בחר ערים מרובות או כל הארץ</span>
        <span class="en">Choose multiple cities or all of Israel</span>
      </div>
    </div>
    <div class="feature">
      <span class="feature-icon">&#128276;</span>
      <div class="feature-title">
        <span class="he">צליל מותאם</span>
        <span class="en">Custom Sound</span>
      </div>
      <div class="feature-desc">
        <span class="he">הגדר צליל התראה משלך</span>
        <span class="en">Set your own alert sound</span>
      </div>
    </div>
    <div class="feature">
      <span class="feature-icon">&#127760;</span>
      <div class="feature-title">
        <span class="he">שפה</span>
        <span class="en">Language</span>
      </div>
      <div class="feature-desc">
        <span class="he">תמיכה מלאה בשתי שפות</span>
        <span class="en">Full bilingual support</span>
      </div>
    </div>
  </div>

  <div class="steps-title">
    <span class="he">איך זה עובד?</span>
    <span class="en">How it works</span>
  </div>

  <div class="steps">
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text">
        <span class="he">פתח את הבוט בטלגרם<small>לחץ על הכפתור למטה</small></span>
        <span class="en">Open the bot in Telegram<small>Tap the button below</small></span>
      </div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text">
        <span class="he">בחר שפה ועיר<small>או הירשם לכל הארץ</small></span>
        <span class="en">Choose language & city<small>Or subscribe to all of Israel</small></span>
      </div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text">
        <span class="he">הגדר צליל התראה<small>כדי לשמוע גם עם מסך נעול</small></span>
        <span class="en">Set alert sound<small>So you hear it even when locked</small></span>
      </div>
    </div>
  </div>

  <div class="bottom-cta">
    <a href="https://t.me/NicelyAlertBot" class="cta" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.97 1.25-5.57 3.68-.53.36-1.01.54-1.43.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 3.98-1.73 6.64-2.88 7.97-3.43 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .38z"/></svg>
      <span class="he">פתח את הבוט</span>
      <span class="en">Open Bot</span>
    </a>
    <p>
      <span class="he">חינם לחלוטין. ללא פרסומות.</span>
      <span class="en">Completely free. No ads.</span>
    </p>
  </div>

</div>

</body>
</html>`;
