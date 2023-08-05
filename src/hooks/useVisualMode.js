import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  // Array need a length of 1 or greater.
  function transition(newMode, replace = false) {
    setHistory((prev) => {
      const preFix = replace ? prev.slice(0, -1) : prev;
      return preFix.concat(newMode);
    })
  }

  function back() {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  }

  return { mode: history[history.length - 1], transition, back}
}