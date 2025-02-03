import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy, Medal, Star } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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
        <Loader2 className="w-8 h-8 animate-spin text-coffee-dark" />
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-coffee-light" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-coffee-dark mb-4 flex items-center justify-center gap-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-coffee-medium text-lg">Top 10 Players</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {scores?.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-6 ${
                index !== scores.length - 1 ? 'border-b border-gray-100' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cream">
                  {getRankIcon(index)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-coffee-dark">{score.name}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(score.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold text-coffee-dark">
                {score.score}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}