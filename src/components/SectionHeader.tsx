interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionHeader = ({ subtitle, title, description, centered = true, light = false }: SectionHeaderProps) => {
  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''} mb-12`}>
      {subtitle && (
        <span className="inline-block text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
          {subtitle}
        </span>
      )}
      <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-primary-foreground' : 'text-foreground'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg ${light ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
