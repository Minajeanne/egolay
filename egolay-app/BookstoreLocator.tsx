import { useState } from "react";
import { MapPin, Phone, Clock, ExternalLink, Star, Navigation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Bookstore {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  rating: number;
  specialties: string[];
  description: string;
  imageUrl: string;
  website: string;
  featuredBooks: Array<{
    title: string;
    author: string;
    price: string;
  }>;
}

export function BookstoreLocator() {
  const [location, setLocation] = useState("");
  const [bookstores, setBookstores] = useState<Bookstore[]>([
    {
      id: "1",
      name: "Corner Bookshop",
      address: "123 Main Street, Downtown",
      distance: "0.3 mi",
      phone: "(555) 123-4567",
      hours: "Mon-Sat 9am-9pm, Sun 10am-6pm",
      rating: 4.8,
      specialties: ["Local Authors", "Book Club", "Coffee Bar"],
      description: "A cozy neighborhood bookstore featuring local authors and hosting weekly book clubs. Known for their excellent coffee and curated fiction selection.",
      imageUrl: "https://images.unsplash.com/photo-1727342681676-b7b32b273add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2h8MXx8Y296eSUyMGJvb2tzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTE3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      website: "cornerbooks.com",
      featuredBooks: [
        { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", price: "$14.99" },
        { title: "Educated", author: "Tara Westover", price: "$17.99" }
      ]
    },
    {
      id: "2",
      name: "Literary Haven",
      address: "456 Oak Avenue, Arts District",
      distance: "0.8 mi",
      phone: "(555) 987-6543",
      hours: "Daily 8am-10pm",
      rating: 4.6,
      specialties: ["Rare Books", "Poetry", "Literary Events"],
      description: "An independent bookstore specializing in literary fiction and poetry. Hosts monthly author readings and maintains an impressive rare book collection.",
      imageUrl: "https://images.unsplash.com/photo-1727342681676-b7b32b273add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2h8MXx8Y296eSUyMGJvb2tzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTE3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      website: "literaryhaven.com",
      featuredBooks: [
        { title: "Klara and the Sun", author: "Kazuo Ishiguro", price: "$16.99" },
        { title: "The Midnight Library", author: "Matt Haig", price: "$15.99" }
      ]
    },
    {
      id: "3",
      name: "Indie Books Co.",
      address: "789 Elm Street, University Area",
      distance: "0.5 mi",
      phone: "(555) 456-7890",
      hours: "Mon-Thu 10am-8pm, Fri-Sat 10am-10pm, Sun 11am-7pm",
      rating: 4.7,
      specialties: ["Academic Books", "Student Discounts", "Study Space"],
      description: "A student-friendly bookstore near the university offering academic texts, study spaces, and discounts for students. Great selection of contemporary fiction.",
      imageUrl: "https://images.unsplash.com/photo-1727342681676-b7b32b273add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2h8MXx8Y296eSUyMGJvb2tzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTE3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      website: "indiebooksco.com",
      featuredBooks: [
        { title: "The Midnight Library", author: "Matt Haig", price: "$14.25" },
        { title: "Educated", author: "Tara Westover", price: "$16.50" }
      ]
    },
    {
      id: "4",
      name: "Page Turner",
      address: "321 Pine Road, Suburban Plaza",
      distance: "1.2 mi",
      phone: "(555) 234-5678",
      hours: "Mon-Sat 9am-8pm, Sun 10am-6pm",
      rating: 4.4,
      specialties: ["Children's Books", "Book Signings", "Gift Wrap"],
      description: "Family-owned bookstore with an excellent children's section and regular book signing events. Known for their personalized recommendations and gift services.",
      imageUrl: "https://images.unsplash.com/photo-1727342681676-b7b32b273add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyY2h8MXx8Y296eSUyMGJvb2tzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTE3NDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      website: "pageturnerbooks.com",
      featuredBooks: [
        { title: "Klara and the Sun", author: "Kazuo Ishiguro", price: "$15.75" },
        { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", price: "$13.50" }
      ]
    }
  ]);

  const handleLocationSearch = () => {
    // In a real app, this would use geolocation API and search nearby bookstores
    console.log("Searching for bookstores near:", location);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2>Local Independent Bookstores</h2>
        <p className="text-muted-foreground mt-2">
          Support local businesses and discover unique book recommendations
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 max-w-md">
          <Input
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button onClick={handleLocationSearch}>
            <Navigation className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {bookstores.map((store) => (
          <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <ImageWithFallback
                src={store.imageUrl}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {store.name}
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{store.rating}</span>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {store.address} • {store.distance}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {store.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {store.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{store.hours}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h4 className="text-sm font-medium mb-2">Featured Books:</h4>
                <div className="space-y-1">
                  {store.featuredBooks.map((book, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="truncate">
                        <span className="font-medium">{book.title}</span>
                        <span className="text-muted-foreground"> by {book.author}</span>
                      </span>
                      <span className="text-green-600 ml-2">{book.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  Directions
                </Button>
                <Button size="sm" className="flex-1">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Visit Website
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="mb-2">Why Support Local Bookstores?</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Personalized recommendations from knowledgeable staff</li>
          <li>• Unique book selection and rare finds</li>
          <li>• Community events and author readings</li>
          <li>• Supporting local economy and culture</li>
          <li>• Often better prices than large chains</li>
        </ul>
      </div>
    </div>
  );
}