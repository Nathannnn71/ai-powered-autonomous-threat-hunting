import React from 'react';

// Reusable component to display a full log record with required fields
export default function LogDetails({ log }) {
  const safeJoin = (v) => Array.isArray(v) ? v.join(', ') : (v ?? '-');
  const field = (label, value) => (
    <div className="flex gap-1 leading-snug">
      <span className="font-semibold text-slate-800">{label}:</span>
      <span className="flex-1 break-words text-slate-900">{value}</span>
    </div>
  );
  if (!log) return null;
  return (
    <div className="space-y-1 text-xs md:text-sm">
      {field('Original Log', log.original_log || log.raw || log.full_log || '-')}
      {field('Hypothesis ID', log.hypothesis_id ?? '-')}
      {field('Source IP', log.src_ip ?? log.source_ip ?? '-')}
      {field('Hypothesis', log.hypothesis ?? (Array.isArray(log.hypotheses) ? log.hypotheses.join(', ') : '-'))}
      {field('Observed Patterns', safeJoin(log.observed_patterns))}
      {field('Confidence Score', log.confidence_score ?? '-')}
      {field('Confidence', log.confidence ?? '-')}
      {field('Category', log.category ?? log.classification ?? '-')}
      {field('Vulnerabilities', safeJoin(log.vulnerabilities))}
      {field('Investigation Log', log.investigation_log ?? '-')}
      {field('Recommendations', safeJoin(log.recommendations))}
    </div>
  );
}
