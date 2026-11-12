(function () {
  var d = document, body = d.body;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---- Language switch (Bangla / English) ---- */
  var lang = 'bn';
  try { lang = localStorage.getItem('hbd_lang') || 'bn'; } catch (e) {}
  function setLang(l) {
    lang = l;
    body.setAttribute('data-lang', l);
    d.documentElement.lang = l;
    try { localStorage.setItem('hbd_lang', l); } catch (e) {}
  }
  setLang(lang);
  var lb = $('#hbd-lang');
  if (lb) lb.addEventListener('click', function () { setLang(lang === 'bn' ? 'en' : 'bn'); });

  /* ---- Tournament filter ---- */
  $$('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      $$('[data-filter]').forEach(function (x) {
        x.classList.toggle('on', x === btn);
        x.setAttribute('aria-pressed', x === btn ? 'true' : 'false');
      });
      $$('.t-card').forEach(function (c) {
        c.hidden = !(f === 'all' || c.getAttribute('data-type') === f);
      });
    });
  });

  /* ---- Tool tabs ---- */
  $$('[data-tool]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var t = btn.getAttribute('data-tool');
      $$('[data-tool]').forEach(function (x) { x.classList.toggle('on', x === btn); });
      var n = $('#tool-nick'), r = $('#tool-role');
      if (n) n.hidden = t !== 'nick';
      if (r) r.hidden = t !== 'role';
    });
  });

  /* ---- Nickname generator ---- */
  var input = $('#hbd-nick'), out = $('#hbd-nick-out'), go = $('#hbd-nick-go');
  if (input && out) {
    var classic = [];
    var copiedText = '';

    function mapF(s, up, lo) {
      return Array.from(s).map(function (c) {
        var k = c.charCodeAt(0);
        if (k >= 65 && k <= 90) return String.fromCodePoint(up + k - 65);
        if (k >= 97 && k <= 122) return String.fromCodePoint(lo + k - 97);
        return c;
      }).join('');
    }
    var smallSet = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ';
    function smallCaps(s) {
      return Array.from(s).map(function (c) {
        var k = c.toLowerCase().charCodeAt(0);
        return (k >= 97 && k <= 122) ? smallSet.charAt(k - 97) : c;
      }).join('');
    }
    function base() { return (input.value || '').trim() || 'Rakib'; }

    function genClassic() {
      var b = (input.value || '').trim() || pick(['Shadow', 'Ghost', 'Alpha', 'Phantom', 'Storm', 'Viper']);
      var pre = ['Dark', 'Silent', 'Toxic', 'Ghost', 'Savage', 'Lethal', 'Alpha', 'Phantom'];
      var suf = ['Killer', 'BD', 'Pro', 'X', 'Slayer', 'Shadow', 'FF', 'King'];
      var num = String(Math.floor(Math.random() * 90) + 10);
      classic = [
        pick(pre) + b, b + '乂' + pick(suf), '彡' + b + '彡', b + '_' + pick(suf),
        '★' + b + '★', pick(pre) + '_' + b + num, 'ツ' + b + pick(suf)
      ].slice(0, 6);
    }

    function copy(text) {
      function done() { copiedText = text; render(); }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
          return;
        }
      } catch (e) {}
      fallback();
      function fallback() {
        var ta = d.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        d.body.appendChild(ta); ta.select();
        try { d.execCommand('copy'); } catch (e) {}
        d.body.removeChild(ta);
        done();
      }
    }

    function bi(bn, en) {
      var f = d.createDocumentFragment();
      var a = d.createElement('span'); a.setAttribute('data-l', 'bn'); a.textContent = bn;
      var b = d.createElement('span'); b.setAttribute('data-l', 'en'); b.textContent = en;
      f.appendChild(a); f.appendChild(b);
      return f;
    }

    function render() {
      var b = base();
      var fonts = [
        mapF(b, 0x1D4D0, 0x1D4EA), mapF(b, 0x1D56C, 0x1D586), mapF(b, 0x1D5D4, 0x1D5EE),
        mapF(b, 0x1D63C, 0x1D656), mapF(b, 0x1D670, 0x1D68A), mapF(b, 0x24B6, 0x24D0),
        mapF(b, 0xFF21, 0xFF41), mapF(b, 0x1F170, 0x1F170), smallCaps(b)
      ];
      var emoji = ['🔥', '👑', '💀', '⚡', '🎯', '🐺', '😈', '💥'].map(function (e) { return e + b + e; });
      var cl = classic.concat(['꧁' + b + '꧂', '『' + b + '』', '【' + b + '】', 'ミ★' + b + '★彡', b + 'ッ', '〖' + b + '〗']);
      var groups = [
        { bn: 'স্টাইল ও সিম্বল নাম', en: 'STYLE AND SYMBOL NAMES', items: cl },
        { bn: 'ফন্ট স্টাইল (ইংরেজি অক্ষরে)', en: 'FONT STYLES (ENGLISH LETTERS)', items: fonts },
        { bn: 'ইমোজি নাম', en: 'EMOJI NAMES', items: emoji }
      ];
      out.textContent = '';
      groups.forEach(function (g) {
        var t = d.createElement('div'); t.className = 'group-title';
        t.appendChild(bi(g.bn, g.en)); out.appendChild(t);
        var wrap = d.createElement('div'); wrap.className = 'names';
        g.items.forEach(function (text) {
          var btn = d.createElement('button'); btn.type = 'button'; btn.className = 'name-btn';
          var s = d.createElement('strong'); s.textContent = text;
          var sm = d.createElement('small');
          sm.appendChild(copiedText === text ? bi('কপি হয়েছে', 'Copied') : bi('ক্লিক করে কপি করুন', 'Click to copy'));
          btn.appendChild(s); btn.appendChild(sm);
          btn.addEventListener('click', function () { copy(text); });
          wrap.appendChild(btn);
        });
        out.appendChild(wrap);
      });
    }

    genClassic();
    render();
    input.addEventListener('input', render);
    if (go) go.addEventListener('click', function () { genClassic(); copiedText = ''; render(); });
  }

  /* ---- Squad roles ---- */
  var rolesEl = $('#hbd-roles'), roleBtn = $('#hbd-role-go');
  if (rolesEl) {
    var names = ['Rusher', 'Sniper', 'Support', 'Scout'];
    function shuffle() {
      var a = names.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      rolesEl.textContent = '';
      a.forEach(function (r, i) {
        var box = d.createElement('div'); box.className = 'role';
        var sm = d.createElement('small');
        sm.appendChild(bi('প্লেয়ার ' + (i + 1), 'Player ' + (i + 1)));
        var st = d.createElement('strong'); st.textContent = r;
        box.appendChild(sm); box.appendChild(st); rolesEl.appendChild(box);
      });
    }
    shuffle();
    if (roleBtn) roleBtn.addEventListener('click', shuffle);
  }
})();
