import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  Answer,
  GameKeyboardState,
  GameKeyboardStatus,
  GameModals,
  GameResult,
  GameStatus,
} from '../types/Words';
import {
  ALPHABET_ARRAY,
  MAX_INCORRECT_ANSWER_CHANCES,
  MODALS,
} from '../constants/gameConstants';
import { checkChoice, createInitialUserAnswer } from '../utils/gameUtils';
import { createGameKeyboard } from '../utils/keyboardUtils';

interface State {
  // Game
  status: GameStatus;
  result: GameResult;
  chances: number;
  correctAnswer?: Answer;
  userAnswer?: Answer;
  startTime?: Date;
  stopTime?: Date;

  // Keyboard
  keyboardLayout: string;
  keyboard: GameKeyboardState[];

  // Modals
  isModalOpen: boolean;
  modalType: GameModals;
  modalTitle: string;
}

interface Action {
  loadAnswer(correctAnswer: Answer): void;
  submitAnswer(letter: string): void;
  setResult(result: GameResult): void;

  // Keyboard
  loadKeyboard(layout: string): void;
  disableKeyboard(): void;

  // Modals
  openModal: (modalType: GameModals) => void;
  closeModal: () => void;
}

const useGameStore = create(
  immer<State & Action>((set) => ({
    status: GameStatus.initial,
    result: GameResult.noresult,
    chances: MAX_INCORRECT_ANSWER_CHANCES,
    correctAnswer: undefined,
    userAnswer: undefined,
    startTime: undefined,
    stopTime: undefined,
    // Keyboard
    keyboardLayout: ALPHABET_ARRAY,
    keyboard: createGameKeyboard(ALPHABET_ARRAY),
    // Modals
    isModalOpen: false,
    modalType: GameModals.help,
    modalTitle: MODALS[GameModals.help].title,

    closeModal() {
      set((draft) => {
        draft.isModalOpen = false;
      });
    },

    openModal(modalType) {
      set((draft) => {
        draft.modalType = modalType;
        draft.isModalOpen = true;
      });
    },

    loadAnswer(correctAnswer: Answer) {
      set((draft) => {
        draft.correctAnswer = correctAnswer;
        draft.userAnswer = createInitialUserAnswer(correctAnswer);
        draft.status = GameStatus.started;
        draft.startTime = new Date();
      });
    },

    submitAnswer(letter: string) {
      set((draft) => {
        if (!draft.correctAnswer || !draft.userAnswer) {
          return;
        }

        const isCorrect = checkChoice(draft.correctAnswer, letter);

        if (!isCorrect) {
          draft.chances = draft.chances - 1;
        }

        draft.keyboard = draft.keyboard.map((element) => {
          if (element.letter === letter) {
            return {
              letter: letter,
              isDisabled: true,
              status: isCorrect
                ? GameKeyboardStatus.correct
                : GameKeyboardStatus.incorrect,
            };
          }
          return element;
        });

        draft.userAnswer = draft.userAnswer.map((row, rowIndex) =>
          row.map((cell, columnIndex) => {
            if (!draft.correctAnswer) {
              return cell;
            }

            const correctLetter = draft.correctAnswer[rowIndex][columnIndex];
            if (correctLetter === letter) {
              return letter;
            }
            return cell;
          })
        );
      });
    },

    setResult(result: GameResult) {
      set((draft) => {
        draft.result = result;
        if (result === GameResult.noresult) {
          draft.status = GameStatus.onprogress;
          return;
        }

        draft.status = GameStatus.stopped;
        draft.stopTime = new Date();

        if (result === GameResult.win) {
          draft.modalType = GameModals.win;
        }

        if (result === GameResult.lose) {
          draft.modalType = GameModals.lose;
        }

        draft.isModalOpen = true;
      });
    },

    // Keyboard
    loadKeyboard(layout: string) {
      set((draft) => {
        draft.keyboardLayout = layout;
        draft.keyboard = createGameKeyboard(layout);
      });
    },

    disableKeyboard() {
      set((draft) => {
        draft.keyboard = draft.keyboard.map((element) => ({
          ...element,
          isDisabled: true,
        }));
      });
    },
  }))
);

export default useGameStore;
