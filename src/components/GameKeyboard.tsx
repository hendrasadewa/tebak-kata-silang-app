import { KeyboardEvent, useEffect } from 'react';
import useGameStore from '../hooks/useGameStore';
import AlphabetButton from './AlphabetButton';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

function GameKeyboard() {
  const { load, play } = useGlobalAudioPlayer();
  const keyboard = useGameStore((store) => store.keyboard);
  const submitAnswer = useGameStore((store) => store.submitAnswer);
  const chances = useGameStore((store) => store.chances);
  const disableKeyboard = useGameStore((store) => store.disableKeyboard);

  const handleClick = (letter: string) => {
    submitAnswer(letter);
    play();
  };

  const handleKeypress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Meta') {
      return;
    }
    handleClick(e.key);
  };

  useEffect(() => {
    load('/sounds/button_switch_on.wav', {
      autoplay: false,
    });
  }, []);

  useEffect(() => {
    if (chances <= 0) {
      disableKeyboard();
      return;
    }
  }, [chances]);

  return (
    <div
      className="grid grid-cols-10 w-full gap-1 outline-none"
      onKeyDown={handleKeypress}
      tabIndex={0}
      ref={(ref) => ref?.focus()}
    >
      {keyboard.map((value) => (
        <AlphabetButton
          key={`button-${value.letter}`}
          letter={value.letter}
          isDisabled={value.isDisabled}
          onClick={handleClick}
          status={value.status}
        />
      ))}
    </div>
  );
}

export default GameKeyboard;
