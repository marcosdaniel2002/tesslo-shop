interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

function Title({ title, subtitle, className }: Props) {
  return (
    <div className={`mt-3 ${className}`}>
      <h1 className="text-4xl font-bold text-foreground my-5">{title}</h1>

      {subtitle && <h3 className="text-xl text-muted mb-10">{subtitle}</h3>}
    </div>
  );
}

export default Title;
