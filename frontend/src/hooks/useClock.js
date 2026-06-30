// Provides a live date and time string updated every second.

import { useState, useEffect } from 'react';

const SWAHILI_MONTHS = [
  'Januari','Februari','Machi','Aprili','Mei','Juni',
  'Julai','Agosti','Septemba','Oktoba','Novemba','Desemba',
];

const SWAHILI_DAYS = [
  'Jumapili','Jumatatu','Jumanne','Jumatano','Alhamisi','Ijumaa','Jumamosi',
];

export function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const day   = SWAHILI_DAYS[now.getDay()];
  const date  = `${day}, ${now.getDate()} ${SWAHILI_MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const time  = now.toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });

  return { now, date, time };
}