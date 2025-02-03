import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy } from "lucide-react";
import { format } from "date-fns";

export default function Leaderboard() {
  const { data: scores, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-coffee-dark mb-8">
        <Trophy className="inline-block mr-2 text-accent" />
        Leaderboard
      </h1>

      <div className="max-w-2xl mx-auto bg-cream rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {scores?.map((score, index) => (
            <div
              key={score.id}
              className="flex items-center justify-between p-4 border-b last:border-0 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-coffee-dark">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-lg">{score.name}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(score.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold text-accent">
                {score.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}