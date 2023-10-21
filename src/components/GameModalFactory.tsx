import useGameStore from '../hooks/useGameStore';
import { GameModals } from '../types/Words';

import BaseModal from './BaseModal';
import HelpModal from './HelpModal';
import LoseModal from './LoseModal';
import WinModal from './WinModal';

function GameModalFactory() {
  const onClose = useGameStore((store) => store.closeModal);
  const isOpen = useGameStore((store) => store.isModalOpen);
  const modalType = useGameStore((store) => store.modalType);
  const modalTitle = useGameStore((store) => store.modalTitle);

  let modal = null;

  switch (modalType) {
    case GameModals.help:
      modal = <HelpModal />;
      break;
    case GameModals.lose:
      modal = <LoseModal />;
      break;
    case GameModals.win:
      modal = <WinModal />;
      break;
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      {modal}
    </BaseModal>
  );
}

export default GameModalFactory;
