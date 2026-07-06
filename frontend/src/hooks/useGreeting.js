// frontend/src/hooks/useGreeting.js
// Returns a Swahili greeting ("Habari za Asubuhi/Mchana/Jioni") that updates
// automatically as time passes, without requiring the page to be reloaded —
// e.g. if a user leaves the dashboard open across midday, it flips on its own.

import { useState, useEffect } from 'react';
import { getGreeting } from '../utils/helpers';

export function useGreeting() {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60 * 1000); // check every minute
    return () => clearInterval(id);
  }, []);

  return greeting;
}
