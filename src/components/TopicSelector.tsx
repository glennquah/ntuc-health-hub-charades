import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Topic } from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface TopicSelectorProps {
  selectedTopics: Topic[];
  onToggleTopic: (topic: Topic) => void;
  onNext?: () => void;
}

export function TopicSelector({ selectedTopics, onToggleTopic, onNext }: TopicSelectorProps) {
  const { data: topics, isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase.from('topics').select('*');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-coffee-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-coffee-dark text-center">Select Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {topics?.map((topic: { id: number; name: string }) => (
          <div
            key={topic.id.toString()}
            className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:bg-cream/50 cursor-pointer"
            onClick={() => onToggleTopic(topic.name)}
          >
            <Checkbox
              id={topic.name}
              checked={selectedTopics.includes(topic.name)}
              onCheckedChange={() => onToggleTopic(topic.name)}
            />
            <label htmlFor={topic.name} className="text-lg cursor-pointer flex-1">
              {topic.name}
            </label>
          </div>
        ))}
      </div>
      {onNext && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onNext}
            disabled={selectedTopics.length === 0}
            className="text-lg px-8"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}