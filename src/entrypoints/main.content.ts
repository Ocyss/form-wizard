import type { Adapter, Message, OnMessage, SendMessage } from 'comctx'
import { browser, defineContentScript } from '#imports'
import { provideFormService } from '@/service/formService'

class ProvideAdapter implements Adapter {
  sendMessage: SendMessage = (message) => {
    void browser.runtime.sendMessage(browser.runtime.id, { ...message, url: document.location.href })
  }

  onMessage: OnMessage = (callback) => {
    const handler = (message: Partial<Message> | undefined): undefined => {
      callback(message)
    }
    browser.runtime.onMessage.addListener(handler)
    return () => browser.runtime.onMessage.removeListener(handler)
  }
}

const formService = provideFormService(new ProvideAdapter())

export default defineContentScript({
  registration: 'runtime',
  async main(_ctx) {
    return formService.queryAllForms()
  },
})
