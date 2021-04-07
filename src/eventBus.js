// EventBus
let EventBus

export function setEventBus(bus) {
  EventBus = bus
}

export default function eventBus() {
  if (!EventBus) {
    console.error('Please provide a event bus through `setEventBus` function!')
  }

  return EventBus
}
