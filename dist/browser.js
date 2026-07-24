const BROWSER_JS_T = {
    nothingFoundForXxx: query => 'Nothing found for \'{query}\''.replace('{query}',query),
    showingFeaturedItems: 'Showing featured items',
    showingXxxResultsForXxx: (count,query) => 'Showing {count} results for \'{query}\''.replace('{count}',count).replace('{query}',query),
    xxxAndOthers: (xxx,othersLink) => '{xxx} and <a href="{others_link}">others</a>'.replace('{xxx}',xxx).replace('{others_link}',othersLink)
};
const LABEL_MODE = false;
const ARTISTS = [];
const RELEASES = [{cover:'cover_160.jpg?_ci1GwSqQfI',title:'史替え歌',tracks:[{number:'1.',title:'【赤羽/纳粹德国】存活千年',url:'shitige/1/'},{number:'2.',title:'【洛天依/美国/特朗普】特朗普的随波逐流',url:'shitige/2/'},{number:'3.',title:'【洛天依/中国东北】幽灵东北',url:'shitige/3/'},{number:'4.',title:'【洛天依/冷战东西德】被世界所厌恶。',url:'shitige/4/'},{number:'5.',title:'【洛天依/苏联】说谎的苏维埃',url:'shitige/5/'},{number:'6.',title:'【洛天依/一战】世末歌者',url:'shitige/6/'},{number:'7.',title:'【洛天依/中东】圆形监狱',url:'shitige/7/'},{number:'8.',title:'【洛天依/中东】我还年轻 我还年轻',url:'shitige/8/'}],url:'shitige/'},{cover:'cover_160.jpg?Aco7dGBGosc',title:'ProjectMili',tracks:[{number:'1.',title:'HUA YU',url:'projectmili/1/'},{number:'2.',title:'SAIKAI',url:'projectmili/2/'},{number:'3.',title:'鐵花飛',url:'projectmili/3/'},{number:'4.',title:'TIAN TIAN',url:'projectmili/4/'},{number:'5.',title:'In Hell We Live, Lament (feat. KIHOW)',url:'projectmili/5/'},{number:'6.',title:'Through Patches of Violet',url:'projectmili/6/'},{number:'7.',title:'Iron Lotus',url:'projectmili/7/'},{number:'8.',title:'Compass',url:'projectmili/8/'},{number:'9.',title:'Hero',url:'projectmili/9/'},{number:'10.',title:'Children of the City',url:'projectmili/10/'},{number:'11.',title:'Fly, My Wings',url:'projectmili/11/'},{number:'12.',title:'Gone Angels',url:'projectmili/12/'},{number:'13.',title:'1000x1000',url:'projectmili/13/'}],url:'projectmili/'},{cover:'cover_160.jpg?UtlqF0VzBmY',title:'Noteblock',tracks:[{number:'1.',title:'真夜中のドア / Stay With Me',url:'noteblock/1/'}],url:'noteblock/'},{cover:'cover_160.jpg?ibfA_v6YC6c',title:'草薙宁宁（Wonderlands✕Showtime）',tracks:[{number:'1.',title:'神のまにまに',url:'kusanagi-nene-wonderlands-showtime/1/'},{number:'2.',title:'サイバーパンクデッドボーイ',url:'kusanagi-nene-wonderlands-showtime/2/'},{number:'3.',title:'ぼくのかみさま',url:'kusanagi-nene-wonderlands-showtime/3/'},{number:'4.',title:'グッバイ宣言',url:'kusanagi-nene-wonderlands-showtime/4/'},{number:'5.',title:'Mr. Showtime',url:'kusanagi-nene-wonderlands-showtime/5/'},{number:'6.',title:'オールセーブチャレンジ',url:'kusanagi-nene-wonderlands-showtime/6/'},{number:'7.',title:'成敗いたAAAAAす！',url:'kusanagi-nene-wonderlands-showtime/7/'},{number:'8.',title:'どんな結末がお望みだい？',url:'kusanagi-nene-wonderlands-showtime/8/'},{number:'9.',title:'1000年生きてる',url:'kusanagi-nene-wonderlands-showtime/9/'},{number:'10.',title:'箱庭のコラル',url:'kusanagi-nene-wonderlands-showtime/10/'},{number:'11.',title:'スマイル*シンフォニー',url:'kusanagi-nene-wonderlands-showtime/11/'},{number:'12.',title:'88☆彡',url:'kusanagi-nene-wonderlands-showtime/12/'},{number:'13.',title:'転生林檎',url:'kusanagi-nene-wonderlands-showtime/13/'},{number:'14.',title:'サヨナラ天国また来て地獄',url:'kusanagi-nene-wonderlands-showtime/14/'},{number:'15.',title:'チュルリラ・チュルリラ・ダッダッダ!',url:'kusanagi-nene-wonderlands-showtime/15/'},{number:'16.',title:'お気に召すまま',url:'kusanagi-nene-wonderlands-showtime/16/'},{number:'17.',title:'KING',url:'kusanagi-nene-wonderlands-showtime/17/'},{number:'18.',title:'にっこり^^調査隊のテーマ',url:'kusanagi-nene-wonderlands-showtime/18/'},{number:'19.',title:'トンデモワンダーズ',url:'kusanagi-nene-wonderlands-showtime/19/'},{number:'20.',title:'potatoになっていく',url:'kusanagi-nene-wonderlands-showtime/20/'},{number:'21.',title:'強風オールバック',url:'kusanagi-nene-wonderlands-showtime/21/'},{number:'22.',title:'ナンセンス文学',url:'kusanagi-nene-wonderlands-showtime/22/'},{number:'23.',title:'いーあるふぁんくらぶ',url:'kusanagi-nene-wonderlands-showtime/23/'},{number:'24.',title:'ワンスアポンアドリーム',url:'kusanagi-nene-wonderlands-showtime/24/'},{number:'25.',title:'ミラクルペイント',url:'kusanagi-nene-wonderlands-showtime/25/'}],url:'kusanagi-nene-wonderlands-showtime/'},{coverProcedural:'cover_120.png?roeMcx8a0Qw',title:'含哉の美妙嗓音',tracks:[{number:'1.',title:'20260718_130932',url:'hanzai-voice/1/'},{number:'2.',title:'铁花飞',url:'hanzai-voice/2/'}],url:'hanzai-voice/'},{cover:'cover_160.jpg?Tb5eurQNRFI',title:'中考行进',tracks:[{number:'1.',title:'水澄Mizu-中考行进',url:'zhongkao-xingjin/1/'}],url:'zhongkao-xingjin/'},{coverProcedural:'cover_120.png?h6WnNTfNo1U',title:'YOASOBI',tracks:[{number:'1.',title:'BABY',url:'yoasobi/1/'},{number:'2.',title:'Biri-Biri',url:'yoasobi/2/'},{number:'3.',title:'HEART BEAT',url:'yoasobi/3/'},{number:'4.',title:'New me',url:'yoasobi/4/'},{number:'5.',title:'PLAYERS',url:'yoasobi/5/'},{number:'6.',title:'The Brave',url:'yoasobi/6/'},{number:'7.',title:'Watch me!',url:'yoasobi/7/'},{number:'8.',title:'アイドル',url:'yoasobi/8/'},{number:'9.',title:'あの夢をなぞって',url:'yoasobi/9/'},{number:'10.',title:'アンコール',url:'yoasobi/10/'},{number:'11.',title:'オリオン',url:'yoasobi/11/'},{number:'12.',title:'たぶん',url:'yoasobi/12/'},{number:'13.',title:'大正浪漫',url:'yoasobi/13/'},{number:'14.',title:'怪物',url:'yoasobi/14/'},{number:'15.',title:'群青',url:'yoasobi/15/'},{number:'16.',title:'三原色',url:'yoasobi/16/'},{number:'17.',title:'夜に駆ける',url:'yoasobi/17/'},{number:'18.',title:'勇者',url:'yoasobi/18/'},{number:'19.',title:'優しい彗星',url:'yoasobi/19/'},{number:'20.',title:'祝福',url:'yoasobi/20/'},{number:'21.',title:'ハルカ',url:'yoasobi/21/'},{number:'22.',title:'ハルジオン',url:'yoasobi/22/'},{number:'23.',title:'ミスター',url:'yoasobi/23/'},{number:'24.',title:'もう少しだけ',url:'yoasobi/24/'},{number:'25.',title:'もしも命が描けたら',url:'yoasobi/25/'}],url:'yoasobi/'},{coverProcedural:'cover_120.png?2N9s43kcmd8',title:'音樂工廠Ⅱ～首都',tracks:[{number:'1.',title:'飛車',url:'yinyue-gongchang-ii-shoudu/1/'},{number:'2.',title:'首都 (清唱)',url:'yinyue-gongchang-ii-shoudu/2/'},{number:'3.',title:'母親 I',url:'yinyue-gongchang-ii-shoudu/3/'},{number:'4.',title:'情人眼裡',url:'yinyue-gongchang-ii-shoudu/4/'},{number:'5.',title:'親親表哥',url:'yinyue-gongchang-ii-shoudu/5/'},{number:'6.',title:'母親 II',url:'yinyue-gongchang-ii-shoudu/6/'},{number:'7.',title:'新聞報導',url:'yinyue-gongchang-ii-shoudu/7/'},{number:'8.',title:'首都',url:'yinyue-gongchang-ii-shoudu/8/'},{number:'9.',title:'不在乎',url:'yinyue-gongchang-ii-shoudu/9/'},{number:'10.',title:'愛色',url:'yinyue-gongchang-ii-shoudu/10/'},{number:'11.',title:'只要是愛',url:'yinyue-gongchang-ii-shoudu/11/'},{number:'12.',title:'首都 (清唱) II',url:'yinyue-gongchang-ii-shoudu/12/'},{number:'13.',title:'新生代',url:'yinyue-gongchang-ii-shoudu/13/'}],url:'yinyue-gongchang-ii-shoudu/'},{cover:'cover_159.jpg?Y15k2ZJUK6I',title:'乌云典当记',tracks:[{number:'1.',title:'乌云典当记',url:'wuyun-diandangji/1/'}],url:'wuyun-diandangji/'},{coverProcedural:'cover_120.png?gnu7X7NYrIM',title:'嗵嗵',tracks:[{number:'1.',title:'嗵嗵',url:'tongtong/1/'}],url:'tongtong/'},{coverProcedural:'cover_120.png?GhlrTv5d83Y',title:'美丽岛',tracks:[{number:'1.',title:'伴侣',url:'meilidao/1/'},{number:'2.',title:'美丽岛',url:'meilidao/2/'},{number:'3.',title:'舞女',url:'meilidao/3/'},{number:'4.',title:'手牵手',url:'meilidao/4/'},{number:'5.',title:'初恋的少年家',url:'meilidao/5/'},{number:'6.',title:'啊！停不住的爱人',url:'meilidao/6/'},{number:'7.',title:'网路',url:'meilidao/7/'},{number:'8.',title:'倾城之雨',url:'meilidao/8/'},{number:'9.',title:'往事2000',url:'meilidao/9/'},{number:'10.',title:'绿色恐怖份子',url:'meilidao/10/'},{number:'11.',title:'时光在慢慢消失',url:'meilidao/11/'},{number:'12.',title:'宁静温泉',url:'meilidao/12/'},{number:'13.',title:'变天着花',url:'meilidao/13/'},{number:'14.',title:'阿辉饲了一只狗',url:'meilidao/14/'},{number:'15.',title:'真的假的',url:'meilidao/15/'},{number:'16.',title:'南台湾仔共',url:'meilidao/16/'}],url:'meilidao/'},{coverProcedural:'cover_120.png?MDtSS615ZBQ',title:'恋曲2000',tracks:[{number:'1.',title:'東風',url:'lianqu-2000/1/'},{number:'2.',title:'就這麽樣吧',url:'lianqu-2000/2/'},{number:'3.',title:'五十塊錢',url:'lianqu-2000/3/'},{number:'4.',title:'情絲',url:'lianqu-2000/4/'},{number:'5.',title:'上海之夜',url:'lianqu-2000/5/'},{number:'6.',title:'藍',url:'lianqu-2000/6/'},{number:'7.',title:'臺北紅玫瑰',url:'lianqu-2000/7/'},{number:'8.',title:'天雨',url:'lianqu-2000/8/'},{number:'9.',title:'倒影',url:'lianqu-2000/9/'},{number:'10.',title:'戀曲2000',url:'lianqu-2000/10/'}],url:'lianqu-2000/'},{cover:'cover_160.jpg?eue6H57X0DQ',title:'いよわ',tracks:[{number:'1.',title:'1000年生きてる',url:'iyowa/1/'},{number:'2.',title:'IMAWANOKIWA',url:'iyowa/2/'},{number:'3.',title:'SHIAWASE FOR YOU!',url:'iyowa/3/'},{number:'4.',title:'SLIP',url:'iyowa/4/'},{number:'5.',title:'あだぽしゃ',url:'iyowa/5/'},{number:'6.',title:'うわがき',url:'iyowa/6/'},{number:'7.',title:'きゅうくらりん',url:'iyowa/7/'},{number:'8.',title:'パジャミィ',url:'iyowa/8/'},{number:'9.',title:'バベル',url:'iyowa/9/'},{number:'10.',title:'ピアノフィッシュ(feat. 初音ミク & v_flower)',url:'iyowa/10/'},{number:'11.',title:'マイクロウェイブ (feat. 初音ミク & flower)',url:'iyowa/11/'},{number:'12.',title:'ももいろの鍵',url:'iyowa/12/'},{number:'13.',title:'地球の裏 (feat. 裏命)',url:'iyowa/13/'},{number:'14.',title:'黄金数',url:'iyowa/14/'},{number:'15.',title:'黄金数 (2024 ver.)',url:'iyowa/15/'},{number:'16.',title:'熱異常 (feat. 足立レイ)',url:'iyowa/16/'},{number:'17.',title:'一千光年',url:'iyowa/17/'},{number:'18.',title:'異星にいこうね (feat. 星界)',url:'iyowa/18/'}],url:'iyowa/'},{coverProcedural:'cover_120.png?dIjMh_z8lZ0',title:'皇后大道东',tracks:[{number:'1.',title:'皇后大道东',url:'huanghou-dadao-dong/1/'},{number:'2.',title:'情深意更深',url:'huanghou-dadao-dong/2/'},{number:'3.',title:'出走',url:'huanghou-dadao-dong/3/'},{number:'4.',title:'赤子',url:'huanghou-dadao-dong/4/'},{number:'5.',title:'长路有多远',url:'huanghou-dadao-dong/5/'},{number:'6.',title:'似是故人来',url:'huanghou-dadao-dong/6/'},{number:'7.',title:'天若有情',url:'huanghou-dadao-dong/7/'},{number:'8.',title:'道',url:'huanghou-dadao-dong/8/'},{number:'9.',title:'青春舞曲2000',url:'huanghou-dadao-dong/9/'},{number:'10.',title:'东方之珠',url:'huanghou-dadao-dong/10/'}],url:'huanghou-dadao-dong/'},{coverProcedural:'cover_120.png?xuA1GE1RU7o',title:'爱人同志',tracks:[{number:'1.',title:'暗恋',url:'airen-tongzhi/1/'},{number:'2.',title:'恋曲1990',url:'airen-tongzhi/2/'},{number:'3.',title:'爱人同志',url:'airen-tongzhi/3/'},{number:'4.',title:'你的样子',url:'airen-tongzhi/4/'},{number:'5.',title:'梦',url:'airen-tongzhi/5/'},{number:'6.',title:'黄色脸孔',url:'airen-tongzhi/6/'},{number:'7.',title:'京城夜',url:'airen-tongzhi/7/'},{number:'8.',title:'明天的太阳',url:'airen-tongzhi/8/'},{number:'9.',title:'游戏规则',url:'airen-tongzhi/9/'},{number:'10.',title:'不变的结局',url:'airen-tongzhi/10/'}],url:'airen-tongzhi/'}];
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
