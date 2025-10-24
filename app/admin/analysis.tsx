'use client';

interface AnalysisProps {
  employerResponses: any[];
  brokerResponses: any[];
}

export default function AnalysisEngine({ employerResponses, brokerResponses }: AnalysisProps) {
  
  // Calculate all 10 factors
  const calculateFactors = () => {
    const empCount = employerResponses.length;
    const brkCount = brokerResponses.length;

    if (empCount === 0 || brkCount === 0) {
      return null;
    }

    // FACTOR 1: TIME SPENT
    const empTimeToFind = employerResponses.filter(r => 
      r.time_to_find === '2-3 months' || r.time_to_find === '3+ months'
    ).length / empCount * 100;
    
    const brkTimeOnLeads = brokerResponses.map(r => {
      const breakdown = r.time_breakdown;
      return parseInt(breakdown.finding_leads || 0);
    });
    const avgBrkLeadTime = brkTimeOnLeads.reduce((a, b) => a + b, 0) / brkCount;

    // FACTOR 2: SATISFACTION
    const empAvgSatisfaction = employerResponses.reduce((sum, r) => sum + r.finding_satisfaction, 0) / empCount;
    const brkAvgSatisfaction = brokerResponses.reduce((sum, r) => sum + r.lead_gen_satisfaction, 0) / brkCount;
    const empUnsatisfied = employerResponses.filter(r => r.finding_satisfaction < 6).length / empCount * 100;
    const brkUnsatisfied = brokerResponses.filter(r => r.lead_gen_satisfaction < 6).length / brkCount * 100;

    // FACTOR 3: NPS (WOULD RECOMMEND)
    const empWouldntRecommend = employerResponses.filter(r => 
      r.would_recommend_process === 'Probably no' || r.would_recommend_process === 'Definitely no'
    ).length / empCount * 100;
    
    const brkWouldntRecommend = brokerResponses.filter(r => 
      r.would_recommend_lead_method === 'Probably no' || r.would_recommend_lead_method === 'Definitely no'
    ).length / brkCount * 100;

    // FACTOR 4: MULTI-STAKEHOLDER PAIN
    const empComplexDecisions = employerResponses.filter(r => 
      r.decision_structure === 'Complex (multiple stakeholders)'
    ).length / empCount * 100;
    
    const empMultiStakeholderPriority = employerResponses.reduce((sum, r) => {
      const points = typeof r.priority_points === 'string' ? JSON.parse(r.priority_points) : r.priority_points;
      return sum + (points.stakeholder_alignment || 0);
    }, 0) / empCount;

    const brkDealsLost = brokerResponses.filter(r => 
      r.last_deal_lost_reason === 'Multi-stakeholder alignment fell apart'
    ).length / brkCount * 100;

    const brkMultiStakeholderDeals = brokerResponses.filter(r => 
      r.multi_stakeholder_count === '6-8' || r.multi_stakeholder_count === '9-10'
    ).length / brkCount * 100;

    const brkMultiStakeholderPriority = brokerResponses.reduce((sum, r) => {
      const points = typeof r.priority_points === 'string' ? JSON.parse(r.priority_points) : r.priority_points;
      return sum + (points.multi_stakeholder_navigation || 0);
    }, 0) / brkCount;

    // FACTOR 5: COST PREDICTABILITY
    const empCostExceeded = employerResponses.filter(r => 
      r.cost_vs_projection === 'Significantly higher (10%+)'
    ).length / empCount * 100;

    const empCostPriority = employerResponses.reduce((sum, r) => {
      const points = typeof r.priority_points === 'string' ? JSON.parse(r.priority_points) : r.priority_points;
      return sum + (points.cost_predictability || 0);
    }, 0) / empCount;

    const brkCostInaccurate = brokerResponses.filter(r => 
      r.cost_projection_accuracy === 'Often higher (10%+ gap)'
    ).length / brkCount * 100;

    const brkCostPriority = brokerResponses.reduce((sum, r) => {
      const points = typeof r.priority_points === 'string' ? JSON.parse(r.priority_points) : r.priority_points;
      return sum + (points.cost_accuracy || 0);
    }, 0) / brkCount;

    // FACTOR 6: SERVICE QUALITY
    const empInfrequentContact = employerResponses.filter(r => 
      r.broker_proactive_contact === 'Quarterly' || r.broker_proactive_contact === 'Annually (at renewal)'
    ).length / empCount * 100;

    const brkInfrequentContact = brokerResponses.filter(r => 
      r.service_level_post_sale === 'Quarterly' || r.service_level_post_sale === 'Annually (at renewal)'
    ).length / brkCount * 100;

    // FACTOR 7: PRIORITY ALIGNMENT (average of all priorities)
    const empPriorities = {
      employee_satisfaction: 0,
      stakeholder_alignment: 0,
      cost_control: 0,
      broker_responsiveness: 0,
      cost_predictability: 0
    };
    
    employerResponses.forEach(r => {
      const points = typeof r.priority_points === 'string' ? JSON.parse(r.priority_points) : r.priority_points;
      Object.keys(empPriorities).forEach(key => {
        empPriorities[key] += points[key] || 0;
      });
    });
    
    Object.keys(empPriorities).forEach(key => {
      empPriorities[key] = empPriorities[key] / empCount;
    });

    const brkPriorities = {
      employee_satisfaction: 0,
      multi_stakeholder_navigation: 0,
      cost_accuracy: 0,
      client_service: 0,
      value_demonstration: 0
    };
    
    brokerResponses.forEach(r => {
      const points = typeof r.priority_points === 'string' ? JSON.parse(r.priority_points) : r.priority_points;
      Object.keys(brkPriorities).forEach(key => {
        brkPriorities[key] += points[key] || 0;
      });
    });
    
    Object.keys(brkPriorities).forEach(key => {
      brkPriorities[key] = brkPriorities[key] / brkCount;
    });

    // FACTOR 8: WILLINGNESS TO PAY
    const empWTP = employerResponses.filter(r => 
      r.willingness_to_pay !== 'Free only' && r.willingness_to_pay !== "Wouldn't use it"
    ).length / empCount * 100;

    const brkLeadWTP = brokerResponses.filter(r => 
      r.qualified_lead_wtp !== "Wouldn't pay"
    ).length / brkCount * 100;

    const brkPlatformWTP = brokerResponses.filter(r => 
      r.platform_monthly_wtp !== "Wouldn't use"
    ).length / brkCount * 100;

    // FACTOR 9: URGENCY
    const empUrgent = employerResponses.filter(r => 
      r.switching_reality === 'actively_shopping' || r.switching_reality === 'would_switch'
    ).length / empCount * 100;

    const brkLeadQualityPoor = brokerResponses.filter(r => {
      const breakdown = typeof r.lead_quality_breakdown === 'string' ? JSON.parse(r.lead_quality_breakdown) : r.lead_quality_breakdown;
      return parseInt(breakdown.highly_qualified || 0) < 30;
    }).length / brkCount * 100;

    // FACTOR 10: BASELINE ECONOMICS
    const brkHighSoftwareSpend = brokerResponses.filter(r => 
      r.monthly_software_spend === '$500-1,000' || 
      r.monthly_software_spend === '$1,000-2,000' ||
      r.monthly_software_spend === '$2,000-3,500' ||
      r.monthly_software_spend === '$3,500+'
    ).length / brkCount * 100;

    const brkHighCAC = brokerResponses.filter(r => 
      r.client_acquisition_cost === '$2,500-$5,000' ||
      r.client_acquisition_cost === '$5,000-$10,000' ||
      r.client_acquisition_cost === '$10,000+'
    ).length / brkCount * 100;

    // Calculate correlation scores for mutual pain
    const correlations = {
      matching: Math.min(empUnsatisfied, brkUnsatisfied) / 100,
      multiStakeholder: Math.min(empComplexDecisions, brkMultiStakeholderDeals) / 100,
      costPredictability: Math.min(empCostExceeded, brkCostInaccurate) / 100,
      serviceQuality: Math.min(empInfrequentContact, brkInfrequentContact) / 100
    };

    return {
      factor1: { empTimeToFind, avgBrkLeadTime },
      factor2: { empAvgSatisfaction, brkAvgSatisfaction, empUnsatisfied, brkUnsatisfied },
      factor3: { empWouldntRecommend, brkWouldntRecommend },
      factor4: { empComplexDecisions, empMultiStakeholderPriority, brkDealsLost, brkMultiStakeholderDeals, brkMultiStakeholderPriority },
      factor5: { empCostExceeded, empCostPriority, brkCostInaccurate, brkCostPriority },
      factor6: { empInfrequentContact, brkInfrequentContact },
      factor7: { empPriorities, brkPriorities },
      factor8: { empWTP, brkLeadWTP, brkPlatformWTP },
      factor9: { empUrgent, brkLeadQualityPoor },
      factor10: { brkHighSoftwareSpend, brkHighCAC },
      correlations
    };
  };

  const factors = calculateFactors();

  if (!factors) {
    return (
      <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-6">
        <h3 className="text-yellow-400 font-semibold mb-2">⏳ Need More Data</h3>
        <p className="text-gray-300">
          Collect at least 10 responses from each side to run analysis. 
          Current: {employerResponses.length} employers, {brokerResponses.length} brokers.
        </p>
      </div>
    );
  }

  const { correlations } = factors;
  
  // Hypothesis validation
  const h1Validated = factors.factor2.empUnsatisfied >= 60 && factors.factor2.brkUnsatisfied >= 60 && factors.factor8.empWTP >= 50 && factors.factor8.brkLeadWTP >= 50;
  const h2Validated = factors.factor2.brkUnsatisfied >= 60 && factors.factor8.brkLeadWTP >= 50;
  const h3Validated = factors.factor10.brkHighSoftwareSpend >= 50 && factors.factor8.brkPlatformWTP >= 50;
  const h4Validated = correlations.multiStakeholder >= 0.5 || correlations.costPredictability >= 0.5;

  return (
    <div className="space-y-6">
      
      {/* Hypothesis Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`border-2 rounded-lg p-4 ${h1Validated ? 'bg-green-900 bg-opacity-20 border-green-500' : 'bg-red-900 bg-opacity-20 border-red-500'}`}>
          <div className="text-2xl mb-2">{h1Validated ? '✅' : '❌'}</div>
          <div className="font-bold text-lg mb-1">H1: Matching Problem</div>
          <div className="text-sm text-gray-300">Both sides struggle to find each other</div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${h2Validated ? 'bg-green-900 bg-opacity-20 border-green-500' : 'bg-red-900 bg-opacity-20 border-red-500'}`}>
          <div className="text-2xl mb-2">{h2Validated ? '✅' : '❌'}</div>
          <div className="font-bold text-lg mb-1">H2: Lead Gen Gap</div>
          <div className="text-sm text-gray-300">Brokers need qualified leads</div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${h3Validated ? 'bg-green-900 bg-opacity-20 border-green-500' : 'bg-red-900 bg-opacity-20 border-red-500'}`}>
          <div className="text-2xl mb-2">{h3Validated ? '✅' : '❌'}</div>
          <div className="font-bold text-lg mb-1">H3: Infrastructure Gap</div>
          <div className="text-sm text-gray-300">Brokers want integrated tools</div>
        </div>

        <div className={`border-2 rounded-lg p-4 ${h4Validated ? 'bg-green-900 bg-opacity-20 border-green-500' : 'bg-red-900 bg-opacity-20 border-red-500'}`}>
          <div className="text-2xl mb-2">{h4Validated ? '✅' : '❌'}</div>
          <div className="font-bold text-lg mb-1">H4: Pain Alignment</div>
          <div className="text-sm text-gray-300">Problems match on both sides</div>
        </div>
      </div>

      {/* 10 Factor Comparison Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📊 10-Factor Comparative Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4">Factor</th>
                <th className="text-left py-3 px-4 text-purple-400">Employer Side</th>
                <th className="text-left py-3 px-4 text-blue-400">Broker Side</th>
                <th className="text-center py-3 px-4">Correlation</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              
              <tr className="border-b border-gray-700">
                <td className="py-3 px-4 font-semibold">1. Time Spent</td>
                <td className="py-3 px-4">{factors.factor1.empTimeToFind.toFixed(0)}% took 2+ months to find broker</td>
                <td className="py-3 px-4">Avg {factors.factor1.avgBrkLeadTime.toFixed(1)} hrs/week on lead gen</td>
                <td className="py-3 px-4 text-center">-</td>
              </tr>

              <tr className="border-b border-gray-700 bg-gray-750">
                <td className="py-3 px-4 font-semibold">2. Satisfaction</td>
                <td className="py-3 px-4">
                  <div>{factors.factor2.empUnsatisfied.toFixed(0)}% unsatisfied (&lt;6/10)</div>
                  <div className="text-xs text-gray-400">Avg: {factors.factor2.empAvgSatisfaction.toFixed(1)}/10</div>
                </td>
                <td className="py-3 px-4">
                  <div>{factors.factor2.brkUnsatisfied.toFixed(0)}% unsatisfied (&lt;6/10)</div>
                  <div className="text-xs text-gray-400">Avg: {factors.factor2.brkAvgSatisfaction.toFixed(1)}/10</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${correlations.matching >= 0.6 ? 'text-green-400' : correlations.matching >= 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {(correlations.matching * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>

              <tr className="border-b border-gray-700">
                <td className="py-3 px-4 font-semibold">3. Would Recommend (NPS)</td>
                <td className="py-3 px-4">{factors.factor3.empWouldntRecommend.toFixed(0)}% wouldn't recommend process</td>
                <td className="py-3 px-4">{factors.factor3.brkWouldntRecommend.toFixed(0)}% wouldn't recommend method</td>
                <td className="py-3 px-4 text-center">-</td>
              </tr>

              <tr className="border-b border-gray-700 bg-gray-750">
                <td className="py-3 px-4 font-semibold">4. Multi-Stakeholder Pain ⭐</td>
                <td className="py-3 px-4">
                  <div>{factors.factor4.empComplexDecisions.toFixed(0)}% say complex decisions</div>
                  <div className="text-xs text-gray-400">Priority: {factors.factor4.empMultiStakeholderPriority.toFixed(1)}/10 pts</div>
                </td>
                <td className="py-3 px-4">
                  <div>{factors.factor4.brkMultiStakeholderDeals.toFixed(0)}% have 6+ multi-stakeholder deals</div>
                  <div className="text-xs text-gray-400">{factors.factor4.brkDealsLost.toFixed(0)}% lost deals to misalignment</div>
                  <div className="text-xs text-gray-400">Priority: {factors.factor4.brkMultiStakeholderPriority.toFixed(1)}/10 pts</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${correlations.multiStakeholder >= 0.6 ? 'text-green-400' : correlations.multiStakeholder >= 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {(correlations.multiStakeholder * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>

              <tr className="border-b border-gray-700">
                <td className="py-3 px-4 font-semibold">5. Cost Predictability</td>
                <td className="py-3 px-4">
                  <div>{factors.factor5.empCostExceeded.toFixed(0)}% costs 10%+ over projection</div>
                  <div className="text-xs text-gray-400">Priority: {factors.factor5.empCostPriority.toFixed(1)}/10 pts</div>
                </td>
                <td className="py-3 px-4">
                  <div>{factors.factor5.brkCostInaccurate.toFixed(0)}% admit 10%+ variance</div>
                  <div className="text-xs text-gray-400">Priority: {factors.factor5.brkCostPriority.toFixed(1)}/10 pts</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${correlations.costPredictability >= 0.6 ? 'text-green-400' : correlations.costPredictability >= 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {(correlations.costPredictability * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>

              <tr className="border-b border-gray-700 bg-gray-750">
                <td className="py-3 px-4 font-semibold">6. Service Quality</td>
                <td className="py-3 px-4">{factors.factor6.empInfrequentContact.toFixed(0)}% say broker reaches out quarterly or less</td>
                <td className="py-3 px-4">{factors.factor6.brkInfrequentContact.toFixed(0)}% reach out quarterly or less</td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-bold ${correlations.serviceQuality >= 0.6 ? 'text-green-400' : correlations.serviceQuality >= 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {(correlations.serviceQuality * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>

              <tr className="border-b border-gray-700">
                <td className="py-3 px-4 font-semibold">7. Priority Alignment</td>
                <td className="py-3 px-4">
                  <div className="text-xs space-y-1">
                    <div>Employee satisfaction: {factors.factor7.empPriorities.employee_satisfaction.toFixed(1)}</div>
                    <div>Stakeholder alignment: {factors.factor7.empPriorities.stakeholder_alignment.toFixed(1)}</div>
                    <div>Cost control: {factors.factor7.empPriorities.cost_control.toFixed(1)}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-xs space-y-1">
                    <div>Employee satisfaction: {factors.factor7.brkPriorities.employee_satisfaction.toFixed(1)}</div>
                    <div>Multi-stakeholder nav: {factors.factor7.brkPriorities.multi_stakeholder_navigation.toFixed(1)}</div>
                    <div>Cost accuracy: {factors.factor7.brkPriorities.cost_accuracy.toFixed(1)}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">-</td>
              </tr>

              <tr className="border-b border-gray-700 bg-gray-750">
                <td className="py-3 px-4 font-semibold">8. Willingness to Pay</td>
                <td className="py-3 px-4">{factors.factor8.empWTP.toFixed(0)}% willing to pay for solution</td>
                <td className="py-3 px-4">
                  <div>{factors.factor8.brkLeadWTP.toFixed(0)}% would pay for leads</div>
                  <div className="text-xs text-gray-400">{factors.factor8.brkPlatformWTP.toFixed(0)}% would pay for platform</div>
                </td>
                <td className="py-3 px-4 text-center">-</td>
              </tr>

              <tr className="border-b border-gray-700">
                <td className="py-3 px-4 font-semibold">9. Urgency (Hair on Fire)</td>
                <td className="py-3 px-4">{factors.factor9.empUrgent.toFixed(0)}% actively shopping or would switch</td>
                <td className="py-3 px-4">{factors.factor9.brkLeadQualityPoor.toFixed(0)}% have &lt;30% qualified leads</td>
                <td className="py-3 px-4 text-center">-</td>
              </tr>

              <tr className="border-b border-gray-700 bg-gray-750">
                <td className="py-3 px-4 font-semibold">10. Baseline Economics</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">
                  <div>{factors.factor10.brkHighSoftwareSpend.toFixed(0)}% spend $500+/month on software</div>
                  <div className="text-xs text-gray-400">{factors.factor10.brkHighCAC.toFixed(0)}% have CAC $2,500+</div>
                </td>
                <td className="py-3 px-4 text-center">-</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Mutual Pain Venn Diagram */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🎯 Mutual Pain Point Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Matching Inefficiency */}
          <div className={`border-2 rounded-lg p-4 ${correlations.matching >= 0.6 ? 'border-green-500 bg-green-900 bg-opacity-10' : correlations.matching >= 0.4 ? 'border-yellow-500 bg-yellow-900 bg-opacity-10' : 'border-gray-600'}`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">Matching Inefficiency</h3>
              <span className={`text-2xl font-bold ${correlations.matching >= 0.6 ? 'text-green-400' : correlations.matching >= 0.4 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {(correlations.matching * 100).toFixed(0)}%
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-purple-400">← Employer: {factors.factor2.empUnsatisfied.toFixed(0)}% unsatisfied with finding process</div>
              <div className="text-blue-400">→ Broker: {factors.factor2.brkUnsatisfied.toFixed(0)}% unsatisfied with lead gen</div>
              <div className={`mt-3 p-2 rounded ${correlations.matching >= 0.6 ? 'bg-green-900 bg-opacity-30' : correlations.matching >= 0.4 ? 'bg-yellow-900 bg-opacity-30' : 'bg-gray-700'}`}>
                <strong>Verdict:</strong> {correlations.matching >= 0.6 ? '✅ Strong mutual pain - BUILD THIS' : correlations.matching >= 0.4 ? '⚠️ Moderate mutual pain' : '❌ Weak correlation'}
              </div>
            </div>
          </div>

          {/* Multi-Stakeholder */}
          <div className={`border-2 rounded-lg p-4 ${correlations.multiStakeholder >= 0.6 ? 'border-green-500 bg-green-900 bg-opacity-10' : correlations.multiStakeholder >= 0.4 ? 'border-yellow-500 bg-yellow-900 bg-opacity-10' : 'border-gray-600'}`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">Multi-Stakeholder Alignment</h3>
              <span className={`text-2xl font-bold ${correlations.multiStakeholder >= 0.6 ? 'text-green-400' : correlations.multiStakeholder >= 0.4 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {(correlations.multiStakeholder * 100).toFixed(0)}%
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-purple-400">← Employer: {factors.factor4.empComplexDecisions.toFixed(0)}% have complex decisions</div>
              <div className="text-blue-400">→ Broker: {factors.factor4.brkMultiStakeholderDeals.toFixed(0)}% have majority multi-stakeholder</div>
              <div className={`mt-3 p-2 rounded ${correlations.multiStakeholder >= 0.6 ? 'bg-green-900 bg-opacity-30' : correlations.multiStakeholder >= 0.4 ? 'bg-yellow-900 bg-opacity-30' : 'bg-gray-700'}`}>
                <strong>Verdict:</strong> {correlations.multiStakeholder >= 0.6 ? '✅ Strong mutual pain - BUILD THIS' : correlations.multiStakeholder >= 0.4 ? '⚠️ Moderate mutual pain' : '❌ Weak correlation'}
              </div>
            </div>
          </div>

          {/* Cost Predictability */}
          <div className={`border-2 rounded-lg p-4 ${correlations.costPredictability >= 0.6 ? 'border-green-500 bg-green-900 bg-opacity-10' : correlations.costPredictability >= 0.4 ? 'border-yellow-500 bg-yellow-900 bg-opacity-10' : 'border-gray-600'}`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">Cost Predictability</h3>
              <span className={`text-2xl font-bold ${correlations.costPredictability >= 0.6 ? 'text-green-400' : correlations.costPredictability >= 0.4 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {(correlations.costPredictability * 100).toFixed(0)}%
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-purple-400">← Employer: {factors.factor5.empCostExceeded.toFixed(0)}% costs exceeded 10%+</div>
              <div className="text-blue-400">→ Broker: {factors.factor5.brkCostInaccurate.toFixed(0)}% admit 10%+ variance</div>
              <div className={`mt-3 p-2 rounded ${correlations.costPredictability >= 0.6 ? 'bg-green-900 bg-opacity-30' : correlations.costPredictability >= 0.4 ? 'bg-yellow-900 bg-opacity-30' : 'bg-gray-700'}`}>
                <strong>Verdict:</strong> {correlations.costPredictability >= 0.6 ? '✅ Strong mutual pain - BUILD THIS' : correlations.costPredictability >= 0.4 ? '⚠️ Moderate mutual pain' : '❌ Weak correlation'}
              </div>
            </div>
          </div>

          {/* Service Quality */}
          <div className={`border-2 rounded-lg p-4 ${correlations.serviceQuality >= 0.6 ? 'border-green-500 bg-green-900 bg-opacity-10' : correlations.serviceQuality >= 0.4 ? 'border-yellow-500 bg-yellow-900 bg-opacity-10' : 'border-gray-600'}`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">Service/Engagement Quality</h3>
              <span className={`text-2xl font-bold ${correlations.serviceQuality >= 0.6 ? 'text-green-400' : correlations.serviceQuality >= 0.4 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {(correlations.serviceQuality * 100).toFixed(0)}%
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-purple-400">← Employer: {factors.factor6.empInfrequentContact.toFixed(0)}% get quarterly+ contact</div>
              <div className="text-blue-400">→ Broker: {factors.factor6.brkInfrequentContact.toFixed(0)}% reach out quarterly+</div>
              <div className={`mt-3 p-2 rounded ${correlations.serviceQuality >= 0.6 ? 'bg-green-900 bg-opacity-30' : correlations.serviceQuality >= 0.4 ? 'bg-yellow-900 bg-opacity-30' : 'bg-gray-700'}`}>
                <strong>Verdict:</strong> {correlations.serviceQuality >= 0.6 ? '✅ Strong mutual pain - BUILD THIS' : correlations.serviceQuality >= 0.4 ? '⚠️ Moderate mutual pain' : '❌ Weak correlation'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decision Tree */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🌳 Decision Tree: What to Build</h2>
        <div className="space-y-4 font-mono text-sm">
          <div className="bg-gray-900 rounded p-4">
            <div className="font-bold text-green-400 mb-2">START: Survey Data Validated</div>
            <div className="ml-4 space-y-2 text-gray-300">
              <div>↓</div>
              <div className={h1Validated ? 'text-green-400 font-bold' : 'text-gray-500'}>
                {h1Validated ? '✅' : '❌'} H1: Matching Inefficiency {h1Validated ? '(VALIDATED)' : '(FAILED)'}
              </div>
              <div className="ml-4 text-xs">
                {factors.factor2.empUnsatisfied.toFixed(0)}% employers + {factors.factor2.brkUnsatisfied.toFixed(0)}% brokers unsatisfied
              </div>
              <div>↓</div>
              <div className={h2Validated ? 'text-green-400 font-bold' : 'text-gray-500'}>
                {h2Validated ? '✅' : '❌'} H2: Broker Lead Gen Gap {h2Validated ? '(VALIDATED)' : '(FAILED)'}
              </div>
              <div>↓</div>
              <div className={h3Validated ? 'text-green-400 font-bold' : 'text-gray-500'}>
                {h3Validated ? '✅' : '❌'} H3: Infrastructure Gap {h3Validated ? '(VALIDATED)' : '(FAILED)'}
              </div>
              <div>↓</div>
              <div className={h4Validated ? 'text-green-400 font-bold' : 'text-gray-500'}>
                {h4Validated ? '✅' : '❌'} H4: Pain Alignment {h4Validated ? '(VALIDATED)' : '(FAILED)'}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded p-4">
            <div className="font-bold text-purple-400 mb-2">RECOMMENDATION:</div>
            <div className="ml-4 space-y-2">
              {h1Validated && h2Validated && h4Validated && (
                <div className="text-green-400 font-bold">
                  🎯 BUILD: Two-sided marketplace connecting employers ↔ brokers
                  <div className="text-sm text-gray-300 mt-2 ml-4">
                    • Start with manual concierge matching (get to revenue fast)
                    • Focus on mutual pain: {correlations.matching >= correlations.multiStakeholder ? 'Matching inefficiency' : 'Multi-stakeholder alignment'}
                    • Revenue model: {factors.factor8.empWTP.toFixed(0)}% employers + {factors.factor8.brkLeadWTP.toFixed(0)}% brokers willing to pay
                  </div>
                </div>
              )}
              {h3Validated && !h1Validated && (
                <div className="text-blue-400 font-bold">
                  🎯 BUILD: Broker SaaS platform (skip marketplace)
                  <div className="text-sm text-gray-300 mt-2 ml-4">
                    • Focus on broker infrastructure consolidation
                    • {factors.factor8.brkPlatformWTP.toFixed(0)}% willing to pay for platform
                  </div>
                </div>
              )}
              {!h1Validated && !h2Validated && !h3Validated && (
                <div className="text-red-400 font-bold">
                  ⚠️ PIVOT: Problem not validated at scale
                  <div className="text-sm text-gray-300 mt-2 ml-4">
                    • Run deeper interviews to understand why
                    • May need to target different segment
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
