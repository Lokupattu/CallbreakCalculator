export default function RoundHistory({ players, rounds }) {
  if (rounds.length === 0) return null;

  // Calculate cumulative totals per round for display?
  // Or just show round scores and a final total row?
  // Usually history shows per-round scores. Total is on the ScoreBoard.
  // But a total row at the bottom is nice.

  const totals = [0, 0, 0, 0];
  rounds.forEach(r => {
    r.roundScores.forEach((score, i) => {
      totals[i] += score;
    });
  });

  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="font-semibold mb-2">Round History</h3>

      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-left">Round</th>
            {players.map((p, i) => (
              <th key={i} className="border border-gray-300 px-3 py-2 text-center min-w-[80px]">
                {p}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rounds.map((round, rIndex) => (
            <tr key={rIndex} className={rIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 px-3 py-2 font-medium">
                {rIndex + 1}
              </td>
              {round.roundScores.map((score, pIndex) => (
                <td key={pIndex} className={`border border-gray-300 px-3 py-2 text-center ${score < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                  {score.toFixed(1)}
                </td>
              ))}
            </tr>
          ))}
          
          {/* Total Row */}
          <tr className="bg-green-50 font-bold border-t-2 border-green-200">
            <td className="border border-gray-300 px-3 py-2">Total</td>
            {totals.map((total, i) => (
              <td key={i} className="border border-gray-300 px-3 py-2 text-center">
                {total.toFixed(1)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
