import { useState, useEffect } from "react";
import { RefreshCw, Filter, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { BookCard } from "./BookCard";
import { EgolayAPI } from "../utils/supabase/client";

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

interface BookRecommendationsProps {
  userProfile: any;
  onAddToWishlist: (bookId: string, bookData?: any) => void;
  onMarkAsRead: (bookId: string, bookData?: any) => void;
  wishlist: string[];
}

export function BookRecommendations({ 
  userProfile, 
  onAddToWishlist, 
  onMarkAsRead, 
  wishlist 
}: BookRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Load recommendations from backend
  const loadRecommendations = async () => {
    try {
      const response = await EgolayAPI.getRecommendations();
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Fallback to mock data
      generateMockRecommendations();
    }
  };

  // Fallback mock recommendations
  const generateMockRecommendations = () => {
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        genre: ["Fiction", "Romance", "Historical"],
        description: "A reclusive Hollywood icon tells her life story to an unknown journalist, revealing long-held secrets about her glamorous and scandalous life.",
        coverUrl: "https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY29sbGVjdGlvbiUyMGxpYnJhcnl8ZW58MXx8fHwxNzU5MjUxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.4,
        pages: 400,
        publishYear: 2017,
        matchReason: "Matches your love for character-driven fiction and romantic elements",
        bookstores: [
          { name: "Corner Bookshop", distance: "0.3 mi", price: "$14.99", inStock: true },
          { name: "Literary Haven", distance: "0.8 mi", price: "$13.50", inStock: true }
        ]
      },
      {
        id: "2",
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        genre: ["Fiction", "Sci-Fi", "Literary"],
        description: "A poignant story told from the perspective of Klara, an artificial friend with outstanding observational qualities, who watches the human behavior of the family she serves.",
        coverUrl: "https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY29sbGVjdGlvbiUyMGxpYnJhcnl8ZW58MXx8fHwxNzU5MjUxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.1,
        pages: 320,
        publishYear: 2021,
        matchReason: "Perfect for your contemplative mood and interest in thought-provoking fiction",
        bookstores: [
          { name: "Indie Books Co.", distance: "0.5 mi", price: "$16.99", inStock: false },
          { name: "Page Turner", distance: "1.2 mi", price: "$15.75", inStock: true }
        ]
      },
      {
        id: "3",
        title: "Educated",
        author: "Tara Westover",
        genre: ["Biography", "Non-Fiction"],
        description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
        coverUrl: "https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY29sbGVjdGlvbiUyMGxpYnJhcnl8ZW58MXx8fHwxNzU5MjUxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.6,
        pages: 334,
        publishYear: 2018,
        matchReason: "Inspiring memoir that aligns with your preference for educational content",
        bookstores: [
          { name: "Corner Bookshop", distance: "0.3 mi", price: "$17.99", inStock: true },
          { name: "Book Nook", distance: "0.7 mi", price: "$16.50", inStock: true }
        ]
      },
      {
        id: "4",
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: ["Fiction", "Philosophy"],
        description: "Between life and death is a library filled with all the possible lives you could have lived. A thought-provoking novel about regret, hope, and second chances.",
        coverUrl: "https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY29sbGVjdGlvbiUyMGxpYnJhcnl8ZW58MXx8fHwxNzU5MjUxNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.2,
        pages: 288,
        publishYear: 2020,
        matchReason: "Combines philosophical themes with accessible storytelling, perfect for introspective reading",
        bookstores: [
          { name: "Literary Haven", distance: "0.8 mi", price: "$15.99", inStock: true },
          { name: "Indie Books Co.", distance: "0.5 mi", price: "$14.25", inStock: true }
        ]
      }
    ];

    // Filter based on user preferences
    let filtered = mockBooks;
    
    if (userProfile.favoriteGenres.length > 0) {
      filtered = filtered.filter(book => 
        book.genre.some(g => userProfile.favoriteGenres.includes(g))
      );
    }

    if (filter !== "all") {
      filtered = filtered.filter(book => 
        book.genre.some(g => g.toLowerCase().includes(filter.toLowerCase()))
      );
    }

    setRecommendations(filtered);
  };

  const refreshRecommendations = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadRecommendations();
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (userProfile.name) {
      loadRecommendations();
    }
  }, [userProfile, filter]);

  if (!userProfile.name) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Card>
          <CardContent className="pt-6">
            <h2>Welcome to Egolay!</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              Complete your profile to get personalized book recommendations.
            </p>
            <Button onClick={() => window.location.hash = "#profile"}>
              Set Up Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2>Recommended for {userProfile.name}</h2>
            <p className="text-muted-foreground">
              Based on your preferences and current mood
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={refreshRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current interests:</span>
            {userProfile.currentMoods.slice(0, 3).map((mood: string) => (
              <Badge key={mood} variant="outline" className="text-xs">
                {mood}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-96 animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-28 bg-muted rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToWishlist={onAddToWishlist}
              onMarkAsRead={onMarkAsRead}
              isInWishlist={wishlist.includes(book.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>No recommendations found for your current filters.</p>
            <Button variant="outline" onClick={() => setFilter("all")} className="mt-4">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}