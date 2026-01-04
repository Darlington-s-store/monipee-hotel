import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface RoomCardProps {
  id?: string;
  image: string;
  name: string;
  description: string;
  price: number;
  amenities: string[];
  size?: string;
}

const RoomCard = ({ id = 'standard', image, name, description, price, amenities, size }: RoomCardProps) => {
  const navigate = useNavigate();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/booking?room=${id}`);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden card-hover elegant-shadow">
      {/* Image */}
      <Link to={`/rooms/${id}`} className="block relative h-64 image-zoom">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          From GH₵{price}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-medium">Free Cancellation</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Link to={`/rooms/${id}`}>
            <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          {size && (
            <span className="text-sm text-muted-foreground">{size}</span>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="text-xs px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-serif font-bold text-primary">GH₵{price}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <button 
            onClick={handleBookNow}
            className="btn-outline-gold px-6 py-2 rounded-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
