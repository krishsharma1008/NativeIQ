import { NextRequest, NextResponse } from 'next/server';

// Serper API key is provided by user. Prefer env var; fall back to inline key if present in secrets.
const SERPER_API_KEY = process.env.SERPER_API_KEY || '69456e800c0c19439a8ad088b830216703c8cc6a';

async function fetchSerperNews(q: string) {
  try {
    const res = await fetch('https://google.serper.dev/news', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q, gl: 'us', hl: 'en' })
    });
    if (!res.ok) throw new Error('Serper failed');
    const data = await res.json();
    return (data.news || []).slice(0, 6);
  } catch {
    return [];
  }
}

function buildSuggestions(industry: string, location: string, news: any[]) {
  // Simple heuristic mapping: derive seasonal/festival cues and trending entities
  const now = new Date();
  const month = now.getMonth() + 1;
  const seasonalHints: Record<string, string[]> = {
    US: month === 11 ? ['Thanksgiving', 'turkey', 'pumpkin pie'] : month === 12 ? ['Christmas', 'gingerbread', 'hot cocoa'] : month === 7 ? ['Independence Day', 'BBQ', 'grill'] : [],
    IN: month === 10 || month === 11 ? ['Diwali', 'sweets', 'mithai'] : month === 8 ? ['Raksha Bandhan', 'laddu'] : [],
    UK: month === 12 ? ['Christmas', 'mince pies'] : [],
    CA: month === 7 ? ['Canada Day', 'BBQ'] : []
  };

  const seasonal = seasonalHints[location as keyof typeof seasonalHints] || [];
  const keywords = new Map<string, number>();
  for (const n of news) {
    const title: string = n.title || '';
    const s = (title + ' ' + (n.snippet || '')).toLowerCase();
    ['festival','holiday','trend','demand','shortage','price','seasonal','recipe','menu','launch','limited'].forEach(k=>{
      if (s.includes(k)) keywords.set(k, (keywords.get(k) || 0) + 1);
    });
    // Pull candidate food terms
    ;['pumpkin','gingerbread','bbq','grill','turkey','sweets','laddu','vegan','gluten-free','spicy','seafood','ramen','taco'].forEach(k=>{
      if (s.includes(k)) keywords.set(k, (keywords.get(k) || 0) + 1);
    });
  }

  const sorted = [...keywords.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>k);

  const suggestions = [] as any[];

  if (industry === 'food') {
    if (seasonal.length) {
      suggestions.push({
        id: 'seasonal-1',
        title: `Seasonal special: feature ${seasonal[1] || seasonal[0]} items`,
        rationale: `Upcoming ${seasonal[0]} in ${location}. Seasonal menus typically lift conversion and AOV during holidays.`,
        action: `Promote a limited-time menu around ${seasonal.slice(0,2).join(' & ')}`,
        confidence: 0.82,
        source: seasonal[0]
      });
    }
    if (sorted.length) {
      suggestions.push({
        id: 'trend-1',
        title: `Lean into demand: ${sorted[0]} trend`,
        rationale: `Recent headlines indicate rising interest in "${sorted[0]}" across ${location}.`,
        action: `Create a quick bundle or spotlight dish: ${sorted[0]}`,
        confidence: 0.7,
        source: 'Serper news'
      });
    }
    suggestions.push({
      id: 'ops-1',
      title: 'Plan inventory around weekends',
      rationale: 'Local demand spikes on Fri–Sun for food SMBs; align prep to reduce waste.',
      action: 'Increase prep by 20% on Fri; reduce by 15% on Mon–Tue',
      confidence: 0.6
    });
  } else {
    // Generic SMB suggestion
    suggestions.push({
      id: 'generic-1',
      title: 'Use 1 limited-time offer tied to a current headline',
      rationale: 'Headline-tied offers lift CTR and conversion with relevance.',
      action: 'Create a 7‑day promo referencing a trending topic in your niche',
      confidence: 0.55,
      source: news[0]?.title
    });
  }

  return suggestions;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const industry = (searchParams.get('industry') || 'food').toLowerCase();
  const location = (searchParams.get('location') || 'US').toUpperCase();

  const query = `${industry} ${location} seasonal trends festival demand news`;
  const news = await fetchSerperNews(query);
  const suggestions = buildSuggestions(industry, location, news);

  return NextResponse.json({ suggestions, newsCount: news.length });
}


