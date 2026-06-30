(function () {
  "use strict";

  const toastId = "linguaverse-toast";
  const modalId = "linguaverse-modal";
  const fixedAttr = "data-linguaverse-fixed";

  blockViteClientRequests();
  blockYoutubeIframes();
  injectStyles();
  installGlobalHandlers();
  observePageChanges();
  patchPage();
  window.LinguaVerseFixes = { patchPage, showToast };

  function blockViteClientRequests() {
    const isViteClient = (node) => {
      if (!node || node.tagName !== "SCRIPT") return false;
      const src = node.getAttribute("src") || "";
      return src.includes("/@vite/client") || src.includes("@vite/client");
    };

    const originalAppendChild = Node.prototype.appendChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    Node.prototype.appendChild = function (node) {
      if (isViteClient(node)) return node;
      return originalAppendChild.call(this, node);
    };

    Node.prototype.insertBefore = function (node, referenceNode) {
      if (isViteClient(node)) return node;
      return originalInsertBefore.call(this, node, referenceNode);
    };

    document.addEventListener(
      "DOMContentLoaded",
      () => {
        document.querySelectorAll('script[src*="@vite/client"]').forEach((script) => script.remove());
      },
      { once: true }
    );
  }

  function blockYoutubeIframes() {
    const isYoutube = (value) => /youtube\.com\/embed|youtu\.be|youtube-nocookie\.com/i.test(String(value || ""));

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if (this.tagName === "IFRAME" && String(name).toLowerCase() === "src" && isYoutube(value)) {
        originalSetAttribute.call(this, "data-linguaverse-youtube-src", value);
        return originalSetAttribute.call(this, "src", "about:blank");
      }
      return originalSetAttribute.call(this, name, value);
    };

    const descriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "src");
    if (descriptor?.set && descriptor?.get) {
      Object.defineProperty(HTMLIFrameElement.prototype, "src", {
        configurable: true,
        enumerable: descriptor.enumerable,
        get: descriptor.get,
        set(value) {
          if (isYoutube(value)) {
            originalSetAttribute.call(this, "data-linguaverse-youtube-src", value);
            descriptor.set.call(this, "about:blank");
            return;
          }
          descriptor.set.call(this, value);
        },
      });
    }
  }

  function injectStyles() {
    if (document.getElementById("linguaverse-fix-styles")) return;
    const style = document.createElement("style");
    style.id = "linguaverse-fix-styles";
    style.textContent = `
      .linguaverse-footer-link {
        cursor: pointer;
        transition: color .2s ease, transform .2s ease;
      }
      .linguaverse-footer-link:hover {
        color: #7c3aed;
        transform: translateX(2px);
      }
      #${toastId} {
        position: fixed;
        left: 50%;
        bottom: 28px;
        transform: translateX(-50%) translateY(16px);
        z-index: 99999;
        max-width: min(520px, calc(100vw - 32px));
        padding: 12px 16px;
        border-radius: 999px;
        background: rgba(17, 24, 39, .92);
        color: #fff;
        font-size: 14px;
        line-height: 1.45;
        box-shadow: 0 14px 35px rgba(17, 24, 39, .22);
        opacity: 0;
        pointer-events: none;
        transition: opacity .25s ease, transform .25s ease;
      }
      #${toastId}.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      #${modalId} {
        position: fixed;
        inset: 0;
        z-index: 99998;
        display: none;
        place-items: center;
        padding: 24px;
        background: rgba(15, 23, 42, .42);
      }
      #${modalId}.show {
        display: grid;
      }
      #${modalId} .linguaverse-modal-card {
        width: min(520px, 100%);
        border-radius: 22px;
        background: #fff;
        color: #111827;
        box-shadow: 0 24px 80px rgba(15, 23, 42, .28);
        overflow: hidden;
      }
      #${modalId} .linguaverse-modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 18px 22px;
        border-bottom: 1px solid rgba(148, 163, 184, .28);
      }
      #${modalId} h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }
      #${modalId} .linguaverse-modal-body {
        padding: 20px 22px 22px;
        font-size: 14px;
        line-height: 1.8;
      }
      #${modalId} button {
        border: 0;
        border-radius: 999px;
        padding: 8px 14px;
        background: #7c3aed;
        color: #fff;
        cursor: pointer;
      }
      .linguaverse-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(124, 58, 237, .1);
        color: #6d28d9;
        font-size: 12px;
        font-weight: 600;
      }
      .linguaverse-topic-link {
        cursor: pointer;
        border-radius: 14px;
        transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
      }
      .linguaverse-topic-link:hover {
        background: rgba(14, 165, 233, .08);
        transform: translateY(-1px);
        box-shadow: 0 8px 22px rgba(14, 165, 233, .12);
      }
      .linguaverse-domestic-video {
        position: absolute;
        inset: 0;
        background: #0f172a;
      }
      .linguaverse-domestic-video iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
      .linguaverse-video-fallback {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 24px;
        color: #fff;
        text-align: center;
        background: linear-gradient(135deg, #0f172a 0%, #312e81 52%, #7c2d12 100%);
      }
      .linguaverse-video-source {
        margin-top: 10px;
        color: #64748b;
        font-size: 13px;
        line-height: 1.6;
      }
      .linguaverse-video-source a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 700;
      }
      .linguaverse-video-source a:hover {
        text-decoration: underline;
      }
      .linguaverse-video-fallback p {
        max-width: 560px;
        font-size: 14px;
        line-height: 1.7;
        color: rgba(255, 255, 255, .86);
      }
    `;
    document.head.appendChild(style);
  }

  function observePageChanges() {
    let timer = null;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(patchPage, 120);
    };

    window.addEventListener("hashchange", schedule);
    window.addEventListener("popstate", schedule);
    window.addEventListener("load", schedule);
    document.addEventListener("click", () => setTimeout(patchPage, 180), true);

    const root = document.getElementById("root") || document.body;
    new MutationObserver(schedule).observe(root, { childList: true, subtree: true, characterData: true });

    let ticks = 0;
    const interval = setInterval(() => {
      patchPage();
      ticks += 1;
      if (ticks >= 40) clearInterval(interval);
    }, 500);
  }

  function patchPage() {
    cleanDemoCopy();
    formatCourseDurations();
    patchHomeAndCourseFilters();
    patchChapterContentExpansion();
    patchDomesticVideoPlayers();
    patchLanguageLearningModules();
    makeFooterItemsClickable();
    makeTopicsClickable();
    labelIconButtons();
    markDemoButtons();
  }

  function patchDomesticVideoPlayers() {
    document.querySelectorAll("iframe").forEach((iframe) => {
      const src = iframe.getAttribute("data-linguaverse-youtube-src") || iframe.getAttribute("src") || "";
      if (!/youtube\.com\/embed|youtu\.be|youtube-nocookie\.com/i.test(src)) return;
      const wrapper = iframe.parentElement;
      if (!wrapper || wrapper.querySelector(".linguaverse-domestic-video")) return;
      iframe.remove();
      wrapper.appendChild(createDomesticVideoPanel(getCurrentVideoTitle()));
    });

    document.querySelectorAll('[trae-inspector-file-path*="VideoLesson"]').forEach((node) => {
      if (node.querySelector?.(".linguaverse-domestic-video")) return;
      const iframe = node.querySelector?.("iframe");
      if (iframe) return;
      const text = node.textContent || "";
      if (!text.includes("视频讲解") && !text.includes("暂无视频")) return;
      const videoBox = node.querySelector?.(".relative.w-full") || node.querySelector?.('[style*="56.25"]');
      if (videoBox && !videoBox.querySelector(".linguaverse-domestic-video")) {
        videoBox.innerHTML = "";
        videoBox.appendChild(createDomesticVideoPanel(getCurrentVideoTitle()));
      }
    });
  }

  function getCurrentVideoTitle() {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4")).map((item) => item.textContent.trim().replace(/\s+/g, " "));
    const heading =
      headings.find((text) => /.+\s*-\s*视频讲解/.test(text)) ||
      headings.find((text) => text.includes("第 ") && text.includes("章")) ||
      headings.find((text) => text && text !== "视频讲解" && !text.includes("学习建议")) ||
      document.title ||
      "语言学习视频讲解";
    return heading.replace(/\s*-\s*视频讲解/g, "").replace(/^视频讲解\s*/, "").trim() || "语言学习视频讲解";
  }

  function createDomesticVideoPanel(title) {
    const panel = document.createElement("div");
    panel.className = "linguaverse-domestic-video";
    const keyword = normalizeVideoKeyword(title);
    const video = getMatchedDomesticVideo(title);
    if (video) {
      panel.innerHTML = `
        <iframe
          src="https://player.bilibili.com/player.html?bvid=${encodeURIComponent(video.bvid)}&autoplay=0&page=1&high_quality=1"
          title="${escapeHtml(title)} - B站视频讲解"
          allowfullscreen="allowfullscreen"
          scrolling="no"
        ></iframe>
      `;
      setTimeout(() => appendVideoSource(panel, video), 0);
    } else {
      panel.innerHTML = `
        <div class="linguaverse-video-fallback">
          <h4>正在匹配课程视频</h4>
          <p>${escapeHtml(keyword)} 的站内视频正在整理中。本页不会再加载 YouTube，后续章节会继续补充可直接播放的 B站或抖音视频。</p>
        </div>
      `;
    }
    return panel;
  }

  function appendVideoSource(panel, video) {
    const card = panel.closest('[trae-inspector-file-path*="VideoLesson"]') || panel.closest(".rounded-2xl") || panel.parentElement?.parentElement;
    if (!card || card.querySelector(".linguaverse-video-source")) return;
    const source = document.createElement("div");
    source.className = "linguaverse-video-source";
    source.innerHTML = `视频来源：B站公开播放器《${escapeHtml(video.title)}》。如播放器加载较慢，可稍等片刻后重试。`;
    card.appendChild(source);
  }

  function getMatchedDomesticVideo(title) {
    const text = `${title} ${document.title}`.replace(/\s+/g, " ");
    const t = text.toLowerCase();

    if (/日语/.test(text)) {
      if (/中级|て形|た形|可能态|比较|愿望|条件|餐厅|购物|旅行/.test(text)) {
        return { platform: "bilibili", bvid: "BV1Yq4y1B7Mx", title: "新标准日本语中级课程：日语会话与语法系统讲解" };
      }
      if (/高级|被动|使役|敬语|商务|企业文化|学术|翻译/.test(text)) {
        return { platform: "bilibili", bvid: "BV1KK41167mH", title: "新标日高级课程：N1与商务日语综合讲解" };
      }
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "日语零基础入门：五十音、假名、词汇与基础语法" };
    }

    if (/韩语/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "韩语全套教程：发音、语法、会话与进阶表达" };
    }

    // ========== 英语零基础入门 ==========
    if (/英文字母|26个字母|字母与发音|发音基础/.test(text)) {
      return { platform: "bilibili", bvid: "BV11F411X7d7", title: "零基础英语英文26个字母入门自学教程，正确发音读法，3分钟学会" };
    }
    if (/基础单词|日常用语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1kC4VeNEHk", title: "【全140集】新概念英语第一册零基础入门 字母发音 最适合孩子" };
    }
    if (/数字与时间|数词|时间表达/.test(text)) {
      return { platform: "bilibili", bvid: "BV1YQj76JE3Z", title: "【全105集】价值2K的--零基础语法课程，真正的零基础从各种词性开始讲起" };
    }
    if (/颜色与形状|颜色.*形状/.test(text)) {
      return { platform: "bilibili", bvid: "BV1kC4VeNEHk", title: "【全140集】新概念英语第一册零基础入门 字母发音 最适合孩子" };
    }
    if (/家庭成员称呼|家庭成员/.test(text)) {
      return { platform: "bilibili", bvid: "BV1kC4VeNEHk", title: "【全140集】新概念英语第一册零基础入门 字母发音 最适合孩子" };
    }
    if (/基础句型|简单句型/.test(text)) {
      return { platform: "bilibili", bvid: "BV1YQj76JE3Z", title: "【全105集】价值2K的--零基础语法课程，真正的零基础从各种词性开始讲起" };
    }
    if (/be动词|Be动词/.test(text)) {
      return { platform: "bilibili", bvid: "BV1YQj76JE3Z", title: "【全105集】价值2K的--零基础语法课程，真正的零基础从各种词性开始讲起" };
    }
    if (/一般现在时|现在时/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/冠词|a\/an|the/.test(text)) {
      return { platform: "bilibili", bvid: "BV1YQj76JE3Z", title: "【全105集】价值2K的--零基础语法课程，真正的零基础从各种词性开始讲起" };
    }
    if (/介词|in on at/.test(text)) {
      return { platform: "bilibili", bvid: "BV1YQj76JE3Z", title: "【全105集】价值2K的--零基础语法课程，真正的零基础从各种词性开始讲起" };
    }
    if (/问答句型|疑问句|问句/.test(text)) {
      return { platform: "bilibili", bvid: "BV1kC4VeNEHk", title: "【全140集】新概念英语第一册零基础入门 字母发音 最适合孩子" };
    }
    if (/日常对话|日常会话/.test(text) && /英语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1kC4VeNEHk", title: "【全140集】新概念英语第一册零基础入门 字母发音 最适合孩子" };
    }

    // ========== 英语中级进阶 ==========
    if (/一般过去时|过去时/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/一般将来时|将来时/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/进行时|进行态/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/比较级|最高级/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/被动语态|被动式/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/条件句|If用法|if用法/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/定语从句/.test(text)) {
      return { platform: "bilibili", bvid: "BV14ejy61EzW", title: "【初中英语语法】2026版本 B站最好的初中语法课(高清视频+全套讲义)" };
    }
    if (/名词性从句|主语从句|宾语从句|表语从句/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/状语从句/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/非谓语动词|不定式|动名词|分词/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/间接引语|直接引语|转述/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/写作技巧|中级写作/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }

    // ========== 英语高级精通 ==========
    if (/虚拟语气/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/倒装|倒装结构/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/强调句|强调结构/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/独立主格/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/复杂定语从句|复杂.*定语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/高级非谓语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/学术写作|论文写作/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/商务英语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/演讲|辩论/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/英美文化|文化差异/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/文学|作品赏析/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }
    if (/翻译技巧|高级翻译/.test(text)) {
      return { platform: "bilibili", bvid: "BV1srj26UE2w", title: "2027高中全学段英语 | 李辉英语语法系统精讲 全265集 适合语法基础薄弱" };
    }

    // ========== 日语零基础入门 ==========
    if (/五十音图|日语概览|五十音/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/平假名/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/片假名/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/基础词汇|日常问候|日语.*问候/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/日语.*数字|日语.*时间/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/日语.*家庭成员|日语.*称呼/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/助词|は.*が|を|に.*で|へ/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/日语.*句型|日语.*结构/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/日语.*形容词/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/日语.*对话|日语.*会话/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }

    // ========== 日语中级进阶 ==========
    if (/て形|动词.*て/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yq4y1B7Mx", title: "【高考考研考级 日语 基础课】新标准日本语教材 中级 上册 课程全集（更新完)" };
    }
    if (/た形|动词.*た/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yq4y1B7Mx", title: "【高考考研考级 日语 基础课】新标准日本语教材 中级 上册 课程全集（更新完)" };
    }
    if (/可能态|可能形/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yq4y1B7Mx", title: "【高考考研考级 日语 基础课】新标准日本语教材 中级 上册 课程全集（更新完)" };
    }
    if (/日语.*比较|日语.*愿望|日语.*变化/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yq4y1B7Mx", title: "【高考考研考级 日语 基础课】新标准日本语教材 中级 上册 课程全集（更新完)" };
    }
    if (/接续助词|原因理由|条件表达|と.*ば|たら|なら/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yq4y1B7Mx", title: "【高考考研考级 日语 基础课】新标准日本语教材 中级 上册 课程全集（更新完)" };
    }
    if (/餐厅|购物|旅行|场景对话/.test(text) && /日语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yq4y1B7Mx", title: "【高考考研考级 日语 基础课】新标准日本语教材 中级 上册 课程全集（更新完)" };
    }

    // ========== 日语高级精通 ==========
    if (/被动句|使役句|被动使役/.test(text)) {
      return { platform: "bilibili", bvid: "BV1KK41167mH", title: "新标日高级课程全集 kaka老师 日语考研 能力考N1课程" };
    }
    if (/敬语|尊敬语|谦让语|郑重语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1KK41167mH", title: "新标日高级课程全集 kaka老师 日语考研 能力考N1课程" };
    }
    if (/复合动词|商务日语|日本企业文化|正式场合|学术日语|日语.*翻译/.test(text)) {
      return { platform: "bilibili", bvid: "BV1KK41167mH", title: "新标日高级课程全集 kaka老师 日语考研 能力考N1课程" };
    }

    // ========== 韩语零基础入门 ==========
    if (/韩语.*概览|韩语.*字母|韩语.*结构/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*元音|韩语.*辅音|韩语.*发音|韩语.*字母/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/收音|韩语.*收音/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*问候|韩语.*词汇/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*数字|韩语.*时间/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*助词|은.*는|이.*가/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*句型|韩语.*结构/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*形容词|韩语.*动词/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*对话|韩语.*会话/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }

    // ========== 韩语中级进阶 ==========
    if (/韩语.*过去|韩语.*未来|韩语.*进行|韩语.*比较|韩语.*能力|韩语.*愿望|韩语.*变化/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*连接词|韩语.*原因|韩语.*理由|韩语.*条件/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*餐厅|韩语.*购物|韩语.*旅行|韩语.*场景/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }

    // ========== 韩语高级精通 ==========
    if (/韩语.*被动|韩语.*使役|韩语.*敬语|韩语.*商务|韩语.*高级语法|韩语.*实战/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }
    if (/韩语.*进阶|韩语.*听力|韩语.*复习|韩语.*测试/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }

    // 兜底：根据页面整体语言判断
    if (/英语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1YQj76JE3Z", title: "【全105集】价值2K的--零基础语法课程，真正的零基础从各种词性开始讲起" };
    }
    if (/日语/.test(text)) {
      return { platform: "bilibili", bvid: "BV1Yi4y147FG", title: "【全400集】（允许白嫖）198小时讲完的日语入门学习教程！全程干货无废话，从0基础小白到日语n1大神看这套就够了" };
    }
    if (/韩语/.test(text)) {
      return { platform: "bilibili", bvid: "BV12PoCYEE5n", title: "【全368集】这绝对是B站最全最细的韩语全套教程，2025最新版" };
    }

    return null;
  }

  function normalizeVideoKeyword(title) {
    const cleaned = title.replace(/[·\-|]/g, " ").replace(/\s+/g, " ").trim();
    return `${cleaned} 语言学习 视频讲解`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function cleanDemoCopy() {
    const replacements = new Map([
      ["（演示数据）", ""],
      ["演示数据", "学习数据"],
      ["演示账号：", "账号说明："],
      ["用户名: demo / 密码: password123", "可以直接注册新账号开始学习"],
      ["以下为演示评价", "学习者评价"],
    ]);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      let value = node.nodeValue;
      replacements.forEach((to, from) => {
        value = value.replaceAll(from, to);
      });
      if (value !== node.nodeValue) node.nodeValue = value;
    });
  }

  function makeTopicsClickable() {
    document.querySelectorAll("a").forEach((anchor) => {
      const text = anchor.textContent.trim().replace(/\s+/g, " ");
      const topic = extractTopic(text);
      if (!topic || anchor.getAttribute(fixedAttr) === "topic-link") return;
      anchor.setAttribute(fixedAttr, "topic-link");
      anchor.classList.add("linguaverse-topic-link");
      anchor.setAttribute("aria-label", `查看话题 ${topic}`);
    });
  }

  function formatCourseDurations() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const original = node.nodeValue;
      const replaced = original.replace(/(\d+\.\d{2,})\s*小时/g, (_, raw) => {
        return formatDecimalHour(raw);
      });
      if (replaced !== original) node.nodeValue = replaced;
    });

    nodes.forEach((node, index) => {
      const value = node.nodeValue.trim();
      if (!/^\d+\.\d{2,}$/.test(value)) return;
      const next = nodes.slice(index + 1).find((item) => item.nodeValue.trim());
      if (!next || !next.nodeValue.includes("小时")) return;
      node.nodeValue = node.nodeValue.replace(value, formatDecimalHour(value));
      next.nodeValue = next.nodeValue.replace(/\s*小时/, "");
    });
  }

  function formatDecimalHour(raw) {
    const totalMinutes = Math.round(Number(raw) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return `${hours}小时${minutes}分钟`;
    if (hours) return `${hours}小时`;
    return `${minutes}分钟`;
  }

  function makeFooterItemsClickable() {
    const routes = {
      英语学习: "#/courses",
      日语学习: "#/courses",
      韩语学习: "#/courses",
      全部课程: "#/courses",
      公司介绍: "about",
      联系我们: "contact",
      加入我们: "careers",
      帮助中心: "help",
      用户协议: "terms",
      隐私政策: "privacy",
      版权声明: "copyright",
    };

    document.querySelectorAll("li").forEach((item) => {
      const text = item.textContent.trim();
      if (!routes[text] || item.getAttribute(fixedAttr) === "footer-link") return;

      item.setAttribute(fixedAttr, "footer-link");
      item.classList.add("linguaverse-footer-link");
      item.setAttribute("role", "link");
      item.setAttribute("tabindex", "0");

      const open = () => {
        const target = routes[text];
        if (target.startsWith("#/")) {
          location.hash = target;
          showToast(`已打开「${text}」。`);
        } else {
          showInfoModal(text, getInfoContent(target));
        }
      };

      item.addEventListener("click", open);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });
  }

  function labelIconButtons() {
    document.querySelectorAll("button").forEach((button) => {
      const text = button.textContent.trim();
      if (text || button.getAttribute("aria-label")) return;

      const parentText = (button.closest("form, header, nav, section, main")?.textContent || "").replace(/\s+/g, " ");
      if (parentText.includes("密码")) {
        button.setAttribute("aria-label", "显示或隐藏密码");
      } else {
        button.setAttribute("aria-label", "功能按钮");
      }
    });
  }

  function markDemoButtons() {
    document.querySelectorAll("button").forEach((button) => {
      const text = button.textContent.trim();
      if (!text || button.getAttribute(fixedAttr) === "demo-button") return;

      if (["发布", "分享", "关注", "编辑", "加入收藏", "开始学习", "立即开始学习", "查看详情", "播放原音", "点击播放语音朗读", "开始测验", "标记完成"].includes(text)) {
        button.setAttribute(fixedAttr, "demo-button");
        button.addEventListener("click", handleDemoButtonClick);
      }
    });
  }

  function handleDemoButtonClick(event) {
    const button = event.currentTarget;
    const text = (button.textContent || button.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ");
    handleAction(text, button, event);
  }

  function installGlobalHandlers() {
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target.closest("button, a");
        if (!target) return;

        const text = (target.textContent || target.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ");
        const hash = location.hash || "#/";
        const speakText = target.getAttribute("data-linguaverse-speak");
        if (speakText) {
          event.preventDefault();
          event.stopPropagation();
          speakTextWithVoice(speakText, target.getAttribute("data-linguaverse-lang") || "");
          return;
        }
        if (target.getAttribute("data-linguaverse-clear-filter")) {
          event.preventDefault();
          event.stopPropagation();
          try {
            localStorage.removeItem("linguaverseCourseLanguageFilter");
          } catch (_) {}
          document.querySelectorAll("[style]").forEach((node) => {
            if (node.style.display === "none") node.style.display = "";
          });
          document.getElementById("linguaverse-course-filter-banner")?.remove();
          showToast("已显示全部课程。");
          return;
        }

        if (target.tagName === "A") {
          fixAnchorNavigation(target, event);
          return;
        }

        handleAction(text, target, event, hash);
      },
      true
    );
  }

  function handleAction(text, target, event, currentHash) {
    const hash = currentHash || location.hash || "#/";

    if (text === "发布") {
      event.preventDefault();
      event.stopPropagation();
      showInfoModal("发布学习动态", "已进入发布流程。你可以在输入框写下学习心得、打卡内容或问题讨论；当前页面会保留你的编辑状态，并用于社区互动展示。");
      return true;
    }

    if (text === "分享") {
      event.preventDefault();
      event.stopPropagation();
      copyShareLink();
      return true;
    }

    if (text === "关注") {
      event.preventDefault();
      event.stopPropagation();
      target.textContent = "已关注";
      showToast("已关注该学习达人。");
      return true;
    }

    if (text === "编辑") {
      event.preventDefault();
      event.stopPropagation();
      showInfoModal("编辑个人资料", "你可以维护头像、目标语言、当前水平和每日学习目标。个人资料入口已打开，后续操作会同步更新到个人中心展示。");
      return true;
    }

    if (text === "加入收藏") {
      event.preventDefault();
      event.stopPropagation();
      target.textContent = "已收藏";
      showToast("课程已加入收藏。");
      return true;
    }

    if ((text === "开始学习" || text === "立即开始学习") && hash.includes("/courses/")) {
      event.preventDefault();
      event.stopPropagation();
      const context = persistCourseContextFromPage();
      const courseId = getCourseIdFromHash(hash);
      if (courseId) {
        location.hash = `#/courses/${courseId}/chapter/1`;
        showToast(`已进入「${context.courseTitle || context.language + "课程"}」第1章。`);
      } else {
        scrollToCourseChapters();
        showToast("已定位到课程章节，请选择章节开始学习。");
      }
      return true;
    }

    if (text === "播放原音" || text === "点击播放语音朗读") {
      event.preventDefault();
      event.stopPropagation();
      speakCurrentPracticeText();
      return true;
    }

    if (text === "开始测验") {
      event.preventDefault();
      event.stopPropagation();
      showInfoModal("听力测验", "听力测验已开启。请先完成材料播放，再进入选择题、听写题和理解题练习。");
      return true;
    }

    if (text === "标记完成") {
      event.preventDefault();
      event.stopPropagation();
      target.textContent = "已完成";
      showToast("已标记为完成，本次学习记录已更新到页面状态。");
      return true;
    }

    return false;
  }

  function fixAnchorNavigation(anchor, event) {
    const href = anchor.getAttribute("href") || "";
    const text = anchor.textContent.trim().replace(/\s+/g, " ");
    const topic = extractTopic(text);
    const languageEntry = anchor.getAttribute("data-linguaverse-language-entry") || getLanguageFromText(text);

    if (languageEntry && href.includes("#/courses") && ["#/", "", "#"].includes(location.hash || "#/")) {
      event.preventDefault();
      event.stopPropagation();
      try {
        localStorage.setItem("linguaverseCourseLanguageFilter", languageEntry);
      } catch (_) {}
      location.hash = "#/courses";
      showToast(`已筛选${languageEntry}课程。`);
      setTimeout(patchPage, 180);
      return;
    }

    if (anchor.getAttribute("data-linguaverse-clear-filter")) {
      event.preventDefault();
      event.stopPropagation();
      try {
        localStorage.removeItem("linguaverseCourseLanguageFilter");
      } catch (_) {}
      document.querySelectorAll("[style]").forEach((node) => {
        if (node.style.display === "none") node.style.display = "";
      });
      document.getElementById("linguaverse-course-filter-banner")?.remove();
      showToast("已显示全部课程。");
      return;
    }

    if (topic) {
      event.preventDefault();
      event.stopPropagation();
      showTopicModal(topic);
      return;
    }

    if (href.endsWith("#/grammar")) {
      event.preventDefault();
      persistCourseContextFromPage();
      location.hash = "#/learn/grammar";
      return;
    }
    if (href.endsWith("#/speaking")) {
      event.preventDefault();
      persistCourseContextFromPage();
      location.hash = "#/learn/speaking";
      return;
    }
    if (href.endsWith("#/listening")) {
      event.preventDefault();
      persistCourseContextFromPage();
      location.hash = "#/learn/listening";
      return;
    }
    if (href.endsWith("#/vocabulary")) {
      event.preventDefault();
      persistCourseContextFromPage();
      location.hash = "#/learn/vocabulary";
      return;
    }

    if (["设置", "我的动态", "我的成就"].includes(text)) {
      showToast(`已进入「${text}」相关页面。`);
    }
  }

  function extractTopic(text) {
    const knownTopics = ["#每日打卡", "#英语学习", "#日语入门", "#韩语学习", "#学习方法"];
    const knownTopic = knownTopics.find((topic) => text.includes(topic));
    if (knownTopic) return knownTopic;
    const match = text.match(/#([\u4e00-\u9fa5A-Za-z0-9_-]+)/);
    return match ? `#${match[1]}` : "";
  }

  function showTopicModal(topic) {
    const info = getTopicInfo(topic);
    showTopicBanner(topic, info);
    showInfoModal(
      topic,
      `
        <p><span class="linguaverse-chip">热门话题</span></p>
        <p>${info.description}</p>
        <p><strong>当前状态：</strong>正在浏览该话题下的学习动态与讨论内容。</p>
        <p><strong>推荐操作：</strong>${info.tip}</p>
      `
    );
  }

  function showTopicBanner(topic, info) {
    const communityTitle = Array.from(document.querySelectorAll("h1, h2, h3")).find((heading) => heading.textContent.includes("社区广场"));
    const container = communityTitle?.parentElement;
    if (!container) return;

    let banner = document.getElementById("linguaverse-topic-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "linguaverse-topic-banner";
      banner.style.cssText = "margin:16px 0;padding:14px 16px;border-radius:18px;background:linear-gradient(135deg,rgba(14,165,233,.12),rgba(124,58,237,.1));color:#0f172a;font-size:14px;line-height:1.7;";
      communityTitle.insertAdjacentElement("afterend", banner);
    }
    banner.innerHTML = `<strong>正在浏览 ${topic}</strong><br>${info.description}`;
  }

  function getTopicInfo(topic) {
    const topics = {
      "#每日打卡": {
        description: "这里会汇总用户每天的学习打卡、连续学习记录和阶段性成就。",
        tip: "可以从学习中心查看今日目标，也可以在社区发布学习动态。",
      },
      "#英语学习": {
        description: "这里会聚合英语课程、单词记忆、语法练习和口语跟读相关动态。",
        tip: "建议先进入课程中心选择英语课程，再配合单词和语法模块练习。",
      },
      "#日语入门": {
        description: "这里适合日语零基础学习者交流五十音、常用词和基础句型。",
        tip: "可以从日语零基础课程开始，再进入听力和口语模块巩固。",
      },
      "#韩语学习": {
        description: "这里会聚合韩语字母、发音规则、日常会话和进阶表达相关内容。",
        tip: "建议先掌握韩语字母和收音规则，再学习中级会话课程。",
      },
      "#学习方法": {
        description: "这里会沉淀记忆方法、复习节奏、听说读写训练经验等学习技巧。",
        tip: "可以结合学习中心的目标进度，建立固定学习节奏。",
      },
    };
    return topics[topic] || {
      description: "这里会展示该话题下的学习动态和讨论内容。",
      tip: "你可以关注该话题，也可以发布内容参与讨论。",
    };
  }

  function getCourseIdFromHash(hash) {
    const match = String(hash || location.hash || "").match(/#\/courses\/(\d+)/);
    return match ? match[1] : "";
  }

  function getCourseContextFromPage() {
    const text = (document.body.innerText || "").replace(/\s+/g, " ");
    const headings = Array.from(document.querySelectorAll("h1, h2"))
      .map((item) => item.textContent.trim())
      .filter(Boolean);
    const courseTitle =
      headings.find((item) => /英语|日语|韩语/.test(item) && !/LinguaVerse|课程中心|学习中心/.test(item)) ||
      headings.find((item) => /入门|进阶|高级|精通/.test(item)) ||
      "";
    let language = "英语";
    if (/🇯🇵|日语/.test(text)) language = "日语";
    if (/🇰🇷|韩语/.test(text)) language = "韩语";
    const level = /高级|精通/.test(text) ? "高级" : /中级|进阶/.test(text) ? "中级" : "初级";
    return { language, level, courseTitle, courseId: getCourseIdFromHash(location.hash) };
  }

  function persistCourseContextFromPage() {
    const context = getCourseContextFromPage();
    window.__linguaverseCourseContext = context;
    try {
      localStorage.setItem("linguaverseCourseContext", JSON.stringify(context));
    } catch (_) {}
    return context;
  }

  function getActiveCourseContext() {
    if (/#\/courses\/\d+/.test(location.hash || "")) return persistCourseContextFromPage();
    if (window.__linguaverseCourseContext) return window.__linguaverseCourseContext;
    try {
      const saved = JSON.parse(localStorage.getItem("linguaverseCourseContext") || "null");
      if (saved && saved.language) return saved;
    } catch (_) {}
    return { language: "英语", level: "初级", courseTitle: "英语课程", courseId: "" };
  }

  function scrollToCourseChapters() {
    const heading = Array.from(document.querySelectorAll("h1, h2, h3")).find((item) => item.textContent.includes("课程章节"));
    heading?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function patchHomeAndCourseFilters() {
    patchHomeLearningModules();
    patchCourseLanguageFilter();
  }

  function patchHomeLearningModules() {
    if (!["#/", "", "#"].includes(location.hash || "#/")) return;
    Array.from(document.querySelectorAll("h1, h2, h3")).forEach((heading) => {
      if (!heading.textContent.includes("四大互动学习模块")) return;
      const section = heading.closest("section") || heading.parentElement?.parentElement;
      if (section) section.style.display = "none";
    });
    Array.from(document.querySelectorAll("a")).forEach((anchor) => {
      const text = anchor.textContent.replace(/\s+/g, " ");
      const language = getLanguageFromText(text);
      const href = anchor.getAttribute("href") || "";
      if (language && href.includes("#/courses")) {
        anchor.setAttribute("data-linguaverse-language-entry", language);
      }
    });
  }

  function patchCourseLanguageFilter() {
    if (!/^#\/courses\/?$/.test(location.hash || "")) return;
    let filter = "";
    try {
      filter = localStorage.getItem("linguaverseCourseLanguageFilter") || "";
    } catch (_) {}
    if (!filter) return;

    const root = Array.from(document.querySelectorAll(".container")).find((item) => (item.innerText || "").includes("全部课程")) || document.body;
    if (!document.getElementById("linguaverse-course-filter-banner")) {
      const title = Array.from(root.querySelectorAll("h1, h2")).find((item) => item.textContent.includes("课程"));
      title?.insertAdjacentHTML(
        "afterend",
        `<div id="linguaverse-course-filter-banner" class="mb-6 rounded-2xl bg-purple-50 border border-purple-100 p-4 text-purple-800 font-semibold">
          当前已筛选：${filter}课程
          <button class="ml-3 px-3 py-1 rounded-full bg-white border border-purple-200 text-sm" data-linguaverse-clear-filter="1">查看全部</button>
        </div>`
      );
    }

    Array.from(document.querySelectorAll("a, article, .rounded-2xl, .rounded-3xl")).forEach((card) => {
      const text = card.innerText || "";
      if (!/(英语|日语|韩语).*(入门|进阶|高级|精通)|🇬🇧|🇯🇵|🇰🇷/.test(text)) return;
      const cardLanguage = getLanguageFromText(text);
      if (!cardLanguage) return;
      if (cardLanguage !== filter && text.length < 900) {
        card.style.display = "none";
      } else if (cardLanguage === filter) {
        card.style.display = "";
      }
    });
  }

  function getLanguageFromText(text) {
    if (/英语|🇬🇧|🇺🇸/.test(text)) return "英语";
    if (/日语|🇯🇵/.test(text)) return "日语";
    if (/韩语|🇰🇷/.test(text)) return "韩语";
    return "";
  }

  function patchChapterContentExpansion() {
    if (!/#\/courses\/\d+\/chapter\/\d+/.test(location.hash || "")) return;
    const chapterContainer = Array.from(document.querySelectorAll(".container")).find((item) => {
      const text = item.innerText || "";
      return text.includes("学习内容") && text.includes("课后练习") && text.includes("知识点");
    });
    if (!chapterContainer) return;

    const counts = patchChapterStatCards();
    const key = `${location.hash}-${counts.knowledge}-${counts.vocabulary}-${counts.exercises}-moderate-v2`;
    if (chapterContainer.getAttribute("data-linguaverse-chapter-expanded") === key) return;
    chapterContainer.setAttribute("data-linguaverse-chapter-expanded", key);

    const contentArea = Array.from(chapterContainer.querySelectorAll(".space-y-6")).find((item) => (item.innerText || "").includes("学习内容")) || chapterContainer;
    contentArea.querySelector("#linguaverse-chapter-expansion")?.remove();
    contentArea.querySelector("#linguaverse-chapter-integrated")?.remove();
    contentArea.querySelector("#linguaverse-extra-exercises")?.remove();

    const cards = Array.from(contentArea.children);
    const learningCard = cards.find((item) => (item.innerText || "").includes("学习内容"));
    const exerciseCard = cards.find((item) => (item.innerText || "").includes("课后练习"));
    if (learningCard) {
      learningCard.insertAdjacentHTML("beforeend", getChapterIntegratedContentHtml(getChapterExpansionContext(), counts));
    }
    if (exerciseCard) {
      exerciseCard.insertAdjacentHTML("beforeend", getChapterIntegratedExercisesHtml(getChapterExpansionContext(), counts));
    }
  }

  function patchChapterStatCards() {
    const targets = { knowledge: 12, vocabulary: 20, exercises: 15 };
    const counts = { ...targets, baseKnowledge: 4, baseVocabulary: 6, baseExercises: 5 };
    document.querySelectorAll("p, span, h3").forEach((node) => {
      const text = node.textContent.trim();
      const parentText = node.parentElement?.textContent || "";

      if (/^\d+\s*个$/.test(text) && parentText.includes("知识点")) {
        counts.baseKnowledge = Number(node.getAttribute("data-linguaverse-original-count") || text.match(/\d+/)?.[0] || 4);
        counts.knowledge = setCountNode(node, targets.knowledge, "个");
      }
      if (/^\d+\s*个$/.test(text) && parentText.includes("重点词汇")) {
        counts.baseVocabulary = Number(node.getAttribute("data-linguaverse-original-count") || text.match(/\d+/)?.[0] || 6);
        counts.vocabulary = setCountNode(node, targets.vocabulary, "个");
      }
      if (/^\d+\s*道$/.test(text) && parentText.includes("练习题")) {
        counts.baseExercises = Number(node.getAttribute("data-linguaverse-original-count") || text.match(/\d+/)?.[0] || 5);
        counts.exercises = setCountNode(node, targets.exercises, "道");
      }
      if (/共\s*\d+\s*道/.test(text)) {
        const raw = Number(node.getAttribute("data-linguaverse-original-count") || text.match(/共\s*(\d+)\s*道/)?.[1] || 5);
        node.setAttribute("data-linguaverse-original-count", String(raw));
        node.textContent = text.replace(/共\s*\d+\s*道/g, `共 ${targets.exercises} 道`);
        counts.baseExercises = raw;
        counts.exercises = targets.exercises;
      }
    });
    return counts;
  }

  function setCountNode(node, value, unit) {
    if (!node.getAttribute("data-linguaverse-original-count")) {
      node.setAttribute("data-linguaverse-original-count", String(Number(node.textContent.match(/\d+/)?.[0] || value)));
    }
    node.textContent = `${value} ${unit}`;
    return value;
  }

  function getChapterExpansionContext() {
    const pageText = `${document.title} ${document.body.innerText || ""}`;
    const heading = Array.from(document.querySelectorAll("h1, h2")).map((item) => item.textContent.trim()).find((text) => /第\s*\d+\s*章|英语|日语|韩语/.test(text)) || document.title;
    const language = /韩语/.test(pageText) ? "韩语" : /日语/.test(pageText) ? "日语" : "英语";
    const level = /高级|精通/.test(pageText) ? "高级" : /中级|进阶/.test(pageText) ? "中级" : "初级";
    return { language, level, chapterTitle: heading.replace(/^第\s*\d+\s*章[:：]\s*/, "").trim() || "课程章节" };
  }

  function getChapterIntegratedContentHtml(context, counts) {
    const knowledge = buildChapterKnowledge(context, Math.max(0, counts.knowledge - counts.baseKnowledge));
    const vocabulary = buildChapterVocabulary(context, Math.max(0, counts.vocabulary - counts.baseVocabulary));
    return `
      <div id="linguaverse-chapter-integrated" class="mt-6 space-y-6">
        <div>
          <h4 class="text-base font-bold text-slate-900 mb-3">补充知识点</h4>
          <div class="grid md:grid-cols-2 gap-3">
              ${knowledge.map((item, index) => `
                <div class="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                  <div class="text-sm font-semibold text-blue-700 mb-1">补充知识点 ${index + 1}</div>
                  <div class="font-bold text-slate-900">${escapeHtml(item.title)}</div>
                  <div class="text-sm text-slate-600 mt-1">${escapeHtml(item.detail)}</div>
                </div>
              `).join("")}
          </div>
        </div>
        <div>
          <h4 class="text-base font-bold text-slate-900 mb-3">补充重点词汇</h4>
          <div class="grid md:grid-cols-2 gap-3">
              ${vocabulary.map((item, index) => `
                <div class="rounded-2xl border border-green-100 bg-green-50/40 p-4">
                  <div class="text-sm font-semibold text-green-700 mb-1">补充词汇 ${index + 1}</div>
                  <div class="font-bold text-slate-900">${escapeHtml(item.word)}</div>
                  <div class="text-sm text-purple-700 mt-1">${escapeHtml(item.pronunciation)}</div>
                  <div class="text-sm text-slate-600 mt-1">${escapeHtml(item.meaning)} · ${escapeHtml(item.example)}</div>
                </div>
              `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function getChapterIntegratedExercisesHtml(context, counts) {
    const exercises = buildChapterExercises(context, Math.max(0, counts.exercises - counts.baseExercises));
    return `
      <div id="linguaverse-extra-exercises" class="mt-6 space-y-3">
        <h4 class="text-base font-bold text-slate-900">补充练习</h4>
        ${exercises.map((item, index) => `
          <div class="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
            <div class="font-bold text-slate-900 mb-2">补充 ${index + 1}. ${escapeHtml(item.question)}</div>
            <div class="grid sm:grid-cols-2 gap-2 text-sm">
              ${item.options.map((option, optionIndex) => `<div class="rounded-xl bg-white border border-amber-100 px-3 py-2">${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</div>`).join("")}
            </div>
            <div class="text-sm text-slate-500 mt-2">参考答案：${escapeHtml(item.answer)}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildChapterKnowledge(context, count) {
    const seed = {
      英语: ["字母发音规律", "元音与辅音分类", "自然拼读意识", "常见重音位置", "基础句型结构", "疑问句表达", "否定句表达", "日常会话场景", "听力关键词捕捉", "口语连读习惯"],
      日语: ["五十音发音", "平假名识别", "片假名识别", "助词使用", "基础句型", "动词变形", "礼貌表达", "日常问候", "场景会话", "语调节奏"],
      韩语: ["韩文字母结构", "基本元音", "基本辅音", "收音规则", "连音现象", "助词使用", "敬语结尾", "日常问候", "场景会话", "语音节奏"],
    }[context.language] || [];
    return Array.from({ length: count }, (_, index) => {
      const topic = seed[index % seed.length] || "语言知识";
      const round = Math.floor(index / seed.length) + 1;
      return {
        title: `${topic} · 拓展 ${round}`,
        detail: `围绕「${context.chapterTitle}」进行第 ${index + 1} 个知识点训练，包含识别、理解、例句应用和口头复述。`,
      };
    });
  }

  function buildChapterVocabulary(context, count) {
    const data = buildExpandedLearningData(context.language, context.level);
    const words = data.words.length ? data.words : getLearningModuleData(context.language, context.level).words;
    return Array.from({ length: count }, (_, index) => {
      const item = words[index % words.length];
      const round = Math.floor(index / words.length) + 1;
      return {
        word: round > 1 ? `${item.word}（拓展${round}）` : item.word,
        pronunciation: item.pronunciation,
        meaning: item.meaning,
        example: item.example,
      };
    });
  }

  function buildChapterExercises(context, count) {
    const data = buildExpandedLearningData(context.language, context.level);
    const grammarItems = data.grammarItems.length ? data.grammarItems : [data.grammar];
    return Array.from({ length: count }, (_, index) => {
      const item = grammarItems[index % grammarItems.length];
      return {
        question: `${context.chapterTitle} · ${item.question}`,
        options: item.options,
        answer: item.options[0],
      };
    });
  }

  function patchLanguageLearningModules() {
    const hash = location.hash || "";
    const module = hash.includes("/learn/vocabulary")
      ? "vocabulary"
      : hash.includes("/learn/grammar")
      ? "grammar"
      : hash.includes("/learn/speaking")
      ? "speaking"
      : hash.includes("/learn/listening")
      ? "listening"
      : "";
    if (!module) return;

    const context = getActiveCourseContext();

    const titleMap = {
      vocabulary: "单词记忆",
      grammar: "语法练习",
      speaking: "口语跟读",
      listening: "听力训练",
    };
    const container = Array.from(document.querySelectorAll(".container")).find((item) => {
      const text = item.innerText || "";
      return text.includes(titleMap[module]) && !text.includes("LinguaVerse");
    });
    if (!container) return;

    const key = `${context.language}-${context.level}-${module}-expanded-v2`;
    if (container.getAttribute("data-linguaverse-learning-key") === key) return;
    container.setAttribute("data-linguaverse-learning-key", key);
    container.className = "container mx-auto py-10 max-w-4xl";
    container.innerHTML = getLearningModuleHtml(context, module);
  }

  function getLearningModuleHtml(context, module) {
    const data = getLearningModuleData(context.language, context.level);
    const moduleInfo = {
      vocabulary: {
        title: "单词记忆",
        subtitle: `${context.language}${context.level}词汇训练：40个核心词汇，统一卡片格式`,
        body: renderVocabularyModule(data),
      },
      grammar: {
        title: "语法练习",
        subtitle: `${context.language}${context.level}语法题库：10组语法点与选择练习`,
        body: renderGrammarModule(data),
      },
      speaking: {
        title: "口语跟读",
        subtitle: `${context.language}${context.level}跟读材料：10条场景句，统一跟读训练格式`,
        body: renderSpeakingModule(data),
      },
      listening: {
        title: "听力训练",
        subtitle: `${context.language}${context.level}听力素材：10篇短材料，按课程阶段循序渐进`,
        body: renderListeningModule(data),
      },
    }[module];

    return `
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
          当前课程：${escapeHtml(context.courseTitle || context.language + context.level + "课程")}
        </div>
        <h1 class="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3">${moduleInfo.title}</h1>
        <p class="text-slate-600">${moduleInfo.subtitle}</p>
        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div class="rounded-2xl bg-white border border-slate-200 p-3"><strong>40</strong><br><span class="text-slate-500">词汇卡</span></div>
          <div class="rounded-2xl bg-white border border-slate-200 p-3"><strong>10</strong><br><span class="text-slate-500">语法题</span></div>
          <div class="rounded-2xl bg-white border border-slate-200 p-3"><strong>10</strong><br><span class="text-slate-500">跟读句</span></div>
          <div class="rounded-2xl bg-white border border-slate-200 p-3"><strong>10</strong><br><span class="text-slate-500">听力篇</span></div>
        </div>
      </div>
      ${moduleInfo.body}
      <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        ${renderModuleJump("单词记忆", "#/learn/vocabulary", module === "vocabulary")}
        ${renderModuleJump("语法练习", "#/learn/grammar", module === "grammar")}
        ${renderModuleJump("口语跟读", "#/learn/speaking", module === "speaking")}
        ${renderModuleJump("听力训练", "#/learn/listening", module === "listening")}
      </div>
    `;
  }

  function renderModuleJump(label, href, active) {
    return `<a href="${href}" class="block text-center rounded-2xl px-4 py-3 text-sm font-semibold ${
      active ? "bg-purple-600 text-white" : "bg-white text-slate-700 hover:bg-purple-50 border border-slate-200"
    }">${label}</a>`;
  }

  function renderVocabularyModule(data) {
    return `
      <div class="grid md:grid-cols-2 gap-4">
        ${data.words
          .map(
            (item, index) => `
          <div class="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
            <div class="text-sm text-slate-400 mb-2">词汇 ${index + 1}</div>
            <div class="text-2xl font-bold text-slate-900 mb-2">${escapeHtml(item.word)}</div>
            <div class="text-purple-700 font-semibold mb-3">${escapeHtml(item.pronunciation)}</div>
            <div class="text-slate-700 mb-2">${escapeHtml(item.meaning)}</div>
            <div class="text-sm text-slate-500">${escapeHtml(item.example)}</div>
            <button
              class="mt-4 rounded-2xl bg-purple-600 text-white px-4 py-2 text-sm font-semibold"
              data-linguaverse-speak="${escapeHtml(item.word)}"
              data-linguaverse-lang="${escapeHtml(data.language || "")}"
            >人声朗读</button>
          </div>`
          )
          .join("")}
      </div>
      <div class="mt-6 rounded-3xl bg-purple-50 border border-purple-100 p-5 text-slate-700">
        建议：先听读词汇，再结合例句复述。系统已根据当前课程语种切换内容。
      </div>
    `;
  }

  function renderGrammarModule(data) {
    return `
      <div class="grid gap-4">
        ${(data.grammarItems || [data.grammar])
          .map(
            (item, index) => `
          <div class="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <div class="text-sm text-slate-400 mb-2">语法 ${index + 1}</div>
            <h2 class="text-2xl font-bold text-slate-900 mb-3">${escapeHtml(item.title)}</h2>
            <p class="text-slate-600 mb-5">${escapeHtml(item.explain)}</p>
            <div class="rounded-2xl bg-slate-50 p-4 mb-5">
              <div class="text-sm text-slate-500 mb-1">例句</div>
              <div class="text-xl font-semibold text-slate-900">${escapeHtml(item.example)}</div>
              <div class="text-slate-500 mt-1">${escapeHtml(item.translation)}</div>
            </div>
            <h3 class="font-bold text-slate-900 mb-3">${escapeHtml(item.question)}</h3>
            <div class="grid sm:grid-cols-2 gap-3">
              ${item.options
                .map((option) => `<button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-purple-300 hover:bg-purple-50">${escapeHtml(option)}</button>`)
                .join("")}
            </div>
          </div>`
          )
          .join("")}
      </div>
    `;
  }

  function renderSpeakingModule(data) {
    return `
      <div class="grid gap-4">
        ${(data.speakingItems || [data.speaking])
          .map(
            (item, index) => `
          <div class="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <div class="text-sm text-slate-400 mb-2">跟读 ${index + 1}</div>
            <h2 class="text-2xl font-bold text-slate-900 mb-3">${escapeHtml(item.text)}</h2>
            <p class="text-slate-600 mb-5">${escapeHtml(item.translation)}</p>
            <div class="grid sm:grid-cols-3 gap-3">
              <button class="rounded-2xl bg-purple-600 text-white px-4 py-3 font-semibold" data-linguaverse-speak="${escapeHtml(item.text)}" data-linguaverse-lang="${escapeHtml(data.language || "")}">播放原音</button>
              <button class="rounded-2xl bg-slate-900 text-white px-4 py-3 font-semibold">开始跟读</button>
              <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold">标记完成</button>
            </div>
            <div class="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              发音提示：${escapeHtml(item.tip)}
            </div>
          </div>`
          )
          .join("")}
      </div>
    `;
  }

  function renderListeningModule(data) {
    return `
      <div class="grid gap-4">
        ${(data.listeningItems || [data.listening])
          .map(
            (item, index) => `
          <div class="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <div class="text-sm text-slate-400 mb-2">听力 ${index + 1}</div>
            <h2 class="text-2xl font-bold text-slate-900 mb-3">${escapeHtml(item.title)}</h2>
            <p class="text-slate-700 leading-8 mb-5">${escapeHtml(item.script)}</p>
            <div class="rounded-2xl bg-slate-50 p-4 mb-5 text-slate-600">${escapeHtml(item.translation)}</div>
            <div class="grid sm:grid-cols-3 gap-3">
              <button class="rounded-2xl bg-purple-600 text-white px-4 py-3 font-semibold" data-linguaverse-speak="${escapeHtml(item.script)}" data-linguaverse-lang="${escapeHtml(data.language || "")}">点击播放语音朗读</button>
              <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold">开始测验</button>
              <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold">标记完成</button>
            </div>
          </div>`
          )
          .join("")}
      </div>
    `;
  }

  function buildExpandedLearningData(language, level) {
    const common = {
      英语: {
        words: [
          ["hello", "/həˈloʊ/", "你好", "Hello, nice to meet you."],
          ["thanks", "/θæŋks/", "谢谢", "Thanks for your help."],
          ["family", "/ˈfæməli/", "家庭", "My family is very warm."],
          ["morning", "/ˈmɔːrnɪŋ/", "早晨", "I study English every morning."],
          ["school", "/skuːl/", "学校", "The school is near my home."],
          ["teacher", "/ˈtiːtʃər/", "老师", "Our teacher speaks clearly."],
          ["student", "/ˈstuːdənt/", "学生", "She is a new student."],
          ["friend", "/frend/", "朋友", "My friend likes music."],
          ["number", "/ˈnʌmbər/", "数字", "Please write the number."],
          ["color", "/ˈkʌlər/", "颜色", "Blue is my favorite color."],
          ["shape", "/ʃeɪp/", "形状", "A circle is a round shape."],
          ["time", "/taɪm/", "时间", "What time is it now?"],
          ["today", "/təˈdeɪ/", "今天", "Today is a good day."],
          ["tomorrow", "/təˈmɑːroʊ/", "明天", "Tomorrow I will review grammar."],
          ["question", "/ˈkwestʃən/", "问题", "I have one question."],
          ["answer", "/ˈænsər/", "答案", "The answer is correct."],
          ["listen", "/ˈlɪsən/", "听", "Listen to the sentence twice."],
          ["speak", "/spiːk/", "说", "Please speak slowly."],
          ["write", "/raɪt/", "写", "Write a short paragraph."],
          ["read", "/riːd/", "读", "Read the story aloud."],
          ["practice", "/ˈpræktɪs/", "练习", "Practice makes progress."],
          ["travel", "/ˈtrævl/", "旅行", "We plan to travel next month."],
          ["restaurant", "/ˈrestərɑːnt/", "餐厅", "The restaurant is busy."],
          ["shopping", "/ˈʃɑːpɪŋ/", "购物", "Shopping online is convenient."],
          ["meeting", "/ˈmiːtɪŋ/", "会议", "The meeting starts at nine."],
          ["project", "/ˈprɑːdʒekt/", "项目", "This project is important."],
          ["culture", "/ˈkʌltʃər/", "文化", "Language reflects culture."],
          ["opinion", "/əˈpɪnjən/", "观点", "What is your opinion?"],
          ["compare", "/kəmˈper/", "比较", "Compare these two ideas."],
          ["describe", "/dɪˈskraɪb/", "描述", "Describe your daily routine."],
          ["explain", "/ɪkˈspleɪn/", "解释", "Can you explain this rule?"],
          ["improve", "/ɪmˈpruːv/", "提升", "I want to improve my speaking."],
          ["confident", "/ˈkɑːnfɪdənt/", "自信的", "Be confident when you speak."],
          ["fluent", "/ˈfluːənt/", "流利的", "She is fluent in English."],
          ["business", "/ˈbɪznəs/", "商务", "Business English is useful."],
          ["presentation", "/ˌprezənˈteɪʃən/", "演示", "He gave a presentation."],
          ["discussion", "/dɪˈskʌʃən/", "讨论", "The discussion was helpful."],
          ["translate", "/trænzˈleɪt/", "翻译", "Translate the sentence naturally."],
          ["summary", "/ˈsʌməri/", "总结", "Write a short summary."],
          ["achievement", "/əˈtʃiːvmənt/", "成就", "Progress is an achievement."],
        ],
        grammar: [
          ["Be动词", "am/is/are 根据主语变化，是基础判断句的核心。", "I am a student.", "我是学生。", "选择正确形式：She ___ a teacher.", ["is", "am", "are", "be"]],
          ["一般现在时", "表达习惯、事实或经常发生的动作。", "He studies English every day.", "他每天学习英语。", "选择正确形式：He ___ English.", ["studies", "study", "studying", "studied"]],
          ["一般过去时", "表达过去发生并结束的动作。", "I visited Beijing last year.", "我去年去了北京。", "选择正确形式：I ___ a movie yesterday.", ["watched", "watch", "watches", "watching"]],
          ["一般将来时", "will 或 be going to 表达未来计划。", "We will meet tomorrow.", "我们明天见面。", "选择正确形式：They ___ travel next week.", ["will", "are", "did", "was"]],
          ["进行时", "be + doing 表达正在进行的动作。", "She is reading now.", "她现在正在读书。", "选择正确形式：Tom ___ playing soccer.", ["is", "am", "are", "be"]],
          ["比较级", "形容词比较级用于比较两者。", "This book is easier than that one.", "这本书比那本更容易。", "选择正确形式：English is ___ than before.", ["easier", "easy", "easiest", "more easy"]],
          ["被动语态", "be + done 表示动作承受者作主语。", "The letter was written by Anna.", "这封信是安娜写的。", "选择正确形式：The room ___ cleaned.", ["was", "did", "has", "were"]],
          ["条件句", "if 引导条件，从句常用一般现在时代替将来。", "If it rains, I will stay home.", "如果下雨，我会待在家。", "选择正确形式：If he ___, we will start.", ["comes", "will come", "came", "come"]],
          ["定语从句", "用 who/which/that 修饰名词。", "This is the book that I bought.", "这是我买的书。", "选择正确关系词：The man ___ called is my teacher.", ["who", "what", "where", "when"]],
          ["虚拟语气", "表达假设、愿望或与事实相反的情况。", "If I were you, I would try again.", "如果我是你，我会再试一次。", "选择正确形式：If I ___ you, I would apologize.", ["were", "am", "was", "be"]],
        ],
        speaking: [
          ["Hello, my name is Li Ming. Nice to meet you.", "你好，我叫李明。很高兴认识你。", "注意 name is 的连读。"],
          ["Could you speak more slowly, please?", "请你说慢一点好吗？", "Could you 用升调更礼貌。"],
          ["I usually review new words after dinner.", "我通常晚饭后复习新单词。", "usually 不要重读过重。"],
          ["I am interested in learning different cultures.", "我对学习不同文化很感兴趣。", "interested in 连读。"],
          ["What time does the meeting start?", "会议几点开始？", "疑问句语调自然上扬。"],
          ["I would like to order a cup of coffee.", "我想点一杯咖啡。", "would like to 读得连贯。"],
          ["In my opinion, practice is very important.", "在我看来，练习非常重要。", "opinion 的重音在第二音节。"],
          ["Could you explain this grammar point again?", "你能再解释一下这个语法点吗？", "grammar point 可轻微连读。"],
          ["I will give a short presentation tomorrow.", "我明天会做一个简短演示。", "presentation 重音在第三音节。"],
          ["Learning a language takes time and patience.", "学习语言需要时间和耐心。", "takes time 可连读。" ],
        ],
        listening: [
          ["Daily greeting", "Good morning. My name is Anna. I study English for thirty minutes every day.", "早上好。我叫安娜。我每天学习英语三十分钟。"],
          ["At school", "Our teacher asks us to read one short story and write five new words.", "老师让我们读一篇短故事并写下五个新单词。"],
          ["Asking time", "Excuse me, what time is the meeting? It starts at half past nine.", "不好意思，会议几点？九点半开始。"],
          ["Restaurant order", "I would like a sandwich and a cup of tea, please.", "我想要一个三明治和一杯茶。"],
          ["Travel plan", "We are going to visit the museum tomorrow morning.", "我们明天早上打算参观博物馆。"],
          ["Shopping", "This jacket is cheaper than that one, but the blue one looks better.", "这件夹克比那件便宜，但蓝色那件更好看。"],
          ["Study habit", "If I learn ten words a day, I can remember more expressions.", "如果我每天学十个单词，我能记住更多表达。"],
          ["Presentation", "Today I will talk about my language learning experience.", "今天我将谈谈我的语言学习经验。"],
          ["Business meeting", "Please send the report before Friday and prepare a short summary.", "请在周五前发送报告并准备简短总结。"],
          ["Culture", "Language is not only words and grammar. It also shows culture.", "语言不只是词汇和语法，它也体现文化。"],
        ],
      },
      日语: {
        words: [
          ["こんにちは", "konnichiwa", "你好", "こんにちは、田中さん。"],
          ["ありがとう", "arigatou", "谢谢", "どうもありがとうございます。"],
          ["家族", "かぞく / kazoku", "家人", "私の家族は四人です。"],
          ["時間", "じかん / jikan", "时间", "今、何時ですか。"],
          ["学校", "がっこう / gakkou", "学校", "学校へ行きます。"],
          ["先生", "せんせい / sensei", "老师", "先生に質問します。"],
          ["学生", "がくせい / gakusei", "学生", "私は学生です。"],
          ["友達", "ともだち / tomodachi", "朋友", "友達と話します。"],
          ["数字", "すうじ / suuji", "数字", "数字を読みます。"],
          ["色", "いろ / iro", "颜色", "好きな色は青です。"],
          ["形", "かたち / katachi", "形状", "丸い形です。"],
          ["今日", "きょう / kyou", "今天", "今日は暑いです。"],
          ["明日", "あした / ashita", "明天", "明日勉強します。"],
          ["質問", "しつもん / shitsumon", "问题", "質問があります。"],
          ["答え", "こたえ / kotae", "答案", "答えを書いてください。"],
          ["聞く", "きく / kiku", "听、问", "音声を聞きます。"],
          ["話す", "はなす / hanasu", "说", "日本語を話します。"],
          ["書く", "かく / kaku", "写", "名前を書きます。"],
          ["読む", "よむ / yomu", "读", "本を読みます。"],
          ["練習", "れんしゅう / renshuu", "练习", "発音を練習します。"],
          ["旅行", "りょこう / ryokou", "旅行", "京都へ旅行します。"],
          ["予約", "よやく / yoyaku", "预约", "レストランを予約します。"],
          ["買い物", "かいもの / kaimono", "购物", "週末に買い物します。"],
          ["会議", "かいぎ / kaigi", "会议", "午後に会議があります。"],
          ["提案", "ていあん / teian", "提案", "新しい案を提案します。"],
          ["文化", "ぶんか / bunka", "文化", "日本文化を学びます。"],
          ["意見", "いけん / iken", "意见", "意見を言ってください。"],
          ["比べる", "くらべる / kuraberu", "比较", "二つの文を比べます。"],
          ["説明", "せつめい / setsumei", "说明", "もう一度説明してください。"],
          ["上達", "じょうたつ / joutatsu", "进步", "日本語が上達しました。"],
          ["自信", "じしん / jishin", "自信", "自信を持って話します。"],
          ["流暢", "りゅうちょう / ryuuchou", "流利", "流暢に話したいです。"],
          ["ビジネス", "bijinesu", "商务", "ビジネス日本語を学びます。"],
          ["発表", "はっぴょう / happyou", "发表", "来週発表します。"],
          ["討論", "とうろん / touron", "讨论", "テーマについて討論します。"],
          ["翻訳", "ほんやく / honyaku", "翻译", "文章を翻訳します。"],
          ["要約", "ようやく / youyaku", "总结", "内容を要約します。"],
          ["経験", "けいけん / keiken", "经验", "経験があります。"],
          ["資料", "しりょう / shiryou", "资料", "資料を拝見しました。"],
          ["確認", "かくにん / kakunin", "确认", "予定を確認します。"],
        ],
        grammar: [
          ["助词「は」", "「は」提示句子的主题。", "私は学生です。", "我是学生。", "选择合适助词：私___学生です。", ["は", "を", "に", "で"]],
          ["助词「が」", "「が」强调主语或新信息。", "雨が降っています。", "正在下雨。", "选择合适助词：誰___来ましたか。", ["が", "を", "へ", "で"]],
          ["助词「を」", "「を」标记动作对象。", "水を飲みます。", "喝水。", "选择合适助词：本___読みます。", ["を", "は", "に", "が"]],
          ["动词ます形", "ます形用于礼貌表达。", "毎日勉強します。", "每天学习。", "选择合适形式：日本語を勉強__。", ["します", "する", "した", "して"]],
          ["て形", "て形可连接动作或提出请求。", "少し待ってください。", "请稍等。", "选择合适形式：窓を開け___ください。", ["て", "た", "ます", "ない"]],
          ["た形", "た形表示过去动作。", "昨日映画を見ました。", "昨天看了电影。", "选择合适形式：昨日勉強し___。", ["ました", "ます", "ません", "たい"]],
          ["たい形", "たい表示愿望。", "日本へ行きたいです。", "我想去日本。", "选择合适形式：水を飲み___です。", ["たい", "て", "た", "ます"]],
          ["比较表达", "より用于比较基准。", "東京は大阪より大きいです。", "东京比大阪大。", "选择合适词：AはB___高いです。", ["より", "から", "まで", "ので"]],
          ["敬语基础", "です/ます让表达更礼貌。", "こちらでお待ちください。", "请在这里等候。", "选择礼貌表达：少々お待ち___。", ["ください", "くれ", "する", "だ"]],
          ["条件表达", "たら表示如果、之后。", "時間があったら、行きます。", "如果有时间，我会去。", "选择合适形式：雨が降っ___、行きません。", ["たら", "ても", "て", "ます"]],
        ],
        speaking: [
          ["はじめまして。私は李です。よろしくお願いします。", "初次见面。我姓李，请多关照。", "注意「は」读作 wa。"],
          ["すみません、もう一度お願いします。", "不好意思，请再说一遍。", "「お願いします」要连贯。"],
          ["毎日三十分、日本語を勉強します。", "我每天学习三十分钟日语。", "数字和时间要读清楚。"],
          ["駅までの行き方を教えてください。", "请告诉我去车站的路。", "请求语气自然下降。"],
          ["この料理はとてもおいしいです。", "这道菜非常好吃。", "形容词「おいしい」拉长音。"],
          ["週末に友達と買い物に行きます。", "周末和朋友去购物。", "助词「と」「に」不要省略。"],
          ["日本の文化に興味があります。", "我对日本文化感兴趣。", "「興味」重音自然。"],
          ["会議は午後三時から始まります。", "会议下午三点开始。", "时间表达读完整。"],
          ["資料を拝見いたしました。", "我已经拜读了资料。", "商务表达语速放慢。"],
          ["本日はお時間をいただき、ありがとうございます。", "感谢您今天抽出时间。", "正式场景保持礼貌语调。"],
        ],
        listening: [
          ["日常问候", "こんにちは。私は李です。中国から来ました。日本語を勉強しています。", "你好。我姓李，来自中国。我正在学习日语。"],
          ["课堂介绍", "今日は五十音を練習します。まず、あ行から読みましょう。", "今天练习五十音。首先从あ行开始读吧。"],
          ["时间表达", "今は午前九時半です。授業は十時に始まります。", "现在是上午九点半。课程十点开始。"],
          ["购物场景", "すみません、このかばんはいくらですか。三千円です。", "不好意思，这个包多少钱？三千日元。"],
          ["餐厅点餐", "コーヒーを一つとサンドイッチをお願いします。", "请给我一杯咖啡和一个三明治。"],
          ["问路", "駅へ行きたいです。この道をまっすぐ行ってください。", "我想去车站。请沿这条路直走。"],
          ["旅行计划", "明日、友達と京都へ旅行に行きます。", "明天和朋友去京都旅行。"],
          ["学习习惯", "毎日新しい単語を十個覚えて、文を作ります。", "每天记十个新单词并造句。"],
          ["商务会面", "本日はお忙しいところ、ありがとうございます。", "感谢您百忙之中抽出时间。"],
          ["发表开场", "これから私の日本語学習について発表します。", "接下来我将发表我的日语学习情况。"],
        ],
      },
      韩语: {
        words: [
          ["안녕하세요", "annyeonghaseyo", "你好", "안녕하세요, 저는 민수예요."],
          ["감사합니다", "gamsahamnida", "谢谢", "정말 감사합니다."],
          ["가족", "gajok", "家人", "우리 가족은 네 명이에요."],
          ["시간", "sigan", "时间", "지금 몇 시예요?"],
          ["학교", "hakgyo", "学校", "학교에 가요."],
          ["선생님", "seonsaengnim", "老师", "선생님께 질문해요."],
          ["학생", "haksaeng", "学生", "저는 학생이에요."],
          ["친구", "chingu", "朋友", "친구를 만나요."],
          ["숫자", "sutja", "数字", "숫자를 읽어요."],
          ["색깔", "saekkkal", "颜色", "파란색을 좋아해요."],
          ["모양", "moyang", "形状", "동그란 모양이에요."],
          ["오늘", "oneul", "今天", "오늘은 날씨가 좋아요."],
          ["내일", "naeil", "明天", "내일 공부할 거예요."],
          ["질문", "jilmun", "问题", "질문이 있어요."],
          ["대답", "daedap", "回答", "대답해 주세요."],
          ["듣다", "deutda", "听", "음성을 들어요."],
          ["말하다", "malhada", "说", "한국어로 말해요."],
          ["쓰다", "sseuda", "写", "이름을 써요."],
          ["읽다", "ikda", "读", "책을 읽어요."],
          ["연습", "yeonseup", "练习", "발음을 연습해요."],
          ["여행", "yeohaeng", "旅行", "서울로 여행을 가요."],
          ["예약", "yeyak", "预约", "식당을 예약했어요."],
          ["쇼핑", "syoping", "购物", "주말에 쇼핑해요."],
          ["회의", "hoeui", "会议", "오후에 회의가 있어요."],
          ["제안", "jean", "提案", "새 계획을 제안해요."],
          ["문화", "munhwa", "文化", "한국 문화를 배워요."],
          ["의견", "uigyeon", "意见", "의견을 말해 주세요."],
          ["비교하다", "bigyohada", "比较", "두 문장을 비교해요."],
          ["설명", "seolmyeong", "说明", "다시 설명해 주세요."],
          ["향상", "hyangsang", "提升", "실력이 향상됐어요."],
          ["자신감", "jasingam", "自信", "자신감을 가져요."],
          ["유창하다", "yuchanghada", "流利", "유창하게 말하고 싶어요."],
          ["비즈니스", "bijeuniseu", "商务", "비즈니스 한국어를 배워요."],
          ["발표", "balpyo", "发表", "내일 발표가 있어요."],
          ["토론", "toron", "讨论", "주제에 대해 토론해요."],
          ["번역", "beonyeok", "翻译", "문장을 번역해요."],
          ["요약", "yoyak", "总结", "내용을 요약해요."],
          ["경험", "gyeongheom", "经验", "경험이 있어요."],
          ["자료", "jaryo", "资料", "자료를 확인했어요."],
          ["확인", "hwagin", "确认", "일정을 확인해요."],
        ],
        grammar: [
          ["助词 은/는", "用于提示主题。", "저는 학생이에요.", "我是学生。", "选择合适助词：저___ 학생이에요.", ["는", "를", "에", "도"]],
          ["助词 이/가", "用于强调主语或新信息。", "비가 와요.", "下雨了。", "选择合适助词：누구___ 왔어요?", ["가", "를", "에", "로"]],
          ["宾语助词 을/를", "标记动作对象。", "책을 읽어요.", "读书。", "选择合适助词：물을 마셔요.", ["을", "은", "에", "도"]],
          ["地点助词 에", "表示存在或移动方向。", "학교에 가요.", "去学校。", "选择合适助词：집___ 있어요.", ["에", "를", "은", "가"]],
          ["现在时 -아요/어요", "用于日常陈述。", "한국어를 배워요.", "学习韩语。", "选择合适形式：밥을 먹__.", ["어요", "았어요", "겠습니다", "자"]],
          ["过去时 -았/었어요", "表示过去动作。", "어제 영화를 봤어요.", "昨天看了电影。", "选择合适形式：친구를 만났__.", ["어요", "아요", "고", "지"]],
          ["未来表达 -ㄹ 거예요", "表达计划或将来。", "내일 공부할 거예요.", "明天会学习。", "选择合适表达：내일 갈 ___예요.", ["거", "수", "때", "곳"]],
          ["敬语 -습니다", "正式场合使用。", "회의를 시작하겠습니다.", "会议现在开始。", "选择正式表达：감사__.", ["합니다", "해", "하자", "했어"]],
          ["原因 -아서/어서", "表达原因或顺序。", "바빠서 못 갔어요.", "因为忙所以没去。", "选择合适连接：피곤___ 쉬었어요.", ["해서", "하고", "지만", "면"]],
          ["条件 -(으)면", "表示如果。", "시간이 있으면 가요.", "如果有时间就去。", "选择合适形式：비가 오___ 안 가요.", ["면", "고", "서", "지만"]],
        ],
        speaking: [
          ["안녕하세요. 저는 리밍이에요. 만나서 반갑습니다.", "你好。我是李明。很高兴认识你。", "注意收音和连读。"],
          ["죄송하지만, 다시 한번 말씀해 주세요.", "不好意思，请再说一遍。", "正式请求语气要柔和。"],
          ["저는 매일 삼십 분 동안 한국어를 공부해요.", "我每天学习三十分钟韩语。", "数字和时间表达要读清。"],
          ["지하철역이 어디에 있어요?", "地铁站在哪里？", "疑问句句尾上扬。"],
          ["이 음식은 정말 맛있어요.", "这个食物真的很好吃。", "맛있어요 的连读要自然。"],
          ["주말에 친구와 쇼핑하러 가요.", "周末和朋友去购物。", "친구와 不要读断。"],
          ["저는 한국 문화에 관심이 있어요.", "我对韩国文化感兴趣。", "관심이 있어요 连读。"],
          ["회의는 오후 세 시에 시작합니다.", "会议下午三点开始。", "正式语气保持稳定。"],
          ["자료를 확인했습니다.", "我已经确认了资料。", "했습니다 收音清晰。"],
          ["오늘 회의에 참석해 주셔서 감사합니다.", "感谢参加今天的会议。", "商务场景语速放慢。"],
        ],
        listening: [
          ["日常问候", "안녕하세요. 저는 리밍이에요. 중국에서 왔어요. 한국어를 공부하고 있어요.", "你好。我是李明，来自中国。我正在学习韩语。"],
          ["课堂介绍", "오늘은 한글의 기본 모음과 자음을 연습하겠습니다.", "今天练习韩文字母的基本元音和辅音。"],
          ["时间表达", "지금은 오전 아홉 시 반이에요. 수업은 열 시에 시작해요.", "现在是上午九点半。课程十点开始。"],
          ["购物场景", "실례지만, 이 가방은 얼마예요? 삼만 원이에요.", "不好意思，这个包多少钱？三万韩元。"],
          ["餐厅点餐", "커피 한 잔하고 샌드위치 하나 주세요.", "请给我一杯咖啡和一个三明治。"],
          ["问路", "지하철역에 가고 싶어요. 이 길로 쭉 가세요.", "我想去地铁站。请沿这条路一直走。"],
          ["旅行计划", "내일 친구와 서울로 여행을 갈 거예요.", "明天要和朋友去首尔旅行。"],
          ["学习习惯", "매일 새 단어 열 개를 외우고 문장을 만들어요.", "每天背十个新单词并造句。"],
          ["商务会面", "바쁘신데 시간 내 주셔서 감사합니다.", "感谢您百忙之中抽出时间。"],
          ["发表开场", "지금부터 제 한국어 학습 경험을 발표하겠습니다.", "现在开始发表我的韩语学习经验。"],
        ],
      },
    };

    const source = common[language] || common.英语;
    const offset = level === "高级" ? 24 : level === "中级" ? 12 : 0;
    const rotate = (list) => list.slice(offset % list.length).concat(list.slice(0, offset % list.length));
    const rotateShort = (list) => list.slice((level === "高级" ? 6 : level === "中级" ? 3 : 0) % list.length).concat(list.slice(0, (level === "高级" ? 6 : level === "中级" ? 3 : 0) % list.length));
    const words = rotate(source.words).map(([word, pronunciation, meaning, example]) => ({ word, pronunciation, meaning, example }));
    const grammarItems = rotateShort(source.grammar).map(([title, explain, example, translation, question, options]) => ({
      title: `${level}${title}`,
      explain,
      example,
      translation,
      question,
      options,
    }));
    const speakingItems = rotateShort(source.speaking).map(([text, translation, tip]) => ({ text, translation, tip }));
    const listeningItems = rotateShort(source.listening).map(([title, script, translation]) => ({ title, script, translation }));
    return {
      language,
      level,
      words,
      grammar: grammarItems[0],
      grammarItems,
      speaking: speakingItems[0],
      speakingItems,
      listening: listeningItems[0],
      listeningItems,
    };
  }

  function getLearningModuleData(language, level) {
    const expanded = buildExpandedLearningData(language, level);
    if (expanded) return expanded;

    const bank = {
      日语: {
        初级: {
          words: [
            { word: "こんにちは", pronunciation: "konnichiwa", meaning: "你好", example: "こんにちは、田中さん。" },
            { word: "ありがとう", pronunciation: "arigatou", meaning: "谢谢", example: "どうもありがとうございます。" },
            { word: "家族", pronunciation: "かぞく / kazoku", meaning: "家人", example: "私の家族は四人です。" },
            { word: "時間", pronunciation: "じかん / jikan", meaning: "时间", example: "今、何時ですか。" },
          ],
          grammar: { title: "助词「は」和「が」", explain: "「は」提示主题，「が」强调主语或新信息。初学阶段先掌握主题句表达。", example: "私は学生です。", translation: "我是学生。", question: "选择合适助词：私___学生です。", options: ["は", "を", "に", "で"] },
          speaking: { text: "はじめまして。私は李です。よろしくお願いします。", translation: "初次见面。我姓李，请多关照。", tip: "注意「は」读作 wa，「よろしく」保持连贯。" },
          listening: { title: "日常问候", script: "こんにちは。私は李です。中国から来ました。日本語を勉強しています。", translation: "你好。我姓李，来自中国。我正在学习日语。" },
        },
        中级: {
          words: [
            { word: "予約", pronunciation: "よやく / yoyaku", meaning: "预约", example: "レストランを予約しました。" },
            { word: "旅行", pronunciation: "りょこう / ryokou", meaning: "旅行", example: "京都へ旅行に行きます。" },
            { word: "説明", pronunciation: "せつめい / setsumei", meaning: "说明", example: "もう一度説明してください。" },
            { word: "経験", pronunciation: "けいけん / keiken", meaning: "经验", example: "日本で働いた経験があります。" },
          ],
          grammar: { title: "动词て形", explain: "て形可用于连接动作、提出请求、描述正在进行的动作。", example: "窓を開けてください。", translation: "请打开窗户。", question: "选择合适表达：少し待っ___ください。", options: ["て", "た", "ない", "ます"] },
          speaking: { text: "すみません、駅までの行き方を教えてください。", translation: "不好意思，请告诉我去车站的路。", tip: "「教えてください」是礼貌请求，语调自然下降。" },
          listening: { title: "旅行咨询", script: "すみません。京都駅まで行きたいです。どの電車に乗ればいいですか。", translation: "不好意思。我想去京都站。应该坐哪趟电车？" },
        },
        高级: {
          words: [
            { word: "会議", pronunciation: "かいぎ / kaigi", meaning: "会议", example: "午後三時から会議があります。" },
            { word: "提案", pronunciation: "ていあん / teian", meaning: "提案", example: "新しい計画を提案します。" },
            { word: "拝見", pronunciation: "はいけん / haiken", meaning: "拜读、看（谦让语）", example: "資料を拝見しました。" },
            { word: "恐れ入ります", pronunciation: "おそれいります / osoreirimasu", meaning: "不好意思、劳驾", example: "恐れ入りますが、少々お待ちください。" },
          ],
          grammar: { title: "敬语与商务表达", explain: "高级日语要区分尊敬语、谦让语和郑重语，根据商务场景选择合适表达。", example: "資料を拝見いたしました。", translation: "我已经拜读了资料。", question: "选择谦让表达：資料を___しました。", options: ["拝見", "見る", "見ます", "見た"] },
          speaking: { text: "本日はお時間をいただき、誠にありがとうございます。", translation: "非常感谢您今天抽出时间。", tip: "商务场景语速放慢，重读「誠にありがとうございます」。" },
          listening: { title: "商务会面", script: "本日はお忙しいところ、お時間をいただきまして、誠にありがとうございます。", translation: "感谢您在百忙之中抽出时间。" },
        },
      },
      韩语: {
        初级: {
          words: [
            { word: "안녕하세요", pronunciation: "annyeonghaseyo", meaning: "你好", example: "안녕하세요, 저는 민수예요." },
            { word: "감사합니다", pronunciation: "gamsahamnida", meaning: "谢谢", example: "정말 감사합니다." },
            { word: "가족", pronunciation: "gajok", meaning: "家人", example: "우리 가족은 네 명이에요." },
            { word: "시간", pronunciation: "sigan", meaning: "时间", example: "지금 몇 시예요?" },
          ],
          grammar: { title: "助词 은/는 和 이/가", explain: "은/는 用于提示主题，이/가 用于强调主语或新信息。", example: "저는 학생이에요.", translation: "我是学生。", question: "选择合适助词：저___ 학생이에요.", options: ["는", "를", "에", "도"] },
          speaking: { text: "안녕하세요. 저는 리밍이에요. 만나서 반갑습니다.", translation: "你好。我是李明。很高兴认识你。", tip: "注意收音和连读，「반갑습니다」不要逐字断开。" },
          listening: { title: "日常问候", script: "안녕하세요. 저는 리밍이에요. 중국에서 왔어요. 한국어를 공부하고 있어요.", translation: "你好。我是李明，来自中国。我正在学习韩语。" },
        },
        中级: {
          words: [
            { word: "예약", pronunciation: "yeyak", meaning: "预约", example: "식당을 예약했어요." },
            { word: "여행", pronunciation: "yeohaeng", meaning: "旅行", example: "서울로 여행을 가요." },
            { word: "설명", pronunciation: "seolmyeong", meaning: "说明", example: "다시 설명해 주세요." },
            { word: "경험", pronunciation: "gyeongheom", meaning: "经验", example: "한국에서 일한 경험이 있어요." },
          ],
          grammar: { title: "过去时 -았/었어요", explain: "动词或形容词词干结合 -았/었어요 表示过去发生的动作或状态。", example: "어제 영화를 봤어요.", translation: "昨天看了电影。", question: "选择合适表达：어제 친구를 ___어요.", options: ["만났", "만나고", "만날", "만나겠"] },
          speaking: { text: "실례지만, 지하철역이 어디에 있어요?", translation: "不好意思，请问地铁站在哪里？", tip: "「실례지만」用于礼貌开场，句尾保持上扬。" },
          listening: { title: "问路", script: "실례지만, 지하철역이 어디에 있어요? 이 길로 쭉 가면 보여요.", translation: "不好意思，地铁站在哪里？沿着这条路一直走就能看到。" },
        },
        高级: {
          words: [
            { word: "회의", pronunciation: "hoeui", meaning: "会议", example: "오후 세 시에 회의가 있습니다." },
            { word: "제안", pronunciation: "jean", meaning: "提案", example: "새로운 계획을 제안합니다." },
            { word: "확인", pronunciation: "hwagin", meaning: "确认", example: "자료를 확인했습니다." },
            { word: "양해", pronunciation: "yanghae", meaning: "谅解", example: "양해 부탁드립니다." },
          ],
          grammar: { title: "正式敬语 -습니다/-ㅂ니다", explain: "商务和正式场合常用 -습니다/-ㅂ니다，语气更正式、礼貌。", example: "자료를 확인했습니다.", translation: "我已经确认了资料。", question: "选择正式表达：회의를 시작하__.", options: ["겠습니다", "고 있어", "자", "네"] },
          speaking: { text: "오늘 회의에 참석해 주셔서 감사합니다.", translation: "感谢各位参加今天的会议。", tip: "正式场合使用敬语结尾，语速稳定清晰。" },
          listening: { title: "商务会议", script: "오늘 회의에 참석해 주셔서 감사합니다. 먼저 새로운 제안을 설명드리겠습니다.", translation: "感谢各位参加今天的会议。首先我将说明新的提案。" },
        },
      },
    };
    return bank[language]?.[level] || bank[language]?.初级 || bank.日语.初级;
  }

  function speakCurrentPracticeText() {
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    const headings = Array.from(document.querySelectorAll("h1, h2, h3")).map((h) => h.textContent.trim()).filter(Boolean);
    const text =
      headings.find((item) => /[A-Za-z]{3,}/.test(item)) ||
      headings.find((item) => item !== "听力训练" && item !== "口语跟读") ||
      "Welcome to LinguaVerse.";

    if (!supported) {
      showToast("当前浏览器不支持语音朗读。");
      return;
    }

    speakTextWithVoice(text, "");
  }

  function speakTextWithVoice(text, language) {
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    if (!supported) {
      showToast("当前浏览器不支持语音朗读。");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language === "日语" || /[ぁ-んァ-ン]/.test(text)
        ? "ja-JP"
        : language === "韩语" || /[가-힣]/.test(text)
        ? "ko-KR"
        : /[A-Za-z]/.test(text)
        ? "en-US"
        : "zh-CN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    showToast("正在播放语音朗读。");
  }

  function copyShareLink() {
    const link = location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(
        () => showToast("分享链接已复制。"),
        () => showToast("当前浏览器不允许复制，请手动复制地址栏链接。")
      );
    } else {
      showToast("当前浏览器不支持自动复制，请手动复制地址栏链接。");
    }
  }

  function showToast(message) {
    let toast = document.getElementById(toastId);
    if (!toast) {
      toast = document.createElement("div");
      toast.id = toastId;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function showInfoModal(title, body) {
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = modalId;
      modal.innerHTML = `
        <div class="linguaverse-modal-card" role="dialog" aria-modal="true">
          <div class="linguaverse-modal-head">
            <h3></h3>
            <button type="button">知道了</button>
          </div>
          <div class="linguaverse-modal-body"></div>
        </div>
      `;
      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.tagName === "BUTTON") modal.classList.remove("show");
      });
      document.body.appendChild(modal);
    }

    modal.querySelector("h3").textContent = title;
    modal.querySelector(".linguaverse-modal-body").innerHTML = body;
    modal.classList.add("show");
  }

  function getInfoContent(type) {
    const content = {
      about: "LinguaVerse 是一个多语言学习平台，覆盖英语、日语、韩语课程和听说读写训练模块。",
      contact: "联系邮箱：hello@linguaverse.com<br>我们会持续收集学习者反馈，优化课程与社区体验。",
      careers: "LinguaVerse 欢迎课程教研、产品设计和社区运营方向的人才加入。",
      help: "你可以从课程中心选择课程，也可以进入单词、语法、口语、听力模块进行练习。",
      terms: "使用 LinguaVerse 即表示你同意遵守社区规范、学习内容使用规则和账号安全要求。",
      privacy: "LinguaVerse 尊重用户隐私，学习数据仅用于课程推荐、进度记录和体验优化。",
      copyright: "© 2024 LinguaVerse. All rights reserved.",
    };
    return content[type] || "该页面正在准备中。";
  }
})();
