import { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles, Palette } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { getThemeByGenres, getThemeByMood, applyTheme, themes } from "../utils/theme";

interface SmartThemeButtonProps {
  userProfile: {
    favoriteGenres: string[];
    currentMoods: string[];
    theme?: string;
  };
  onThemeChange: (themeId: string) => void;
}

export function SmartThemeButton({ userProfile, onThemeChange }: SmartThemeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSmartTheme = () => {
    setIsAnimating(true);
    
    let suggestedTheme;
    let reason = '';

    // Determine theme based on current mood first, then genres
    if (userProfile.currentMoods?.length > 0) {
      suggestedTheme = getThemeByMood(userProfile.currentMoods);
      reason = `Based on your ${userProfile.currentMoods[0].toLowerCase()} mood`;
    } else if (userProfile.favoriteGenres?.length > 0) {
      suggestedTheme = getThemeByGenres(userProfile.favoriteGenres);
      reason = `Perfect for ${userProfile.favoriteGenres[0]} readers`;
    } else {
      suggestedTheme = themes[0]; // Default
      reason = 'Classic theme for all reading';
    }

    // Only change if it's different from current theme
    if (suggestedTheme.id !== userProfile.theme) {
      setTimeout(() => {
        onThemeChange(suggestedTheme.id);
        applyTheme(suggestedTheme.id);
        setIsAnimating(false);
      }, 500);
    } else {
      setIsAnimating(false);
    }
  };

  const getSuggestedTheme = () => {
    if (userProfile.currentMoods?.length > 0) {
      return getThemeByMood(userProfile.currentMoods);
    } else if (userProfile.favoriteGenres?.length > 0) {
      return getThemeByGenres(userProfile.favoriteGenres);
    }
    return themes[0];
  };

  const suggestedTheme = getSuggestedTheme();
  const isDifferentFromCurrent = suggestedTheme.id !== userProfile.theme;

  if (!isDifferentFromCurrent) {
    return null; // Don't show if current theme is already optimal
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSmartTheme}
            className="relative overflow-hidden"
            disabled={isAnimating}
          >
            <div className="flex items-center gap-2">
              {isAnimating ? (
                <Palette className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isAnimating ? 'Applying...' : 'Smart Theme'}
              </span>
            </div>
            {isAnimating && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">Switch to {suggestedTheme.name}</p>
            <p className="text-xs text-muted-foreground">
              {userProfile.currentMoods?.length > 0 
                ? `Perfect for your ${userProfile.currentMoods[0].toLowerCase()} mood`
                : `Great for ${userProfile.favoriteGenres?.[0] || 'general'} reading`
              }
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}