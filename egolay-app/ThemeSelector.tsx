import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Check, Palette, Sparkles } from "lucide-react";
import { themes, Theme, getThemeByGenres, getThemeByMood, applyTheme } from "../utils/theme";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
  userProfile?: {
    favoriteGenres: string[];
    currentMoods: string[];
  };
}

export function ThemeSelector({ selectedTheme, onThemeChange, userProfile }: ThemeSelectorProps) {
  const [isAutoMode, setIsAutoMode] = useState(false);

  const handleThemeSelect = (themeId: string) => {
    setIsAutoMode(false);
    onThemeChange(themeId);
    applyTheme(themeId);
  };

  const handleAutoTheme = () => {
    setIsAutoMode(true);
    let suggestedTheme: Theme;

    // First try to match by current mood, then by favorite genres
    if (userProfile?.currentMoods?.length) {
      suggestedTheme = getThemeByMood(userProfile.currentMoods);
    } else if (userProfile?.favoriteGenres?.length) {
      suggestedTheme = getThemeByGenres(userProfile.favoriteGenres);
    } else {
      suggestedTheme = themes[0]; // Default theme
    }

    onThemeChange(suggestedTheme.id);
    applyTheme(suggestedTheme.id);
  };

  const getSmartSuggestion = (): Theme | null => {
    if (!userProfile) return null;
    
    if (userProfile.currentMoods?.length) {
      return getThemeByMood(userProfile.currentMoods);
    } else if (userProfile.favoriteGenres?.length) {
      return getThemeByGenres(userProfile.favoriteGenres);
    }
    
    return null;
  };

  const smartSuggestion = getSmartSuggestion();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <div>
            <CardTitle>Visual Theme</CardTitle>
            <CardDescription>
              Choose a color scheme that matches your reading mood
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Smart Suggestion */}
        {smartSuggestion && smartSuggestion.id !== selectedTheme && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Suggested for you</p>
                  <p className="text-sm text-muted-foreground">
                    {smartSuggestion.name} - {smartSuggestion.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoTheme}
                className="ml-4"
              >
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Auto Theme Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Smart Theme</p>
            <p className="text-sm text-muted-foreground">
              Automatically adapt theme based on your mood and reading preferences
            </p>
          </div>
          <Button
            variant={isAutoMode ? "default" : "outline"}
            size="sm"
            onClick={handleAutoTheme}
          >
            {isAutoMode ? "Active" : "Enable"}
          </Button>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedTheme === theme.id 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              {selectedTheme === theme.id && (
                <div className="absolute top-3 right-3">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
              
              {/* Theme Preview */}
              <div className="flex gap-2 mb-3">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.previewColors.primary }}
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.previewColors.secondary }}
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.previewColors.accent }}
                />
              </div>

              {/* Theme Info */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium">{theme.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
                
                {/* Best For Tags */}
                <div className="flex flex-wrap gap-1">
                  {theme.bestFor.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {theme.bestFor.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{theme.bestFor.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Your theme preference will be saved and applied across all devices</p>
        </div>
      </CardContent>
    </Card>
  );
}