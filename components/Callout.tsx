export const Callout = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <aside className="my-6 rounded-r border-rose-400 border-l-4 bg-zinc-200/60 p-4 dark:bg-zinc-800/60">
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {children}
    </aside>
  );
};
