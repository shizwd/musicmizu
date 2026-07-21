(() => {
  "use strict";

  const icons = {
    back: "‹",
    forward: "›",
    previous: "⏮",
    play: "▶",
    pause: "❚❚",
    next: "⏭",
    library: "♫",
    albums: "▦",
    search: "⌕",
    volume: "◕"
  };

  const albumArtists = {
    "projectmili": "Mili",
    "noteblock": "Noteblock",
    "kusanagi-nene-wonderlands-showtime": "草薙宁宁 · Wonderlands×Showtime"
  };

  const originalLogo = document.querySelector("#logo");
  const siteRoot = new URL(originalLogo ? originalLogo.getAttribute("href") : "./", window.location.href);
  const normalizePath = path => path.endsWith("/") ? path : `${path}/`;
  const rootPath = normalizePath(siteRoot.pathname);

  let queue = [];
  let currentIndex = -1;
  let currentTrack = null;
  let navigating = false;
  let toastTimer = 0;

  const pathFor = slug => new URL(slug ? `${slug}/` : "./", siteRoot).href;
  const pathKey = url => normalizePath(new URL(url, window.location.href).pathname).toLowerCase();

  function createSidebar() {
    const aside = document.createElement("aside");
    aside.className = "mizu-sidebar";
    aside.setAttribute("aria-label", "资料库导航");
    aside.innerHTML = `
      <a class="mizu-brand" href="${siteRoot.href}">
        <span class="mizu-brand-mark">${icons.library}</span>
        <span>Music Mizu</span>
      </a>
      <div class="mizu-nav mizu-nav-primary">
        <a href="${siteRoot.href}" data-nav="home"><span class="mizu-nav-icon">${icons.library}</span><span>现在就听</span></a>
        <a href="${siteRoot.href}#albums" data-nav="albums"><span class="mizu-nav-icon">${icons.albums}</span><span>浏览专辑</span></a>
      </div>
      <div class="mizu-nav-label">资料库</div>
      <nav class="mizu-nav mizu-nav-library">
        <a href="${pathFor("projectmili")}"><span class="mizu-nav-icon">●</span><span>ProjectMili</span></a>
        <a href="${pathFor("kusanagi-nene-wonderlands-showtime")}"><span class="mizu-nav-icon">●</span><span>草薙宁宁</span></a>
        <a href="${pathFor("noteblock")}"><span class="mizu-nav-icon">●</span><span>Noteblock</span></a>
      </nav>
      <div class="mizu-sidebar-spacer"></div>
      <div class="mizu-library-summary">3 张专辑 · 39 首歌曲<br>无广告 · 无追踪 · 直接播放</div>
    `;
    document.body.insertBefore(aside, document.body.firstChild);
  }

  function createToolbar() {
    const header = document.querySelector(".layout > header");
    if (!header) return;

    header.innerHTML = `
      <div class="mizu-toolbar">
        <div class="mizu-history">
          <button type="button" data-history="back" aria-label="后退">${icons.back}</button>
          <button type="button" data-history="forward" aria-label="前进">${icons.forward}</button>
          <div class="mizu-context"><strong>Music Mizu</strong><span>资料库</span></div>
        </div>
        <div class="mizu-player-shell">
          <div class="mizu-transport">
            <button type="button" data-player="previous" aria-label="上一首" disabled>${icons.previous}</button>
            <button type="button" data-player="play" aria-label="播放" disabled>${icons.play}</button>
            <button type="button" data-player="next" aria-label="下一首" disabled>${icons.next}</button>
          </div>
          <div class="mizu-now-playing">
            <img class="mizu-player-art" alt="" src="">
            <div class="mizu-player-center">
              <div class="mizu-player-meta"><strong>选择一首歌曲</strong><span>Music Mizu</span></div>
              <div class="mizu-progress-row">
                <time data-time="current">0:00</time>
                <input class="mizu-range" data-player="progress" type="range" min="0" max="0" value="0" step="0.1" aria-label="播放进度">
                <time data-time="total">0:00</time>
              </div>
            </div>
          </div>
        </div>
        <div class="mizu-toolbar-end">
          <label class="mizu-volume" title="音量"><span>${icons.volume}</span><input class="mizu-range" data-player="volume" type="range" min="0" max="1" value="0.9" step="0.01" aria-label="音量"></label>
          <label class="mizu-search"><span>${icons.search}</span><input type="search" placeholder="搜索当前页面" aria-label="搜索当前页面"></label>
        </div>
      </div>
    `;

    const audio = document.createElement("audio");
    audio.id = "mizu-audio";
    audio.preload = "metadata";
    audio.volume = 0.9;
    header.appendChild(audio);
  }

  function toast(message) {
    let element = document.querySelector(".mizu-toast");
    if (!element) {
      element = document.createElement("div");
      element.className = "mizu-toast";
      element.setAttribute("role", "status");
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => element.classList.remove("visible"), 1800);
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function trackFromElement(element) {
    const nativeAudio = element.querySelector("audio");
    const sources = Array.from(nativeAudio ? nativeAudio.querySelectorAll("source") : []);
    const preferred = sources.find(source => source.type.includes("mpeg")) || sources[0];
    const pageCover = document.querySelector(".page_split .cover img");
    const rowCover = element.querySelector(".track_playback img");
    const artist = element.querySelector(".artists")?.textContent.trim()
      || document.querySelector(".release_artists")?.textContent.trim()
      || "Music Mizu";

    return {
      element,
      src: preferred ? preferred.src : "",
      title: element.querySelector(".title")?.textContent.trim() || "未知曲目",
      artist,
      album: document.querySelector("#content h1")?.textContent.trim() || "Music Mizu",
      cover: rowCover?.src || pageCover?.src || "",
      duration: Number(element.dataset.duration) || 0
    };
  }

  function collectQueue() {
    return Array.from(document.querySelectorAll("#content .track"))
      .map(trackFromElement)
      .filter(track => track.src);
  }

  function updateMediaSession(track) {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: track.cover ? [{ src: track.cover }] : []
    });
  }

  function updatePlayerMeta() {
    const audio = document.querySelector("#mizu-audio");
    const art = document.querySelector(".mizu-player-art");
    const title = document.querySelector(".mizu-player-meta strong");
    const artist = document.querySelector(".mizu-player-meta span");
    const playButton = document.querySelector('[data-player="play"]');
    const previous = document.querySelector('[data-player="previous"]');
    const next = document.querySelector('[data-player="next"]');

    if (currentTrack) {
      title.textContent = currentTrack.title;
      artist.textContent = `${currentTrack.artist} — ${currentTrack.album}`;
      art.src = currentTrack.cover;
      art.alt = `${currentTrack.album} 封面`;
      playButton.disabled = false;
      previous.disabled = false;
      next.disabled = false;
    }

    playButton.textContent = audio && !audio.paused ? icons.pause : icons.play;
    playButton.setAttribute("aria-label", audio && !audio.paused ? "暂停" : "播放");
    document.body.classList.toggle("mizu-playing", Boolean(audio && !audio.paused));
    markCurrentTrack();
  }

  function markCurrentTrack() {
    document.querySelectorAll("#content .track").forEach(element => {
      const track = trackFromElement(element);
      element.classList.toggle("mizu-current", Boolean(currentTrack && track.src === currentTrack.src));
      const button = element.querySelector(".track_playback");
      if (button) button.setAttribute("aria-label", `${currentTrack && track.src === currentTrack.src ? "播放中的" : "播放"} ${track.title}`);
    });
  }

  async function playTrack(index, nextQueue = null) {
    const audio = document.querySelector("#mizu-audio");
    if (!audio) return;
    if (nextQueue) queue = nextQueue;
    if (!queue.length) return;

    currentIndex = Math.max(0, Math.min(index, queue.length - 1));
    const nextTrack = queue[currentIndex];
    if (!nextTrack?.src) return;

    if (!currentTrack || currentTrack.src !== nextTrack.src) {
      currentTrack = nextTrack;
      audio.src = nextTrack.src;
      audio.load();
      updateMediaSession(nextTrack);
    }

    updatePlayerMeta();
    try {
      await audio.play();
    } catch (error) {
      console.warn("Playback was not started", error);
      toast("浏览器阻止了自动播放，请再次点击播放");
    }
    updatePlayerMeta();
  }

  function playAdjacent(direction) {
    const audio = document.querySelector("#mizu-audio");
    if (!queue.length) return;
    if (direction < 0 && audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const nextIndex = (currentIndex + direction + queue.length) % queue.length;
    playTrack(nextIndex);
  }

  function togglePlayback() {
    const audio = document.querySelector("#mizu-audio");
    if (!audio || !currentTrack) return;
    if (audio.paused) {
      audio.play().catch(() => toast("请从曲目列表开始播放"));
    } else {
      audio.pause();
    }
  }

  function updateTimeline() {
    const audio = document.querySelector("#mizu-audio");
    const progress = document.querySelector('[data-player="progress"]');
    if (!audio || !progress) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : currentTrack?.duration || 0;
    progress.max = duration;
    progress.value = audio.currentTime || 0;
    document.querySelector('[data-time="current"]').textContent = formatTime(audio.currentTime);
    document.querySelector('[data-time="total"]').textContent = formatTime(duration);
  }

  function absolutizeContent(container, baseUrl) {
    container.querySelectorAll("[href]").forEach(element => {
      const value = element.getAttribute("href");
      if (!value || value.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(value)) return;
      element.setAttribute("href", new URL(value, baseUrl).href);
    });
    container.querySelectorAll("[src]").forEach(element => {
      const value = element.getAttribute("src");
      if (!value || /^(data:|blob:)/i.test(value)) return;
      element.setAttribute("src", new URL(value, baseUrl).href);
    });
    container.querySelectorAll("[srcset]").forEach(element => {
      const value = element.getAttribute("srcset");
      if (!value) return;
      element.setAttribute("srcset", value.split(",").map(candidate => {
        const parts = candidate.trim().split(/\s+/);
        parts[0] = new URL(parts[0], baseUrl).href;
        return parts.join(" ");
      }).join(", "));
    });
  }

  function updateActiveNavigation() {
    const current = pathKey(window.location.href);
    document.querySelectorAll(".mizu-nav a").forEach(link => {
      const isHome = link.dataset.nav === "home" && current === rootPath.toLowerCase();
      const isAlbum = !link.dataset.nav && pathKey(link.href) === current;
      link.classList.toggle("active", isHome || isAlbum);
    });
  }

  function enhancePage() {
    document.querySelectorAll("#content .docked_player, #content .docked_player_status").forEach(element => element.remove());

    const tracks = Array.from(document.querySelectorAll("#content .track"));
    const isHome = pathKey(window.location.href) === rootPath.toLowerCase();
    document.body.classList.toggle("mizu-home", isHome);
    document.body.classList.toggle("mizu-release", tracks.length > 0);

    const contextTitle = document.querySelector(".mizu-context strong");
    const contextSubtitle = document.querySelector(".mizu-context span");
    const pageTitle = document.querySelector("#content h1")?.textContent.trim() || "Music Mizu";
    if (contextTitle) contextTitle.textContent = pageTitle;
    if (contextSubtitle) contextSubtitle.textContent = tracks.length ? `${tracks.length} 首歌曲` : "资料库";

    if (isHome) {
      const grid = document.querySelector("#content .page_grid > div");
      if (grid && !grid.querySelector(".mizu-section-heading")) {
        grid.id = "albums";
        const heading = document.createElement("div");
        heading.className = "mizu-section-heading";
        const releaseCount = grid.querySelectorAll(".release").length;
        heading.innerHTML = `<h2>最近添加</h2><span>${releaseCount} 张专辑</span>`;
        grid.insertBefore(heading, grid.firstChild);
      }
      document.querySelectorAll("#content .release").forEach(release => {
        if (release.querySelector(".mizu-release-artist")) return;
        const link = release.querySelector("a[href]");
        const slug = link ? new URL(link.href).pathname.split("/").filter(Boolean).pop() : "";
        const meta = document.createElement("span");
        meta.className = "mizu-release-artist";
        meta.textContent = albumArtists[slug] || "Music Mizu";
        release.appendChild(meta);
      });
    }

    if (tracks.length) {
      const abstract = document.querySelector("#content .page_split .abstract");
      if (abstract && !abstract.querySelector(".mizu-eyebrow")) {
        const eyebrow = document.createElement("div");
        eyebrow.className = "mizu-eyebrow";
        eyebrow.textContent = "专辑 · 2026";
        abstract.insertBefore(eyebrow, abstract.firstChild);

        const totalSeconds = tracks.reduce((sum, track) => sum + (Number(track.dataset.duration) || 0), 0);
        const stats = document.createElement("div");
        stats.className = "mizu-album-stats";
        stats.textContent = `${tracks.length} 首歌曲 · ${Math.floor(totalSeconds / 3600) ? `${Math.floor(totalSeconds / 3600)} 小时 ` : ""}${Math.round((totalSeconds % 3600) / 60)} 分钟 · 2026`;
        abstract.appendChild(stats);
      }

      const trackContainer = document.querySelector("#content .tracks");
      if (trackContainer && !trackContainer.querySelector(".mizu-track-header")) {
        const header = document.createElement("div");
        header.className = "mizu-track-header";
        header.innerHTML = "<span>#</span><span>标题</span><span>时长</span>";
        trackContainer.insertBefore(header, trackContainer.firstChild);
      }
    }

    const search = document.querySelector(".mizu-search input");
    if (search) search.value = "";
    updateActiveNavigation();
    markCurrentTrack();
  }

  function filterPage(query) {
    const normalized = query.trim().toLocaleLowerCase();
    document.querySelectorAll("#content .track, #content .release").forEach(element => {
      element.classList.toggle("mizu-hidden", Boolean(normalized && !element.textContent.toLocaleLowerCase().includes(normalized)));
    });
  }

  function shouldNavigate(anchor, event) {
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.startsWith(rootPath)) return false;
    if (/\.(mp3|opus|flac|zip|jpg|jpeg|png|webp)$/i.test(url.pathname)) return false;
    return true;
  }

  async function navigate(url, pushState = true) {
    const target = new URL(url, window.location.href);
    if (target.pathname === window.location.pathname && target.search === window.location.search) {
      if (target.hash) document.querySelector(target.hash)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (navigating) return;
    navigating = true;
    document.body.classList.add("mizu-loading");
    const persistentAudio = document.querySelector("#mizu-audio");
    const shouldResumePlayback = Boolean(persistentAudio && !persistentAudio.paused && currentTrack);

    try {
      const response = await fetch(target.href, { headers: { "X-Requested-With": "MusicMizu" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const markup = await response.text();
      const nextDocument = new DOMParser().parseFromString(markup, "text/html");
      const nextContent = nextDocument.querySelector("#content");
      const currentContent = document.querySelector("#content");
      if (!nextContent || !currentContent) throw new Error("Missing content area");

      nextContent.querySelectorAll(".docked_player, .docked_player_status, script").forEach(element => element.remove());
      absolutizeContent(nextContent, target.href);
      currentContent.innerHTML = nextContent.innerHTML;
      document.title = nextDocument.title || "Music Mizu";
      if (pushState) window.history.pushState({ mizu: true }, "", target.href);
      enhancePage();
      if (shouldResumePlayback && persistentAudio.paused) {
        await persistentAudio.play().catch(() => toast("点击播放以继续聆听"));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      if (target.hash) document.querySelector(target.hash)?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("In-app navigation failed", error);
      window.location.href = target.href;
    } finally {
      navigating = false;
      document.body.classList.remove("mizu-loading");
    }
  }

  function bindEvents() {
    const audio = document.querySelector("#mizu-audio");
    audio.addEventListener("timeupdate", updateTimeline);
    audio.addEventListener("durationchange", updateTimeline);
    audio.addEventListener("play", updatePlayerMeta);
    audio.addEventListener("pause", updatePlayerMeta);
    audio.addEventListener("ended", () => playAdjacent(1));

    document.addEventListener("click", event => {
      const target = event.target;
      const trackButton = target.closest?.(".track_playback");
      if (trackButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const elements = Array.from(document.querySelectorAll("#content .track"));
        const element = trackButton.closest(".track");
        const nextQueue = elements.map(trackFromElement).filter(track => track.src);
        const selected = nextQueue.findIndex(track => track.element === element);
        playTrack(selected < 0 ? 0 : selected, nextQueue);
        return;
      }

      const listenButton = target.closest?.("button.listen");
      if (listenButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const nextQueue = collectQueue();
        const existingIndex = currentTrack ? nextQueue.findIndex(track => track.src === currentTrack.src) : -1;
        playTrack(existingIndex >= 0 ? existingIndex : 0, nextQueue);
        return;
      }

      const playerButton = target.closest?.("[data-player]");
      if (playerButton && playerButton.tagName === "BUTTON") {
        const action = playerButton.dataset.player;
        if (action === "play") togglePlayback();
        if (action === "previous") playAdjacent(-1);
        if (action === "next") playAdjacent(1);
        return;
      }

      const historyButton = target.closest?.("[data-history]");
      if (historyButton) {
        historyButton.dataset.history === "back" ? window.history.back() : window.history.forward();
        return;
      }

      const copyButton = target.closest?.("[data-copy]");
      if (copyButton) {
        event.preventDefault();
        navigator.clipboard?.writeText(window.location.href).then(() => toast("链接已复制"));
        return;
      }

      const anchor = target.closest?.("a[href]");
      if (shouldNavigate(anchor, event)) {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname === window.location.pathname && url.hash) return;
        event.preventDefault();
        navigate(url.href);
      }
    }, true);

    document.addEventListener("input", event => {
      if (event.target.matches(".mizu-search input")) filterPage(event.target.value);
      if (event.target.matches('[data-player="progress"]')) audio.currentTime = Number(event.target.value);
      if (event.target.matches('[data-player="volume"]')) audio.volume = Number(event.target.value);
    });

    document.addEventListener("keydown", event => {
      const editable = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
      if (event.key === "/" && !editable) {
        event.preventDefault();
        document.querySelector(".mizu-search input")?.focus();
      }
      if (event.code === "Space" && !editable && currentTrack) {
        event.preventDefault();
        togglePlayback();
      }
    });

    window.addEventListener("popstate", () => navigate(window.location.href, false));

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", togglePlayback);
      navigator.mediaSession.setActionHandler("pause", togglePlayback);
      navigator.mediaSession.setActionHandler("previoustrack", () => playAdjacent(-1));
      navigator.mediaSession.setActionHandler("nexttrack", () => playAdjacent(1));
    }
  }

  createSidebar();
  createToolbar();
  bindEvents();
  enhancePage();
})();
