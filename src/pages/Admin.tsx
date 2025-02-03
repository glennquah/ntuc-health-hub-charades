import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Plus, Loader2 } from "lucide-react";

export default function Admin() {
  const [newTopic, setNewTopic] = useState("");
  const [newWord, setNewWord] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [translations, setTranslations] = useState({
    English: "",
    Chinese: "",
    Hokkien: "",
    Cantonese: ""
  });

  const queryClient = useQueryClient();

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*, words(*)');
      if (error) throw error;
      return data;
    }
  });

  const addTopicMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('topics')
        .insert([{ name }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setNewTopic("");
      toast({
        title: "Success",
        description: "Topic added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add topic: " + error.message,
        variant: "destructive",
      });
    }
  });

  const addWordMutation = useMutation({
    mutationFn: async ({ topicId, translations }: { topicId: number, translations: Record<string, string> }) => {
      const { data, error } = await supabase
        .from('words')
        .insert([{ topic_id: topicId, translations }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setNewWord("");
      setTranslations({
        English: "",
        Chinese: "",
        Hokkien: "",
        Cantonese: ""
      });
      toast({
        title: "Success",
        description: "Word added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add word: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    addTopicMutation.mutate(newTopic);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !translations.English.trim()) return;
    addWordMutation.mutate({
      topicId: selectedTopic,
      translations
    });
  };

  if (topicsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>

      {/* Add Topic Form */}
      <div className="bg-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Topic</h2>
        <form onSubmit={handleAddTopic} className="flex gap-4">
          <Input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Enter topic name"
            className="flex-1"
          />
          <Button type="submit" disabled={addTopicMutation.isPending}>
            {addTopicMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Topic
          </Button>
        </form>
      </div>

      {/* Add Word Form */}
      <div className="bg-cream p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Word</h2>
        <form onSubmit={handleAddWord} className="space-y-4">
          <select
            className="w-full p-2 border rounded"
            value={selectedTopic || ""}
            onChange={(e) => setSelectedTopic(Number(e.target.value))}
          >
            <option value="">Select a topic</option>
            {topics?.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>

          {Object.keys(translations).map((lang) => (
            <Input
              key={lang}
              value={translations[lang]}
              onChange={(e) => setTranslations(prev => ({
                ...prev,
                [lang]: e.target.value
              }))}
              placeholder={`${lang} translation`}
            />
          ))}

          <Button
            type="submit"
            disabled={addWordMutation.isPending || !selectedTopic}
            className="w-full"
          >
            {addWordMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Word
          </Button>
        </form>
      </div>

      {/* Topics and Words List */}
      <div className="space-y-6">
        {topics?.map((topic) => (
          <div key={topic.id} className="bg-cream p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{topic.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topic.words?.map((word) => (
                <div key={word.id} className="bg-white p-4 rounded shadow">
                  {Object.entries(word.translations).map(([lang, translation]) => (
                    <div key={lang} className="text-sm">
                      <span className="font-semibold">{lang}:</span> {translation}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}