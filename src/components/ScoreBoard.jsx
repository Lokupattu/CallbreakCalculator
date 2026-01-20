import { useState } from "react";

export default function ScoreBoard({ players, scores, setPlayers }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const updateName = (index, newName) => {
    const updated = [...players];
    updated[index] = newName.trim() || `Player ${index + 1}`;
    setPlayers(updated);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">
        Score Board <span className="text-sm font-normal text-gray-500">(Tap name to edit)</span>
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {players.map((player, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg p-3 flex flex-col justify-between items-start gap-1 shadow-sm"
          >
            {/* NAME AREA */}
            {editingIndex === i ? (
              <input
                autoFocus
                type="text"
                defaultValue={player.startsWith("Player") ? "" : player}
                placeholder={`Player ${i + 1}`}
                className="border rounded px-2 py-1 w-full text-sm focus:ring-2 focus:ring-green-500 outline-none"
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  updateName(i, value || `Player ${i + 1}`);
                  setEditingIndex(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = e.target.value.trim();
                    updateName(i, value || `Player ${i + 1}`);
                    setEditingIndex(null);
                  }
                }}
              />
            ) : (
              <button
                onClick={() => setEditingIndex(i)}
                className="
                  text-left
                  w-full
                  font-medium
                  text-sm
                  truncate
                  text-gray-700
                "
              >
                {player}
              </button>
            )}

            {/* SCORE */}
            <span className={`text-xl font-bold ${scores[i] < 0 ? 'text-red-500' : 'text-green-700'}`}>
              {scores[i].toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
