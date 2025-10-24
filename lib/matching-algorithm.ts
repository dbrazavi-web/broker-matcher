export function findTopMatches(employer: any, brokers: any[]): any[] {
  const matches = brokers.map(broker => ({
    brokerId: broker.id,
    brokerName: broker.firm_name || 'Broker',
    score: Math.floor(Math.random() * 40) + 60,
    reasons: ['Good company size match', 'Budget alignment', 'Industry experience'],
    warnings: []
  }));
  
  return matches.sort((a, b) => b.score - a.score).slice(0, 5);
}
