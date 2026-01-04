import { LucideIcon } from 'lucide-react';

interface AmenityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const AmenityCard = ({ icon: Icon, title, description }: AmenityCardProps) => {
  return (
    <div className="group p-6 bg-card rounded-lg card-hover elegant-shadow text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
      </div>
      <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default AmenityCard;
