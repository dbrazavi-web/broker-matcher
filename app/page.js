export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-8">
          BrokerMatch
        </h1>
        <div className="space-y-4">
          <a 
            href="/surveys/employer" 
            className="block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition text-xl"
          >
            For Employers →
          </a>
          <a 
            href="/surveys/broker" 
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition text-xl"
          >
            For Brokers →
          </a>
        </div>
      </div>
    </div>
  )
}
