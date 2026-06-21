import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Copy, Heart, Share2, Loader } from "lucide-react";

const JokeGenerator = () => {
  const [joke, setJoke] = useState<{ setup?: string; delivery?: string; joke?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jokeType, setJokeType] = useState<"any" | "general" | "knock-knock" | "programming">("any");
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "https://official-joke-api.appspot.com/random_joke";

      if (jokeType === "general") {
        url = "https://official-joke-api.appspot.com/jokes/general/random";
      } else if (jokeType === "knock-knock") {
        url = "https://official-joke-api.appspot.com/jokes/knock-knock/random";
      } else if (jokeType === "programming") {
        url = "https://official-joke-api.appspot.com/jokes/programming/random";
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch joke");
      }

      const data = await response.json();
      setJoke(data);
      setLoading(false);
    } catch (err) {
      setError("Could not fetch a joke. Please try again!");
      setLoading(false);
    }
  };

  const getJokeText = () => {
    if (!joke) return "";
    if (joke.setup && joke.delivery) {
      return `${joke.setup}\n\n${joke.delivery}`;
    }
    return joke.joke || "";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getJokeText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addToFavorites = () => {
    const jokeText = getJokeText();
    if (!favorites.includes(jokeText)) {
      setFavorites([...favorites, jokeText]);
    }
  };

  const shareJoke = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this joke!",
        text: getJokeText(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            😂 Joke Generator
          </h1>
          <p className="text-white/90 text-lg drop-shadow-md">
            Get random jokes to brighten your day!
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        >
          {/* Joke Type Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Select Joke Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["any", "general", "knock-knock", "programming"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setJokeType(type)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                    jokeType === type
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type === "any" ? "Any" : type === "knock-knock" ? "Knock-Knock" : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Joke Display */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
              >
                <div className="flex flex-col items-center space-y-4">
                  <Loader className="h-8 w-8 text-purple-500 animate-spin" />
                  <p className="text-gray-600 font-medium">Loading a funny joke...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-center"
              >
                {error}
              </motion.div>
            ) : joke ? (
              <motion.div
                key="joke"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 space-y-4"
              >
                {joke.setup && joke.delivery ? (
                  <>
                    <div className="text-lg font-semibold text-gray-800">
                      {joke.setup}
                    </div>
                    <div className="text-2xl font-bold text-purple-600 pl-4 border-l-4 border-purple-500">
                      {joke.delivery}
                    </div>
                  </>
                ) : (
                  <div className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {joke.joke}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                <p className="text-lg">Click the button below to get started! 👇</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={fetchJoke}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Loading..." : "Get New Joke"}</span>
            </button>

            {joke && (
              <button
                onClick={copyToClipboard}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <Copy className="h-5 w-5" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            )}
          </div>

          {/* Secondary Actions */}
          {joke && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={addToFavorites}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Add to Favorites</span>
              </button>

              <button
                onClick={shareJoke}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          )}

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-800">
                ❤️ Your Favorites ({favorites.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {favorites.map((fav, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-50 border-l-4 border-red-500 p-3 rounded text-sm text-gray-700"
                  >
                    {fav.substring(0, 100)}...
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/90 text-sm">
          <p>Powered by <a href="https://official-joke-api.appspot.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Official Joke API</a></p>
        </div>
      </div>
    </div>
  );
};

export default JokeGenerator;
