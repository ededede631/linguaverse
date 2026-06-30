(function () {
  "use strict";

  const VERSION = "20260701b";
  const STORE_KEY = "linguaverse_learning_state_v2";
  const CONTEXT_KEY = "linguaverseCourseContext";
  const FILTER_KEY = "linguaverseCourseLanguageFilter";
  const toastId = "linguaverse-toast";
  const modalId = "linguaverse-modal";
  const langCode = { 英语: "en-US", 日语: "ja-JP", 韩语: "ko-KR" };

  const packs = {
    英语: {
      初级: {
        words: [["hello", "/həˈloʊ/", "你好", "Hello, nice to meet you."], ["family", "/ˈfæməli/", "家庭", "My family is very warm."], ["school", "/skuːl/", "学校", "The school is near my home."], ["teacher", "/ˈtiːtʃər/", "老师", "Our teacher speaks clearly."], ["time", "/taɪm/", "时间", "What time is it now?"]],
        grammar: [["Be 动词", "am/is/are 随主语变化。", "She is a teacher.", "选择正确形式：She ___ a teacher.", ["is", "am", "are", "be"]], ["一般现在时", "表达习惯、事实或经常发生的动作。", "He studies English every day.", "选择正确形式：He ___ English.", ["studies", "study", "studying", "studied"]], ["冠词", "a/an 表泛指，the 表特指。", "I have a book.", "选择正确冠词：___ apple", ["an", "a", "the", "不填"]]],
        speaking: [["Hello, my name is Li Ming. Nice to meet you.", "你好，我叫李明。很高兴认识你。", "name is 可自然连读。"], ["Could you speak more slowly, please?", "请你说慢一点好吗？", "Could you 用升调更礼貌。"]],
        listening: [["Daily greeting", "Good morning. My name is Anna. I study English every day.", "早上好。我叫安娜。我每天学习英语。"], ["Asking time", "Excuse me, what time is the meeting? It starts at half past nine.", "不好意思，会议几点？九点半开始。"]]
      },
      中级: {
        words: [["practice", "/ˈpræktɪs/", "练习", "Practice makes progress."], ["travel", "/ˈtrævl/", "旅行", "We plan to travel next month."], ["restaurant", "/ˈrestərɑːnt/", "餐厅", "The restaurant is busy."], ["meeting", "/ˈmiːtɪŋ/", "会议", "The meeting starts at nine."], ["opinion", "/əˈpɪnjən/", "观点", "What is your opinion?"]],
        grammar: [["一般过去时", "表达过去发生并结束的动作。", "I visited Beijing last year.", "选择正确形式：I ___ a movie yesterday.", ["watched", "watch", "watches", "watching"]], ["一般将来时", "will 或 be going to 表达未来计划。", "We will meet tomorrow.", "选择正确形式：They ___ travel next week.", ["will", "are", "did", "was"]], ["比较级", "比较两者时用比较级。", "This book is easier than that one.", "选择正确形式：English is ___ than before.", ["easier", "easy", "easiest", "more easy"]]],
        speaking: [["In my opinion, daily practice is very important.", "在我看来，每日练习非常重要。", "opinion 重音在第二音节。"], ["I would like to order a cup of coffee.", "我想点一杯咖啡。", "would like to 读得连贯。"]],
        listening: [["Restaurant order", "I would like a sandwich and a cup of tea, please.", "我想要一个三明治和一杯茶。"], ["Travel plan", "We are going to visit the museum tomorrow morning.", "我们明天早上打算参观博物馆。"]]
      },
      高级: {
        words: [["presentation", "/ˌprezənˈteɪʃən/", "演示", "He gave a presentation."], ["discussion", "/dɪˈskʌʃən/", "讨论", "The discussion was helpful."], ["translate", "/trænzˈleɪt/", "翻译", "Translate the sentence naturally."], ["summary", "/ˈsʌməri/", "总结", "Write a short summary."], ["evidence", "/ˈevɪdəns/", "证据", "Give evidence for your opinion."]],
        grammar: [["定语从句", "用 who/which/that 修饰名词。", "This is the book that I bought.", "选择正确关系词：The man ___ called is my teacher.", ["who", "what", "where", "when"]], ["虚拟语气", "表达假设或与事实相反的情况。", "If I were you, I would try again.", "选择正确形式：If I ___ you, I would apologize.", ["were", "am", "was", "be"]]],
        speaking: [["I will give a short presentation about language learning.", "我会做一个关于语言学习的简短演示。", "presentation 重音在第三音节。"], ["From my perspective, fluency comes from consistent practice.", "从我的角度看，流利来自持续练习。", "perspective 重音靠后。"]],
        listening: [["Presentation", "Today I will talk about my language learning experience.", "今天我将谈谈我的语言学习经验。"], ["Culture", "Language is not only words and grammar. It also shows culture.", "语言不只是词汇和语法，它也体现文化。"]]
      }
    },
    日语: {
      初级: {
        words: [["こんにちは", "konnichiwa", "你好", "こんにちは、田中です。"], ["ありがとう", "arigatou", "谢谢", "ありがとうございます。"], ["家族", "kazoku", "家庭", "私の家族は四人です。"], ["学校", "gakkou", "学校", "学校へ行きます。"], ["先生", "sensei", "老师", "田中先生は優しいです。"]],
        grammar: [["です／ます体", "礼貌体，日常和正式场合使用。", "私は学生です。", "选择正确形式：私は日本人___。", ["です", "だ", "である", "でした"]], ["助词「は」", "提示句子主题，读作 wa。", "私は学生です。", "选择正确助词：私___田中です。", ["は", "が", "を", "に"]], ["助词「を」", "标记动作的直接对象。", "本を読みます。", "选择正确助词：日本語___勉強します。", ["を", "は", "が", "に"]]],
        speaking: [["こんにちは、私は李明です。はじめまして。", "你好，我叫李明。初次见面。", "はじめまして 要完整读出。"], ["もう少しゆっくり話してください。", "请再说慢一点。", "ゆっくり 的促音停顿要清楚。"]],
        listening: [["朝の挨拶", "おはようございます。私は田中です。", "早上好。我是田中。"], ["時間を尋ねる", "すみません、今何時ですか。九時半です。", "不好意思，现在几点？九点半。"]]
      },
      中级: {
        words: [["質問", "shitsumon", "问题", "質問があります。"], ["答え", "kotae", "答案", "答えを教えてください。"], ["聞く", "kiku", "听", "音楽を聞きます。"], ["話す", "hanasu", "说", "日本語を話します。"], ["旅行", "ryokou", "旅行", "京都へ旅行しました。"]],
        grammar: [["动词て形", "连接动作、请求或表示状态。", "食べて、寝ます。", "选择正确形式：行___ください。", ["って", "くて", "きて", "いて"]], ["动词た形", "表示过去或完成。", "昨日、映画を見た。", "选择正确形式：食べ___。", ["た", "て", "る", "ない"]], ["可能态", "表示能力或可能性。", "日本語が話せます。", "选择正确形式：漢字が読___。", ["めます", "みます", "まれます", "みたい"]]],
        speaking: [["コーヒーを一杯、お願いします。", "请给我一杯咖啡。", "お願いします 礼貌结尾。"], ["この文法をもう一度説明してください。", "请再解释一下这个语法点。", "説明 读作せつめい。"]],
        listening: [["レストランで", "サンドイッチと紅茶をお願いします。", "请给我三明治和红茶。"], ["旅行の計画", "明日の朝、博物館へ行く予定です。", "明天早上打算去博物馆。"]]
      },
      高级: {
        words: [["敬語", "keigo", "敬语", "敬語は大切です。"], ["発表", "happyou", "发表", "発表の準備をします。"], ["議論", "giron", "讨论", "議論を交わしましょう。"], ["翻訳", "honyaku", "翻译", "この文章を翻訳してください。"], ["経験", "keiken", "经验", "私の経験を話します。"]],
        grammar: [["尊敬语", "抬高对方或第三方动作。", "先生がいらっしゃいます。", "选择正确表达：先生が___。", ["いらっしゃいます", "参ります", "行く", "来る"]], ["谦让语", "降低自己的动作以表示尊敬。", "私が伺います。", "选择正确表达：私が___。", ["伺います", "いらっしゃいます", "来ます", "来られます"]]],
        speaking: [["明日、短い発表をします。", "我明天会做一个简短演示。", "発表 读作はっぴょう。"], ["本日はお時間をいただき、ありがとうございます。", "感谢您今天抽出时间。", "商务敬语要放慢。"]],
        listening: [["発表", "今日は私の語学学習の経験について話します。", "今天我将谈谈我的语言学习经验。"], ["文化", "言語は単語と文法だけではありません。文化も表しています。", "语言不只是词汇和语法，它也体现文化。"]]
      }
    },
    韩语: {
      初级: {
        words: [["안녕하세요", "annyeonghaseyo", "你好", "안녕하세요, 저는 민수입니다."], ["감사합니다", "gamsahamnida", "谢谢", "도와주셔서 감사합니다."], ["가족", "gajok", "家庭", "우리 가족은 네 명입니다."], ["학교", "hakgyo", "学校", "학교에 갑니다."], ["선생님", "seonsaengnim", "老师", "선생님은 친절하십니다."]],
        grammar: [["은/는 主题助词", "은 用于辅音结尾，는 用于元音结尾。", "저는 학생입니다.", "选择正确形式：그 사람___ 선생님입니다。", ["은", "는", "이", "가"]], ["이/가 主语助词", "이 用于辅音结尾，가 用于元音结尾。", "제가 하겠습니다.", "选择正确形式：누가 ___ 왔어요?", ["가", "이", "은", "는"]], ["을/를 宾语助词", "标记动作对象。", "책을 읽습니다.", "选择正确助词：한국어___ 공부합니다。", ["를", "을", "이", "가"]]],
        speaking: [["안녕하세요, 저는 이밍입니다. 처음 뵙겠습니다.", "你好，我叫李明。初次见面。", "처음 뵙겠습니다 要读得恭敬。"], ["조금 더 천천히 말씀해 주세요.", "请你说慢一点。", "천천히 的节奏要均匀。"]],
        listening: [["아침 인사", "안녕하세요. 저는 김민수입니다.", "你好。我是金敏秀。"], ["시간 묻기", "실례합니다, 지금 몇 시입니까?", "不好意思，现在几点？"]]
      },
      中级: {
        words: [["질문", "jilmun", "问题", "질문이 있습니다."], ["답", "dap", "答案", "답을 알려주세요."], ["듣다", "deutda", "听", "음악을 듣습니다."], ["말하다", "malhada", "说", "한국어를 말합니다."], ["여행", "yeohaeng", "旅行", "서울에 여행했습니다."]],
        grammar: [["过去时 -았/었어요", "词干以ㅏ/ㅗ结尾用 -았어요，其余用 -었어요。", "어제 영화를 봤어요.", "选择正确形式：어제 밥을 먹___。", ["었어요", "았어요", "어요", "아요"]], ["将来时 -(으)ㄹ 거예요", "表示未来计划或推测。", "내일 만날 거예요.", "选择正确形式：다음 주에 여행___。", ["할 거예요", "했어요", "해요", "하다"]], ["进行时 -고 있어요", "表示动作正在进行。", "지금 공부하고 있어요.", "选择正确形式：지금 노래를 듣___。", ["고 있어요", "었어요", "아요", "을 거예요"]]],
        speaking: [["커피 한 잔 주세요.", "请给我一杯咖啡。", "주세요 是礼貌请求。"], ["이 문법을 다시 설명해 주세요.", "请再解释一下这个语法点。", "설명해 读得连贯。"]],
        listening: [["식당에서", "샌드위치와 차 한 잔 주세요.", "请给我三明治和一杯茶。"], ["여행 계획", "내일 아침, 박물관에 갈 예정입니다.", "明天早上打算去博物馆。"]]
      },
      高级: {
        words: [["경어", "gyeongeo", "敬语", "경어는 중요합니다."], ["발표", "balpyo", "发表", "발표 준비를 합니다."], ["토론", "toron", "讨论", "토론을 나눕시다."], ["번역", "beonyeok", "翻译", "이 글을 번역해 주세요."], ["경험", "gyeongheom", "经验", "제 경험을 말씀드리겠습니다."]],
        grammar: [["敬语 -시-", "用于抬高主语。", "선생님께서 오십니다.", "选择正确形式：선생님이 가___。", ["십니다", "습니다", "아요", "었어요"]], ["间接引语", "다고 하다 表示转述。", "그는 바쁘다고 했어요.", "选择正确形式：비가 온___ 했어요。", ["다고", "라고", "고", "에게"]]],
        speaking: [["내일 짧은 발표를 하겠습니다.", "我明天会做一个简短演示。", "하겠습니다 是正式表达。"], ["오늘 시간 내 주셔서 감사합니다.", "感谢您今天抽出时间。", "商务敬语要放慢。"]],
        listening: [["발표", "오늘은 제 언어 학습 경험에 대해 말씀드리겠습니다.", "今天我将谈谈我的语言学习经验。"], ["문화", "언어는 단어와 문법만이 아닙니다. 문화도 보여줍니다.", "语言不只是词汇和语法，它也体现文化。"]]
      }
    }
  };

  const spellChars = {
    日语: { 初级: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ"], 中级: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ"], 高级: ["日", "月", "山", "田", "人", "水", "火", "木", "金", "土"] },
    韩语: { 初级: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅎ"], 中级: ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "ㅐ", "ㅔ", "ㅚ", "ㅟ"], 高级: ["각", "난", "달", "물", "학", "한", "글", "말", "집", "책"] },
    英语: { 初级: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), 中级: "abcdefghijklmnopqrstuvwxyz".split(""), 高级: ["th", "sh", "ch", "ph", "tion", "sion", "ough", "able", "ment", "ness"] }
  };

  const videoMap = [
    [/日语.*(五十音|平假名|片假名|入门)/, "BV1Yi4y147FG", "日语零基础入门：五十音、假名、基础词汇与语法"],
    [/日语.*(中级|て形|た形|可能|比较|旅行|购物)/, "BV1Yq4y1B7Mx", "新标准日本语中级：语法与场景会话"],
    [/日语.*(高级|敬语|被动|使役|商务|翻译)/, "BV1KK41167mH", "新标日高级课程：N1与商务日语综合讲解"],
    [/韩语|韩文|한글/, "BV12PoCYEE5n", "韩语全套教程：发音、语法、会话与进阶表达"],
    [/英语.*(字母|发音|26)/, "BV11F411X7d7", "零基础英语26个字母与发音入门"],
    [/英语.*(语法|be动词|现在时|过去时|将来时|冠词|介词|从句|被动|虚拟)/, "BV1YQj76JE3Z", "零基础英语语法系统课程"],
    [/英语|English/, "BV1kC4VeNEHk", "新概念英语第一册零基础入门"]
  ];

  injectStyles();
  registerSW();
  ready(() => {
    patchAll();
    window.addEventListener("hashchange", () => setTimeout(patchAll, 120));
    new MutationObserver(debounce(patchAll, 120)).observe(document.body, { childList: true, subtree: true });
    setInterval(patchAll, 1200);
  });

  function patchAll() {
    cleanCopy();
    patchHome();
    patchCourseFilter();
    patchChapter();
    patchLearnModule();
    patchFooter();
    patchVideos();
    patchDashboard();
    bindButtons();
  }

  function ctx() {
    const text = `${location.hash} ${document.body.innerText || ""}`;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(CONTEXT_KEY) || "{}"); } catch (_) {}
    const language = /韩语|韩文|🇰🇷/.test(text) ? "韩语" : /日语|日本|🇯🇵/.test(text) ? "日语" : /英语|English|🇬🇧|🇺🇸/.test(text) ? "英语" : saved.language || "英语";
    const level = /高级|精通|N1|商务/.test(text) ? "高级" : /中级|进阶|N2|N3/.test(text) ? "中级" : saved.level || "初级";
    const courseTitle = Array.from(document.querySelectorAll("h1,h2")).map(x => x.textContent.trim()).find(x => /英语|日语|韩语|第\s*\d+\s*章/.test(x)) || `${language}${level}课程`;
    const c = { language, level, courseTitle };
    try { localStorage.setItem(CONTEXT_KEY, JSON.stringify(c)); } catch (_) {}
    return c;
  }

  function pack(c) {
    return packs[c.language]?.[c.level] || packs[c.language]?.初级 || packs.英语.初级;
  }

  function getState() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (_) { return {}; }
  }

  function setState(fn) {
    const s = getState();
    s.progress ||= {};
    s.vocab ||= [];
    s.quiz ||= [];
    s.checkins ||= [];
    fn(s);
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
    document.getElementById("lv-dashboard")?.remove();
    patchDashboard();
  }

  function cleanCopy() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      let v = n.nodeValue.replaceAll("静态演示版", "正式学习版").replaceAll("演示数据", "学习数据").replaceAll("Demo", "学习版").replaceAll("demo", "学习版");
      if (v !== n.nodeValue) n.nodeValue = v;
    });
  }

  function patchHome() {
    if (!/^#\/?$/.test(location.hash || "#/")) return;
    document.querySelectorAll("h1,h2,h3").forEach(h => {
      if (/四大互动学习模块/.test(h.textContent)) {
        const section = h.closest("section") || h.parentElement?.parentElement;
        if (section) section.style.display = "none";
      }
    });
    const root = document.querySelector("main") || document.body;
    if (!document.getElementById("lv-position-panel")) {
      root.insertAdjacentHTML("afterbegin", `<section id="lv-position-panel" class="lv-panel lv-hero"><div><span class="lv-chip">能力补强</span><h2>已从展示页升级为轻量学习工具</h2><p>新增本地学习记录、生词本、错题复盘、打卡、章节闭环、触屏手写、移动端优化、离线缓存、隐私与版权说明。账号云同步、AI发音评分、客服、ICP备案和正版内容库仍需要后端与正式运营资质。</p></div><button class="lv-primary" data-lv-open="roadmap">查看升级边界</button></section>`);
    }
    document.querySelectorAll("a,button").forEach(el => {
      if (el.dataset.lvLangEntry) return;
      const text = el.textContent || "";
      const lang = /英语|English|🇬🇧|🇺🇸/.test(text) ? "英语" : /日语|日本|🇯🇵/.test(text) ? "日语" : /韩语|韩国|🇰🇷/.test(text) ? "韩语" : "";
      if (!lang) return;
      el.dataset.lvLangEntry = lang;
      el.addEventListener("click", e => {
        if (!/课程|英语|日语|韩语|English|日本|韩国/.test(text)) return;
        e.preventDefault();
        localStorage.setItem(FILTER_KEY, lang);
        location.hash = "#/courses";
        toast(`已自动筛选${lang}课程。`);
      }, true);
    });
  }

  function patchCourseFilter() {
    if (!/^#\/courses\/?$/.test(location.hash || "")) return;
    const lang = localStorage.getItem(FILTER_KEY) || "";
    if (!lang) return;
    if (!document.getElementById("lv-filter-banner")) {
      const h = Array.from(document.querySelectorAll("h1,h2")).find(x => /课程/.test(x.textContent));
      h?.insertAdjacentHTML("afterend", `<div id="lv-filter-banner" class="lv-panel">当前筛选：${lang}课程 <button class="lv-ghost" data-lv-clear-filter="1">查看全部</button></div>`);
    }
    document.querySelectorAll("article,a,.rounded-2xl,.rounded-3xl").forEach(card => {
      const t = card.innerText || "";
      if (t.length > 900 || !/(英语|日语|韩语|🇬🇧|🇯🇵|🇰🇷)/.test(t)) return;
      const l = /韩语|🇰🇷/.test(t) ? "韩语" : /日语|🇯🇵/.test(t) ? "日语" : /英语|🇬🇧/.test(t) ? "英语" : "";
      if (l && l !== lang) card.style.display = "none";
    });
  }

  function patchChapter() {
    if (!/#\/courses\/\d+\/chapter\/\d+/.test(location.hash)) return;
    const c = ctx(), d = pack(c);
    const root = Array.from(document.querySelectorAll(".container,main,section")).find(x => /学习内容|课后练习|知识点/.test(x.innerText || "")) || document.querySelector("main");
    if (!root || root.dataset.lvChapter === VERSION) return;
    root.dataset.lvChapter = VERSION;
    const knowledge = buildKnowledge(c, root.innerText || "");
    fixCounts(root, knowledge.length, d.words.length, d.grammar.length);
    root.insertAdjacentHTML("beforeend", `<div id="lv-learning-loop" class="lv-panel"><h3>完整学习闭环</h3><div class="lv-flow"><span>预习</span><span>学习</span><span>练习</span><span>测试</span><span>复习</span></div><div class="lv-grid two"><div><h4>知识点（${knowledge.length}个）</h4>${knowledge.map(x => `<p><b>${esc(x[0])}</b>：${esc(x[1])}</p>`).join("")}</div><div><h4>重点词汇（${d.words.length}个）</h4>${d.words.map(w => wordRow(w, c.language)).join("")}</div></div><h4>练习题（${d.grammar.length}道）</h4>${d.grammar.map((g, i) => question(g, i)).join("")}<div class="lv-actions"><button class="lv-primary" data-lv-complete="chapter">标记本章完成</button><button class="lv-ghost" data-lv-open="review">打开复盘</button></div></div>`);
  }

  function fixCounts(root, k, v, e) {
    root.querySelectorAll("p,span,div,h3,h4").forEach(n => {
      const p = n.parentElement?.innerText || "", txt = n.textContent.trim();
      if (/^\d+\s*个$/.test(txt) && /知识点/.test(p)) n.textContent = `${k} 个`;
      if (/^\d+\s*个$/.test(txt) && /重点词汇/.test(p)) n.textContent = `${v} 个`;
      if (/^\d+\s*道$/.test(txt) && /练习题/.test(p)) n.textContent = `${e} 道`;
      if (/共\s*\d+\s*道/.test(txt)) n.textContent = txt.replace(/共\s*\d+\s*道/, `共 ${e} 道`);
    });
  }

  function buildKnowledge(c, text) {
    if (c.language === "英语") return /字母|发音/.test(text) ? [["元音与辅音", "区分 A/E/I/O/U 与常见辅音发音。"], ["清浊辅音", "用声带振动区分 /p/ 与 /b/。"], ["拼读规律", "用字母组合识别常见读音。"]] : [["句子主干", "先找主语和谓语。"], ["时态标志", "通过时间状语判断时态。"], ["错误复盘", "将错题加入复习清单。"]];
    if (c.language === "日语") return /五十音|平假名|片假名/.test(text) ? [["假名笔顺", "按正确笔顺书写假名。"], ["清音浊音", "掌握か/が、た/だ等差异。"], ["长音促音", "长音拉长一拍，促音停顿一拍。"]] : [["助词功能", "判断は、が、を、に、で的作用。"], ["动词变形", "按一类、二类、三类动词分类变形。"], ["敬体与简体", "按场景选择礼貌程度。"]];
    return [["韩文字母结构", "按初声、中声、终声组合。"], ["收音规则", "掌握七个代表收音。"], ["助词选择", "根据前一音节有无收音选 은/는、이/가。"]];
  }

  function patchLearnModule() {
    const h = location.hash || "";
    const module = h.includes("/learn/vocabulary") ? "vocabulary" : h.includes("/learn/grammar") ? "grammar" : h.includes("/learn/speaking") ? "speaking" : h.includes("/learn/listening") ? "listening" : h.includes("/learn/spelling") ? "spelling" : "";
    if (!module) return;
    const c = ctx(), d = pack(c);
    const root = Array.from(document.querySelectorAll(".container,main")).find(x => /单词记忆|语法练习|口语跟读|听力训练|拼写/.test(x.innerText || "")) || document.querySelector("main") || document.body;
    if (root.dataset.lvModule === `${VERSION}-${module}-${c.language}-${c.level}`) return;
    root.dataset.lvModule = `${VERSION}-${module}-${c.language}-${c.level}`;
    root.className = "container mx-auto py-10 max-w-5xl";
    const names = { vocabulary: "单词记忆", grammar: "语法练习", speaking: "口语跟读", listening: "听力训练", spelling: "拼写练习" };
    root.innerHTML = `<div class="lv-module-head"><span class="lv-chip">${c.language} · ${c.level}</span><h1>${names[module]}</h1><p>内容已按语种和阶段区分，并会写入本地学习记录。</p></div>${moduleNav(module)}${renderModule(module, c, d)}`;
    if (module === "spelling") initCanvas(c);
  }

  function moduleNav(active) {
    return [["vocabulary", "单词记忆"], ["grammar", "语法练习"], ["speaking", "口语跟读"], ["listening", "听力训练"], ["spelling", "拼写练习"]].map(([k, n], i) => i === 0 ? `<div class="lv-tabs"><a class="${active === k ? "active" : ""}" href="#/learn/${k}">${n}</a>` : `<a class="${active === k ? "active" : ""}" href="#/learn/${k}">${n}</a>${i === 4 ? "</div>" : ""}`).join("");
  }

  function renderModule(module, c, d) {
    if (module === "vocabulary") return `<div class="lv-grid two">${d.words.map(w => `<div class="lv-card">${wordRow(w, c.language)}<button class="lv-primary" data-lv-speak="${esc(w[0])}" data-lv-lang="${c.language}">人声朗读</button><button class="lv-ghost" data-lv-vocab="${esc(w.join("|"))}">加入生词本</button></div>`).join("")}</div>`;
    if (module === "grammar") return `<div class="lv-list">${d.grammar.map((g, i) => `<div class="lv-card"><h3>${i + 1}. ${esc(g[0])}</h3><p>${esc(g[1])}</p><p class="lv-example">${esc(g[2])}</p>${question(g, i)}</div>`).join("")}</div>`;
    if (module === "speaking") return `<div class="lv-list">${d.speaking.map((s, i) => `<div class="lv-card"><h3>${i + 1}. ${esc(s[0])}</h3><p>${esc(s[1])}</p><p class="lv-tip">发音提示：${esc(s[2])}</p><button class="lv-primary" data-lv-speak="${esc(s[0])}" data-lv-lang="${c.language}">播放原音</button><button class="lv-ghost" data-lv-complete="speaking">标记跟读完成</button></div>`).join("")}</div>`;
    if (module === "listening") return `<div class="lv-list">${d.listening.map((l, i) => `<div class="lv-card"><h3>${i + 1}. ${esc(l[0])}</h3><p class="lv-example">${esc(l[1])}</p><p>${esc(l[2])}</p><button class="lv-primary" data-lv-speak="${esc(l[1])}" data-lv-lang="${c.language}">播放听力</button><button class="lv-ghost" data-lv-open="review">听后复盘</button></div>`).join("")}</div>`;
    return `<div class="lv-card"><div class="lv-spell-layout"><div><h2 id="lv-spell-char"></h2><p id="lv-spell-tip"></p><div class="lv-canvas-wrap"><canvas id="lv-canvas" width="320" height="320"></canvas></div><div class="lv-actions"><button class="lv-primary" id="lv-clear-canvas">清除</button><button class="lv-ghost" id="lv-prev-char">上一个</button><button class="lv-ghost" id="lv-next-char">下一个</button><button class="lv-ghost" id="lv-speak-char">播放发音</button></div></div><div><h3>字符选择</h3><div id="lv-char-grid" class="lv-char-grid"></div></div></div></div>`;
  }

  function wordRow(w) {
    return `<div class="lv-word"><div><b>${esc(w[0])}</b><span>${esc(w[1])}</span></div><p>${esc(w[2])}</p><p class="lv-example">${esc(w[3])}</p></div>`;
  }

  function question(g, i) {
    return `<div class="lv-question"><b>${i + 1}. ${esc(g[3])}</b><div>${g[4].map(o => `<button data-lv-answer="${esc(g[4][0])}" data-lv-choice="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>`;
  }

  function initCanvas(c) {
    const canvas = document.getElementById("lv-canvas");
    if (!canvas) return;
    const chars = spellChars[c.language]?.[c.level] || spellChars[c.language]?.初级 || spellChars.英语.初级;
    let index = 0, drawing = false;
    const grid = document.getElementById("lv-char-grid");
    const ctx2 = canvas.getContext("2d");
    grid.innerHTML = chars.map((ch, i) => `<button data-i="${i}">${esc(ch)}</button>`).join("");
    function clear(withGuide = true) {
      ctx2.clearRect(0, 0, 320, 320);
      ctx2.fillStyle = "#f8fafc"; ctx2.fillRect(0, 0, 320, 320);
      ctx2.strokeStyle = "#dbeafe"; ctx2.beginPath(); ctx2.moveTo(160, 0); ctx2.lineTo(160, 320); ctx2.moveTo(0, 160); ctx2.lineTo(320, 160); ctx2.stroke();
      if (withGuide) { ctx2.fillStyle = "rgba(124,58,237,.16)"; ctx2.font = "180px sans-serif"; ctx2.textAlign = "center"; ctx2.textBaseline = "middle"; ctx2.fillText(chars[index], 160, 170); }
    }
    function show() {
      document.getElementById("lv-spell-char").textContent = chars[index];
      document.getElementById("lv-spell-tip").textContent = `${c.language}${c.level}字符书写：支持触屏和鼠标，先临摹参考，再清除独立书写。`;
      grid.querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === index));
      clear();
    }
    function pos(e) { const r = canvas.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; return { x: (p.clientX - r.left) * 320 / r.width, y: (p.clientY - r.top) * 320 / r.height }; }
    function start(e) { e.preventDefault(); drawing = true; const p = pos(e); ctx2.beginPath(); ctx2.moveTo(p.x, p.y); }
    function move(e) { if (!drawing) return; e.preventDefault(); const p = pos(e); ctx2.strokeStyle = "#111827"; ctx2.lineWidth = 4; ctx2.lineCap = "round"; ctx2.lineJoin = "round"; ctx2.lineTo(p.x, p.y); ctx2.stroke(); }
    function end() { drawing = false; ctx2.beginPath(); }
    canvas.addEventListener("mousedown", start); canvas.addEventListener("mousemove", move); canvas.addEventListener("mouseup", end); canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false }); canvas.addEventListener("touchmove", move, { passive: false }); canvas.addEventListener("touchend", end);
    document.getElementById("lv-clear-canvas").onclick = () => clear(false);
    document.getElementById("lv-prev-char").onclick = () => { index = (index - 1 + chars.length) % chars.length; show(); };
    document.getElementById("lv-next-char").onclick = () => { index = (index + 1) % chars.length; show(); };
    document.getElementById("lv-speak-char").onclick = () => speak(chars[index], c.language);
    grid.onclick = e => { const b = e.target.closest("button"); if (b) { index = Number(b.dataset.i); show(); } };
    show();
  }

  function patchFooter() {
    const entries = { 用户协议: "terms", 隐私政策: "privacy", 版权声明: "copyright", 帮助中心: "help", 联系我们: "contact", 公司介绍: "about" };
    document.querySelectorAll("li,a,button,[data-lv-open]").forEach(el => {
      if (el.dataset.lvBound) return;
      const t = (el.textContent || "").trim();
      const type = el.dataset.lvOpen || entries[t];
      if (!type) return;
      el.dataset.lvBound = "1";
      el.style.cursor = "pointer";
      el.addEventListener("click", e => { e.preventDefault(); openInfo(type); }, true);
    });
  }

  function patchVideos() {
    document.querySelectorAll("iframe").forEach(frame => {
      const src = frame.src || frame.getAttribute("src") || "";
      if (!/youtube|youtu\.be|about:blank/.test(src)) return;
      const text = `${ctx().language} ${ctx().level} ${document.body.innerText || ""}`;
      const found = videoMap.find(([re]) => re.test(text)) || videoMap[videoMap.length - 1];
      const box = frame.parentElement;
      if (!box || box.dataset.lvVideo) return;
      box.dataset.lvVideo = "1";
      frame.remove();
      box.innerHTML = `<iframe class="lv-bili" src="https://player.bilibili.com/player.html?bvid=${found[1]}&autoplay=0&page=1&high_quality=1" allowfullscreen="allowfullscreen" scrolling="no" title="${esc(found[2])}"></iframe><p class="lv-video-note">已替换为国内可访问的 B 站公开播放器：${esc(found[2])}</p>`;
    });
  }

  function patchDashboard() {
    if (document.getElementById("lv-dashboard")) return;
    const s = getState();
    document.body.insertAdjacentHTML("beforeend", `<div id="lv-dashboard"><button id="lv-dashboard-toggle">学习记录</button><div id="lv-dashboard-panel"><h3>本地学习记录</h3><p>已完成：${Object.keys(s.progress || {}).length} 项</p><p>生词本：${(s.vocab || []).length} 个</p><p>打卡：${(s.checkins || []).length} 天</p><div class="lv-actions"><button data-lv-checkin="1">今日打卡</button><button data-lv-open="review">复盘</button><button data-lv-open="privacy">隐私说明</button></div></div></div>`);
    document.getElementById("lv-dashboard-toggle").onclick = () => document.getElementById("lv-dashboard").classList.toggle("open");
  }

  function bindButtons() {
    document.querySelectorAll("[data-lv-speak]").forEach(b => bind(b, "speak", () => speak(b.dataset.lvSpeak, b.dataset.lvLang)));
    document.querySelectorAll("[data-lv-vocab]").forEach(b => bind(b, "vocab", () => addVocab(b.dataset.lvVocab)));
    document.querySelectorAll("[data-lv-complete]").forEach(b => bind(b, "complete", () => complete(b.dataset.lvComplete)));
    document.querySelectorAll("[data-lv-choice]").forEach(b => bind(b, "choice", () => answer(b)));
    document.querySelectorAll("[data-lv-checkin]").forEach(b => bind(b, "check", checkin));
    document.querySelectorAll("[data-lv-clear-filter]").forEach(b => bind(b, "clear", () => { localStorage.removeItem(FILTER_KEY); location.reload(); }));
  }

  function bind(el, name, fn) {
    const key = `lv${name}Bound`;
    if (el.dataset[key]) return;
    el.dataset[key] = "1";
    el.addEventListener("click", fn);
  }

  function speak(text, language) {
    if (!window.speechSynthesis) return toast("当前浏览器不支持语音朗读。");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode[language] || langCode[ctx().language] || "en-US";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  function addVocab(raw) {
    setState(s => { if (!s.vocab.includes(raw)) s.vocab.push(raw); });
    toast("已加入本地生词本。静态版保存在当前浏览器。");
  }

  function complete(type) {
    setState(s => { s.progress[`${location.hash || "home"}:${type}`] = { time: new Date().toISOString(), context: ctx() }; });
    toast("已记录学习进度。本版本为本地保存，跨设备云同步需要后端。");
  }

  function answer(btn) {
    const ok = btn.dataset.lvChoice === btn.dataset.lvAnswer;
    btn.classList.add(ok ? "ok" : "bad");
    setState(s => s.quiz.push({ time: new Date().toISOString(), ok, question: btn.closest(".lv-question")?.innerText || "" }));
    toast(ok ? "回答正确，已计入复盘。" : `答错了，正确答案：${btn.dataset.lvAnswer}。已加入错题复盘。`);
  }

  function checkin() {
    const today = new Date().toISOString().slice(0, 10);
    setState(s => { if (!s.checkins.includes(today)) s.checkins.push(today); });
    toast("今日已打卡。连续打卡统计已保存到本地。");
  }

  function openInfo(type) {
    const s = getState();
    const wrong = (s.quiz || []).filter(x => !x.ok).slice(-5);
    const content = {
      roadmap: "<p>已解决静态站内可落地问题：本地学习记录、生词本、错题复盘、打卡、章节闭环、触屏手写、移动端优化、离线缓存、隐私与版权说明。</p><p>仍需后端才能真正解决：账号登录、云端多端同步、专业客服、AI发音评分、正版海量内容库、ICP备案、教育资质、等保与内容风控。</p>",
      privacy: "<p>当前版本仅使用浏览器 localStorage 保存学习记录、生词、错题和打卡，不上传服务器。清除浏览器数据会删除记录。</p><p>正式运营版本需要账号体系、加密传输、隐私政策、数据导出与注销机制。</p>",
      terms: "<p>本平台当前为学习辅助网站，不承诺等同于多邻国、扇贝、每日英语听力等成熟商业平台。请结合教材、老师或权威资源进行长期学习。</p>",
      copyright: "<p>站内课程文本为自编学习材料。外部视频通过 B 站公开播放器嵌入，不下载、不搬运、不重新分发。若视频方限制播放或下架，页面会显示替代说明。</p>",
      help: "<p>建议流程：选择语言课程 → 学习章节 → 完成练习 → 加入生词 → 做测试 → 次日复习。若页面异常，请强制刷新并清理缓存。</p>",
      contact: "<p>当前没有 7×24 客服系统。正式运营需接入工单、监控告警和故障响应机制。</p>",
      about: "<p>LinguaVerse 当前定位为轻量语言学习工具，已从纯展示页面升级为带本地记录与复盘能力的学习站点。</p>",
      review: `${wrong.length ? wrong.map(x => `<p>${esc(x.question).slice(0, 180)}</p>`).join("") : "<p>暂无错题。完成语法练习后会自动记录。</p>"}<p><b>生词数：</b>${(s.vocab || []).length} 个；<b>完成项：</b>${Object.keys(s.progress || {}).length} 项。</p>`
    }[type] || "<p>内容正在完善。</p>";
    modal(type === "review" ? "学习复盘" : "说明", content);
  }

  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => navigator.serviceWorker.register("/linguaverse/sw.js?v=" + VERSION).catch(() => {}));
  }

  function injectStyles() {
    if (document.getElementById("lv-styles")) return;
    const st = document.createElement("style");
    st.id = "lv-styles";
    st.textContent = `
      html{scroll-behavior:smooth}body{overflow-x:hidden}img,video,iframe{max-width:100%}.container{padding-left:16px!important;padding-right:16px!important}
      .lv-panel,.lv-card{border:1px solid rgba(124,58,237,.14);background:#fff;border-radius:22px;padding:18px;box-shadow:0 10px 30px rgba(15,23,42,.06);margin:16px 0}.lv-hero{display:flex;justify-content:space-between;gap:18px;align-items:center;background:linear-gradient(135deg,#f5f3ff,#ecfeff)}.lv-chip{display:inline-flex;background:#ede9fe;color:#6d28d9;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700}.lv-primary,.lv-ghost,.lv-question button,.lv-tabs a,#lv-dashboard button,.lv-char-grid button{border-radius:14px;border:1px solid #ddd;padding:9px 12px;cursor:pointer;font-weight:700}.lv-primary{background:#7c3aed;color:white;border-color:#7c3aed}.lv-ghost{background:white;color:#334155}.lv-grid{display:grid;gap:14px}.lv-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.lv-list{display:grid;gap:14px}.lv-word b{font-size:22px;display:block}.lv-word span{color:#7c3aed}.lv-example{color:#475569;background:#f8fafc;border-radius:12px;padding:10px}.lv-tip{color:#0369a1;background:#ecfeff;border-radius:12px;padding:10px}.lv-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.lv-tabs a{background:white;color:#334155;text-decoration:none}.lv-tabs a.active{background:#7c3aed;color:white}.lv-flow{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.lv-flow span{background:#f1f5f9;border-radius:999px;padding:8px 12px;font-weight:700}.lv-question div{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.lv-question button.ok{background:#dcfce7;border-color:#22c55e}.lv-question button.bad{background:#fee2e2;border-color:#ef4444}.lv-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.lv-bili{width:100%;height:100%;min-height:320px;border:0}.lv-video-note{font-size:13px;color:#64748b}.lv-module-head h1{font-size:34px;margin:8px 0}.lv-spell-layout{display:grid;grid-template-columns:1fr 260px;gap:18px}.lv-canvas-wrap{width:320px;height:320px;max-width:100%;background:#f8fafc;border:1px solid #dbeafe;border-radius:18px;overflow:hidden}.lv-canvas-wrap canvas{width:100%;height:100%;touch-action:none}.lv-char-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.lv-char-grid button.active{background:#7c3aed;color:white}#lv-dashboard{position:fixed;right:18px;bottom:18px;z-index:99997}#lv-dashboard-toggle{background:#7c3aed;color:white;border:0;box-shadow:0 10px 30px rgba(124,58,237,.35)}#lv-dashboard-panel{display:none;width:260px;background:white;border:1px solid #e2e8f0;border-radius:18px;padding:14px;margin-top:10px;box-shadow:0 20px 60px rgba(15,23,42,.18)}#lv-dashboard.open #lv-dashboard-panel{display:block}#${toastId}{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:99999;background:#111827;color:white;border-radius:999px;padding:11px 16px;opacity:0;transition:.2s;max-width:calc(100vw - 32px)}#${toastId}.show{opacity:1}#${modalId}{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:99998;display:none;place-items:center;padding:20px}#${modalId}.show{display:grid}.lv-modal-card{background:white;border-radius:22px;max-width:620px;width:100%;box-shadow:0 24px 80px rgba(15,23,42,.3);overflow:hidden}.lv-modal-head{display:flex;justify-content:space-between;gap:10px;padding:16px 20px;border-bottom:1px solid #e2e8f0}.lv-modal-body{padding:20px;line-height:1.8}.lv-modal-head button{border:0;background:#7c3aed;color:white;border-radius:999px;padding:8px 14px;cursor:pointer}
      @media(max-width:760px){.lv-hero{display:block}.lv-grid.two,.lv-spell-layout{grid-template-columns:1fr}.lv-module-head h1{font-size:28px}.lv-tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:6px}.lv-tabs a{white-space:nowrap}.lv-canvas-wrap{width:280px;height:280px}.lv-bili{min-height:220px}#lv-dashboard{right:10px;bottom:10px}#lv-dashboard-panel{width:calc(100vw - 32px)}}`;
    document.head.appendChild(st);
  }

  function toast(msg) {
    let t = document.getElementById(toastId);
    if (!t) { t = document.createElement("div"); t.id = toastId; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function modal(title, html) {
    let m = document.getElementById(modalId);
    if (!m) { m = document.createElement("div"); m.id = modalId; m.onclick = e => { if (e.target === m) m.classList.remove("show"); }; document.body.appendChild(m); }
    m.innerHTML = `<div class="lv-modal-card"><div class="lv-modal-head"><h3>${esc(title)}</h3><button id="lv-modal-close">关闭</button></div><div class="lv-modal-body">${html}</div></div>`;
    m.classList.add("show"); document.getElementById("lv-modal-close").onclick = () => m.classList.remove("show");
  }

  function ready(fn) { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn, { once: true }) : fn(); }
  function debounce(fn, delay) { let t = 0; return () => { clearTimeout(t); t = setTimeout(fn, delay); }; }
  function esc(v) { return String(v ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[s])); }
})();
