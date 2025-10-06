import { Star, Heart, ExternalLink, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string[];
  description: string;
  coverUrl: string;
  rating: number;
  pages: number;
  publishYear: number;
  matchReason: string;
  bookstores: Array<{
    name: string;
    distance: string;
    price: string;
    inStock: boolean;
  }>;
}

interface BookCardProps {
  book: Book;
  onAddToWishlist: (bookId: string, bookData?: any) => void;
  onMarkAsRead: (bookId: string, bookData?: any) => void;
  isInWishlist?: boolean;
}

export function BookCard({ book, onAddToWishlist, onMarkAsRead, isInWishlist = false }: BookCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <ImageWithFallback
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-20 h-28 object-cover rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2">{book.title}</CardTitle>
            <CardDescription className="mb-2">by {book.author}</CardDescription>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">{book.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {book.pages} pages • {book.publishYear}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {book.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-sm text-primary bg-primary/5 p-2 rounded-md">
            <strong>Why we recommend this:</strong> {book.matchReason}
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {book.description}
        </p>
        
        <div className="mt-auto space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToWishlist(book.id, book)}
              className="flex-1"
            >
              <Heart className={`h-4 w-4 mr-1 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
            <Button
              size="sm"
              onClick={() => onMarkAsRead(book.id, {
                id: book.id,
                title: book.title,
                author: book.author,
                genre: book.genre,
                rating: book.rating,
                coverUrl: book.coverUrl,
                myRating: 5, // Default rating, could be made interactive
                review: "", // Could be made interactive with a modal
                dateRead: new Date().toISOString().split('T')[0]
              })}
              className="flex-1"
            >
              Mark as Read
            </Button>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Local Bookstores:</span>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            {book.bookstores.slice(0, 2).map((store, index) => (
              <div key={index} className="flex justify-between items-center text-sm mb-1">
                <div className="flex-1">
                  <span className="font-medium">{store.name}</span>
                  <span className="text-muted-foreground ml-2">({store.distance})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">{store.price}</span>
                  {store.inStock && (
                    <Badge variant="outline" className="text-xs">
                      In Stock
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2">
              <ExternalLink className="h-3 w-3 mr-1" />
              View All Stores
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}