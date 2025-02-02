import { Button } from "@/components/ui/button";
import { Topic } from "@/types/game";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface TopicSelectorProps {
  selectedTopics: Topic[];
  onToggleTopic: (topic: Topic) => void;
}

const topics: Topic[] = [
  "Singapore Festive",
  "Singapore Slang",
  "Local Food and Drinks",
  "Singapore Landmarks",
  "Famous Local People",
  "Everyday Local Life",
  "Old-School Games",
  "Singlish Phrases",
  "MRT Stations",
  "Singapore Icons"
];

export function TopicSelector({ selectedTopics, onToggleTopic }: TopicSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-coffee-dark text-center">Select Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {topics.map((topic) => (
          <div
            key={topic}
            className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:bg-cream/50 cursor-pointer"
            onClick={() => onToggleTopic(topic)}
          >
            <Checkbox
              checked={selectedTopics.includes(topic)}
              onCheckedChange={() => onToggleTopic(topic)}
            />
            <span className="text-lg">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}