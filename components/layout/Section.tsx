export function Section({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section className={`py-16 ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {children}
    </section>
  );
}
