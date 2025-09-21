"use client";

import { useEffect, useState } from "react";
import { Badge, Button } from "@nativeiq/ui";

type Suggestion = {
  id: string;
  title: string;
  rationale: string;
  action: string;
  confidence: number;
  source?: string;
};

interface MarketSuggestionsProps {
  onClose?: () => void;
}

export default function MarketSuggestions({ onClose }: MarketSuggestionsProps) {
  const [industry, setIndustry] = useState<string>("food");
  const [location, setLocation] = useState<string>("US");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/market-suggestions?industry=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (e) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="market-suggestions">
      <div className="market-suggestions__controls" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="chat-interface__user-select">
            <option value="food">Food & Beverage</option>
            <option value="retail">Retail</option>
            <option value="fitness">Fitness</option>
            <option value="beauty">Beauty</option>
          </select>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="chat-interface__user-select">
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
          </select>
          <Button variant="secondary" onClick={fetchSuggestions} disabled={loading} style={{ flexShrink: 0 }}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
        {onClose && (
          <Button variant="secondary" onClick={onClose} style={{ flexShrink: 0 }}>
            ✕
          </Button>
        )}
      </div>

      <div className="market-suggestions__list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1.5rem' }}>
        {suggestions.length === 0 && !loading && (
          <div className="muted" style={{ padding: '3rem', textAlign: 'center', fontSize: '1.1rem' }}>
            No suggestions yet. Try Refresh.
          </div>
        )}
        {suggestions.map(s => (
          <div key={s.id} className="recommendation-item" style={{ width: '100%', boxSizing: 'border-box', minHeight: 'auto' }}>
            <div className="recommendation-item__header">
              <h4 className="recommendation-item__title">{s.title}</h4>
              <Badge className="deal-priority deal-priority--medium">
                {Math.round(s.confidence * 100)}%
              </Badge>
            </div>
            <p className="recommendation-item__description">{s.rationale}</p>
            <div className="recommendation-actions-grid">
              <span className="recommendation-impact-label">→</span>
              <span className="recommendation-impact-value">
                {s.action}
              </span>
            </div>
            {s.source && (
              <div className="muted" style={{ fontSize: '0.75rem', marginTop: '0.75rem', opacity: 0.7 }}>
                Source: {s.source}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


