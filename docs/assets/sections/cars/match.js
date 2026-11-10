import { parseCarQuery, carCondsMatch } from './query.js';
export { parseCarQuery };
export function matchingConfigs(car, query, lang='en') {
  const p = typeof query === 'string' ? parseCarQuery(query) : query;
  const vehicle = {...car, countryName:car.countryName.en};
  const text = p.text.trim().toLowerCase();
  if (text && ![car.name,car.id,car.brand,...car.configs.map(c=>c.name)].some(s=>(s??'').toLowerCase().includes(text))) return [];
  if (!text && !p.conds.length) return car.configs.slice();
  return car.configs.filter(config => carCondsMatch(vehicle, config, p.conds, {countryLabel:() => car.countryName[lang]})).sort((a,b) => (b.power??-1)-(a.power??-1));
}
