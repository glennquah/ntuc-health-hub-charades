import { Button } from "@/components/ui/button";
import { Language } from "@/types/game";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  selectedLanguage: Language | null;
  onSelect: (language: Language) => void;
}

const languages: Language[] = ["English", "Chinese", "Hokkien", "Cantonese"];

export function LanguageSelector({ selectedLanguage, onSelect }: LanguageSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-coffee-dark text-center">选择语言 / Select Language</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {languages.map((lang) => (
          <Button
            key={lang}
            onClick={() => onSelect(lang)}
            variant="outline"
            className={cn(
              "h-16 text-lg border-2",
              selectedLanguage === lang && "border-coffee bg-coffee/10"
            )}
          >
            {lang}
          </Button>
        ))}
      </div>
    </div>
  );
}