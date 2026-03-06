import { browser, defineBackground } from "#imports";

// 生成值的函数
function generateValues(domain: string = "example.com") {
  return {
    "password-1": Date.now().toString(),
    "password-2": Math.random().toString(36).substring(2, 14),
    "email-1": `user@${domain}`,
    "email-2": `${domain}@gmail.com`,
  };
}

export default defineBackground(() => {
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

  // 创建右键菜单
  browser.runtime.onInstalled.addListener(() => {
    // 创建主菜单项
    browser.contextMenus.create({
      id: "form-wizard-main",
      title: "表单助手",
      contexts: ["editable"],
    });

    // 创建随机密码子菜单
    browser.contextMenus.create({
      id: "random-password-parent",
      title: "随机密码",
      parentId: "form-wizard-main",
      contexts: ["editable"],
    });

    // 创建域名邮箱子菜单
    browser.contextMenus.create({
      id: "domain-email-parent",
      title: "域名邮箱",
      parentId: "form-wizard-main",
      contexts: ["editable"],
    });

    // 随机密码选项 - 初始值
    browser.contextMenus.create({
      id: "password-1",
      title: "加载中...",
      parentId: "random-password-parent",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "password-2",
      title: "加载中...",
      parentId: "random-password-parent",
      contexts: ["editable"],
    });

    // 域名邮箱选项 - 初始值
    browser.contextMenus.create({
      id: "email-1",
      title: "加载中...",
      parentId: "domain-email-parent",
      contexts: ["editable"],
    });

    browser.contextMenus.create({
      id: "email-2",
      title: "加载中...",
      parentId: "domain-email-parent",
      contexts: ["editable"],
    });
  });

  // 监听来自content script的更新请求
  browser.runtime.onMessage.addListener((message: { action: string }, sender, sendResponse) => {
    if (message.action === "updateContextMenu" && sender.tab?.url) {
      const currentUrl = new URL(sender.tab.url);
      const domain = currentUrl.hostname;
      const values = generateValues(domain);

      // 更新菜单项标题为实际值
      void browser.contextMenus.update("password-1", {
        title: `🔑 ${values["password-1"]}`,
      });

      void browser.contextMenus.update("password-2", {
        title: `🎲 ${values["password-2"]}`,
      });

      void browser.contextMenus.update("email-1", {
        title: `📧 ${values["email-1"]}`,
      });

      void browser.contextMenus.update("email-2", {
        title: `📮 ${values["email-2"]}`,
      });

      sendResponse({ success: true });
    }
  });

  // 处理菜单点击事件
  browser.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info, tab);
    if (!tab?.id || !tab.url) return;

    const currentUrl = new URL(tab.url);
    const domain = currentUrl.hostname;
    const values = generateValues(domain);

    // 直接使用生成的值
    const textToInsert = values[info.menuItemId as keyof typeof values];

    if (textToInsert) {
      // 向content script发送消息
      void browser.tabs.sendMessage(tab.id, {
        action: "insertText",
        text: textToInsert,
      });
    }
  });
});
