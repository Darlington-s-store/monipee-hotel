import { Star, Quote } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar?: string;
}

const ReviewCard = ({ name, date, rating, comment, avatar }: ReviewCardProps) => {
  return (
    <div className="bg-card p-6 rounded-lg elegant-shadow relative">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-primary fill-primary' : 'text-muted'
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-foreground mb-6 italic leading-relaxed">
        "{comment}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
