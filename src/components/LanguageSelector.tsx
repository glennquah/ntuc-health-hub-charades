import { Language } from '@/types/game'
import CustomButton from './CustomButton'

interface LanguageSelectorProps {
  selectedLanguages: Language[]
  onToggleLanguage: (language: Language) => void
  onNext: () => void
}

const languages: Language[] = ['English', 'Chinese', 'Hokkien', 'Cantonese']

export function LanguageSelector({
  selectedLanguages,
  onToggleLanguage,
  onNext,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-8">
      <p
        className="text-2xl text-center mb-8 font-bold"
        style={{ color: '#40C0DF' }}
      >
        Select Language(s)
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {languages.map((lang) => (
          <div
            key={lang}
            className={`flex items-center justify-center rounded-full p-4 transition-colors cursor-pointer ${
              selectedLanguages.includes(lang)
                ? 'bg-[#40C0DF] text-white border-blue-500'
                : 'bg-white text-black border-gray-300'
            }`}
            onClick={() => onToggleLanguage(lang)}
          >
            <span className="px-12 text-lg font-medium leading-none">
              {lang}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <CustomButton
          words="Continue"
          onClick={onNext}
          disabled={selectedLanguages.length === 0}
        />
      </div>
    </div>
  )
}
