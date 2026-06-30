(function () {
  "use strict";

  const toastId = "linguaverse-toast";
  const modalId = "linguaverse-modal";
  const fixedAttr = "data-linguaverse-fixed";

  blockViteClientRequests();
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
    formatCourseDurations();
    makeFooterItemsClickable();
    labelIconButtons();
    markDemoButtons();
  }

  function formatCourseDurations() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const original = node.nodeValue;
      const replaced = original.replace(/(\d+\.\d{2,})\s*小时/g, (_, raw) => {
        const totalMinutes = Math.round(Number(raw) * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours && minutes) return `${hours}小时${minutes}分钟`;
        if (hours) return `${hours}小时`;
        return `${minutes}分钟`;
      });
      if (replaced !== original) node.nodeValue = replaced;
    });
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

      if (["发布", "分享", "关注", "编辑", "加入收藏", "开始学习", "查看详情", "播放原音", "点击播放语音朗读", "开始测验", "标记完成"].includes(text)) {
        button.setAttribute(fixedAttr, "demo-button");
      }
    });
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

        if (text === "发布") {
          event.preventDefault();
          showInfoModal("发布学习动态", "这是静态演示站，暂未接入后端发布服务。正式版会支持发布文字、图片、学习打卡和评论互动。");
          return;
        }

        if (text === "分享") {
          event.preventDefault();
          copyShareLink();
          return;
        }

        if (text === "关注") {
          event.preventDefault();
          target.textContent = "已关注";
          showToast("已关注该学习达人。");
          return;
        }

        if (text === "编辑") {
          event.preventDefault();
          showInfoModal("编辑个人资料", "当前为演示账号，个人资料暂不保存到服务器。正式版会支持修改头像、目标语言、当前水平和每日学习目标。");
          return;
        }

        if (text === "加入收藏") {
          event.preventDefault();
          target.textContent = "已收藏";
          showToast("课程已加入收藏。");
          return;
        }

        if (text === "开始学习" && hash.includes("/courses/")) {
          event.preventDefault();
          location.hash = "#/learn/vocabulary";
          showToast("已进入单词记忆模块。");
          return;
        }

        if (text === "播放原音" || text === "点击播放语音朗读") {
          event.preventDefault();
          speakCurrentPracticeText();
          return;
        }

        if (text === "开始测验") {
          event.preventDefault();
          showInfoModal("听力测验", "测验功能已预留入口。当前演示版可先完成听力播放、原文和翻译查看；正式版会提供选择题和听写题。");
          return;
        }

        if (text === "标记完成") {
          event.preventDefault();
          target.textContent = "已完成";
          showToast("已标记为完成，本次学习记录已更新到页面状态。");
          return;
        }
      },
      true
    );
  }

  function fixAnchorNavigation(anchor, event) {
    const href = anchor.getAttribute("href") || "";
    const text = anchor.textContent.trim().replace(/\s+/g, " ");

    if (href.endsWith("#/grammar")) {
      event.preventDefault();
      location.hash = "#/learn/grammar";
      return;
    }
    if (href.endsWith("#/speaking")) {
      event.preventDefault();
      location.hash = "#/learn/speaking";
      return;
    }
    if (href.endsWith("#/listening")) {
      event.preventDefault();
      location.hash = "#/learn/listening";
      return;
    }

    if (["设置", "我的动态", "我的成就"].includes(text)) {
      showToast(`已进入「${text}」相关页面。`);
    }
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
      about: "LinguaVerse 是一个多语言学习演示平台，覆盖英语、日语、韩语课程和听说读写训练模块。",
      contact: "联系邮箱：hello@linguaverse.demo<br>当前为静态演示站，邮箱仅作展示。",
      careers: "欢迎关注后续版本。正式版会开放课程教研、产品设计和社区运营等岗位信息。",
      help: "你可以从课程中心选择课程，也可以进入单词、语法、口语、听力模块进行练习。",
      terms: "用户协议页面已预留。当前演示站不会收集真实账号数据，请勿输入敏感信息。",
      privacy: "隐私政策页面已预留。当前站点主要使用浏览器本地状态展示登录与学习进度。",
      copyright: "© 2024 LinguaVerse. All rights reserved. 页面素材仅用于演示。",
    };
    return content[type] || "该页面正在准备中。";
  }
})();
