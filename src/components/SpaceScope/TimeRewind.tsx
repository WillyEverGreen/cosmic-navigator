import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Rewind, Play, Pause, Calendar, Star } from 'lucide-react';

const TimeRewind = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const events = [
    { day: -28, name: 'Lunar Eclipse', type: 'eclipse' },
    { day: -21, name: 'Meteor Shower Peak', type: 'meteor' },
    { day: -14, name: 'ISS Bright Pass', type: 'satellite' },
    { day: -7, name: 'Saturn Opposition', type: 'planet' },
    { day: 0, name: 'Tonight', type: 'current' },
  ];

  const togglePlayback = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentDay(-30);
      intervalRef.current = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const getMeteorPositions = () => {
    const meteors = [];
    const count = Math.max(0, Math.abs(currentDay + 21) < 5 ? 8 : 2);
    for (let i = 0; i < count; i++) {
      meteors.push({
        id: i,
        x: 20 + Math.random() * 60,
        y: 10 + Math.random() * 40,
        delay: Math.random() * 2,
      });
    }
    return meteors;
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-glow/10 border border-cosmic-glow/20 mb-4">
            <Rewind className="w-4 h-4 text-cosmic-glow" />
            <span className="text-sm text-cosmic-glow font-medium">Time Rewind</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            <span className="text-star-white">Rewind the </span>
            <span className="text-gradient">Cosmos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Missed last night's meteor shower? Travel back in time and see what you missed.
          </p>
        </motion.div>

        {/* Sky viewer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Sky canvas */}
          <div 
            className="relative aspect-video rounded-2xl overflow-hidden glass-card border-glow"
            style={{
              background: 'linear-gradient(180deg, hsl(230 60% 8%) 0%, hsl(230 50% 12%) 50%, hsl(230 40% 18%) 100%)',
            }}
          >
            {/* Stars */}
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-star-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 70}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Moon */}
            <motion.div
              className="absolute right-[15%] top-[20%] w-16 h-16 md:w-24 md:h-24"
              animate={{
                x: currentDay * 2,
              }}
            >
              <div 
                className="w-full h-full rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at ${40 + (currentDay + 30) / 30 * 20}% 40%, 
                      hsl(45 10% 90%) 0%, 
                      hsl(45 10% 80%) 50%, 
                      hsl(45 10% 60%) 100%
                    )
                  `,
                  boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
                }}
              />
              {/* Moon phase shadow */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(${90 + currentDay * 6}deg, transparent 50%, hsl(230 60% 8%) 50%)`,
                  opacity: 0.9,
                }}
              />
            </motion.div>

            {/* Meteors */}
            {getMeteorPositions().map((meteor) => (
              <motion.div
                key={meteor.id}
                className="absolute"
                style={{
                  left: `${meteor.x}%`,
                  top: `${meteor.y}%`,
                }}
                animate={{
                  x: [0, -100],
                  y: [0, 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: meteor.delay,
                  repeat: Infinity,
                  repeatDelay: 1 + Math.random() * 2,
                }}
              >
                <div 
                  className="w-20 h-0.5 -rotate-45 origin-right"
                  style={{
                    background: 'linear-gradient(to right, transparent, hsl(var(--star-white)))',
                  }}
                />
              </motion.div>
            ))}

            {/* Timestamp */}
            <div className="absolute top-4 left-4 glass-card px-4 py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cosmic-glow" />
                <span className="font-mono text-sm text-star-white">
                  {currentDay === 0 
                    ? 'Tonight' 
                    : `${Math.abs(currentDay)} days ago`
                  }
                </span>
              </div>
            </div>

            {/* Event indicator */}
            {events.find(e => e.day === currentDay) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 right-4 glass-card px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-cosmic-gold" />
                  <span className="text-sm text-star-white">
                    {events.find(e => e.day === currentDay)?.name}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Silhouette horizon */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/4"
              style={{
                background: 'linear-gradient(to top, hsl(230 60% 6%) 0%, transparent 100%)',
              }}
            />
            <svg className="absolute bottom-0 left-0 right-0 h-16 md:h-24" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path 
                d="M0 100 L0 60 Q100 40 200 50 T400 45 T600 55 T800 40 T1000 50 T1200 45 L1200 100 Z" 
                fill="hsl(230 60% 6%)"
              />
            </svg>
          </div>

          {/* Timeline scrubber */}
          <div className="mt-6 px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayback}
                className="w-12 h-12 rounded-full bg-cosmic-glow/20 border border-cosmic-glow/30 flex items-center justify-center text-cosmic-glow hover:bg-cosmic-glow/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex-1 relative">
                {/* Track */}
                <div className="h-2 rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-gradient-cosmic"
                    style={{ width: `${((currentDay + 30) / 30) * 100}%` }}
                  />
                </div>

                {/* Event markers */}
                {events.filter(e => e.day < 0).map((event) => (
                  <div
                    key={event.day}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cosmic-gold border-2 border-space-deep cursor-pointer"
                    style={{ left: `${((event.day + 30) / 30) * 100}%` }}
                    title={event.name}
                  />
                ))}

                {/* Scrubber handle */}
                <input
                  type="range"
                  min={-30}
                  max={0}
                  value={currentDay}
                  onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="text-sm font-mono text-muted-foreground min-w-[80px] text-right">
                {currentDay === 0 ? 'Now' : `${Math.abs(currentDay)}d ago`}
              </span>
            </div>

            {/* Event legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {events.filter(e => e.day < 0).map((event) => (
                <button
                  key={event.day}
                  onClick={() => setCurrentDay(event.day)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    currentDay === event.day 
                      ? 'bg-cosmic-glow/20 text-cosmic-glow border border-cosmic-glow/30' 
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {event.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TimeRewind;
