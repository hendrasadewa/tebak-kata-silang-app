import { nanoid } from 'nanoid';
import { useEffect } from 'react';

// Components
import GameModalFactory from './components/GameModalFactory';
import GameKeyboard from './components/GameKeyboard';
import Healthbar from './components/Healthbar';
import Help from './components/Help';
import Plane from './components/Plane';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    window.localStorage.setItem('gameid', nanoid());
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col h-screen justify-between">
      <Header />
      <main className="px-4 mx-auto max-w-lg w-full pt-2 pb-4 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center w-full">
          <Help />
          <Healthbar />
        </div>
        <div className="py-2 flex items-center justify-center w-full">
          <Plane />
        </div>
        <div>
          <GameKeyboard />
        </div>
      </main>
      <Footer />
      <GameModalFactory />
    </div>
  );
}
