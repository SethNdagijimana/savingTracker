import React, { useState } from "react"

const SavingTracker = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [goalName, setGoalName] = useState("")
  const [targetAmount, setTargetAmount] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [savedSoFar, setSavedSoFar] = useState(0)

  const monthsToGoal = Math.ceil((targetAmount - savedSoFar) / monthlySavings)
  const progressPercent = Math.min((savedSoFar / targetAmount) * 100, 100)

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl space-y-4">
      <h1 className="text-2xl font-bold text-center text-green-600">
        💰 Savings Tracker
      </h1>

      <div className="space-y-2">
        <input
          type="number"
          placeholder="Monthly Income (RWF)"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Goal Name (e.g. Buy Land)"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => setGoalName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target Amount (RWF)"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => setTargetAmount(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Monthly Savings (RWF)"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => setMonthlySavings(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Already Saved (RWF)"
          className="w-full border rounded px-3 py-2"
          onChange={(e) => setSavedSoFar(Number(e.target.value))}
        />
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Goal: <span className="font-semibold">{goalName || "–"}</span>
        </p>
        <p className="text-sm text-gray-600">
          You will reach your goal in:
          <span className="font-bold text-green-700 ml-1">
            {isNaN(monthsToGoal) ? "–" : `${monthsToGoal} months`}
          </span>
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-right mt-1 text-gray-500">
          {progressPercent.toFixed(1)}% saved
        </p>
      </div>
    </div>
  )
}

export default SavingTracker
