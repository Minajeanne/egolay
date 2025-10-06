import { useState } from "react";
import { Book, Heart, Trash2, Star, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ReadBook {
  id: string;
  title: string;
  author: string;
  genre: string[];
  rating: number;
  myRating?: number;
  dateRead: string;
  review?: string;
  coverUrl: string;
}

interface ReadingHistoryProps {
  readBooks: ReadBook[];
  wishlist: string[];
  onRemoveFromWishlist: (bookId: string) => void;
  onMarkAsRead: (bookId: string, bookData?: any) => void;
}

export function ReadingHistory({ 
  readBooks, 
  wishlist, 
  onRemoveFromWishlist, 
  onMarkAsRead 
}: ReadingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");

  // Mock wishlist books (in a real app, this would come from a database)
  const wishlistBooks: ReadBook[] = [
    {
      id: "w1",
      title: "The Song of Achilles",
      author: "Madeline Miller",
      genre: ["Fiction", "Historical", "Romance"],
      rating: 4.5,
      dateRead: "",
      coverUrl: "https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY29sbGVjdGlvbiUyMGxpYnJhcnl8ZW58MXx8fHwxNzU5MjUxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: "w2",
      title: "Atomic Habits",
      author: "James Clear",
      genre: ["Self-Help", "Psychology"],
      rating: 4.3,
      dateRead: "",
      coverUrl: "https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY29sbGVjdGlvbiUyMGxpYnJhcnl8ZW58MXx8fHwxNzU5MjUxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ].filter(book => wishlist.includes(book.id));

  const filteredReadBooks = readBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const getGenres = () => {
    const genres = new Set<string>();
    readBooks.forEach(book => book.genre.forEach(g => genres.add(g)));
    return Array.from(genres);
  };

  const getReadingStats = () => {
    const totalBooks = readBooks.length;
    const avgRating = readBooks.reduce((sum, book) => sum + (book.myRating || 0), 0) / totalBooks || 0;
    const favoriteGenre = readBooks.reduce((acc, book) => {
      book.genre.forEach(g => {
        acc[g] = (acc[g] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const topGenre = Object.entries(favoriteGenre).sort(([,a], [,b]) => b - a)[0]?.[0] || "Fiction";

    return { totalBooks, avgRating: avgRating.toFixed(1), topGenre };
  };

  const stats = getReadingStats();

  const BookCard = ({ book, isWishlist = false }: { book: ReadBook; isWishlist?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <ImageWithFallback
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-16 h-24 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-2 mb-1">{book.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {book.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="outline" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isWishlist && book.myRating && (
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs ml-1">{book.myRating}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">
                  {isWishlist ? `${book.rating} avg rating` : book.dateRead}
                </span>
              </div>
              
              {isWishlist ? (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsRead(book.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Book className="h-3 w-3 mr-1" />
                    Mark Read
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFromWishlist(book.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  <Star className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {book.review && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              "{book.review}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2>My Reading Journey</h2>
        <p className="text-muted-foreground mt-2">
          Track your reading progress and discover patterns in your book choices
        </p>
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalBooks}</div>
            <p className="text-sm text-muted-foreground">Books Read</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.avgRating}</div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.topGenre}</div>
            <p className="text-sm text-muted-foreground">Favorite Genre</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="read" className="space-y-6">
        <TabsList>
          <TabsTrigger value="read" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Books Read ({readBooks.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Wishlist ({wishlistBooks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedGenre === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre("all")}
              >
                All
              </Button>
              {getGenres().slice(0, 4).map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {filteredReadBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReadBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3>No books found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchTerm ? "Try adjusting your search terms" : "Start reading and mark books as complete!"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-6">
          {wishlistBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistBooks.map((book) => (
                <BookCard key={book.id} book={book} isWishlist={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3>Your wishlist is empty</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Add books to your wishlist from the recommendations page
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}