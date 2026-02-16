export function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-0 bg-white dark:bg-black p-8 shadow-lg">
      {children}
    </div>
  );
}
