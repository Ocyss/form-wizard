import type { DefineSetupFnComponent } from 'vue'
import { computed, ref } from 'vue'
import AddressAssistant from '@/components/cards/AddressAssistant'
import EmailGenerator from '@/components/cards/EmailGenerator'
import PasswordGenerator from '@/components/cards/PasswordGenerator'
import TimeCapsuleVault from '@/components/cards/TimeCapsuleVault'
import { useStore } from './useStore'

export interface CardInfo {
  key: string
  title: string
  description: string
  icon: string
}
export type CardRender = DefineSetupFnComponent<{ editState: boolean }>

export interface Card extends CardInfo {
  render: CardRender
}

const cardsComponents: Card[] = [
  AddressAssistant(),
  EmailGenerator(),
  PasswordGenerator(),
  TimeCapsuleVault(),
]

const editState = ref(false)

const cardMap = cardsComponents.reduce((acc, card) => {
  acc[card.key] = card
  return acc
}, {} as Record<string, Card>)

interface CardState {
  key: string
  isTemp?: boolean
}

const cardsRef = useStore<CardState[]>('cards', [])

const usedCards = computed(() => {
  return cardsComponents.filter(card => cardsRef.value.some(ref => ref.key === card.key))
})

const unusedCards = computed(() => {
  return cardsComponents.filter((card) => {
    const ref = cardsRef.value.find(ref => ref.key === card.key)
    return !ref || ref.isTemp
  })
})

export function useCards() {
  async function initCards() {
    editState.value = false
    await cardsRef.init()
    return cardsRef.value
  }

  function deleteCard(key: string, isEdit = false) {
    if (isEdit) {
      editState.value = true
    }
    cardsRef.value = cardsRef.value.filter(ref => ref.key !== key)
  }

  function addCard(data: CardState, isEdit = false) {
    if (isEdit) {
      editState.value = true
    }
    const ref = cardsRef.value.find(ref => ref.key === data.key)
    if (ref) {
      ref.isTemp = data.isTemp
    }
    else {
      cardsRef.value.push(data)
    }
  }

  async function saveCards() {
    await cardsRef.save((v) => {
      return v.filter(ref => !ref.isTemp)
    })
    editState.value = false
  }

  return {
    cards: cardsRef,
    editState,
    cardMap,
    usedCards,
    unusedCards,
    initCards,
    deleteCard,
    addCard,
    saveCards,
  }
}
