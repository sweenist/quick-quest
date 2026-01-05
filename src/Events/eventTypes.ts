import { EventEmitter } from "excalibur"
import { CloseDialogEvent, InteractionCompleteEvent, InteractionStartEvent, LetterTyped, ShowDialogEvent, TypingComplete, TypingStart } from "./events"

interface PlayerEvents {
  startInteraction: InteractionStartEvent
  completeInteraction: InteractionCompleteEvent
}

export const PlayerEvents = {
  StartInteraction: 'startInteraction',
  CompleteInteraction: 'completeInteraction'
} as const

interface DialogEvents {
  showDialog: ShowDialogEvent;
  closeDialog: CloseDialogEvent;
}

export const DialogEvents = {
  ShowDialog: 'showDialog',
  CloseDialog: 'closeDialog'
} as const;

interface TypeWriterEvents {
  typingComplete: TypingComplete;
  typingStart: TypingStart;
  letterTyped: LetterTyped;
}

export const TypeWriterEvents = {
  TypingComplete: 'typingComplete',
  TypingStart: 'typingStart',
  LetterTyped: 'letterTyped',
}

export type QuickQuestEvents = PlayerEvents & DialogEvents & TypeWriterEvents;

export const conley = new EventEmitter<QuickQuestEvents>();