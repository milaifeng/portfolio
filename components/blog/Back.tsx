"use client";
import { ArrowLeftIcon } from "lucide-react";
const Back = () => {
  const handleBack = () => {
    window.history.back();
  }
  return (
   <button 
   className="border px-4 py-2 border-blue-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700" 
   onClick={handleBack}>
    <ArrowLeftIcon className="w-4 h-4 text-blue-500" />
  </button>
  )
}

export default Back