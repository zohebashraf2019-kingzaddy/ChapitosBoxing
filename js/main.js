(function () {
  "use strict";
  var S = window.GYM_SCHEDULE || { weekly: {}, closures: {}, events: {}, announcements: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var key = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* Nav */
  var nav = $(".nav"), toggle = $(".nav__toggle"), links = $("#nav-links");
  var onScroll = function () { nav.classList.toggle("is-solid", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open); links.classList.toggle("is-open", open);
  });
  $$("a", links).forEach(function (a) { a.addEventListener("click", function () { toggle.setAttribute("aria-expanded", "false"); links.classList.remove("is-open"); }); });

  /* Hero sound */
  var hv = $(".hero__video"), sb = $(".hero__sound");
  sb.addEventListener("click", function () {
    hv.muted = !hv.muted; if (!hv.muted) hv.play();
    sb.setAttribute("aria-pressed", String(!hv.muted));
    $("span", sb).textContent = hv.muted ? "Sound on" : "Sound off";
  });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { hv.removeAttribute("autoplay"); hv.pause(); }

  /* Schedule */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var selected = new Date(today);

  function itemsFor(d) {
    var k = key(d);
    if (S.closures && S.closures[k]) return [{ title: S.closures[k], type: "closed" }];
    var list = (S.weekly[d.getDay()] || []).slice();
    if (S.events && S.events[k]) list = list.concat(S.events[k]);
    return list;
  }
  function chipLabel(it) {
    if (it.type === "closed") return "Closed";
    if (it.type === "women") return "Women's " + (it.time || "");
    if (it.type === "boxing") return "Boxing " + (it.time || "").replace(":00", "").replace(" – ", "–").replace(":00", "");
    return it.title;
  }
  function renderCal() {
    $("#cal-month").textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
    var grid = $("#cal-grid"); grid.innerHTML = "";
    var first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var i = 0; i < first; i++) { var e = document.createElement("div"); e.className = "cday is-empty"; grid.appendChild(e); }
    for (var n = 1; n <= days; n++) {
      var d = new Date(view.getFullYear(), view.getMonth(), n), items = itemsFor(d);
      var b = document.createElement("button"); b.type = "button"; b.className = "cday";
      if (d < today) b.classList.add("is-past");
      if (+d === +today) b.classList.add("is-today");
      if (+d === +selected) b.classList.add("is-selected");
      if (items[0] && items[0].type === "closed") b.classList.add("is-closed");
      b.setAttribute("aria-label", DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + n + ": " + (items.length ? items.map(function (x) { return x.title; }).join(", ") : "no classes"));
      b.innerHTML = '<span class="cday__n">' + n + '</span><span class="chips">' + items.map(function (it) { return '<span class="chip chip--' + it.type + '">' + esc(chipLabel(it)) + "</span>"; }).join("") + "</span>";
      (function (dd) { b.addEventListener("click", function () { selected = dd; renderCal(); renderDay(); }); })(d);
      grid.appendChild(b);
    }
    var a = S.announcements && S.announcements[view.getFullYear() + "-" + pad(view.getMonth() + 1)];
    var cur = S.announcements && S.announcements[today.getFullYear() + "-" + pad(today.getMonth() + 1)];
    var notice = $("#notice");
    if (cur) { $(".notice__title", notice).textContent = cur.title; $(".notice__text", notice).textContent = cur.text; notice.hidden = false; }
  }
  function renderDay() {
    var items = itemsFor(selected);
    $("#day-date").textContent = DAYS[selected.getDay()] + ", " + MONTHS[selected.getMonth()].slice(0, 3) + " " + selected.getDate();
    $("#day-list").innerHTML = items.length ? items.map(function (it) {
      return '<div class="slot slot--' + it.type + '"><b>' + esc(it.title) + "</b>" + (it.time ? "<span>" + esc(it.time) + "</span>" : "") + (it.note ? "<p>" + esc(it.note) + "</p>" : "") + "</div>";
    }).join("") : '<div class="slot slot--closed"><b>No classes</b><p>Pick another day, or send us a message.</p></div>';
  }
  $$(".cal__nav").forEach(function (btn) {
    btn.addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() + (+btn.dataset.step), 1); renderCal(); });
  });
  renderCal(); renderDay();

  /* Reels: one plays at a time */
  var reels = $$(".reel");
  reels.forEach(function (r) {
    var v = $("video", r);
    $(".reel__play", r).addEventListener("click", function () {
      reels.forEach(function (o) { if (o !== r) { $("video", o).pause(); } });
      v.controls = true; r.classList.add("is-playing"); v.play();
    });
    v.addEventListener("play", function () { reels.forEach(function (o) { if (o !== r) $("video", o).pause(); }); });
  });

  /* Lightbox */
  var lb = $("#lightbox"), lbImg = $("img", lb), tiles = $$(".g img"), idx = 0, lastFocus;
  function show(i) { idx = (i + tiles.length) % tiles.length; lbImg.src = tiles[idx].src; lbImg.alt = tiles[idx].alt; }
  function close() { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  tiles.forEach(function (img, i) { img.parentNode.addEventListener("click", function () { lastFocus = img.parentNode; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lightbox__close").focus(); }); });
  $(".lightbox__close").addEventListener("click", close);
  $(".lightbox__prev").addEventListener("click", function () { show(idx - 1); });
  $(".lightbox__next").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close(); else if (e.key === "ArrowLeft") show(idx - 1); else if (e.key === "ArrowRight") show(idx + 1);
  });

  /* CTA buttons preselect the form topic */
  var sel = $("#f-interest");
  $$("[data-interest]").forEach(function (a) {
    a.addEventListener("click", function () {
      var want = a.dataset.interest.toLowerCase();
      for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].text.toLowerCase().indexOf(want) === 0) { sel.selectedIndex = i; break; } }
    });
  });

  /* Contact form */
  var form = $("#contact-form"), status = $("#form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["name", "email", "message"].forEach(function (n) {
      var f = form.elements[n], bad = !f.value.trim() || (n === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.closest(".field").classList.toggle("is-invalid", bad); if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) { status.className = "form__status err"; status.textContent = "Add your name, a valid email and a message, then send again."; return; }
    var btn = $("button[type=submit]", form), data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    btn.disabled = true; btn.textContent = "Sending…"; status.className = "form__status"; status.textContent = "";
    fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () { form.reset(); status.className = "form__status ok"; status.textContent = "Message sent. We'll get back to you soon."; })
      .catch(function () { status.className = "form__status err"; status.innerHTML = 'Your message didn\'t send. Call <a href="tel:+17753519167">(775) 351-9167</a> or message us on <a href="https://www.facebook.com/ChapitosBoxing/" target="_blank" rel="noopener">Facebook</a>.'; })
      .then(function () { btn.disabled = false; btn.textContent = "Send message"; });
  });

  $("#year").textContent = new Date().getFullYear();
})();
