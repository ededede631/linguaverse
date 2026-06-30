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
    const text = `${title} ${document.body.innerText}`.replace(/\s+/g, " ");
    const t = text.toLowerCase();

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
    if (context.language === "英语") return;

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

    const key = `${context.language}-${context.level}-${module}`;
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
        subtitle: `${context.language}${context.level}词汇训练，不再混用英语内容`,
        body: renderVocabularyModule(data),
      },
      grammar: {
        title: "语法练习",
        subtitle: `${context.language}${context.level}语法题库，围绕当前课程知识点训练`,
        body: renderGrammarModule(data),
      },
      speaking: {
        title: "口语跟读",
        subtitle: `${context.language}${context.level}跟读材料，适配当前课程发音与会话目标`,
        body: renderSpeakingModule(data),
      },
      listening: {
        title: "听力训练",
        subtitle: `${context.language}${context.level}听力素材，按课程阶段循序渐进`,
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
      <div class="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div class="text-sm text-slate-400 mb-2">语法重点</div>
        <h2 class="text-2xl font-bold text-slate-900 mb-3">${escapeHtml(data.grammar.title)}</h2>
        <p class="text-slate-600 mb-5">${escapeHtml(data.grammar.explain)}</p>
        <div class="rounded-2xl bg-slate-50 p-4 mb-5">
          <div class="text-sm text-slate-500 mb-1">例句</div>
          <div class="text-xl font-semibold text-slate-900">${escapeHtml(data.grammar.example)}</div>
          <div class="text-slate-500 mt-1">${escapeHtml(data.grammar.translation)}</div>
        </div>
        <h3 class="font-bold text-slate-900 mb-3">${escapeHtml(data.grammar.question)}</h3>
        <div class="grid sm:grid-cols-2 gap-3">
          ${data.grammar.options
            .map((option) => `<button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-purple-300 hover:bg-purple-50">${escapeHtml(option)}</button>`)
            .join("")}
        </div>
      </div>
    `;
  }

  function renderSpeakingModule(data) {
    return `
      <div class="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div class="text-sm text-slate-400 mb-2">跟读句子</div>
        <h2 class="text-2xl font-bold text-slate-900 mb-3">${escapeHtml(data.speaking.text)}</h2>
        <p class="text-slate-600 mb-5">${escapeHtml(data.speaking.translation)}</p>
        <div class="grid sm:grid-cols-3 gap-3">
          <button class="rounded-2xl bg-purple-600 text-white px-4 py-3 font-semibold">播放原音</button>
          <button class="rounded-2xl bg-slate-900 text-white px-4 py-3 font-semibold">开始跟读</button>
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold">下一句</button>
        </div>
        <div class="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          发音提示：${escapeHtml(data.speaking.tip)}
        </div>
      </div>
    `;
  }

  function renderListeningModule(data) {
    return `
      <div class="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div class="text-sm text-slate-400 mb-2">听力材料</div>
        <h2 class="text-2xl font-bold text-slate-900 mb-3">${escapeHtml(data.listening.title)}</h2>
        <p class="text-slate-700 leading-8 mb-5">${escapeHtml(data.listening.script)}</p>
        <div class="rounded-2xl bg-slate-50 p-4 mb-5 text-slate-600">${escapeHtml(data.listening.translation)}</div>
        <div class="grid sm:grid-cols-3 gap-3">
          <button class="rounded-2xl bg-purple-600 text-white px-4 py-3 font-semibold">点击播放语音朗读</button>
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold">开始测验</button>
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold">标记完成</button>
        </div>
      </div>
    `;
  }

  function getLearningModuleData(language, level) {
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

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[A-Za-z]/.test(text) ? "en-US" : "zh-CN";
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
