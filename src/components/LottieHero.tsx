import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function LottieHero() {
  return (
    <div className="w-full h-72 md:h-96 flex items-center justify-center">
      <Player
        autoplay
        loop
        src="https://assets5.lottiefiles.com/packages/lf20_xyadoh9h.json"
        style={{ height: '100%', width: '100%', willChange: 'transform' }}
        speed={1}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
      />
    </div>
  );
} 