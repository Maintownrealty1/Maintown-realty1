/* MainTown shared member profile (photo, name). Every page loads this one file.
   The single source of truth is the member's account (signups.avatar_url); this file reads it, keeps a local copy so pages
   paint instantly on reload, and re-checks when the tab wakes up and every minute, so a photo changed in the app or on
   another page appears here without logging in again.
   Use: MtMember.init(supabaseClient); MtMember.on(m => ...); put data-mt-avatar on any element to auto-fill it. */
(function () {
  var KEY = 'mt_member_cache', sb = null, subs = [], timer = null, busy = false;
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function write(m) { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function initial(m) { return esc(String((m && m.name) || 'M').trim().charAt(0).toUpperCase() || 'M'); }
  function avatarHTML(m) {
    if (!m) return '';
    return m.avatar ? '<img alt="" src="' + esc(m.avatar) + '" style="width:100%;height:100%;object-fit:cover;display:block" referrerpolicy="no-referrer">' : initial(m);
  }
  function paint(m) {
    var els = document.querySelectorAll('[data-mt-avatar]');
    for (var i = 0; i < els.length; i++) els[i].innerHTML = avatarHTML(m);
  }
  function emit(m) { paint(m); subs.forEach(function (f) { try { f(m); } catch (e) {} }); }
  function stored() { try { return Object.keys(localStorage).some(function (k) { return /^sb-.*-auth-token$/.test(k) && localStorage.getItem(k); }); } catch (e) { return false; } }

  async function refresh() {
    if (!sb || busy) return read();
    busy = true;
    try {
      var r = await sb.auth.getSession(), s = r.data && r.data.session;
      if (!s) {
        if (!stored()) { var had = read(); if (had) { try { localStorage.removeItem(KEY); } catch (e) {} emit(null); } }
        return read();                                  // signed out for real, or only a connection hiccup: caller keeps what it has
      }
      var cur = read() || {}, card = null;
      try { var c = await sb.rpc('get_my_profile_card'); if (!c.error && c.data) card = c.data; } catch (e) {}
      if (!card) { try { var q = await sb.from('signups').select('full_name, avatar_url, phone').eq('user_id', s.user.id).order('created_at', { ascending: false }).limit(1); if (q.data && q.data[0]) card = q.data[0]; } catch (e) {} }
      var next = Object.assign({}, cur, { id: s.user.id, email: s.user.email || cur.email || '' });
      if (card) {
        if (card.avatar_url) next.avatar = card.avatar_url; /* an empty server value never wipes a photo already known */
        if (card.full_name) next.name = card.full_name;
        if (card.phone !== undefined) next.phone = card.phone || '';
      }
      if (!next.name) next.name = (s.user.user_metadata && (s.user.user_metadata.full_name || s.user.user_metadata.name)) || String(s.user.email || '').split('@')[0] || 'Member';
      var changed = (cur.avatar || '') !== (next.avatar || '') || cur.name !== next.name || cur.id !== next.id;
      write(next);
      if (changed) emit(next);
      return next;
    } catch (e) { return read(); } finally { busy = false; }
  }

  window.MtMember = {
    init: function (client) {
      if (sb) return; sb = client;
      paint(read());
      document.addEventListener('DOMContentLoaded', function () { paint(read()); });
      refresh();
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refresh(); });
      window.addEventListener('online', refresh);
      window.addEventListener('storage', function (e) { if (e.key === KEY) emit(read()); });   // another tab changed it
      timer = setInterval(function () { if (document.visibilityState === 'visible') refresh(); }, 60000);
    },
    on: function (f) { subs.push(f); },
    get: read, refresh: refresh, avatarHTML: avatarHTML,
    // call right after this page saves a new photo so every other tab and page updates at once
    setAvatar: function (url) { var m = read() || {}; m.avatar = url || ''; write(m); emit(m); }
  };
})();
