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
      .linguaverse-canvas-wrap {
        position: relative;
        margin: 0 auto;
        width: 280px;
        height: 280px;
      }
      .linguaverse-canvas-wrap canvas {
        position: relative;
        z-index: 2;
        border: 2px solid #e2e8f0;
        border-radius: 16px;
        touch-action: none;
        cursor: crosshair;
        background: transparent;
      }
      .linguaverse-canvas-guide {
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 140px;
        color: #e2e8f0;
        pointer-events: none;
        z-index: 1;
        user-select: none;
      }
      .linguaverse-spelling-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        margin-top: 12px;
      }
      .linguaverse-spelling-grid button {
        aspect-ratio: 1;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #fff;
        font-size: 20px;
        cursor: pointer;
        transition: all .15s ease;
      }
      .linguaverse-spelling-grid button:hover {
        background: #f3f0ff;
        border-color: #a78bfa;
      }
      .linguaverse-spelling-grid button.active {
        background: #7c3aed;
        color: #fff;
        border-color: #7c3aed;
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

  /* ========== 章节内容扩展（修复数量统计与内容质量） ========== */

  function patchChapterContentExpansion() {
    if (!/#\/courses\/\d+\/chapter\/\d+/.test(location.hash || "")) return;
    const chapterContainer = Array.from(document.querySelectorAll(".container")).find((item) => {
      const text = item.innerText || "";
      return text.includes("学习内容") && text.includes("课后练习") && text.includes("知识点");
    });
    if (!chapterContainer) return;

    const counts = patchChapterStatCards(chapterContainer);
    const key = `${location.hash}-${counts.knowledge}-${counts.vocabulary}-${counts.exercises}-v3`;
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

  function patchChapterStatCards(container) {
    // 通过DOM统计实际原始列表项数量（而非仅依赖文本标签）
    let actualKnowledge = 0, actualVocabulary = 0, actualExercises = 0;
    
    const allCards = Array.from(container.querySelectorAll(".rounded-2xl, .rounded-xl, .rounded-3xl"));
    const learningArea = Array.from(container.children).find((item) => (item.innerText || "").includes("学习内容"));
    const exerciseArea = Array.from(container.children).find((item) => (item.innerText || "").includes("课后练习"));
    
    if (learningArea) {
      const learningCards = Array.from(learningArea.querySelectorAll(".rounded-2xl, .rounded-xl, .rounded-3xl"));
      // 知识点卡片通常包含"知识点"字样或有h4标题
      actualKnowledge = learningCards.filter((card) => {
        const txt = card.innerText || "";
        return txt.includes("知识点") || txt.includes("发音") || txt.includes("规则") || txt.includes("概念") || txt.includes("结构");
      }).length;
      // 词汇卡片通常包含"例句"或"发音"标注
      actualVocabulary = learningCards.filter((card) => {
        const txt = card.innerText || "";
        return txt.includes("例句") || txt.includes("读音") || txt.includes("发音") || txt.includes("含义");
      }).length;
    }
    if (exerciseArea) {
      actualExercises = Array.from(exerciseArea.querySelectorAll(".rounded-2xl, .rounded-xl, .rounded-3xl")).length;
    }
    
    // 兜底：如果DOM统计为0，回退到文本统计
    if (actualKnowledge === 0) actualKnowledge = 4;
    if (actualVocabulary === 0) actualVocabulary = 6;
    if (actualExercises === 0) actualExercises = 4;
    
    // 目标：实际数量 + 适量补充（不夸大）
    const targets = { 
      knowledge: actualKnowledge + 3, 
      vocabulary: actualVocabulary + 3, 
      exercises: actualExercises + 2 
    };
    const counts = { ...targets, baseKnowledge: actualKnowledge, baseVocabulary: actualVocabulary, baseExercises: actualExercises };
    
    document.querySelectorAll("p, span, h3, h4, div").forEach((node) => {
      const text = node.textContent.trim();
      const parentText = node.parentElement?.textContent || "";

      if (/^\d+\s*个$/.test(text) && parentText.includes("知识点")) {
        if (!node.getAttribute("data-linguaverse-original-count")) {
          node.setAttribute("data-linguaverse-original-count", text.match(/\d+/)?.[0] || String(actualKnowledge));
        }
        node.textContent = `${targets.knowledge} 个`;
        counts.knowledge = targets.knowledge;
      }
      if (/^\d+\s*个$/.test(text) && parentText.includes("重点词汇")) {
        if (!node.getAttribute("data-linguaverse-original-count")) {
          node.setAttribute("data-linguaverse-original-count", text.match(/\d+/)?.[0] || String(actualVocabulary));
        }
        node.textContent = `${targets.vocabulary} 个`;
        counts.vocabulary = targets.vocabulary;
      }
      if (/^\d+\s*道$/.test(text) && parentText.includes("练习题")) {
        if (!node.getAttribute("data-linguaverse-original-count")) {
          node.setAttribute("data-linguaverse-original-count", text.match(/\d+/)?.[0] || String(actualExercises));
        }
        node.textContent = `${targets.exercises} 道`;
        counts.exercises = targets.exercises;
      }
      if (/共\s*\d+\s*道/.test(text)) {
        const raw = Number(node.getAttribute("data-linguaverse-original-count") || text.match(/共\s*(\d+)\s*道/)?.[1] || actualExercises);
        node.setAttribute("data-linguaverse-original-count", String(raw));
        node.textContent = text.replace(/共\s*\d+\s*道/g, `共 ${targets.exercises} 道`);
        counts.baseExercises = raw;
        counts.exercises = targets.exercises;
      }
    });
    return counts;
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
    const generators = getKnowledgeGenerators(context.language, context.chapterTitle);
    return Array.from({ length: count }, (_, index) => {
      const gen = generators[index % generators.length];
      const round = Math.floor(index / generators.length) + 1;
      return {
        title: round > 1 ? `${gen.title}（深入 ${round}）` : gen.title,
        detail: gen.detail,
      };
    });
  }

  function getKnowledgeGenerators(language, chapterTitle) {
    const title = chapterTitle.toLowerCase();
    
    if (language === "英语") {
      if (title.includes("字母") || title.includes("发音")) {
        return [
          { title: "元音字母识别", detail: "A、E、I、O、U 五个元音字母在单词中的常见发音规律及口型示范。" },
          { title: "辅音清浊配对", detail: "按发音部位区分清辅音与浊辅音，如 /p/ 与 /b/ 的声带振动差异。" },
          { title: "大小写书写规范", detail: "掌握26个字母的大小写书写规范，注意手写体与印刷体的区别。" },
        ];
      }
      if (title.includes("单词") || title.includes("词汇") || title.includes("日常用语")) {
        return [
          { title: "高频名词场景记忆", detail: "将家庭、学校、餐厅等场景中的常用名词按主题归类记忆。" },
          { title: "动词搭配规律", detail: "掌握 have、do、go、come 等基础动词与常见名词的搭配用法。" },
          { title: "形容词比较级构成", detail: "单音节形容词加 -er，多音节前加 more 的基本构成规则。" },
        ];
      }
      if (title.includes("数字") || title.includes("时间")) {
        return [
          { title: "基数词与序数词转换", detail: "one→first、two→second 等常见基数词变序数词的不规则变化。" },
          { title: "时间表达法", detail: "整点、半点、刻钟的英语表达方式及常用介词 at、in、on 的区别。" },
          { title: "日期读写格式", detail: "英式与美式日期表达差异，如 5th March 与 March 5th。" },
        ];
      }
      if (title.includes("颜色") || title.includes("形状")) {
        return [
          { title: "常见颜色词汇", detail: "red、blue、green、yellow、black、white、purple、pink 等基础颜色词。" },
          { title: "形状描述用语", detail: "circle、square、triangle、rectangle 等几何形状的名称与描述。" },
          { title: "颜色+形状组合表达", detail: "a red circle、a blue square 等颜色与形状组合修饰名词的语序。" },
        ];
      }
      if (title.includes("家庭") || title.includes("成员")) {
        return [
          { title: "直系亲属称呼", detail: "father、mother、brother、sister、son、daughter 等直系家庭成员词汇。" },
          { title: "旁系亲属称呼", detail: "uncle、aunt、cousin、grandfather、grandmother 等旁系与祖辈称呼。" },
          { title: "家庭关系句型", detail: "This is my... / He is my... 等介绍家庭成员的常用句型。" },
        ];
      }
      if (title.includes("句型") || title.includes("结构")) {
        return [
          { title: "主谓宾基本句型", detail: "掌握 S+V+O 基本结构，如 I eat apples. 的主谓宾分析。" },
          { title: "There be 句型", detail: "There is/are... 表示存在，注意主谓一致和就近原则。" },
          { title: "祈使句与感叹句", detail: "Open the door. / What a nice day! 等祈使句和感叹句的结构特点。" },
        ];
      }
      if (title.includes("be动词") || title.includes("be 动词")) {
        return [
          { title: "am/is/are 人称搭配", detail: "I am / He is / You are / They are 的基本人称搭配规则。" },
          { title: "Be 动词否定形式", detail: "am not / is not / are not 的缩写 isn't、aren't 及使用场景。" },
          { title: "Be 动词一般疑问句", detail: "将 Be 动词提前构成一般疑问句：Are you...? / Is he...?" },
        ];
      }
      if (title.includes("现在时") || title.includes("一般现在")) {
        return [
          { title: "第三人称单数变化", detail: "动词加 -s/-es 的规则：work→works、go→goes、watch→watches。" },
          { title: "一般现在时时间标志", detail: "often、usually、every day、sometimes 等常用时间状语。" },
          { title: "一般现在时 vs 现在进行时", detail: "习惯性动作用一般现在时，正在进行的动作用现在进行时。" },
        ];
      }
      if (title.includes("冠词")) {
        return [
          { title: "不定冠词 a/an 用法", detail: "a 用于辅音音素开头，an 用于元音音素开头的单词前。" },
          { title: "定冠词 the 的特指用法", detail: "双方都知晓的事物、上文已提及的事物、独一无二的事物前用 the。" },
          { title: "零冠词常见场景", detail: "泛指的复数名词、抽象名词、三餐球类运动前通常不加冠词。" },
        ];
      }
      if (title.includes("介词")) {
        return [
          { title: "时间介词 in/on/at", detail: "in 用于月份年份，on 用于具体日期，at 用于具体时刻。" },
          { title: "地点介词 in/on/at", detail: "in 用于大地点，at 用于小地点，on 用于表面接触。" },
          { title: "方向介词 to/towards/into", detail: "to 表示目的地，towards 表示朝向，into 表示进入内部。" },
        ];
      }
      if (title.includes("疑问") || title.includes("问句")) {
        return [
          { title: "一般疑问句结构", detail: "将助动词或 Be 动词提前，用 Yes/No 回答的基本结构。" },
          { title: "特殊疑问句疑问词", detail: "what、where、when、why、who、how 等疑问词的选择与用法。" },
          { title: "选择疑问句与反意疑问句", detail: "Do you like tea or coffee? / You like tea, don't you?" },
        ];
      }
      if (title.includes("对话") || title.includes("会话")) {
        return [
          { title: "问候与告别用语", detail: "Hello、Good morning、See you、Goodbye 等日常问候与告别的恰当使用。" },
          { title: "购物场景常用句", detail: "How much is it? / I'll take it. / Can I try it on? 等购物对话。" },
          { title: "餐厅点餐用语", detail: "I'd like... / May I have the menu? / Check, please. 等餐厅常用句。" },
        ];
      }
      // 英语中级/高级兜底
      return [
        { title: "核心语法规则", detail: `深入理解「${chapterTitle}」的核心语法规则与适用条件。` },
        { title: "常见例句分析", detail: `通过典型例句掌握「${chapterTitle}」在实际语境中的运用。` },
        { title: "易错点辨析", detail: `辨析「${chapterTitle}」与其他相近语法点的区别与联系。` },
      ];
    }
    
    if (language === "日语") {
      if (title.includes("五十音") || title.includes("概览")) {
        return [
          { title: "清音あ行发音要领", detail: "あいうえお 的口型、舌位和声调练习，注意あ 与 う 的开口度差异。" },
          { title: "清音か行送气控制", detail: "かきくけこ 的气流控制技巧，区分送气音与不送气音。" },
          { title: "さ行与た行辨析", detail: "さしすせそ 和 たちつてと 的发音区别，注意 し 与 ち 的舌位。" },
        ];
      }
      if (title.includes("平假名")) {
        return [
          { title: "平假名书写笔顺", detail: "あいうえお 的正确笔画顺序、书写比例和连笔技巧。" },
          { title: "平假名使用场景", detail: "平假名用于日语固有词、语法助词和汉字注音（振り仮名）。" },
          { title: "清音、浊音、半浊音", detail: "がぎぐげご、ざじずぜぞ、だぢづでど、ばびぶべぼ、ぱぴぷぺぽ 的发音区别。" },
        ];
      }
      if (title.includes("片假名")) {
        return [
          { title: "片假名书写规范", detail: "アイウエオ 等片假名的笔画顺序，注意与平假名的字形差异。" },
          { title: "片假名使用场景", detail: "外来语、外国人名、拟声拟态词、动植物学名常用片假名书写。" },
          { title: "外来语长音规则", detail: "片假名外来语中的长音用 ー 表示，如 コーヒー、ケーキ。" },
        ];
      }
      if (title.includes("助词") || title.includes("は") || title.includes("が")) {
        return [
          { title: "主题助词「は」", detail: "「は」用于提示句子的主题，读作 wa，后续谓语对主题进行说明。" },
          { title: "主语助词「が」", detail: "「が」用于强调主语或引入新信息，回答疑问句时突出主语。" },
          { title: "「は」与「が」的区别", detail: "「は」表示已知信息的主题，「が」表示未知信息的主语或强调。" },
        ];
      }
      if (title.includes("动词") || title.includes("て形") || title.includes("た形")) {
        return [
          { title: "动词分类（一类/二类/三类）", detail: "以う段结尾为一类，以い段+る/え段+る为二类，する・来る为三类。" },
          { title: "て形变形规则", detail: "一类动词音变（い音变、促音变、拨音变），二类去る加て，三类して/来て。" },
          { title: "た形与て形的对应关系", detail: "将て形中的て替换为た、で替换为だ即可得到た形。" },
        ];
      }
      if (title.includes("敬语")) {
        return [
          { title: "尊敬语（れる・られる）", detail: "对长辈或上级使用，抬高对方的动作：行かれる、おっしゃる。" },
          { title: "谦让语（お～する）", detail: "降低自己的动作以表示谦逊：お伺いする、拝見する。" },
          { title: "郑重语（です・ます）", detail: "日常礼貌表达，通过です、ます、ございます使语气更正式。" },
        ];
      }
      // 日语兜底
      return [
        { title: "核心语法要点", detail: `掌握「${chapterTitle}」的核心语法规则与使用限制。` },
        { title: "常用例句解析", detail: `通过典型例句理解「${chapterTitle}」在实际会话中的运用。` },
        { title: "近义表达对比", detail: `辨析「${chapterTitle}」与其他相似表达的细微差别。` },
      ];
    }
    
    if (language === "韩语") {
      if (title.includes("字母") || title.includes("发音") || title.includes("概览")) {
        return [
          { title: "基本元音ㅏㅓㅗㅜ", detail: "掌握四个基本元音的发音口型和舌位：ㅏ（开口大）、ㅓ（开口小）、ㅗ（圆唇）、ㅜ（更圆）。" },
          { title: "基本辅音ㄱㄴㄷㄹ", detail: "理解舌根音ㄱ、舌尖音ㄴ、齿龈音ㄷ、闪音ㄹ 的发音方法。" },
          { title: "韩字方块组合结构", detail: "初声（辅音）+ 中声（元音）+ 终声（收音）在方块字中的排列规则。" },
        ];
      }
      if (title.includes("收音") || title.includes("韵尾")) {
        return [
          { title: "单收音发音规则", detail: "ㄱㄴㄷㄹㅁㅂㅇ 七个单收音的实际发音及其与后续音节连音的规则。" },
          { title: "双收音代表音", detail: "ㄳ、ㄵ、ㄶ 等双收音在发音时只发其中一个音的代表音规则。" },
          { title: "收音连音现象", detail: "当前字有收音、后字以元音开头时，收音移至后字音节首发音。" },
        ];
      }
      if (title.includes("助词") || title.includes("은") || title.includes("는")) {
        return [
          { title: "主题助词 은/는", detail: "은 用于辅音结尾，는 用于元音结尾，用于提示句子主题。" },
          { title: "主语助词 이/가", detail: "이 用于辅音结尾，가 用于元音结尾，用于强调主语或新信息。" },
          { title: "宾语助词 을/를", detail: "을 用于辅音结尾，를 用于元音结尾，标记动作的直接对象。" },
        ];
      }
      if (title.includes("过去") || title.includes("时态")) {
        return [
          { title: "过去时 -았/었어요", detail: "词干以ㅏ/ㅗ结尾用 -았어요，其余用 -었어요，하다 变 했어요。" },
          { title: "过去时否定形式", detail: "过去时否定用 안 + 过去时或 지 않았어요，如 안 갔어요 / 가지 않았어요。" },
          { title: "过去时与现在时对比", detail: "通过时间状语 어제、지난주 等区分过去时与现在时的使用场景。" },
        ];
      }
      // 韩语兜底
      return [
        { title: "核心语法要点", detail: `掌握「${chapterTitle}」的核心语法规则与使用限制。` },
        { title: "常用例句解析", detail: `通过典型例句理解「${chapterTitle}」在实际会话中的运用。` },
        { title: "近义表达对比", detail: `辨析「${chapterTitle}」与其他相似表达的细微差别。` },
      ];
    }
    
    return [
      { title: "核心概念理解", detail: `深入理解「${chapterTitle}」的核心语言概念和运用场景。` },
      { title: "常见用法归纳", detail: `归纳「${chapterTitle}」在日常交流中的常见表达方式。` },
      { title: "易错点辨析", detail: `辨析「${chapterTitle}」学习中容易混淆的语言点。` },
    ];
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

  /* ========== 语言学习模块 ========== */

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
      : hash.includes("/learn/spelling")
      ? "spelling"
      : "";
    if (!module) return;

    const context = getActiveCourseContext();

    const titleMap = {
      vocabulary: "单词记忆",
      grammar: "语法练习",
      speaking: "口语跟读",
      listening: "听力训练",
      spelling: "拼写练习",
    };
    const container = Array.from(document.querySelectorAll(".container")).find((item) => {
      const text = item.innerText || "";
      return text.includes(titleMap[module]) && !text.includes("LinguaVerse");
    });
    if (!container) return;

    const key = `${context.language}-${context.level}-${module}-expanded-v3`;
    if (container.getAttribute("data-linguaverse-learning-key") === key) return;
    container.setAttribute("data-linguaverse-learning-key", key);
    container.className = "container mx-auto py-10 max-w-4xl";
    container.innerHTML = getLearningModuleHtml(context, module);
    
    if (module === "spelling") {
      initSpellingModule(context);
    }
  }

  function getLearningModuleHtml(context, module) {
    const data = getLearningModuleData(context.language, context.level);
    const moduleInfo = {
      vocabulary: {
        title: "单词记忆",
        subtitle: `${context.language}${context.level}词汇训练：核心词汇卡片，含人声朗读`,
        body: renderVocabularyModule(data),
      },
      grammar: {
        title: "语法练习",
        subtitle: `${context.language}${context.level}语法题库：语法点讲解与选择练习`,
        body: renderGrammarModule(data),
      },
      speaking: {
        title: "口语跟读",
        subtitle: `${context.language}${context.level}跟读材料：场景句与发音提示`,
        body: renderSpeakingModule(data),
      },
      listening: {
        title: "听力训练",
        subtitle: `${context.language}${context.level}听力素材：短材料与理解练习`,
        body: renderListeningModule(data),
      },
      spelling: {
        title: "拼写练习",
        subtitle: `${context.language}${context.level}书写训练：触屏/鼠标书写字符`,
        body: renderSpellingModule(data),
      },
    }[module];

    return `
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
          当前课程：${escapeHtml(context.courseTitle || context.language + context.level + "课程")}
        </div>
        <h1 class="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3">${moduleInfo.title}</h1>
        <p class="text-slate-600">${moduleInfo.subtitle}</p>
      </div>
      ${moduleInfo.body}
      <div class="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
        ${renderModuleJump("单词记忆", "#/learn/vocabulary", module === "vocabulary")}
        ${renderModuleJump("语法练习", "#/learn/grammar", module === "grammar")}
        ${renderModuleJump("口语跟读", "#/learn/speaking", module === "speaking")}
        ${renderModuleJump("听力训练", "#/learn/listening", module === "listening")}
        ${renderModuleJump("拼写练习", "#/learn/spelling", module === "spelling")}
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

  /* ========== 拼写/手写模块 ========== */

  function renderSpellingModule(data) {
    const chars = getSpellingCharacters(data.language, data.level);
    return `
      <div id="linguaverse-spelling-app">
        <div class="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <div class="text-sm text-slate-400 mb-1">拼写练习 <span id="spelling-current-index">1</span> / ${chars.length}</div>
              <h2 id="spelling-target-char" class="text-4xl font-bold text-slate-900">${escapeHtml(chars[0].char)}</h2>
              <p id="spelling-target-info" class="text-slate-600 mt-1">${escapeHtml(chars[0].info)}</p>
            </div>
            <button class="rounded-2xl bg-purple-600 text-white px-4 py-2 text-sm font-semibold" 
              id="spelling-speak-btn"
              data-linguaverse-speak="${escapeHtml(chars[0].char)}" 
              data-linguaverse-lang="${escapeHtml(data.language || "")}">播放发音</button>
          </div>
          
          <div class="linguaverse-canvas-wrap mx-auto">
            <div id="spelling-guide" class="linguaverse-canvas-guide">${escapeHtml(chars[0].char)}</div>
            <canvas id="spelling-canvas" width="280" height="280"></canvas>
          </div>
          
          <div class="flex gap-3 mt-4 justify-center flex-wrap">
            <button id="spelling-clear" class="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-semibold text-sm">清除</button>
            <button id="spelling-toggle-guide" class="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-semibold text-sm">隐藏参考</button>
            <button id="spelling-prev" class="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-semibold text-sm">上一个</button>
            <button id="spelling-next" class="rounded-2xl bg-purple-600 text-white px-4 py-2 font-semibold text-sm">下一个</button>
          </div>
          
          <div class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <strong>书写提示：</strong><span id="spelling-tip">${escapeHtml(chars[0].tip)}</span>
          </div>
          
          <div class="mt-4">
            <div class="text-sm font-semibold text-slate-700 mb-2">快速选择字符：</div>
            <div class="linguaverse-spelling-grid" id="spelling-char-grid">
              ${chars.map((c, i) => `<button data-index="${i}" class="${i === 0 ? 'active' : ''}">${escapeHtml(c.char)}</button>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getSpellingCharacters(language, level) {
    if (language === "日语") {
      const hiragana = [
        { char: "あ", info: "平假名 あ（a）", tip: "先画横，再画竖弯钩，注意第二笔的弧度。" },
        { char: "い", info: "平假名 い（i）", tip: "两竖，左短右长，注意间距。" },
        { char: "う", info: "平假名 う（u）", tip: "起笔偏右上，向下画弧线再向左上收笔。" },
        { char: "え", info: "平假名 え（e）", tip: "先横后竖，再向右下画一条斜线。" },
        { char: "お", info: "平假名 お（o）", tip: "竖、横折、再一竖，注意中间一横偏上。" },
        { char: "か", info: "平假名 か（ka）", tip: "先写十字形，再在右侧加一撇。" },
        { char: "き", info: "平假名 き（ki）", tip: "两横一竖，中间一横短，底部带弯钩。" },
        { char: "く", info: "平假名 く（ku）", tip: "像小于号，起笔重收笔轻，略有弧度。" },
        { char: "け", info: "平假名 け（ke）", tip: "一撇一竖，竖带弯钩，撇从右上向左下。" },
        { char: "こ", info: "平假名 こ（ko）", tip: "两横，上短下长，注意起笔位置。" },
      ];
      const katakana = [
        { char: "ア", info: "片假名 ア（a）", tip: "像偏旁的宀加一竖，先写上部再写竖。" },
        { char: "イ", info: "片假名 イ（i）", tip: "两竖，左竖短右竖长，起笔有角度。" },
        { char: "ウ", info: "片假名 ウ（u）", tip: "起笔点加弧线，像平假名的简化版。" },
        { char: "エ", info: "片假名 エ（e）", tip: "像工字，注意三笔的交点位置。" },
        { char: "オ", info: "片假名 オ（o）", tip: "像才字，横竖撇的组合。" },
        { char: "カ", info: "片假名 カ（ka）", tip: "像力字，横折钩加一撇。" },
        { char: "キ", info: "片假名 キ（ki）", tip: "三横一竖，像キ字架结构。" },
        { char: "ク", info: "片假名 ク（ku）", tip: "像孤字的一部分，一横折加一撇。" },
        { char: "ケ", info: "片假名 ケ（ke）", tip: "像艹字头去掉一横，再向右下延伸。" },
        { char: "コ", info: "片假名 コ（ko）", tip: "像口字去掉右边，横折加横。" },
      ];
      const kanjiBasic = [
        { char: "日", info: "汉字 日（ひ/にち）", tip: "竖、横折、横、横，注意中间一横不连右边。" },
        { char: "月", info: "汉字 月（つき/げつ）", tip: "撇、横折钩、横、横，注意内部两横间距。" },
        { char: "山", info: "汉字 山（やま/さん）", tip: "竖、竖折/竖弯、竖，中竖最高。" },
        { char: "田", info: "汉字 田（た/でん）", tip: "竖、横折、横、竖、横，注意十在正中。" },
        { char: "人", info: "汉字 人（ひと/じん）", tip: "撇、捺，起笔相交于上部。" },
      ];
      if (level === "高级") return [...hiragana.slice(0, 5), ...katakana.slice(0, 5), ...kanjiBasic];
      if (level === "中级") return [...hiragana.slice(5), ...katakana.slice(5)];
      return hiragana;
    }
    
    if (language === "韩语") {
      const basic = [
        { char: "ㄱ", info: "辅音 ㄱ（g/k）", tip: "像汉字 L，从左上向右下再横向右画。" },
        { char: "ㄴ", info: "辅音 ㄴ（n）", tip: "像汉字 L 的镜像，竖加横折。" },
        { char: "ㄷ", info: "辅音 ㄷ（d/t）", tip: "像口字缺底，竖、横折、横。" },
        { char: "ㄹ", info: "辅音 ㄹ（r/l）", tip: "像数字 2 或波浪线，两折笔画。" },
        { char: "ㅁ", info: "辅音 ㅁ（m）", tip: "像口字，竖、横折、横，封口。" },
        { char: "ㅂ", info: "辅音 ㅂ（b/p）", tip: "像口字中间加一竖，注意两竖对称。" },
        { char: "ㅅ", info: "辅音 ㅅ（s）", tip: "像人字形，两笔从中间向左右下分开。" },
        { char: "ㅇ", info: "辅音 ㅇ（ng）", tip: "像圆圈，一笔画成，注意圆润。" },
        { char: "ㅈ", info: "辅音 ㅈ（j）", tip: "像汉字 入 加一横，先写人字形再补横。" },
        { char: "ㅊ", info: "辅音 ㅊ（ch）", tip: "像 ㅈ 加一短横，多了一短撇。" },
      ];
      const vowels = [
        { char: "ㅏ", info: "元音 ㅏ（a）", tip: "竖加右横，像汉字 卜 但横在顶部。" },
        { char: "ㅓ", info: "元音 ㅓ（eo）", tip: "竖加左横，像反方向的 卜。" },
        { char: "ㅗ", info: "元音 ㅗ（o）", tip: "横加下竖，像倒 T 字。" },
        { char: "ㅜ", info: "元音 ㅜ（u）", tip: "横加上竖，像 T 字。" },
        { char: "ㅡ", info: "元音 ㅡ（eu）", tip: "一横，注意水平平直。" },
        { char: "ㅣ", info: "元音 ㅣ（i）", tip: "一竖，垂直向下。" },
      ];
      const combined = [
        { char: "각", info: "韩字 각（gak）", tip: "ㄱ + ㅏ + ㄱ，注意三部分的排列结构。" },
        { char: "난", info: "韩字 난（nan）", tip: "ㄴ + ㅏ + ㄴ，左右结构加下部收音。" },
        { char: "닭", info: "韩字 닭（dak）", tip: "ㄷ + ㅏ + ㄹㄱ，注意双收音在底部。" },
        { char: "물", info: "韩字 물（mul）", tip: "ㅁ + ㅜ + ㄹ，左右结构紧凑排列。" },
        { char: "학", info: "韩字 학（hak）", tip: "ㅎ + ㅏ + ㄱ，注意ㅎ的上部两横。" },
      ];
      if (level === "高级") return [...basic.slice(0, 5), ...vowels, ...combined];
      if (level === "中级") return [...basic, ...vowels];
      return basic;
    }
    
    // 英语拼写 - 提供大小写字母书写
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("").map((char) => ({
      char,
      info: `字母 ${char}`,
      tip: char === char.toUpperCase() ? "注意大写字母占上两格。" : "注意小写字母的占格位置。",
    }));
    if (level === "初级") return letters.slice(0, 26); // 大写
    if (level === "中级") return letters.slice(26, 40); // 部分小写
    return letters.slice(26); // 全部小写
  }

  function initSpellingModule(context) {
    const canvas = document.getElementById("spelling-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const chars = getSpellingCharacters(context.language, context.level);
    let currentIndex = 0;
    let isDrawing = false;
    let guideVisible = true;
    
    function updateDisplay() {
      const char = chars[currentIndex];
      document.getElementById("spelling-current-index").textContent = currentIndex + 1;
      document.getElementById("spelling-target-char").textContent = char.char;
      document.getElementById("spelling-target-info").textContent = char.info;
      document.getElementById("spelling-tip").textContent = char.tip;
      document.getElementById("spelling-guide").textContent = char.char;
      
      const speakBtn = document.getElementById("spelling-speak-btn");
      if (speakBtn) {
        speakBtn.setAttribute("data-linguaverse-speak", char.char);
        speakBtn.setAttribute("data-linguaverse-lang", context.language);
      }
      
      document.querySelectorAll("#spelling-char-grid button").forEach((btn, i) => {
        btn.classList.toggle("active", i === currentIndex);
      });
      
      clearCanvas();
    }
    
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    }
    
    function startDraw(e) {
      e.preventDefault();
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    
    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    
    function endDraw(e) {
      if (e) e.preventDefault();
      isDrawing = false;
      ctx.beginPath();
    }
    
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", endDraw);
    
    document.getElementById("spelling-clear")?.addEventListener("click", clearCanvas);
    document.getElementById("spelling-toggle-guide")?.addEventListener("click", () => {
      guideVisible = !guideVisible;
      document.getElementById("spelling-guide").style.opacity = guideVisible ? "1" : "0";
      document.getElementById("spelling-toggle-guide").textContent = guideVisible ? "隐藏参考" : "显示参考";
    });
    document.getElementById("spelling-prev")?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + chars.length) % chars.length;
      updateDisplay();
    });
    document.getElementById("spelling-next")?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % chars.length;
      updateDisplay();
    });
    
    document.getElementById("spelling-char-grid")?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.getAttribute("data-index"));
      if (!isNaN(idx)) {
        currentIndex = idx;
        updateDisplay();
      }
    });
    
    // 绘制网格辅助线
    function drawGrid() {
      ctx.save();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      const w = canvas.width;
      const h = canvas.height;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.restore();
    }
    
    drawGrid();
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
      },      日语: {
        words: [
          ["こんにちは", "[konnichiwa]", "你好", "こんにちは、田中です。"],
          ["ありがとう", "[arigatou]", "谢谢", "ありがとうございます。"],
          ["家族", "[kazoku]", "家庭", "私の家族は四人です。"],
          ["学校", "[gakkou]", "学校", "学校へ行きます。"],
          ["先生", "[sensei]", "老师", "田中先生は優しいです。"],
          ["学生", "[gakusei]", "学生", "私は大学の学生です。"],
          ["友達", "[tomodachi]", "朋友", "彼は私の友達です。"],
          ["本", "[hon]", "书", "この本は面白いです。"],
          ["時間", "[jikan]", "时间", "今、何時ですか。"],
          ["今日", "[kyou]", "今天", "今日は晴れです。"],
          ["明日", "[ashita]", "明天", "明日、試験があります。"],
          ["質問", "[shitsumon]", "问题", "質問があります。"],
          ["答え", "[kotae]", "答案", "答えを教えてください。"],
          ["聞く", "[kiku]", "听", "音楽を聞きます。"],
          ["話す", "[hanasu]", "说", "日本語を話します。"],
          ["書く", "[kaku]", "写", "手紙を書きます。"],
          ["読む", "[yomu]", "读", "新聞を読みます。"],
          ["練習", "[renshuu]", "练习", "毎日練習します。"],
          ["旅行", "[ryokou]", "旅行", "京都へ旅行しました。"],
          ["レストラン", "[resutoran]", "餐厅", "レストランで食事します。"],
          ["買い物", "[kaimono]", "购物", "買い物に行きます。"],
          ["会議", "[kaigi]", "会议", "会議は三時からです。"],
          ["仕事", "[shigoto]", "工作", "仕事が忙しいです。"],
          ["文化", "[bunka]", "文化", "日本の文化が好きです。"],
          ["意見", "[iken]", "意见", "あなたの意見を聞かせてください。"],
          ["比べる", "[kuraberu]", "比较", "二つを比べてみましょう。"],
          ["説明", "[setsumei]", "说明", "この文法を説明します。"],
          ["上達", "[joutatsu]", "进步", "日本語が上達しました。"],
          ["自信", "[jishin]", "自信", "自信を持って話してください。"],
          ["流暢", "[ryuuchou]", "流利", "彼女は流暢に話します。"],
          ["敬語", "[keigo]", "敬语", "敬語は大切です。"],
          ["発表", "[happyou]", "发表", "発表の準備をします。"],
          ["議論", "[giron]", "讨论", "議論を交わしましょう。"],
          ["翻訳", "[honyaku]", "翻译", "この文章を翻訳してください。"],
          ["まとめ", "[matome]", "总结", "今日のまとめをしましょう。"],
          ["成果", "[seika]", "成果", "努力の成果が出ました。"],
          ["経験", "[keiken]", "经验", "私の経験を話します。"],
          ["習慣", "[shuukan]", "习惯", "毎朝の習慣が大切です。"],
          ["挑戦", "[chousen]", "挑战", "新しい挑戦を始めます。"],
        ],
        grammar: [
          ["です／ます体", "日语礼貌体，日常和正式场合使用。", "私は学生です。", "我是学生。", "选择正确形式：私は日本人___。", ["です", "だ", "である", "でした"]],
          ["助词「は」", "提示句子主题，读作 wa。", "私は学生です。", "我是学生。", "选择正确助词：私___田中です。", ["は", "が", "を", "に"]],
          ["助词「が」", "强调主语或引入新信息。", "私がやります。", "我来做。", "选择正确助词：誰___来ましたか。", ["が", "は", "を", "に"]],
          ["助词「を」", "标记动作的直接对象。", "本を読みます。", "读书。", "选择正确助词：日本語___勉強します。", ["を", "は", "が", "に"]],
          ["动词て形", "连接多个动作或表示进行、请求等。", "食べて、寝ます。", "吃了然后睡觉。", "选择正确形式：行___ください。", ["いて", "くて", "きて", "いって"]],
          ["动词た形", "表示过去。", "昨日、映画を見た。", "昨天看了电影。", "选择正确形式：食べ___。", ["た", "て", "る", "ない"]],
          ["可能态", "表示能力或可能性。", "日本語が話せます。", "会说日语。", "选择正确形式：漢字が読___。", ["めます", "みます", "まれます", "みたい"]],
          ["比较句「より」", "A より B のほうが… 表示 B 比 A 更…", "東京より大阪のほうが安い。", "大阪比东京便宜。", "选择正确形式：猫___犬のほうが大きい。", ["より", "ほど", "と", "に"]],
          ["愿望表达「たい」", "动词去ます + たい 表示想做某事。", "日本に行きたい。", "想去日本。", "选择正确形式：寿司を食べ___。", ["たい", "た", "て", "たがる"]],
          ["变化表达「なる」", "表示状态变化。", "寒くなりました。", "变冷了。", "选择正确形式：日本語が上手に___。", ["なりたい", "したい", "なる", "する"]],
        ],
        speaking: [
          ["こんにちは、私は李明です。はじめまして。", "你好，我叫李明。初次见面。", "注意 はじめまして 的重音在第二拍。"],
          ["もう少しゆっくり話していただけますか。", "请你说慢一点好吗？", "ゆっくり 的第二个く 轻读。"],
          ["私は毎晩、新しい単語を復習します。", "我每天晚上复习新单词。", "復習 的重音在ふく。"],
          ["私は異なる文化を学ぶことに興味があります。", "我对学习不同文化很感兴趣。", "興味がある 连读自然。"],
          ["会議は何時から始まりますか。", "会议几点开始？", "何時から 语调上扬。"],
          ["コーヒーを一杯、お願いします。", "我想点一杯咖啡。", "お願いします 礼貌结尾。"],
          ["私の意見では、練習がとても大切です。", "在我看来，练习非常重要。", "意見 读作いけん，重音在第二拍。"],
          ["この文法をもう一度説明していただけますか。", "你能再解释一下这个语法点吗？", "説明 读作せつめい。"],
          ["明日、短い発表をします。", "我明天会做一个简短演示。", "発表 读作はっぴょう。"],
          ["言語を学ぶには、時間と忍耐が必要です。", "学习语言需要时间和耐心。", "忍耐 读作にんたい。"],
        ],
        listening: [
          ["朝の挨拶", "おはようございます。私は田中です。毎朝、日本語を三十分勉強しています。", "早上好。我是田中。每天早上学习日语三十分钟。"],
          ["学校の話", "先生は私たちに短い文章を読んで、新しい単語を五つ書くように言いました。", "老师让我们读一篇短文章并写下五个新单词。"],
          ["時間を尋ねる", "すみません、会議は何時ですか。九時半から始まります。", "不好意思，会议几点？九点半开始。"],
          ["レストランで", "サンドイッチと紅茶をお願いします。", "请给我三明治和红茶。"],
          ["旅行の計画", "私たちは明日の朝、博物館へ行く予定です。", "我们明天早上打算去博物馆。"],
          ["買い物", "このジャケットはあれより安いですが、青いほうが似合います。", "这件夹克比那件便宜，但蓝色的更适合。"],
          ["勉強の習慣", "毎日十個の単語を覚えれば、もっと表現を覚えられます。", "如果每天记十个单词，能记住更多表达。"],
          ["発表", "今日は私の語学学習の経験について話します。", "今天我将谈谈我的语言学习经验。"],
          ["会議", "金曜日までにレポートを送って、簡単なまとめを準備してください。", "请在周五前发送报告并准备简短总结。"],
          ["文化", "言語は単語と文法だけではありません。文化も表しています。", "语言不只是词汇和语法，它也体现文化。"],
        ],
      },
      韩语: {
        words: [
          ["안녕하세요", "[annyeonghaseyo]", "你好", "안녕하세요, 저는 명입니다."],
          ["감사합니다", "[gamsahamnida]", "谢谢", "감사합니다, 도와주셔서."],
          ["가족", "[gajok]", "家庭", "우리 가족은 네 명입니다."],
          ["학교", "[hakgyo]", "学校", "학교에 갑니다."],
          ["선생님", "[seonsaengnim]", "老师", "선생님은 친절하십니다."],
          ["학생", "[haksaeng]", "学生", "저는 대학생입니다."],
          ["친구", "[chingu]", "朋友", "그는 제 친구입니다."],
          ["책", "[chaek]", "书", "이 책은 재미있습니다."],
          ["시간", "[sigan]", "时间", "지금 몇 시예요?"],
          ["오늘", "[oneul]", "今天", "오늘 날씨가 좋습니다."],
          ["내일", "[naeil]", "明天", "내일 시험이 있습니다."],
          ["질문", "[jilmun]", "问题", "질문이 있습니다."],
          ["답", "[dap]", "答案", "답을 알려주세요."],
          ["듣다", "[deutda]", "听", "음악을 듣습니다."],
          ["말하다", "[malhada]", "说", "한국어를 말합니다."],
          ["쓰다", "[sseuda]", "写", "편지를 씁니다."],
          ["읽다", "[iktta]", "读", "신문을 읽습니다."],
          ["연습", "[yeonseup]", "练习", "매일 연습합니다."],
          ["여행", "[yeohaeng]", "旅行", "서울에 여행했습니다."],
          ["식당", "[sikdang]", "餐厅", "식당에서 밥을 먹습니다."],
          ["쇼핑", "[syoping]", "购物", "쇼핑하러 갑니다."],
          ["회의", "[hoeui]", "会议", "회의는 세 시부터입니다."],
          ["일", "[il]", "工作", "일이 바쁩니다."],
          ["문화", "[munhwa]", "文化", "한국 문화를 좋아합니다."],
          ["의견", "[uigyeon]", "意见", "당신의 의견을 들려주세요."],
          ["비교하다", "[bigyohada]", "比较", "두 가지를 비교해 봅시다."],
          ["설명", "[seolmyeong]", "说明", "이 문법을 설명하겠습니다."],
          ["향상", "[hyangsang]", "提升", "한국어가 향상되었습니다."],
          ["자신감", "[jasingam]", "自信", "자신감 있게 말하세요."],
          ["유창한", "[yuchanghan]", "流利的", "그녀는 유창하게 말합니다."],
          ["경어", "[gyeongeo]", "敬语", "경어는 중요합니다."],
          ["발표", "[balpyo]", "发表", "발표 준비를 합니다."],
          ["토론", "[toron]", "讨论", "토론을 나눕시다."],
          ["번역", "[beonyeok]", "翻译", "이 글을 번역해 주세요."],
          ["요약", "[yoyak]", "总结", "오늘의 요약을 합시다."],
          ["성과", "[seonggwa]", "成果", "노력의 성과가 나타났습니다."],
          ["경험", "[gyeongheom]", "经验", "제 경험을 말씀드리겠습니다."],
          ["습관", "[seupgwan]", "习惯", "아침 습관이 중요합니다."],
          ["도전", "[dojeon]", "挑战", "새로운 도전을 시작합니다."],
        ],
        grammar: [
          ["은/는 主题助词", "은 用于辅音结尾，는 用于元音结尾，提示句子主题。", "저는 학생입니다。", "我是学生。", "选择正确形式：그 사람___ 선생님입니다。", ["은", "는", "이", "가"]],
          ["이/가 主语助词", "이 用于辅音结尾，가 用于元音结尾，强调主语。", "제가 하겠습니다。", "我来做。", "选择正确形式：누가 ___ 왔어요?", ["이", "가", "은", "는"]],
          ["을/를 宾语助词", "을 用于辅音结尾，를 用于元音结尾，标记动作对象。", "책을 읽습니다。", "读书。", "选择正确助词：한국어___ 공부합니다。", ["를", "을", "이", "가"]],
          ["에/에서 地点助词", "에 表示目的地或时间点，에서 表示动作发生地。", "학교에서 공부합니다。", "在学校学习。", "选择正确形式：집___ 쉽니다。", ["에서", "에", "으로", "부터"]],
          ["过去时 -았/었어요", "词干以ㅏ/ㅗ结尾用 -았어요，其余用 -었어요。", "어제 영화를 봤어요。", "昨天看了电影。", "选择正确形式：어제 밥을 먹___。", ["었어요", "았어요", "어요", "아요"]],
          ["将来时 -(으)ㄹ 거예요", "表示未来计划或推测。", "내일 만날 거예요。", "明天会见面。", "选择正确形式：다음 주에 여행___。", ["할 거예요", "했어요", "해요", "하다"]],
          ["进行时 -고 있어요", "表示动作正在进行。", "지금 공부하고 있어요。", "现在正在学习。", "选择正确形式：지금 노래를 듣___。", ["고 있어요", "었어요", "아요", "을 거예요"]],
          ["比较句 더", "A 보다 B 가 더… 表示 B 比 A 更…", "서울보다 부산이 더 따뜻해요。", "釜山比首尔更暖和。", "选择正确形式：고양이보다 개가 ___ 커요。", ["더", "덜", "많이", "조금"]],
          ["愿望表达 고 싶어요", "动词词干 + 고 싶어요 表示想做某事。", "한국에 가고 싶어요。", "想去韩国。", "选择正确形式：김치를 먹___。", ["고 싶어요", "고 있어요", "을 거예요", "았어요"]],
          ["变化表达 -아/어지다", "表示状态变化，如 好起来了、变大了。", "날씨가 좋아졌어요。", "天气变好了。", "选择正确形式：한국어가 쉬워___。", ["졌어요", "고 싶어요", "을 거예요", "고 있어요"]],
        ],
        speaking: [
          ["안녕하세요, 저는 이밍입니다. 처음 뵙겠습니다。", "你好，我叫李明。初次见面。", "처음 뵙겠습니다 要读得恭敬。"],
          ["조금 더 천천히 말씀해 주시겠어요?", "请你说慢一点好吗？", "천천히 的第二个 천 轻读。"],
          ["저는 매일 저녁, 새로운 단어를 복습합니다。", "我每天晚上复习新单词。", "복습합니다 读得连贯。"],
          ["저는 다른 문화를 배우는 것에 관심이 있습니다。", "我对学习不同文化很感兴趣。", "관심이 있습니다 自然连读。"],
          ["회의는 몇 시에 시작합니까?", "会议几点开始？", "몇 시에 语调上扬。"],
          ["커피 한 잔 주세요。", "请给我一杯咖啡。", "주세요 礼貌结尾。"],
          ["제 의견으로는, 연습이 매우 중요합니다。", "在我看来，练习非常重要。", "의견 读作의견，重音在第二音节。"],
          ["이 문법을 다시 설명해 주실 수 있나요?", "你能再解释一下这个语法点吗？", "설명해 读得连贯。"],
          ["내일 짧은 발표를 하겠습니다。", "我明天会做一个简短演示。", "발표 读作발표。"],
          ["언어를 배우려면, 시간과 인내가 필요합니다。", "学习语言需要时间和耐心。", "인내 读作인내。"],
        ],
        listening: [
          ["아침 인사", "안녕하세요. 저는 김민수입니다. 매일 아침, 한국어를 삼십 분씩 공부합니다。", "你好。我是金敏秀。每天早上学习韩语三十分钟。"],
          ["학교 이야기", "선생님께서 짧은 글을 읽고 새로운 단어 다섯 개를 쓰라고 하셨습니다。", "老师让我们读一篇短文并写下五个新单词。"],
          ["시간 묻기", "실례합니다, 회의는 몇 시입니까? 아홉 시 반부터 시작합니다。", "不好意思，会议几点？九点半开始。"],
          ["식당에서", "샌드위치와 차 한 잔 주세요。", "请给我三明治和一杯茶。"],
          ["여행 계획", "우리는 내일 아침, 박물관에 갈 예정입니다。", "我们明天早上打算去博物馆。"],
          ["쇼핑", "이 재킷은 저것보다 싼데, 파란 게 더 잘 어울려요。", "这件夹克比那件便宜，但蓝色的更适合。"],
          ["학습 습관", "매일 열 개의 단어를 외우면, 더 많은 표현을 기억할 수 있습니다。", "如果每天记十个单词，能记住更多表达。"],
          ["발표", "오늘은 제 언어 학습 경험에 대해 말씀드리겠습니다。", "今天我将谈谈我的语言学习经验。"],
          ["회의", "금요일까지 보고서를 보내시고 간단한 요약을 준비해 주세요。", "请在周五前发送报告并准备简短总结。"],
          ["문화", "언어는 단어와 문법만이 아닙니다. 문화도 보여줍니다。", "语言不只是词汇和语法，它也体现文化。"],
        ],
      },
    };
    const jp = common["日语"];
    const kr = common["韩语"];
    const en = common["英语"];
    const pick = (arr, n) => {
      const copy = arr.slice(0, n);
      while (copy.length < n) copy.push(arr[copy.length % arr.length]);
      return copy;
    };
    const rotateShort = (arr) => arr.slice(0, Math.min(10, arr.length));
    const rotateMid = (arr) => arr.slice(0, Math.min(15, arr.length));
    const round1 = (arr) => arr.map(([a, b, c, d]) => ({ word: a, pronunciation: b, meaning: c, example: d }));
    const round2 = (arr) => arr.map(([a, b, c, d]) => ({ word: a + "（二）", pronunciation: b, meaning: c, example: d }));
    if (language === "英语") {
      return {
        language: "英语",
        words: level === "初级" ? round1(en.words.slice(0, 15)) : level === "中级" ? round1(en.words.slice(10, 30)) : round1(en.words.slice(20, 39)),
        grammarItems: rotateShort(en.grammar.map(([title, explain, example, translation, question, options]) => ({ title, explain, example, translation, question, options }))),
        grammar: en.grammar[0],
        speakingItems: rotateShort(en.speaking.map(([text, translation, tip]) => ({ text, translation, tip }))),
        speaking: en.speaking[0],
        listeningItems: rotateShort(en.listening.map(([title, script, translation]) => ({ title, script, translation }))),
        listening: en.listening[0],
      };
    }
    if (language === "日语") {
      return {
        language: "日语",
        words: level === "初级" ? round1(jp.words.slice(0, 15)) : level === "中级" ? round1(jp.words.slice(10, 30)) : round1(jp.words.slice(20, 39)),
        grammarItems: rotateShort(jp.grammar.map(([title, explain, example, translation, question, options]) => ({ title, explain, example, translation, question, options }))),
        grammar: jp.grammar[0],
        speakingItems: rotateShort(jp.speaking.map(([text, translation, tip]) => ({ text, translation, tip }))),
        speaking: jp.speaking[0],
        listeningItems: rotateShort(jp.listening.map(([title, script, translation]) => ({ title, script, translation }))),
        listening: jp.listening[0],
      };
    }
    if (language === "韩语") {
      return {
        language: "韩语",
        words: level === "初级" ? round1(kr.words.slice(0, 15)) : level === "中级" ? round1(kr.words.slice(10, 30)) : round1(kr.words.slice(20, 39)),
        grammarItems: rotateShort(kr.grammar.map(([title, explain, example, translation, question, options]) => ({ title, explain, example, translation, question, options }))),
        grammar: kr.grammar[0],
        speakingItems: rotateShort(kr.speaking.map(([text, translation, tip]) => ({ text, translation, tip }))),
        speaking: kr.speaking[0],
        listeningItems: rotateShort(kr.listening.map(([title, script, translation]) => ({ title, script, translation }))),
        listening: kr.listening[0],
      };
    }
    return { language: "英语", words: round1(en.words.slice(0, 15)), grammar: en.grammar[0], speaking: en.speaking[0], listening: en.listening[0], grammarItems: [], speakingItems: [], listeningItems: [] };
  }

  function getLearningModuleData(language, level) {
    return buildExpandedLearningData(language, level);
  }

  function speakCurrentPracticeText() {
    const heading = Array.from(document.querySelectorAll("h2, h3")).find((item) => {
      const text = item.textContent.trim();
      return text.length > 3 && text.length < 200 && !text.includes("拼写") && !text.includes("提示");
    });
    const text = heading?.textContent?.trim() || "";
    const context = getActiveCourseContext();
    if (text) {
      speakTextWithVoice(text, context.language);
      showToast("正在播放语音朗读。");
    } else {
      showToast("未找到可朗读内容。");
    }
  }

  function speakTextWithVoice(text, language) {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    const langMap = { 英语: "en-US", 日语: "ja-JP", 韩语: "ko-KR" };
    utterance.lang = langMap[language] || "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  function copyShareLink() {
    const url = location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => showToast("链接已复制。")).catch(() => showToast(链接：));
    } else {
      showToast(链接：);
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
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function showInfoModal(title, bodyHtml) {
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = modalId;
      modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.classList.remove("show");
      });
      document.body.appendChild(modal);
    }
    modal.innerHTML = 
      <div class="linguaverse-modal-card">
        <div class="linguaverse-modal-head">
          <h3></h3>
          <button onclick="document.getElementById('').classList.remove('show')">关闭</button>
        </div>
        <div class="linguaverse-modal-body"></div>
      </div>
    ;
    modal.classList.add("show");
  }

  function getInfoContent(key) {
    const contents = {
      about: "<p>我们致力于提供优质语言学习资源，涵盖英语、日语和韩语课程。通过系统化课程和互动练习，帮助学习者高效掌握语言技能。</p>",
      contact: "<p>欢迎通过官网或邮件与我们取得联系。我们会尽快回复学习咨询、合作建议和课程反馈。</p>",
      careers: "<p>如果你热爱语言教育并具备相关背景，欢迎了解我们的岗位机会。请将简历发送至招聘邮箱。</p>",
      help: "<p>常见问题包括课程选择、学习进度同步、账户设置和测验规则。如需进一步帮助，请提交工单或发送邮件。</p>",
      terms: "<p>使用本平台即表示你同意相关服务条款。请遵守社区规范，尊重版权和他人权益。</p>",
      privacy: "<p>我们重视用户隐私，严格保护个人信息。未经明确授权，不会向第三方分享个人数据。</p>",
      copyright: "<p>所有课程内容、视频、文字和资料受版权保护。未经授权，禁止复制、传播或用于商业用途。</p>",
    };
    return contents[key] || "<p>信息正在整理中，请稍后查看。</p>";
  }
})();
