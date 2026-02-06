import { motion } from 'framer-motion';

const Earth = () => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]">
      {/* Outer glow */}
      <div className="absolute inset-[-20%] rounded-full bg-gradient-to-r from-cosmic-glow/20 via-cosmic-purple/10 to-transparent blur-3xl animate-pulse-glow" />
      
      {/* Atmosphere glow */}
      <motion.div
        className="absolute inset-[-8%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Earth sphere */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, 
              hsl(217, 91%, 60%) 0%, 
              hsl(221, 83%, 53%) 20%,
              hsl(224, 76%, 48%) 40%, 
              hsl(230, 60%, 30%) 70%,
              hsl(230, 60%, 15%) 100%
            )
          `,
          boxShadow: `
            inset -30px -30px 60px rgba(0, 0, 0, 0.5),
            inset 20px 20px 40px rgba(99, 102, 241, 0.3)
          `,
        }}
      >
        {/* Land masses - stylized patterns */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 40% 30% at 25% 40%, rgba(34, 197, 94, 0.4) 0%, transparent 100%),
              radial-gradient(ellipse 30% 25% at 60% 35%, rgba(34, 197, 94, 0.35) 0%, transparent 100%),
              radial-gradient(ellipse 25% 40% at 75% 60%, rgba(34, 197, 94, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 35% 20% at 40% 70%, rgba(34, 197, 94, 0.35) 0%, transparent 100%)
            `,
          }}
        />

        {/* Cloud layer */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: `
              radial-gradient(ellipse 20% 15% at 20% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 100%),
              radial-gradient(ellipse 15% 20% at 70% 40%, rgba(255, 255, 255, 0.3) 0%, transparent 100%),
              radial-gradient(ellipse 25% 10% at 45% 65%, rgba(255, 255, 255, 0.35) 0%, transparent 100%),
              radial-gradient(ellipse 10% 15% at 85% 70%, rgba(255, 255, 255, 0.25) 0%, transparent 100%)
            `,
          }}
        />

        {/* Highlight */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
          }}
        />
      </motion.div>

      {/* Aurora effect at poles */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[15%]"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scaleX: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 100%)',
          borderRadius: '50% 50% 0 0',
          filter: 'blur(8px)',
        }}
      />

      {/* Orbiting satellite */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-3 h-3"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformOrigin: '-150px 0',
        }}
      >
        <div className="w-3 h-3 bg-star-white rounded-full shadow-lg relative">
          <div className="absolute inset-0 bg-cosmic-glow rounded-full animate-ping opacity-50" />
        </div>
      </motion.div>

      {/* Second orbiting object */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-2 h-2"
        animate={{ rotate: -360 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformOrigin: '120px 50px',
        }}
      >
        <div className="w-2 h-2 bg-cosmic-pink rounded-full opacity-80" />
      </motion.div>
    </div>
  );
};

export default Earth;
