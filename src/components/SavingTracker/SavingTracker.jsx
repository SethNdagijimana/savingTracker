import React, { useEffect, useState } from "react"

const currencies = ["RWF", "USD", "EUR"]

const SavingTracker = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("savingsGoals")
    return saved ? JSON.parse(saved) : []
  })

  const [newGoal, setNewGoal] = useState({
    goalName: "",
    targetAmount: 0,
    monthlySavings: 0,
    savedSoFar: 0,
    deadline: "",
    currency: "RWF"
  })

  useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (
      !newGoal.goalName ||
      newGoal.targetAmount <= 0 ||
      newGoal.monthlySavings <= 0
    )
      return
    setGoals([...goals, newGoal])
    setNewGoal({
      goalName: "",
      targetAmount: 0,
      monthlySavings: 0,
      savedSoFar: 0,
      deadline: "",
      currency: "RWF"
    })
  }

  const calculateProgress = (goal) => {
    const remaining = goal.targetAmount - goal.savedSoFar
    const months = Math.ceil(remaining / goal.monthlySavings)
    const percent = Math.min((goal.savedSoFar / goal.targetAmount) * 100, 100)
    return { months, percent }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl space-y-6">
      <h1 className="text-3xl font-bold text-center text-green-700">
        💰 Multi Goal Savings Tracker
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Goal Name"
          className="border rounded px-3 py-2"
          value={newGoal.goalName}
          onChange={(e) => setNewGoal({ ...newGoal, goalName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Target Amount"
          className="border rounded px-3 py-2"
          value={newGoal.targetAmount}
          onChange={(e) =>
            setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Monthly Savings"
          className="border rounded px-3 py-2"
          value={newGoal.monthlySavings}
          onChange={(e) =>
            setNewGoal({ ...newGoal, monthlySavings: Number(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Already Saved"
          className="border rounded px-3 py-2"
          value={newGoal.savedSoFar}
          onChange={(e) =>
            setNewGoal({ ...newGoal, savedSoFar: Number(e.target.value) })
          }
        />
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={newGoal.currency}
          onChange={(e) => setNewGoal({ ...newGoal, currency: e.target.value })}
        >
          {currencies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          className="md:col-span-2 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
          onClick={addGoal}
        >
          ➕ Add Goal
        </button>
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => {
          const { months, percent } = calculateProgress(goal)
          return (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800">
                🎯 {goal.goalName}
              </h2>
              <p className="text-sm text-gray-600">
                Target: {goal.targetAmount.toLocaleString()} {goal.currency}
              </p>
              <p className="text-sm text-gray-600">
                Monthly Savings: {goal.monthlySavings.toLocaleString()}{" "}
                {goal.currency}
              </p>
              <p className="text-sm text-gray-600">
                Already Saved: {goal.savedSoFar.toLocaleString()}{" "}
                {goal.currency}
              </p>
              {goal.deadline && (
                <p className="text-sm text-gray-500">
                  Deadline: {goal.deadline}
                </p>
              )}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {percent.toFixed(1)}% saved — Estimated {months} months left
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SavingTracker
