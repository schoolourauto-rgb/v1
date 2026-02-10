export function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
      {children}
    </div>
  );
}
