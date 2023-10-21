import { useEffect } from 'react';

import useGameStore from '../hooks/useGameStore';
import { mockAnswer } from '../__mocks__/useGameState.mock';
import { compareGameAnswers } from '../utils/gameUtils';
import { GameResult } from '../types/Words';

import LetterCell from './LetterCell';

function Plane() {
  const userAnswer = useGameStore((store) => store.userAnswer || []);
  const loadAnswer = useGameStore((store) => store.loadAnswer);
  const correctAnswer = useGameStore((store) => store.correctAnswer);
  const setResult = useGameStore((store) => store.setResult);

  useEffect(() => {
    loadAnswer(mockAnswer);
  }, []);

  useEffect(() => {
    if (!correctAnswer || !userAnswer) {
      return;
    }

    const isAnswerComplete = compareGameAnswers(correctAnswer, userAnswer);
    if (isAnswerComplete) {
      setResult(GameResult.win);
    }
  }, [userAnswer, correctAnswer]);

  return (
    <div className="flex items-center justify-center flex-col">
      {userAnswer.map((row, rowIndex) => (
        <div key={`cell-${rowIndex}`} className="flex">
          {row.map((cell, columnIndex) => (
            <LetterCell
              key={`cell-${columnIndex}-${rowIndex}`}
              value={cell || ''}
              disabled={cell === null}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Plane;
