export function Tags({ label, items }) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className="border border-border bg-secondary px-3 py-1.5 text-xs">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
