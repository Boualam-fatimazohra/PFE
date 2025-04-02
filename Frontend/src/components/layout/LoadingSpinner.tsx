import * as React from "react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 font -bold foont-inter text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;