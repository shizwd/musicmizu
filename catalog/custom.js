(() => {
  "use strict";

  const svgIcon = (content, viewBox = "0 0 24 24") =>
    `<svg class="mizu-icon-svg" viewBox="${viewBox}" aria-hidden="true" focusable="false">${content}</svg>`;

  const icons = {
    previous: svgIcon('<path d="M6.5 5.5v13M18 6.5 9 12l9 5.5z"/>'),
    play: svgIcon('<path d="m8 5.5 10.5 6.5L8 18.5z"/>'),
    pause: svgIcon('<path d="M7.5 5.5h3v13h-3zm6 0h3v13h-3z"/>'),
    next: svgIcon('<path d="M17.5 5.5v13M6 6.5l9 5.5-9 5.5z"/>'),
    library: svgIcon('<path d="M9 5v11.2a3 3 0 1 1-1.5-2.6V7.3L18 5v8.2a3 3 0 1 1-1.5-2.6V3.1z"/>'),
    search: svgIcon('<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4 4"/>'),
    volume: svgIcon('<path d="M4 10v4h3l4 3V7l-4 3zm10.5-.5a4 4 0 0 1 0 5m2-7a7 7 0 0 1 0 9"/>')
  };

  const albumArtists = {
    "projectmili": "Mili",
    "noteblock": "Music Mizu",
    "kusanagi-nene-wonderlands-showtime": "草薙宁宁 · Wonderlands×Showtime"
  };

  const trackCoverCounts = {
    "projectmili": 13,
    "kusanagi-nene-wonderlands-showtime": 25
  };

  const originalLogo = document.querySelector("#logo");
  const siteRoot = new URL(originalLogo ? originalLogo.getAttribute("href") : "./", window.location.href);
  const normalizePath = path => {
    const withoutIndex = path.replace(/\/index\.html$/i, "/");
    return withoutIndex.endsWith("/") ? withoutIndex : `${withoutIndex}/`;
  };
  const rootPath = normalizePath(siteRoot.pathname);

  let queue = [];
  let currentIndex = -1;
  let currentTrack = null;
  let navigating = false;
  let toastTimer = 0;

  const pathFor = slug => new URL(slug ? `${slug}/` : "./", siteRoot).href;
  const assetFor = name => new URL(name, siteRoot).href;
  const pathKey = url => normalizePath(new URL(url, window.location.href).pathname).toLowerCase();

  function applyTrackCovers(tracks) {
    const pathname = new URL(window.location.href).pathname;
    const relativePath = pathname.toLowerCase().startsWith(rootPath.toLowerCase())
      ? pathname.slice(rootPath.length)
      : pathname.replace(/^\/+/, "");
    const pathSegments = relativePath.split("/").filter(Boolean);
    const albumSlug = pathSegments[0]?.toLowerCase();
    const coverCount = trackCoverCounts[albumSlug];
    if (!coverCount) return;

    const detailTrackNumber = /^\d+$/.test(pathSegments[1] || "") ? Number(pathSegments[1]) : 0;
    tracks.forEach((track, index) => {
      const listedNumber = Number.parseInt(track.querySelector(".number")?.textContent || "", 10);
      const trackNumber = detailTrackNumber || listedNumber || index + 1;
      if (trackNumber < 1 || trackNumber > coverCount) return;

      const cover = track.querySelector(".track_playback img");
      if (!cover) return;
      cover.removeAttribute("srcset");
      cover.src = assetFor(`track-covers/${albumSlug}/${String(trackNumber).padStart(2, "0")}.jpg`);
      cover.alt = "";
      cover.setAttribute("aria-hidden", "true");
    });
  }

  function createMascotLayer() {
    const standee = document.createElement("img");
    standee.className = "mizu-mascot-standee";
    standee.src = assetFor("mio-standee.png");
    standee.alt = "";
    standee.setAttribute("aria-hidden", "true");
    document.body.appendChild(standee);
  }

  function createSidebar() {
    const aside = document.createElement("aside");
    aside.className = "mizu-sidebar";
    aside.setAttribute("aria-label", "资料库导航");
    aside.innerHTML = `
      <a class="mizu-brand" href="${siteRoot.href}">
        <img class="mizu-brand-avatar" src="${assetFor("mio-avatar.png")}" alt="">
        <span><strong>Music Mizu</strong><small>澪音的潮汐档案</small></span>
      </a>
      <div class="mizu-nav-label">音乐库</div>
      <nav class="mizu-nav mizu-nav-library">
        <a href="${siteRoot.href}" data-nav="home"><span class="mizu-nav-icon">${icons.library}</span><span>全部专辑</span></a>
        <a href="${pathFor("projectmili")}"><img class="mizu-nav-cover" src="${assetFor("projectmili/cover_160.jpg")}" alt=""><span>ProjectMili</span></a>
        <a href="${pathFor("kusanagi-nene-wonderlands-showtime")}"><img class="mizu-nav-cover" src="${assetFor("kusanagi-nene-wonderlands-showtime/cover_160.jpg")}" alt=""><span>草薙宁宁</span></a>
        <a href="${pathFor("noteblock")}"><img class="mizu-nav-cover" src="${assetFor("noteblock/cover_160.jpg")}" alt=""><span>Noteblock</span></a>
        <button class="mizu-mobile-search-button" type="button" data-mobile-search aria-label="搜索当前页面" aria-controls="mizu-search-panel" aria-expanded="false"><span class="mizu-nav-icon">${icons.search}</span><span>搜索</span></button>
      </nav>
    `;
    document.body.insertBefore(aside, document.body.firstChild);
  }

  function createToolbar() {
    const header = document.querySelector(".layout > header");
    if (!header) return;

    header.innerHTML = `
      <div class="mizu-toolbar">
        <div class="mizu-player-shell">
          <div class="mizu-transport">
            <button type="button" data-player="previous" aria-label="上一首" disabled>${icons.previous}</button>
            <button type="button" data-player="play" aria-label="播放" disabled>${icons.play}</button>
            <button type="button" data-player="next" aria-label="下一首" disabled>${icons.next}</button>
          </div>
          <div class="mizu-now-playing mizu-player-empty">
            <img class="mizu-player-art" alt="">
            <div class="mizu-player-center">
              <div class="mizu-player-meta"><strong>选择一首歌曲</strong><span>Music Mizu</span></div>
              <div class="mizu-progress-row">
                <time data-time="current">0:00</time>
                <input class="mizu-range" data-player="progress" type="range" min="0" max="0" value="0" step="0.1" aria-label="播放进度" aria-valuetext="尚未选择歌曲" disabled>
                <time data-time="total">0:00</time>
              </div>
            </div>
          </div>
        </div>
        <div class="mizu-toolbar-end" id="mizu-search-panel">
          <label class="mizu-volume" title="音量"><span>${icons.volume}</span><input class="mizu-range" data-player="volume" type="range" min="0" max="1" value="0.9" step="0.01" aria-label="音量"></label>
          <label class="mizu-search"><span>${icons.search}</span><input type="search" placeholder="搜索当前页面" aria-label="搜索当前页面"><output class="mizu-search-status" aria-live="polite"></output></label>
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

  function updateRangeFill(input, value, maximum = 1) {
    if (!input) return;
    const ratio = maximum > 0 ? Math.min(1, Math.max(0, value / maximum)) : 0;
    input.style.setProperty("--mizu-range-value", `${ratio * 100}%`);
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
    const pageAlbum = document.querySelector("#content h1")?.textContent.trim() || "Music Mizu";
    const activeAlbum = document.querySelector(".mizu-nav a.active span:last-child")?.textContent.trim();

    return {
      element,
      src: preferred ? preferred.src : "",
      title: element.querySelector(".title")?.textContent.trim() || "未知曲目",
      artist,
      album: document.body.classList.contains("mizu-track-detail") && activeAlbum ? activeAlbum : pageAlbum,
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
    const progress = document.querySelector('[data-player="progress"]');

    if (currentTrack) {
      document.querySelector(".mizu-now-playing")?.classList.remove("mizu-player-empty");
      title.textContent = currentTrack.title;
      artist.textContent = `${currentTrack.artist} — ${currentTrack.album}`;
      art.src = currentTrack.cover;
      art.alt = `${currentTrack.title} 封面`;
      playButton.disabled = false;
      previous.disabled = false;
      next.disabled = false;
      progress.disabled = false;
    }

    playButton.innerHTML = audio && !audio.paused ? icons.pause : icons.play;
    playButton.setAttribute("aria-label", audio && !audio.paused ? "暂停" : "播放");
    document.body.classList.toggle("mizu-playing", Boolean(audio && !audio.paused));
    markCurrentTrack();
  }

  function markCurrentTrack() {
    const audio = document.querySelector("#mizu-audio");
    document.querySelectorAll("#content .track").forEach(element => {
      const track = trackFromElement(element);
      const isCurrent = Boolean(currentTrack && track.src === currentTrack.src);
      const isPlaying = Boolean(isCurrent && audio && !audio.paused);
      element.classList.toggle("mizu-current", isCurrent);
      const button = element.querySelector(".track_playback");
      if (button) {
        button.setAttribute("aria-label", `${isCurrent ? (isPlaying ? "暂停" : "继续播放") : "播放"} ${track.title}`);
        const icon = button.querySelector(".icon");
        if (icon) icon.innerHTML = isPlaying ? icons.pause : icons.play;
      }
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
    updateRangeFill(progress, audio.currentTime || 0, duration);
    document.querySelector('[data-time="current"]').textContent = formatTime(audio.currentTime);
    document.querySelector('[data-time="total"]').textContent = formatTime(duration);
    progress.setAttribute("aria-valuetext", `${formatTime(audio.currentTime)} / ${formatTime(duration)}`);
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
      const linkPath = pathKey(link.href);
      const isAlbum = !link.dataset.nav && (current === linkPath || current.startsWith(linkPath));
      const isActive = isHome || isAlbum;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function enhancePage() {
    document.querySelectorAll("#content .docked_player, #content .docked_player_status").forEach(element => element.remove());

    const tracks = Array.from(document.querySelectorAll("#content .track"));
    const isHome = pathKey(window.location.href) === rootPath.toLowerCase();
    const isAlbum = Boolean(tracks.length && document.querySelector("#content .page_more .release_info"));
    const isTrackDetail = Boolean(tracks.length && !isAlbum);
    applyTrackCovers(tracks);
    document.body.classList.toggle("mizu-home", isHome);
    document.body.classList.toggle("mizu-release", isAlbum);
    document.body.classList.toggle("mizu-track-detail", isTrackDetail);

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

      const intro = document.querySelector("#content .page_more");
      if (intro && !intro.querySelector(".mizu-mascot-gallery")) {
        intro.querySelector("h1")?.remove();
        const gallery = document.createElement("section");
        gallery.className = "mizu-mascot-gallery";
        gallery.setAttribute("aria-labelledby", "mizu-mascot-gallery-title");
        gallery.innerHTML = `
          <div class="mizu-gallery-heading">
            <div><span>潮汐日志</span><h3 id="mizu-mascot-gallery-title">澪音的三个片段</h3></div>
            <a href="${assetFor("mio-character-sheet.png")}" target="_blank" rel="noopener">查看完整设定图 ↗</a>
          </div>
          <div class="mizu-gallery-grid">
            <figure><img src="${assetFor("mio-illustration-archive.png")}" alt="澪音在潮汐档案室整理音乐记忆" loading="lazy"><figcaption><strong>潮汐档案</strong><span>把旋律收进不会蒸发的水层。</span></figcaption></figure>
            <figure><img src="${assetFor("mio-illustration-stage.png")}" alt="澪音用水波为舞台调音" loading="lazy"><figcaption><strong>舞台调音</strong><span>让每一道水波落在正确的拍点。</span></figcaption></figure>
            <figure><img src="${assetFor("mio-illustration-echo.png")}" alt="澪音读取水球中的数字回声" loading="lazy"><figcaption><strong>数字回声</strong><span>红色节点连接散落的听歌记忆。</span></figcaption></figure>
          </div>
        `;
        intro.appendChild(gallery);
      }
    }

    document.querySelectorAll("#content .track_playback").forEach(button => button.setAttribute("tabindex", "0"));

    if (isAlbum) {
      const abstract = document.querySelector("#content .page_split .abstract");
      if (abstract && !abstract.querySelector(".mizu-eyebrow")) {
        const eyebrow = document.createElement("div");
        eyebrow.className = "mizu-eyebrow";
        eyebrow.textContent = "专辑";
        abstract.insertBefore(eyebrow, abstract.firstChild);

        const totalSeconds = tracks.reduce((sum, track) => sum + (Number(track.dataset.duration) || 0), 0);
        const stats = document.createElement("div");
        stats.className = "mizu-album-stats";
        stats.textContent = `${tracks.length} 首歌曲 · ${Math.floor(totalSeconds / 3600) ? `${Math.floor(totalSeconds / 3600)} 小时 ` : ""}${Math.round((totalSeconds % 3600) / 60)} 分钟`;
        abstract.appendChild(stats);
      }

      const trackContainer = document.querySelector("#content .tracks");
      if (trackContainer && !trackContainer.querySelector(".mizu-track-header")) {
        const header = document.createElement("div");
        header.className = "mizu-track-header";
        header.innerHTML = '<span aria-hidden="true"></span><span class="mizu-track-title-heading"><span>#</span><span>标题</span></span><span>时长</span>';
        trackContainer.insertBefore(header, trackContainer.firstChild);
      }
    }

    const search = document.querySelector(".mizu-search input");
    if (search) search.value = "";
    const searchStatus = document.querySelector(".mizu-search-status");
    if (searchStatus) searchStatus.textContent = "";
    document.body.classList.remove("mizu-search-open", "mizu-no-results");
    document.querySelector("[data-mobile-search]")?.setAttribute("aria-expanded", "false");
    updateActiveNavigation();
    markCurrentTrack();
  }

  function filterPage(query) {
    const normalized = query.trim().toLocaleLowerCase();
    const items = Array.from(document.querySelectorAll("#content .track, #content .release"));
    let visibleCount = 0;
    items.forEach(element => {
      element.classList.toggle("mizu-hidden", Boolean(normalized && !element.textContent.toLocaleLowerCase().includes(normalized)));
      if (!element.classList.contains("mizu-hidden")) visibleCount += 1;
    });
    const count = document.querySelector(".mizu-section-heading > span");
    if (count) count.textContent = normalized ? `${visibleCount} / ${items.length} 张专辑` : `${items.length} 张专辑`;
    const status = document.querySelector(".mizu-search-status");
    if (status) status.textContent = normalized ? `${visibleCount}/${items.length}` : "";
    document.body.classList.toggle("mizu-no-results", Boolean(normalized && items.length && visibleCount === 0));
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
      currentContent.setAttribute("tabindex", "-1");
      currentContent.focus({ preventScroll: true });
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
      const mobileSearchButton = target.closest?.("[data-mobile-search]");
      if (mobileSearchButton) {
        const willOpen = !document.body.classList.contains("mizu-search-open");
        document.body.classList.toggle("mizu-search-open", willOpen);
        mobileSearchButton.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) document.querySelector(".mizu-search input")?.focus();
        return;
      }

      const coverLink = target.closest?.(".cover a.image");
      const coverOverlay = document.querySelector("#content dialog#overlay");
      if (coverLink && coverOverlay && typeof coverOverlay.showModal === "function") {
        event.preventDefault();
        event.stopImmediatePropagation();
        coverOverlay.showModal();
        return;
      }

      const trackButton = target.closest?.(".track_playback");
      if (trackButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const elements = Array.from(document.querySelectorAll("#content .track"));
        const element = trackButton.closest(".track");
        const nextQueue = elements.map(trackFromElement).filter(track => track.src);
        const selected = nextQueue.findIndex(track => track.element === element);
        if (selected >= 0 && currentTrack && nextQueue[selected].src === currentTrack.src) {
          togglePlayback();
          return;
        }
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
      if (event.target.matches('[data-player="progress"]')) {
        audio.currentTime = Number(event.target.value);
        updateRangeFill(event.target, Number(event.target.value), Number(event.target.max));
      }
      if (event.target.matches('[data-player="volume"]')) {
        audio.volume = Number(event.target.value);
        updateRangeFill(event.target, Number(event.target.value));
      }
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
      if (event.key === "Escape" && document.body.classList.contains("mizu-search-open")) {
        document.body.classList.remove("mizu-search-open");
        const mobileSearch = document.querySelector("[data-mobile-search]");
        mobileSearch?.setAttribute("aria-expanded", "false");
        document.querySelector(".mizu-search input")?.blur();
        mobileSearch?.focus();
      }
    });

    window.addEventListener("popstate", () => navigate(window.location.href, false));

    if ("mediaSession" in navigator) {
      [
        ["play", togglePlayback],
        ["pause", togglePlayback],
        ["previoustrack", () => playAdjacent(-1)],
        ["nexttrack", () => playAdjacent(1)]
      ].forEach(([action, handler]) => {
        try { navigator.mediaSession.setActionHandler(action, handler); } catch (_) { /* Unsupported action. */ }
      });
    }
  }

  absolutizeContent(document.querySelector("footer"), window.location.href);
  createMascotLayer();
  createSidebar();
  createToolbar();
  updateRangeFill(document.querySelector('[data-player="volume"]'), 0.9);
  bindEvents();
  enhancePage();
})();
