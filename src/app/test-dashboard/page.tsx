"use client";

export default function TestDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Test Dashboard</h1>
      <p className="text-lg mb-4">If you can see this, the page is working!</p>
      <div className="bg-green-100 border border-green-400 rounded p-4">
        <p className="text-green-800">✅ Page loaded successfully!</p>
      </div>
      <div className="mt-4">
        <a href="/dashboard" className="text-blue-600 underline">
          Go to Main Dashboard
        </a>
      </div>
    </div>
  );
}
