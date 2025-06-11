/** @format */

import React from "react"
import { SwapForm } from "./components/SwapForm"

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-sky-900 text-white flex flex-col items-center justify-center p-4 selection:bg-sky-500 selection:text-white">
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#0ea5e922,transparent)]"></div>
      </div>
      <SwapForm />
    </div>
  )
}

export default App
