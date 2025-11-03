export default function Matches() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Your Top 3 Broker Matches</h1>
      <div className="space-y-6 max-w-5xl">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">#1 Strategic Benefits Group</h3>
            <div className="text-4xl font-bold text-blue-400">92%</div>
          </div>
          <button className="mt-4 w-full bg-blue-600 py-3 rounded-lg font-bold">Request Introduction</button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">#2 Complete Care Advisors</h3>
            <div className="text-4xl font-bold text-blue-400">88%</div>
          </div>
          <button className="mt-4 w-full bg-blue-600 py-3 rounded-lg font-bold">Request Introduction</button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">#3 Modern Benefits Partners</h3>
            <div className="text-4xl font-bold text-blue-400">85%</div>
          </div>
          <button className="mt-4 w-full bg-blue-600 py-3 rounded-lg font-bold">Request Introduction</button>
        </div>
      </div>
    </div>
  );
}
