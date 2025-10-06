import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { EgolayAPI } from "../utils/supabase/client";
import { ThemeSelector } from "./ThemeSelector";
import { MFASetup } from "./MFASetup";
import { applyTheme } from "../utils/theme";
import { Loader2, Save, Shield, Lock } from "lucide-react";

interface UserProfileProps {
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
}

export function UserProfile({ userProfile, onProfileUpdate }: UserProfileProps) {
  const [profile, setProfile] = useState(userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [mfaFactors, setMfaFactors] = useState<any[]>([]);

  // Load profile from backend on mount
  useEffect(() => {
    loadProfile();
    loadMFAFactors();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await EgolayAPI.getProfile();
      if (response.profile) {
        setProfile(response.profile);
        onProfileUpdate(response.profile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMFAFactors = async () => {
    try {
      const data = await EgolayAPI.getMFAFactors();
      setMfaFactors(data.totp || []);
    } catch (error) {
      console.error('Failed to load MFA factors:', error);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await EgolayAPI.updateProfile(profile);
      onProfileUpdate(response.profile);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const genres = [
    "Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", 
    "Biography", "History", "Philosophy", "Psychology", "Business", 
    "Self-Help", "Travel", "Cooking", "Art", "Poetry"
  ];

  const moods = [
    "Adventurous", "Contemplative", "Escapist", "Educational", "Inspiring", 
    "Relaxing", "Challenging", "Nostalgic", "Romantic", "Thrilling"
  ];

  const handleGenreToggle = (genre: string) => {
    const updatedGenres = profile.favoriteGenres.includes(genre)
      ? profile.favoriteGenres.filter((g: string) => g !== genre)
      : [...profile.favoriteGenres, genre];
    
    const updatedProfile = { ...profile, favoriteGenres: updatedGenres };
    setProfile(updatedProfile);
  };

  const handleMoodToggle = (mood: string) => {
    const updatedMoods = profile.currentMoods.includes(mood)
      ? profile.currentMoods.filter((m: string) => m !== mood)
      : [...profile.currentMoods, mood];
    
    const updatedProfile = { ...profile, currentMoods: updatedMoods };
    setProfile(updatedProfile);
  };

  const handleInputChange = (field: string, value: any) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
  };

  const handleThemeChange = (themeId: string) => {
    const updatedProfile = { ...profile, theme: themeId };
    setProfile(updatedProfile);
    applyTheme(themeId);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2>Tell us about your reading preferences</h2>
        <p className="text-muted-foreground mt-2">
          Help us recommend the perfect books for you
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Let us know a bit about you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                placeholder="Your age"
              />
            </div>

            <div>
              <Label>Reading Experience</Label>
              <Select value={profile.readingLevel} onValueChange={(value) => handleInputChange("readingLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your reading experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Reader (1-5 books/year)</SelectItem>
                  <SelectItem value="regular">Regular Reader (6-20 books/year)</SelectItem>
                  <SelectItem value="avid">Avid Reader (20+ books/year)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Book Length</Label>
              <div className="mt-2 mb-4">
                <Slider
                  value={[profile.preferredLength]}
                  onValueChange={(value) => handleInputChange("preferredLength", value[0])}
                  max={500}
                  min={100}
                  step={50}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Short (100-200 pages)</span>
                  <span>Medium (200-350 pages)</span>
                  <span>Long (350+ pages)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Current preference: {profile.preferredLength} pages
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Authors & Inspiration</CardTitle>
            <CardDescription>Who are your favorite authors?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="authors">Favorite Authors</Label>
              <Textarea
                id="authors"
                value={profile.favoriteAuthors}
                onChange={(e) => handleInputChange("favoriteAuthors", e.target.value)}
                placeholder="List your favorite authors..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="recentBook">Recent Favorite Book</Label>
              <Input
                id="recentBook"
                value={profile.recentFavorite}
                onChange={(e) => handleInputChange("recentFavorite", e.target.value)}
                placeholder="What's a book you loved recently?"
              />
            </div>

            <div>
              <Label htmlFor="lookingFor">What are you looking for?</Label>
              <Textarea
                id="lookingFor"
                value={profile.lookingFor}
                onChange={(e) => handleInputChange("lookingFor", e.target.value)}
                placeholder="Describe what kind of book you're in the mood for..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Favorite Genres</CardTitle>
          <CardDescription>Select all genres you enjoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant={profile.favoriteGenres.includes(genre) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Reading Mood</CardTitle>
          <CardDescription>How are you feeling? What kind of reading experience do you want?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Badge
                key={mood}
                variant={profile.currentMoods.includes(mood) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => handleMoodToggle(mood)}
              >
                {mood}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <ThemeSelector
        selectedTheme={profile.theme || 'default'}
        onThemeChange={handleThemeChange}
        userProfile={profile}
      />

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Two-Factor Authentication</span>
                {mfaFactors.length > 0 && (
                  <Badge variant="default" className="text-xs">
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {mfaFactors.length > 0 
                  ? `You have ${mfaFactors.length} MFA factor${mfaFactors.length !== 1 ? 's' : ''} configured`
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
            <Button
              variant={mfaFactors.length > 0 ? "outline" : "default"}
              onClick={() => setShowMFASetup(true)}
            >
              {mfaFactors.length > 0 ? "Manage" : "Enable MFA"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button onClick={saveProfile} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>

      <MFASetup
        isOpen={showMFASetup}
        onClose={() => setShowMFASetup(false)}
        onMFAStatusChange={loadMFAFactors}
      />
    </div>
  );
}