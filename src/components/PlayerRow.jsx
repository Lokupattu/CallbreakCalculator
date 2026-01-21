import { useState, useEffect } from "react";

export default function PlayerRow({ players, onSubmit, roundNo }) {
  const [calls, setCalls] = useState([0, 0, 0, 0]);
  const [hands, setHands] = useState([0, 0, 0, 0]);
  const [step, setStep] = useState("call");
  // roundNo is passed from parent now

  const totalCalls = calls.reduce((a, b) => a + b, 0);
  const totalHands = hands.reduce((a, b) => a + b, 0);

  // Reset state when roundNo changes (e.g. after submit or undo)
  useEffect(() => {
    setCalls([0, 0, 0, 0]);
    setHands([0, 0, 0, 0]);
    setStep("call");
  }, [roundNo]);

  const handleCallChange = (i, val) => {
    // Prevent negative numbers
    if (val < 0) return;
    const copy = [...calls];
    copy[i] = Number(val);
    setCalls(copy);
  };

  const handleHandChange = (i, val) => {
     // Prevent negative numbers
    if (val < 0) return;
    const copy = [...hands];
    copy[i] = Number(val);
    setHands(copy);
  };

  const callsMade = () => {
    // Standard Callbreak: Total calls usually at least 8. 
    if (calls.some(c => c < 1)) {
        alert("Each player must call at least 1");
        return;
    }

    if (totalCalls <= 8) {
        alert("Total calls must be greater than 8");
        return;
    }

    // Special Rule: If total calls = 9, auto-complete round
    if (totalCalls === 9) {
        const scores = calls.map(c => c + 0.1);
        alert("Total calls is 9! Auto-completing round with bonus.");
        
        onSubmit({
            round: roundNo,
            roundScores: scores,
        });
        
        // State reset is handled by useEffect on roundNo change
        return;
    }
    
    setStep("hand");
  };

  const submitRound = () => {
    if (totalHands !== 13) {
      alert(`Total hands must be exactly 13. Currently: ${totalHands}`);
      return;
    }

    const scores = calls.map((c, i) => {
      const made = hands[i];
      if (made < c) {
        return -c; // Negative score equal to call
      } else {
        // Standard Callbreak: Call + 0.1 per extra trick
        return c + (made - c) * 0.1;
      }
    });

    onSubmit({
      round: roundNo,
      roundScores: scores,
    });
    
    // State reset is handled by useEffect on roundNo change
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="font-bold mb-4 text-lg text-gray-800">
        Results for Round {roundNo}
      </h2>

      {/* Header Row */}
      <div className="grid grid-cols-3 gap-2 mb-2 text-sm font-semibold text-gray-600 border-b pb-2">
        <div className="col-span-1">Player</div>
        <div className="text-center">Call</div>
        <div className="text-center">{step === "call" ? "-" : "Hand"}</div>
      </div>

      {players.map((p, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 mb-3 items-center">
          <span className="col-span-1 truncate font-medium text-gray-700">{p}</span>

          <div className="flex justify-center">
             <input
              type="number"
              min="1"
              max="13"
              placeholder="0"
              value={calls[i] || ""}
              onChange={(e) => handleCallChange(i, e.target.value)}
              disabled={step !== "call"}
              className={`w-16 border rounded px-2 py-1 text-center ${step !== 'call' ? 'bg-gray-100 text-gray-500' : 'bg-white border-blue-300 ring-2 ring-transparent focus:ring-blue-200'}`}
            />
          </div>

          <div className="flex justify-center">
            {step === "hand" && (
                <input
                  type="number"
                  min="0"
                  max="13"
                  placeholder="0"
                  value={hands[i] || ""}
                  onChange={(e) => handleHandChange(i, e.target.value)}
                  className="w-16 border border-green-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-green-200 outline-none"
                />
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4 border-t pt-3">
        <div className="text-sm text-gray-600">
             {step === "call" 
                ? `Total Calls: ${totalCalls}` 
                : <span className={totalHands !== 13 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>Total Hands: {totalHands} / 13</span>
             }
        </div>

        {step === "call" ? (
            <button
            onClick={callsMade}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
            Next: Enter Hands
            </button>
        ) : (
            <button
            onClick={submitRound}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
            Save Round
            </button>
        )}
      </div>
    </div>
  );
}
