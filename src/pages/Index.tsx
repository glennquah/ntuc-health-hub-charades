import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, HeartPulse } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const Index = () => {
  const [noCount, setNoCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  
  const noButtonText = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you absolutely sure?",
    "This could be a mistake!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;(",
  ];

  const getNoButtonText = () => {
    return noCount >= noButtonText.length
      ? noButtonText[noButtonText.length - 1]
      : noButtonText[noCount];
  };

  const handleNoClick = () => {
    setNoCount(noCount + 1);
    // Make the "Yes" button bigger with each "No"
    const yesButton = document.querySelector(".yes-button");
    if (yesButton) {
      const scale = 1 + noCount * 0.1;
      yesButton.style.transform = `scale(${scale})`;
    }
  };

  const handleYesClick = () => {
    setShowDialog(true);
    toast({
      title: "Yay! 🎉",
      description: "I knew you'd say yes! Get ready for the best Valentine's Day ever!",
    });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-coffee-dark">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-accent">
          Will you be my Valentine?
        </h1>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <Heart className="w-24 h-24 md:w-32 md:h-32 mx-auto text-red-500" fill="currentColor" />
        </motion.div>

        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="inline-block"
          >
            <Button
              onClick={handleYesClick}
              className="yes-button bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full text-xl transition-all duration-300"
              size="lg"
            >
              Yes <HeartPulse className="ml-2" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="inline-block"
          >
            <Button
              onClick={handleNoClick}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-4 rounded-full text-xl ml-4"
              style={{
                fontSize: `${Math.max(1, 1 - noCount * 0.1)}rem`,
              }}
              size="lg"
            >
              {getNoButtonText()}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-pink-50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-red-500">
              🎉 Woohoo! Best Decision Ever! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-lg">
              I promise to make this Valentine's Day absolutely amazing! 
            </p>
            <p className="text-sm text-gray-600">
              (No refunds or exchanges available 😉)
            </p>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-16 h-16 mx-auto text-red-500" fill="currentColor" />
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;