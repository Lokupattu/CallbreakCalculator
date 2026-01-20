import { useState, useEffect } from "react";
import PlayerRow from "./components/PlayerRow";
import ScoreBoard from "./components/ScoreBoard";
import RoundHistory from "./components/RoundHistory";

export default function App() {
  const [players, setPlayers] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
  ]);

  const [rounds, setRounds] = useState(() => {
    const saved = localStorage.getItem("callbreak");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Calculate totals dynamically
  const calculateTotals = () => {
    const totals = [0, 0, 0, 0];
    rounds.forEach((r) => r.roundScores.forEach((s, i) => (totals[i] += s)));
    return totals;
  };

  const addRound = (round) => {
    setRounds((prev) => [...prev, round]);
  };

  const undoLastRound = () => {
    if (confirm("Are you sure you want to delete the last round?")) {
      setRounds((prev) => prev.slice(0, -1));
    }
  };

  const finishGame = () => {
    const totals = calculateTotals();
    const max = Math.max(...totals);
    // Handle ties
    const winners = players.filter((_, i) => totals[i] === max);
    
    let message = "";
    if (winners.length === 1) {
      message = `🏆 Winner: ${winners[0]} (${max.toFixed(1)} points)`;
    } else {
      message = `🏆 Tie between: ${winners.join(", ")} (${max.toFixed(1)} points)`;
    }

    alert(message);
    
    if (confirm("Start a new game? This will clear all history.")) {
      setRounds([]);
    }
  };

  useEffect(() => {
    localStorage.setItem("callbreak", JSON.stringify(rounds));
  }, [rounds]);

  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-4 font-sans text-gray-900 pb-20">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">
            ♠️ Callbreak Calculator
          </h1>
        </div>

        <div className="p-4 sm:p-6">
          <ScoreBoard
            players={players}
            setPlayers={setPlayers}
            scores={calculateTotals()}
          />

          <hr className="my-6 border-gray-200" />

          {/* Only show PlayerRow if less than 5 rounds usually, but Callbreak can be any length? 
              Standard is 5 rounds. I will allow infinite but maybe mark 5 as typical end. 
              The user didn't specify limit. I found "isFinal = roundNo === 5" in old code. 
              I'll just let it run. */}
          <PlayerRow 
            players={players} 
            onSubmit={addRound} 
            roundNo={rounds.length + 1}
          />
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={undoLastRound}
              disabled={rounds.length === 0}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
            >
              Undo Last
            </button>

            <button
              onClick={finishGame}
              disabled={rounds.length === 0}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
            >
              Finish Game
            </button>
          </div>

          <RoundHistory players={players} rounds={rounds} />
        </div>
      </div>
    </div>
  );
}
