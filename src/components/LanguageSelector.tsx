import { Checkbox } from "@/components/ui/checkbox";
import { Language } from "@/types/game";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  selectedLanguages: Language[];
  onToggleLanguage: (language: Language) => void;
  onNext: () => void;
}

const languages: Language[] = ["English", "Chinese", "Hokkien", "Cantonese"];

export function LanguageSelector({ selectedLanguages, onToggleLanguage, onNext }: LanguageSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-coffee-dark text-center">选择语言 / Select Language(s)</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {languages.map((lang) => (
          <div
            key={lang}
            className="flex items-center space-x-3 border-2 rounded-lg p-4 hover:bg-coffee/5 transition-colors"
          >
            <Checkbox
              id={lang}
              checked={selectedLanguages.includes(lang)}
              onCheckedChange={() => onToggleLanguage(lang)}
            />
            <label
              htmlFor={lang}
              className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {lang}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button
          onClick={onNext}
          disabled={selectedLanguages.length === 0}
          className="text-lg px-8"
        >
          Next
        </Button>
      </div>
    </div>
  );
}