import { Book, User, MapPin, Library, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { SmartThemeButton } from "./SmartThemeButton";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onSignOut: () => void;
  userProfile?: any;
  onThemeChange?: (themeId: string) => void;
}

export function Header({ activeTab, onTabChange, user, onSignOut, userProfile, onThemeChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-medium">Egolay</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={activeTab === "recommendations" ? "default" : "ghost"}
              onClick={() => onTabChange("recommendations")}
              className="flex items-center space-x-2"
            >
              <Library className="h-4 w-4" />
              <span>Recommendations</span>
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => onTabChange("profile")}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button
              variant={activeTab === "bookstores" ? "default" : "ghost"}
              onClick={() => onTabChange("bookstores")}
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Local Stores</span>
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => onTabChange("history")}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>My Books</span>
            </Button>
          </nav>
          
          {/* User menu */}
          <div className="flex items-center gap-2">
            {/* Smart Theme Button */}
            {userProfile && onThemeChange && (
              <SmartThemeButton 
                userProfile={userProfile} 
                onThemeChange={onThemeChange}
              />
            )}
            
            {user && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Welcome,</span>
                <span className="font-medium">{user.user_metadata?.name || user.email}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}