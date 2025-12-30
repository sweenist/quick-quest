import { ActorEvents } from "excalibur"
import { CloseDialogEvent, InteractionCompleteEvent, InteractionStartEvent, ShowDialogEvent } from "./events"

type PlayerEvents = {
  startInteraction: InteractionStartEvent
  completeInteraction: InteractionCompleteEvent
}

export const PlayerEvents = {
  StartInteraction: 'startInteraction',
  CompleteInteraction: 'completeInteraction'
} as const

export type DialogEvents = {
  showDialog: ShowDialogEvent;
  closeDialog: CloseDialogEvent;
}

export const DialogEvents = {
  ShowDialog: 'showDialog',
  CloseDialog: 'closeDialog'
} as const;

export type QuickQuestEvents = PlayerEvents & DialogEvents & ActorEvents;