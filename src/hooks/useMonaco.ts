import { useEffect, useState } from 'react';
import { loader } from '@monaco-editor/react';
import monaco from '../monacoLoader';

export const useMonaco = () => {
  const [isMonacoReady, setIsMonacoReady] = useState(false);

  useEffect(() => {
    loader.config({ monaco });
    
    loader.init().then(() => {
      setIsMonacoReady(true);
    }).catch((error) => {
      console.error('Monaco editor initialization failed:', error);
    });
  }, []);

  return { isMonacoReady };
}; 