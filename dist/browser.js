const BROWSER_JS_T = {
    nothingFoundForXxx: query => 'Nothing found for \'{query}\''.replace('{query}',query),
    showingFeaturedItems: 'Showing featured items',
    showingXxxResultsForXxx: (count,query) => 'Showing {count} results for \'{query}\''.replace('{count}',count).replace('{query}',query),
    xxxAndOthers: (xxx,othersLink) => '{xxx} and <a href="{others_link}">others</a>'.replace('{xxx}',xxx).replace('{others_link}',othersLink)
};
const LABEL_MODE = false;
const ARTISTS = [];
const RELEASES = [{coverProcedural:'cover_120.png?0bHd1OefOFI',title:'史替え歌',tracks:[{number:'1.',title:'【赤羽/纳粹德国】存活千年',url:'shitige/1/'},{number:'2.',title:'【洛天依/美国/特朗普】特朗普的随波逐流',url:'shitige/2/'},{number:'3.',title:'【洛天依/中国东北】幽灵东北',url:'shitige/3/'},{number:'4.',title:'【洛天依/冷战东西德】被世界所厌恶。',url:'shitige/4/'},{number:'5.',title:'【洛天依/苏联】说谎的苏维埃',url:'shitige/5/'},{number:'6.',title:'【洛天依/一战】世末歌者',url:'shitige/6/'}],url:'shitige/'},{cover:'cover_160.jpg?Aco7dGBGosc',title:'ProjectMili',tracks:[{number:'1.',title:'HUA YU',url:'projectmili/1/'},{number:'2.',title:'SAIKAI',url:'projectmili/2/'},{number:'3.',title:'鐵花飛',url:'projectmili/3/'},{number:'4.',title:'TIAN TIAN',url:'projectmili/4/'},{number:'5.',title:'In Hell We Live, Lament (feat. KIHOW)',url:'projectmili/5/'},{number:'6.',title:'Through Patches of Violet',url:'projectmili/6/'},{number:'7.',title:'Iron Lotus',url:'projectmili/7/'},{number:'8.',title:'Compass',url:'projectmili/8/'},{number:'9.',title:'Hero',url:'projectmili/9/'},{number:'10.',title:'Children of the City',url:'projectmili/10/'},{number:'11.',title:'Fly, My Wings',url:'projectmili/11/'},{number:'12.',title:'Gone Angels',url:'projectmili/12/'},{number:'13.',title:'1000x1000',url:'projectmili/13/'}],url:'projectmili/'},{cover:'cover_160.jpg?UtlqF0VzBmY',title:'Noteblock',tracks:[{number:'1.',title:'真夜中のドア / Stay With Me',url:'noteblock/1/'}],url:'noteblock/'},{cover:'cover_160.jpg?ibfA_v6YC6c',title:'草薙宁宁（Wonderlands✕Showtime）',tracks:[{number:'1.',title:'神のまにまに',url:'kusanagi-nene-wonderlands-showtime/1/'},{number:'2.',title:'サイバーパンクデッドボーイ',url:'kusanagi-nene-wonderlands-showtime/2/'},{number:'3.',title:'ぼくのかみさま',url:'kusanagi-nene-wonderlands-showtime/3/'},{number:'4.',title:'グッバイ宣言',url:'kusanagi-nene-wonderlands-showtime/4/'},{number:'5.',title:'Mr. Showtime',url:'kusanagi-nene-wonderlands-showtime/5/'},{number:'6.',title:'オールセーブチャレンジ',url:'kusanagi-nene-wonderlands-showtime/6/'},{number:'7.',title:'成敗いたAAAAAす！',url:'kusanagi-nene-wonderlands-showtime/7/'},{number:'8.',title:'どんな結末がお望みだい？',url:'kusanagi-nene-wonderlands-showtime/8/'},{number:'9.',title:'1000年生きてる',url:'kusanagi-nene-wonderlands-showtime/9/'},{number:'10.',title:'箱庭のコラル',url:'kusanagi-nene-wonderlands-showtime/10/'},{number:'11.',title:'スマイル*シンフォニー',url:'kusanagi-nene-wonderlands-showtime/11/'},{number:'12.',title:'88☆彡',url:'kusanagi-nene-wonderlands-showtime/12/'},{number:'13.',title:'転生林檎',url:'kusanagi-nene-wonderlands-showtime/13/'},{number:'14.',title:'サヨナラ天国また来て地獄',url:'kusanagi-nene-wonderlands-showtime/14/'},{number:'15.',title:'チュルリラ・チュルリラ・ダッダッダ!',url:'kusanagi-nene-wonderlands-showtime/15/'},{number:'16.',title:'お気に召すまま',url:'kusanagi-nene-wonderlands-showtime/16/'},{number:'17.',title:'KING',url:'kusanagi-nene-wonderlands-showtime/17/'},{number:'18.',title:'にっこり^^調査隊のテーマ',url:'kusanagi-nene-wonderlands-showtime/18/'},{number:'19.',title:'トンデモワンダーズ',url:'kusanagi-nene-wonderlands-showtime/19/'},{number:'20.',title:'potatoになっていく',url:'kusanagi-nene-wonderlands-showtime/20/'},{number:'21.',title:'強風オールバック',url:'kusanagi-nene-wonderlands-showtime/21/'},{number:'22.',title:'ナンセンス文学',url:'kusanagi-nene-wonderlands-showtime/22/'},{number:'23.',title:'いーあるふぁんくらぶ',url:'kusanagi-nene-wonderlands-showtime/23/'},{number:'24.',title:'ワンスアポンアドリーム',url:'kusanagi-nene-wonderlands-showtime/24/'},{number:'25.',title:'ミラクルペイント',url:'kusanagi-nene-wonderlands-showtime/25/'}],url:'kusanagi-nene-wonderlands-showtime/'},{coverProcedural:'cover_120.png?roeMcx8a0Qw',title:'含哉の美妙嗓音',tracks:[{number:'1.',title:'20260718_130932',url:'hanzai-voice/1/'},{number:'2.',title:'铁花飞',url:'hanzai-voice/2/'}],url:'hanzai-voice/'},{cover:'cover_160.jpg?Tb5eurQNRFI',title:'中考行进',tracks:[{number:'1.',title:'水澄Mizu-中考行进',url:'zhongkao-xingjin/1/'}],url:'zhongkao-xingjin/'},{cover:'cover_159.jpg?Y15k2ZJUK6I',title:'乌云典当记',tracks:[{number:'1.',title:'乌云典当记',url:'wuyun-diandangji/1/'}],url:'wuyun-diandangji/'}];
const browser = document.querySelector('#browser');
const browseButtonFooter = document.querySelector('footer button.browse');
const browseButtonHeader = document.querySelector('header button.browse');

const browseResults = browser.querySelector('#results');
const closeButton = browser.querySelector('button');
const searchField = browser.querySelector('input');
const statusField = browser.querySelector('[role="status"]');

const indexSuffix = window.location.pathname.endsWith('index.html') ? 'index.html' : '';
const rootPrefix = browser.dataset.rootPrefix;

function truncateArtistList(artists, othersLink)  {
    const MAX_CHARS = 40;

    if (artists.length > 2) {
        const nameChars = artists.reduce((sum, artist) => sum + artist.name.length, 0);
        const separatorChars = (artists.length - 1) * 2; // All separating ", " between the artists

        if (nameChars + separatorChars > MAX_CHARS) {
            // Here we have more than two artists, we have a char limit,
            // and we cannot fit all artists within the limit, thus
            // we truncate the list.

            if (LABEL_MODE) {
                // In label mode we show at least one artist, then as many
                // additional ones as fit, e.g. "[artist],[artist] and
                // more"
                let charsUsed = 0;
                const truncatedArtists = artists
                    .filter(artist => {
                        if (charsUsed === 0) {
                            charsUsed += artist.name.length;
                            return true;
                        }

                        charsUsed += artist.name.length;
                        return charsUsed < MAX_CHARS;
                    });

                const rArtists = truncatedArtists
                    .map(artist => {
                        const url = artist.externalPage ?? `${rootPrefix}${artist.url}${indexSuffix}`;
                        return `<a href="${url}">${artist.name}</a>`;
                    })
                    .join(", ");

                return BROWSER_JS_T.xxxAndOthers(rArtists, othersLink);
            }

            // In artist mode we show only "[catalog artist] and others".
            // Our sorting ensures the catalog artist is the first one,
            // so we can just take that.
            const rArtists = `<a href="${rootPrefix}${artists[0].url}${indexSuffix}">${artists[0].name}</a>`;

            return BROWSER_JS_T.xxxAndOthers(rArtists, othersLink);
        }
    }

    return artists
        .map(artist => {
            const url = artist.externalPage ?? `${rootPrefix}${artist.url}${indexSuffix}`;
            return `<a href="${url}">${artist.name}</a>`;
        })
        .join(", ");
}

for (const release of RELEASES) {
    let imgRelease;
    if (release.cover) {
        imgRelease = document.createElement('img');
        imgRelease.src = rootPrefix + release.url + release.cover;
    } else {
        imgRelease = document.createElement('img');
        imgRelease.classList.add('procedural');
        imgRelease.src = rootPrefix + release.url + release.coverProcedural;
    }

    const aText = document.createElement('a');
    aText.href = rootPrefix + release.url + indexSuffix;

    const aImage = aText.cloneNode(true);
    aImage.tabIndex = -1;
    aImage.appendChild(imgRelease);

    aText.dataset.searchable = 'true';
    aText.textContent = release.title;

    const details = document.createElement('div');
    details.appendChild(aText);

    if (release.artists) {
        const artists = document.createElement('div');
        artists.classList.add('artists');
        artists.innerHTML = truncateArtistList(release.artists, `${rootPrefix}${release.url}`);
        details.appendChild(artists);
    }

    const row = document.createElement('div');
    row.appendChild(aImage);
    row.appendChild(details);
    browseResults.appendChild(row);

    for (const track of release.tracks) {
        let imgTrack;
        if (track.cover) {
            imgTrack = document.createElement('img');
            imgTrack.src = rootPrefix + track.url + track.cover;
        } else {
            imgTrack = imgRelease.cloneNode(true);
        }

        const number = document.createElement('span');
        number.classList.add('number');
        number.textContent = track.number;

        const aTitle = document.createElement('a');
        aTitle.href = rootPrefix + track.url + indexSuffix;

        const aImage = aTitle.cloneNode(true);
        aImage.tabIndex = -1;
        aImage.appendChild(imgTrack);

        aTitle.dataset.searchable = 'true';
        aTitle.textContent = track.title;

        const details = document.createElement('div');
        details.appendChild(number);
        details.appendChild(aTitle);

        if (track.artists) {
            const artists = document.createElement('div');
            artists.classList.add('artists');
            artists.innerHTML = truncateArtistList(track.artists, `${rootPrefix}${track.url}`);
            details.appendChild(artists);
        }

        const row = document.createElement('div');
        row.appendChild(aImage);
        row.appendChild(details);
        row.dataset.track = '';
        row.style.setProperty('display', 'none');
        browseResults.appendChild(row);
    }
}

for (const artist of ARTISTS) {
    const aText = document.createElement('a');

    const url = artist.externalPage ?? `${rootPrefix}${artist.url}${indexSuffix}`;
    aText.href = url;

    let imageArtist;
    if (artist.image) {
        imageArtist = document.createElement('img');
        imageArtist.classList.add('crop');
        imageArtist.src = rootPrefix + artist.url + artist.image;
    } else {
        imageArtist = document.createElement('span');
        imageArtist.classList.add('placeholder');
    }

    const aImage = aText.cloneNode(true);
    aImage.tabIndex = -1;
    aImage.appendChild(imageArtist);

    aText.dataset.searchable = 'true';
    aText.textContent = artist.name;

    const details = document.createElement('div');
    details.appendChild(aText);

    const row = document.createElement('div');
    row.appendChild(aImage);
    row.appendChild(details);
    browseResults.appendChild(row);
}

function hideBrowser() {
    const browseButton = browseButtonFooter.ariaExpanded === 'true'
        ? browseButtonFooter
        : browseButtonHeader;

    browser.classList.remove('active');
    browseButton.setAttribute('aria-expanded', 'false');
    searchField.value = '';
    statusField.removeAttribute('aria-label');
    statusField.textContent = '';
    for (const result of browseResults.children) {
        const display = result.dataset.track === undefined;
        result.style.setProperty('display', display ? null : 'none');
    }
    browseButton.focus();
}

function showBrowser(browseButton) {
    browser.classList.add('active');
    browseButton.setAttribute('aria-expanded', 'true');
    searchField.focus();
    statusField.setAttribute('aria-label', BROWSER_JS_T.showingFeaturedItems);
    statusField.textContent = '';
}

// When the browse/search modal is open and focus moves outside the page
// entirely (e.g. to the addressbar) but then re-enters the page, we need
// to make sure that it returns back to the browse/search modal (instead of
// to an obscured element in the main body)
document.body.addEventListener('focusin', event => {
    if (browser.classList.contains('active') && !browser.contains(event.target)) {
        searchField.focus();
    }
});

browser.addEventListener('focusout', event => {
    if (browser.classList.contains('active') && event.relatedTarget && !browser.contains(event.relatedTarget)) {
        hideBrowser();
    }
});

browser.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        event.preventDefault();
        hideBrowser();
    }
});

browseButtonFooter.addEventListener('click', () => showBrowser(browseButtonFooter));
browseButtonHeader.addEventListener('click', () => showBrowser(browseButtonHeader));

closeButton.addEventListener('click', hideBrowser);

searchField.addEventListener('input', () => {
    const query = searchField.value.trim();

    if (query.length) {
        const regexp = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        let shown = 0;

        for (const element of browseResults.children) {
            const title = element.querySelector('[data-searchable]').textContent;
            const display = regexp.test(title);
            element.style.setProperty('display', display ? null : 'none');
            if (display) { shown += 1; }
        }

        if (shown === 0) {
            statusField.removeAttribute('aria-label');
            statusField.textContent = BROWSER_JS_T.nothingFoundForXxx(query);
        } else {
            statusField.setAttribute('aria-label', BROWSER_JS_T.showingXxxResultsForXxx(shown, query));
            statusField.textContent = '';
        }
    } else {
        for (const element of browseResults.children) {
            const display = element.dataset.track === undefined;
            element.style.setProperty('display', display ? null : 'none');
        }

        statusField.setAttribute('aria-label', BROWSER_JS_T.showingFeaturedItems);
        statusField.textContent = '';
    }
});
