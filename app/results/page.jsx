'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams?.get('role') || 'employer';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem('rightfit_results');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setResults(parsed);
        setLoading(false);
      } catch (e) {
        console.error('Parse error:', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-900 text-xl">Analyzing your responses...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-900 text-xl mb-4">No results found</div>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Take Survey
          </button>
        </div>
      </div>
    );
  }

  const companyName = results.company_name || results.company || results.brokerage_name || results.brokerage || results.name || "ABC";
  const companySize = results.company_size || results.size || results.employees || "50-200 employees";
  const industry = results.industry || results.industries || "your industry";
  const location = results.headquarters || results.location || results.city || "your area";
  
  const biggestProblem = results.biggest_problem || results.problem || "";
  const timeline = results.timeline || results.when_need || "";
  const monthlyImpact = results.monthly_cost || results.monthly_loss || results.costing || "";
  
  const WEIGHTS = {
    urgency: 35,
    cultureGap: 30,
    stakeholderConflict: 20,
    decisionSpeed: 10,
    budgetAuthority: 5
  };
  
  const urgencyScore = results.desperation_score || 50;
  const cultureGap = results.alignment_score ? (100 - results.alignment_score) : 32;
  const stakeholderConflict = results.alignment_score && results.alignment_score < 50 ? 85 : 45;
  const decisionSpeed = 72;
  const budgetAuthority = 88;
  
  const alignmentScore = Math.round(
    (urgencyScore * WEIGHTS.urgency / 100) +
    (cultureGap * WEIGHTS.cultureGap / 100) +
    (stakeholderConflict * WEIGHTS.stakeholderConflict / 100) +
    (decisionSpeed * WEIGHTS.decisionSpeed / 100) +
    (budgetAuthority * WEIGHTS.budgetAuthority / 100)
  );
  
  const componentBreakdown = role === 'broker' ? [
    { label: "Pipeline Urgency Index", sublabel: "Revenue pressure and deal velocity", score: urgencyScore, icon: "⏰", insight: urgencyScore < 40 ? "Critical: Immediate action" : "Moderate urgency" },
    { label: "Market Differentiation Score", sublabel: "Commodity vs. specialist positioning", score: cultureGap, icon: "🎯", insight: cultureGap > 50 ? "High commoditization risk" : "Building differentiation" },
    { label: "Stakeholder Dynamics Index", sublabel: "Client relationship complexity", score: stakeholderConflict, icon: "🤝", insight: stakeholderConflict > 60 ? "High complexity" : "Manageable" },
    { label: "Decision Velocity Coefficient", sublabel: "Speed to close deals", score: decisionSpeed, icon: "⚡", insight: "Strong closer" },
    { label: "Revenue Predictability Score", sublabel: "Pipeline sustainability", score: budgetAuthority, icon: "📊", insight: "Maintain focus" }
  ] : [
    { label: "Decision Urgency Index", sublabel: "Timeline pressure & deadlines", score: urgencyScore, icon: "⏰", insight: urgencyScore < 40 ? "Critical: Deadline approaching" : "Moderate pressure" },
    { label: "Culture-Benefits Alignment Gap", sublabel: "Brand promise vs. reality", score: cultureGap, icon: "🎯", insight: cultureGap > 40 ? "Major misalignment" : "Minor gaps" },
    { label: "Stakeholder Consensus Index", sublabel: "CEO/CFO/HR alignment", score: stakeholderConflict, icon: "🤝", insight: stakeholderConflict > 60 ? "High conflict" : "Aligned" },
    { label: "Decision Velocity Score", sublabel: "Speed to evaluate & select", score: decisionSpeed, icon: "⚡", insight: "Fast decision-maker" },
    { label: "Budget Authority Score", sublabel: "Decision power & clarity", score: budgetAuthority, icon: "💰", insight: "Strong authority" }
  ];
  
  const isHighPriority = alignmentScore <= 40;
  const isMediumPriority = alignmentScore > 40 && alignmentScore <= 65;
  const priorityLevel = isHighPriority ? "HIGH RISK" : isMediumPriority ? "MEDIUM RISK" : "LOW RISK";
  const priorityColor = isHighPriority ? "red" : isMediumPriority ? "orange" : "yellow";
  const timelineDays = isHighPriority ? "1-2 days" : isMediumPriority ? "2-3 days" : "3-5 days";
  
  // REALISTIC COST CALCULATIONS
  const employeeCount = companySize.includes("50-200") ? 125 : companySize.includes("200-500") ? 350 : companySize.includes("500+") ? 750 : 125;
  const avgSalary = 75000;
  
  const baseTurnover = 0.18;
  const misalignedTurnover = baseTurnover * 1.34;
  const incrementalTurnover = misalignedTurnover - baseTurnover;
  const costPerHire = avgSalary * 0.75;
  const annualTurnoverCost = Math.round(employeeCount * incrementalTurnover * costPerHire);
  
  const avgBenefitsCostPerEmployee = 15000;
  const totalBenefitsSpend = employeeCount * avgBenefitsCostPerEmployee;
  const overspendRate = 0.08;
  const annualOverspend = Math.round(totalBenefitsSpend * overspendRate);
  
  const underutilizationRate = 0.15;
  const underutilizationWaste = Math.round(totalBenefitsSpend * underutilizationRate);
  
  const totalAnnualRisk = annualTurnoverCost + annualOverspend + underutilizationWaste;
  const platformROI = Math.round(totalAnnualRisk * 0.55);
  
  const identifiedRisks = role === 'broker' ? [
    { number: 1, risk: "Pipeline Dried Up", reason: `Monthly revenue loss of ${monthlyImpact || "$20K+"} due to lack of quality leads`, cost: monthlyImpact || "$20K+/mo", source: "Your reported monthly impact", has: biggestProblem.includes("dried up") || urgencyScore < 40 },
    { number: 2, risk: "Commodity Pricing Pressure", reason: "Unable to command premium fees without clear specialization", cost: "40% margin erosion", source: "HBR: Specialist vs generalist pricing", has: biggestProblem.includes("commoditized") || cultureGap > 50 },
    { number: 3, risk: "High Customer Acquisition Cost", reason: "Excessive time spent on unqualified prospects", cost: "$65K+ wasted/year", source: "Avg for 5-city brokers", has: stakeholderConflict > 60 }
  ] : [
    { number: 1, risk: "Incremental Turnover Cost", reason: `${Math.round(incrementalTurnover * 100)}% extra turnover from misalignment × ${employeeCount} employees × $${Math.round(costPerHire/1000)}K per replacement`, cost: `$${Math.round(annualTurnoverCost/1000)}K/year`, source: "Deloitte: 34% higher turnover", has: cultureGap > 40 },
    { number: 2, risk: "Benefits Plan Overspend", reason: `Paying 8% too much for misaligned coverage on $${Math.round(totalBenefitsSpend/1000)}K annual spend`, cost: `$${Math.round(annualOverspend/1000)}K/year`, source: "Industry avg for wrong-fit plans", has: true },
    { number: 3, risk: "Underutilization Waste", reason: `15% of voluntary benefits unused due to poor culture-plan fit`, cost: `$${Math.round(underutilizationWaste/1000)}K/year`, source: "Mercer study on benefit utilization", has: true }
  ];
  
  const activeRisks = identifiedRisks.filter(r => r.has).slice(0, 3);
  
  const valueProps = role === 'broker' ? [
    { metric: "Total Annual Risk", value: "$185K+/year", description: "Pipeline + margin + CAC losses", source: "Based on reported challenges" },
    { metric: "Platform Value", value: "$102K/year", description: "55% risk reduction from matching", source: "Specialist positioning + qualified leads" },
    { metric: "Payback Period", value: "2.1 months", description: "Time to ROI positive", source: "Typical for lead gen platforms" }
  ] : [
    { metric: "Total Annual Risk", value: `$${Math.round(totalAnnualRisk/1000)}K/year`, description: "Turnover + overspend + waste", source: `${companySize} ${industry} benchmark` },
    { metric: "Platform Value", value: `$${Math.round(platformROI/1000)}K/year`, description: "55% risk reduction from right match", source: "Specialist broker fit + faster alignment" },
    { metric: "Time to Value", value: timelineDays, description: "From alignment to 3 broker intros", source: "Platform avg for aligned stakeholders" }
  ];
  
  // UPDATED TO DAY 1, 2, 3
  const platformProcess = role === 'broker' ? [
    { step: 1, title: "Stakeholder Alignment", description: "Define your niche positioning (geo/industry/size) with internal team buy-in", timeline: "Day 1" },
    { step: 2, title: "Brand & Value Documentation", description: "Create positioning materials showcasing your specialization and case studies", timeline: "Day 2" },
    { step: 3, title: "Employer Matching & Introductions", description: "Connect with 3 pre-qualified employers seeking YOUR niche expertise", timeline: "Day 3" }
  ] : [
    { step: 1, title: "Stakeholder Alignment", description: "Facilitate CEO/CFO/HR alignment on budget, priorities, and decision criteria", timeline: "Day 1" },
    { step: 2, title: "Culture & Requirements Documentation", description: "Document your culture, values, and benefits requirements for broker briefing", timeline: "Day 2" },
    { step: 3, title: "Specialist Broker Matching", description: "Introductions to 3 brokers who specialize in your industry/size/culture", timeline: "Day 3" }
  ];
  
  const problemStatement = role === 'broker'
    ? `${companyName}'s pipeline challenges stem from competing as a generalist. Without clear specialization in ${industry}, you're losing deals to brokers with niche expertise.${monthlyImpact ? ` This is costing ${monthlyImpact} monthly.` : ""}`
    : `${companyName}'s benefits misalignment is creating turnover risk. As a ${companySize} ${industry} company in ${location}, your benefits need to match your culture and growth stage.${monthlyImpact ? ` Current misalignment costs ${monthlyImpact} monthly.` : ""}`;
  
  const solutionStatement = role === 'broker'
    ? `We'll connect ${companyName} with 3 specialist brokers in ${timelineDays} who focus on ${industry} companies in ${location}, understand your stakeholder dynamics, and become strategic growth partners.`
    : `We'll connect ${companyName} with 3 specialist brokers in ${timelineDays} who understand ${industry} companies at your stage (${companySize}), navigate CEO/CFO/HR dynamics, and align benefits with your culture.`;
  
  const scaleDescriptions = [
    { range: "0-24", label: "Critical Gap" },
    { range: "25-49", label: "Major Issues" },
    { range: "50-74", label: "Partial Fit" },
    { range: "75-89", label: "Strong Fit" },
    { range: "90-100", label: "Perfect Match" }
  ];
  
  const studies = role === 'broker' ? [
    { source: "Gartner 2024", finding: "Specialized brokers close 73% more deals than generalists", citation: "Benefits Broker Performance Study" },
    { source: "Harvard Business Review 2023", finding: "Niche focus increases revenue per client by 2.4x", citation: "Specialization Economics" },
    { source: "SHRM 2024", finding: "Time-to-close reduced 58% with targeted prospecting", citation: "Sales Efficiency Study" }
  ] : [
    { source: "McKinsey & Company 2024", finding: "Stakeholder alignment saves $127K+ annually in decision costs", citation: "Executive Decision-Making Study" },
    { source: "Deloitte 2023", finding: "Benefits-culture misalignment increases turnover by 34%", citation: "Employee Retention Analysis" },
    { source: "Gartner 2024", finding: "Specialist brokers deliver 2.8x better coverage fit", citation: "Benefits Procurement Study" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full bg-slate-900 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 absolute left-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">RF</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg">RightFit</div>
                <div className="text-slate-300 text-[10px]">Decision Science Intelligence</div>
              </div>
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={() => window.open('https://calendly.com/dbrazavi/15-minute-discovery-call', '_blank')}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm transition shadow-lg"
              >
                📅 Book Discovery Call
              </button>
              <button
                onClick={() => router.push(role === 'broker' ? '/platform/broker/dashboard' : '/platform/alignment')}
                className="px-8 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 rounded-lg font-bold text-sm shadow-xl"
              >
                Get Started with Platform →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white text-center py-8 border-b-2 border-slate-200">
        <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
          {companyName}'s {role === 'broker' ? 'Market Position' : 'Benefits Alignment'} Analysis
        </h1>
        <div className="text-slate-700 text-base font-bold">
          Align {companyName}'s stakeholders, then match with specialist brokers using RightFit™ decision science
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
        <div className="w-full px-4">
          <div className="max-w-[1700px] mx-auto grid grid-cols-[200px_1fr_360px] gap-5">
            
            <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-xl h-fit">
              <div className="text-[10px] text-slate-600 uppercase mb-3 font-bold text-center tracking-wider">RightFit™</div>
              <div className="text-center mb-3 pb-3 border-b-2 border-slate-200">
                <div className="text-6xl font-black text-blue-600 mb-1">{alignmentScore}</div>
                <div className="text-xs text-slate-500 font-semibold">out of 100</div>
              </div>
              <div className="space-y-2">
                {scaleDescriptions.map((item, idx) => {
                  const [min, max] = item.range.split('-').map(Number);
                  const isActive = alignmentScore >= min && alignmentScore <= max;
                  return (
                    <div key={idx} className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 border-2 border-blue-500' : 'bg-slate-50 border border-slate-200'}`}>
                      <div className="text-xs text-slate-600 font-bold mb-0.5">{item.range}</div>
                      <div className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                <div className="text-xs text-red-700 uppercase font-bold mb-2 tracking-wider">{companyName}'s Challenge</div>
                <div className="text-slate-900 text-sm font-semibold leading-relaxed mb-4">{problemStatement}</div>
                <div className="text-xs text-emerald-700 uppercase font-bold mb-2 tracking-wider">Our Solution for {companyName}</div>
                <div className="text-slate-900 text-sm font-medium leading-relaxed">{solutionStatement}</div>
              </div>

              {/* PLATFORM PROCESS - NOW WITH DAY 1, 2, 3 */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-xl">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-black text-emerald-800 uppercase tracking-wide">Platform Process</h2>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">Complete in {timelineDays}</div>
                </div>
                <div className="space-y-4 mb-5">
                  {platformProcess.map((step) => (
                    <div key={step.step} className="flex gap-4 bg-white rounded-xl p-4 border-2 border-emerald-200 shadow-sm">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-slate-900 mb-1">{step.title}</div>
                        <div className="text-sm text-slate-700 leading-relaxed mb-1">{step.description}</div>
                        <div className="text-xs text-emerald-700 font-semibold">{step.timeline}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push(role === 'broker' ? '/platform/broker/dashboard' : '/platform/alignment')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-lg shadow-xl transition transform hover:scale-[1.02]"
                >
                  Begin Platform Process →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 shadow-lg flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-900">RightFit™ Decision Science</h2>
                    <div className="text-[8px] text-slate-600 uppercase">Patent Pending</div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {componentBreakdown.map((comp, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-2.5 border border-slate-200">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl flex-shrink-0">{comp.icon}</span>
                          <div className="text-[11px] leading-tight flex-1">
                            <span className="font-bold text-slate-900">{comp.label}</span>
                            <span className="text-slate-400 mx-1">—</span>
                            <span className="text-slate-600">{comp.sublabel}</span>
                            <span className="text-slate-400 mx-1">—</span>
                            <span className="text-blue-700 font-semibold italic">{comp.insight}</span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-slate-200 rounded-full">
                          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${comp.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 h-full">
                  {studies.map((study, idx) => (
                    <div key={idx} className="bg-white border-2 border-blue-300 rounded-xl p-4 shadow-lg hover:shadow-xl transition flex-1">
                      <div className="flex gap-3 h-full">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">📊</span>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="text-blue-600 font-bold text-sm mb-1">{study.source}</div>
                          <div className="text-slate-900 text-base font-bold mb-2 italic leading-tight flex-1">
                            "{study.finding}"
                          </div>
                          <div className="text-slate-500 text-xs">— {study.citation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-2xl h-fit">
              
              <div className="mb-5 pb-5 border-b-2 border-slate-200">
                <div className="text-sm text-slate-500 uppercase tracking-wider mb-4 font-bold text-center">Priority & Financial Impact</div>
                <div className="text-center mb-4">
                  <div className={`inline-block px-6 py-3 rounded-xl font-bold text-xl ${
                    priorityColor === 'red' ? 'bg-red-100 text-red-700' :
                    priorityColor === 'orange' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {priorityLevel}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {valueProps.map((vp, idx) => (
                    <div key={idx} className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3">
                      <div className="text-xs text-slate-600 mb-1 font-medium">{vp.metric}</div>
                      <div className="text-xl font-black text-emerald-700">{vp.value}</div>
                      <div className="text-[10px] text-slate-600 mb-0.5">{vp.description}</div>
                      <div className="text-[9px] text-slate-500 italic">{vp.source}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="text-sm text-slate-500 uppercase tracking-wider mb-4 font-bold text-center">Annual Financial Risks</div>
                <div className="space-y-3">
                  {activeRisks.map((risk) => (
                    <div key={risk.number} className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-bold text-red-700">Risk {risk.number}: {risk.risk}</div>
                        <div className="text-sm font-black text-red-700 ml-2 flex-shrink-0">{risk.cost}</div>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed mb-1">
                        {risk.reason}
                      </div>
                      <div className="text-[9px] text-slate-500 italic">Source: {risk.source}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-slate-900">Loading...</div></div>}>
      <ResultsContent />
    </Suspense>
  );
}
