import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Plus, Loader2, Trash2 } from "lucide-react";

export default function Admin() {
  const [newTopic, setNewTopic] = useState("");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<number[]>([]);

  const queryClient = useQueryClient();
  const languages = ["English", "Chinese", "Hokkien", "Cantonese"];

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
    }
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
    }
  });

  const deleteWordMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Word deleted successfully",
      });
    }
  });

  const addWordMutation = useMutation({
    mutationFn: async ({ topicId, translations }: { topicId: number, translations: Record<string, string> }) => {
      // Validate at least one translation
      if (Object.keys(translations).length === 0) {
        throw new Error("At least one translation is required");
      }
      
      const { data, error } = await supabase
        .from('words')
        .insert([{ topic_id: topicId, translations }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setTranslations({});
      toast({
        title: "Success",
        description: "Word added successfully",
      });
    }
  });

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    addTopicMutation.mutate(newTopic);
  };

  const handleAddWord = (topicId: number) => {
    if (Object.keys(translations).length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one translation",
        variant: "destructive",
      });
      return;
    }
    addWordMutation.mutate({ topicId, translations });
  };

  const toggleTopic = (topicId: number) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
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

      {/* Topics and Words List */}
      <div className="space-y-6">
        {topics?.map((topic) => (
          <div key={topic.id} className="bg-cream p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{topic.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => toggleTopic(topic.id)}
                >
                  {expandedTopics.includes(topic.id) ? "Hide" : "Show"} Words
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteTopicMutation.mutate(topic.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {expandedTopics.includes(topic.id) && (
              <div className="space-y-4">
                {/* Add Word Form */}
                <div className="bg-white p-4 rounded shadow">
                  <h4 className="font-semibold mb-2">Add New Word</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {languages.map((lang) => (
                      <Input
                        key={lang}
                        value={translations[lang] || ""}
                        onChange={(e) => setTranslations(prev => ({
                          ...prev,
                          [lang]: e.target.value
                        }))}
                        placeholder={`${lang} translation (optional)`}
                      />
                    ))}
                  </div>
                  <Button
                    onClick={() => handleAddWord(topic.id)}
                    disabled={addWordMutation.isPending}
                  >
                    {addWordMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Word
                  </Button>
                </div>

                {/* Words List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topic.words?.map((word) => (
                    <div key={word.id} className="bg-white p-4 rounded shadow group relative">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteWordMutation.mutate(word.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {Object.entries(word.translations).map(([lang, translation]) => (
                        <div key={lang} className="text-sm mt-4">
                          <span className="font-semibold">{lang}:</span> {translation}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}