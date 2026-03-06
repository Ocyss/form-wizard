import type { Adapter, Message, OnMessage, SendMessage } from "comctx";
import { browser, defineContentScript } from "#imports";

class _ProvideAdapter implements Adapter {
  sendMessage: SendMessage = (message) => {
    void browser.runtime.sendMessage(browser.runtime.id, {
      ...message,
      url: document.location.href,
    });
  };

  onMessage: OnMessage = (callback) => {
    const handler = (message: Partial<Message> | undefined): undefined => {
      callback(message);
    };
    browser.runtime.onMessage.addListener(handler);
    return () => browser.runtime.onMessage.removeListener(handler);
  };
}

// 处理文本插入功能
function insertTextToActiveElement(text: string) {
  const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

  if (
    activeElement &&
    (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
  ) {
    const start = activeElement.selectionStart || 0;
    const end = activeElement.selectionEnd || 0;
    const value = activeElement.value;

    // 插入文本
    activeElement.value = value.substring(0, start) + text + value.substring(end);

    // 设置光标位置
    const newPosition = start + text.length;
    activeElement.setSelectionRange(newPosition, newPosition);

    // 触发input事件，确保框架能检测到变化
    activeElement.dispatchEvent(new Event("input", { bubbles: true }));
    activeElement.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    // 如果没有聚焦的输入框，尝试查找最近点击的输入框
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"], textarea',
    );
    if (inputs.length > 0) {
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement | HTMLTextAreaElement;
      lastInput.focus();
      lastInput.value = text;
      lastInput.dispatchEvent(new Event("input", { bubbles: true }));
      lastInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

export default defineContentScript({
  registration: "runtime",
  async main(_ctx) {
    // 监听来自background的消息
    browser.runtime.onMessage.addListener(
      (message: { action: string; text: string }, sender, sendResponse) => {
        if (message.action === "insertText") {
          insertTextToActiveElement(message.text);
          sendResponse({ success: true });
        }
      },
    );

    // 添加右键事件监听，在右键时更新菜单
    document.addEventListener("mousedown", (event) => {
      // 检查是否在可编辑元素上右键
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.contentEditable === "true")
      ) {
        // 向background发送更新菜单的请求
        browser.runtime
          .sendMessage({
            action: "updateContextMenu",
          })
          .catch((error) => {
            console.log("更新菜单失败:", error);
          });
      }
    });

    // return formService.queryAllForms()
  },
});
