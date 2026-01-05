import { EventEmitter } from "excalibur"
import { DialogAdvanced, CloseDialogEvent, InteractionCompleteEvent, InteractionStartEvent, LetterTyped, ShowDialogEvent, TypingComplete, TypingStart, DialogAdvancing, TypingForceComplete } from "./events"

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
  typingForceComplete: TypingForceComplete;
  typingStart: TypingStart;
  letterTyped: LetterTyped;
  dialogAdvancing: DialogAdvancing;
  dialogAdvanced: DialogAdvanced;
}

export const TypeWriterEvents = {
  TypingComplete: 'typingComplete',
  TypingForceComplete: 'typingForceComplete',
  TypingStart: 'typingStart',
  LetterTyped: 'letterTyped',
  DialogAdvancing: 'dialogAdvancing',
  DialogAdvanced: 'dialogAdvanced',
} as const;

export type QuickQuestEvents = PlayerEvents & DialogEvents & TypeWriterEvents;

export const conley = new EventEmitter<QuickQuestEvents>();