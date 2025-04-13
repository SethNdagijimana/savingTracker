import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import React, { useEffect, useRef, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

const currencies = ["RWF", "USD", "EUR"]

const SavingTracker = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("savingsGoals")
    return saved ? JSON.parse(saved) : []
  })

  const exportRef = useRef()

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

  const handleExportPDF = async () => {
    const input = exportRef.current
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save("savings-goals.pdf")
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl space-y-8">
      <h1 className="text-3xl font-bold text-center text-green-700">
        💰 Multi Goal Savings Tracker
      </h1>

      {/* Input Form */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            className="border rounded px-3 py-2"
            value={newGoal.goalName}
            onChange={(e) =>
              setNewGoal({ ...newGoal, goalName: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Target Amount
          </label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={newGoal.targetAmount}
            onChange={(e) =>
              setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Monthly Savings
          </label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={newGoal.monthlySavings}
            onChange={(e) =>
              setNewGoal({
                ...newGoal,
                monthlySavings: Number(e.target.value)
              })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Already Saved
          </label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={newGoal.savedSoFar}
            onChange={(e) =>
              setNewGoal({
                ...newGoal,
                savedSoFar: Number(e.target.value)
              })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Deadline
          </label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={newGoal.deadline}
            onChange={(e) =>
              setNewGoal({ ...newGoal, deadline: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            className="border rounded px-3 py-2"
            value={newGoal.currency}
            onChange={(e) =>
              setNewGoal({ ...newGoal, currency: e.target.value })
            }
          >
            {currencies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          className="md:col-span-2 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
          onClick={addGoal}
        >
          ➕ Add Goal
        </button>
      </div>

      {/* Goal List */}
      <div ref={exportRef} className="space-y-6">
        {goals.map((goal, index) => {
          const { months, percent } = calculateProgress(goal)
          const years = Math.floor(months / 12)
          const remainingMonths = months % 12

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
                {percent.toFixed(1)}% saved — Estimated{" "}
                {years > 0 && `${years} years `}
                {remainingMonths} months left
              </p>
            </div>
          )
        })}
      </div>

      {/* PDF Export Button */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          onClick={handleExportPDF}
        >
          📄 Export Goals to PDF
        </button>
      </div>

      {/* 📅 Calendar View */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          📅 Deadlines Overview
        </h2>
        <Calendar
          tileContent={({ date, view }) => {
            if (view === "month") {
              const formatted = date.toISOString().split("T")[0]
              const isGoalDate = goals.some(
                (goal) => goal.deadline === formatted
              )
              return isGoalDate ? (
                <span className="text-green-600">●</span>
              ) : null
            }
          }}
        />
      </div>
    </div>
  )
}

export default SavingTracker
