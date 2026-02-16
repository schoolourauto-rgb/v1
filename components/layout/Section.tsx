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
    <section className={`py-20 px-8 ${className}`}>
      {title && <h2 className="text-3xl font-bold mb-10 text-black dark:text-white">{title}</h2>}
      {children}
    </section>
  );
}
