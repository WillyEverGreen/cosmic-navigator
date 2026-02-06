import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Eye, Clock, Compass, Bell, Info } from "lucide-react";

interface Region {
  id: string;
  name: string;
  visibility: number;
  localTime: string;
  direction: string;
  status: "visible" | "partial" | "hidden";
}

const regions: Region[] = [
  {
    id: "na",
    name: "North America",
    visibility: 95,
    localTime: "11:30 PM - 3:00 AM",
    direction: "Northeast",
    status: "visible",
  },
  {
    id: "eu",
    name: "Europe",
    visibility: 78,
    localTime: "4:30 AM - 6:00 AM",
    direction: "Northwest",
    status: "partial",
  },
  {
    id: "asia",
    name: "Asia",
    visibility: 45,
    localTime: "8:30 PM - 10:00 PM",
    direction: "North",
    status: "partial",
  },
  {
    id: "sa",
    name: "South America",
    visibility: 88,
    localTime: "10:00 PM - 2:00 AM",
    direction: "East",
    status: "visible",
  },
];

const InteractiveGlobe = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const globeRotate = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const getStatusColor = (status: Region["status"]) => {
    switch (status) {
      case "visible":
        return "bg-green-500";
      case "partial":
        return "bg-amber-500";
      case "hidden":
        return "bg-gray-500";
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-20 md:py-32 overflow-hidden"
    >
      {/* Background (Removed gradient) */}
      <div className="absolute inset-0" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-glow/10 border border-cosmic-glow/20 mb-4">
            <MapPin className="w-4 h-4 text-cosmic-glow" />
            <span className="text-sm text-cosmic-glow font-medium">
              Personalized Tracking
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            <span className="text-star-white">Your Sky, </span>
            <span className="text-gradient">Your Events</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every location sees space differently. SpaceScope adapts to your
            position on Earth.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Globe */}
          <motion.div
            style={{ rotateY: globeRotate }}
            className="relative aspect-square max-w-[500px] mx-auto"
          >
            {/* Globe background (Removed gradient) */}
            <div
              className="absolute inset-0 rounded-full bg-space-deep"
              style={{
                boxShadow: `
                  inset -20px -20px 60px rgba(0, 0, 0, 0.5),
                  0 0 60px rgba(99, 102, 241, 0.2)
                `,
              }}
            />

            {/* Grid lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
            >
              {/* Latitude lines */}
              {[0.2, 0.35, 0.5, 0.65, 0.8].map((ratio, i) => {
                const rxVal = Math.abs(
                  180 *
                    Math.sin(
                      Math.acos(Math.max(-1, Math.min(1, (ratio - 0.5) * 2))),
                    ),
                );
                const ryVal = rxVal * 0.3;
                return (
                  <ellipse
                    key={`lat-${i}`}
                    cx="200"
                    cy={200}
                    rx={rxVal}
                    ry={ryVal}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.15)"
                    strokeWidth="1"
                    transform={`translate(0, ${(ratio - 0.5) * 300})`}
                  />
                );
              })}
              {/* Longitude lines */}
              {[0, 30, 60, 90, 120, 150].map((angle, i) => (
                <ellipse
                  key={`lng-${i}`}
                  cx="200"
                  cy="200"
                  rx="30"
                  ry="180"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.15)"
                  strokeWidth="1"
                  transform={`rotate(${angle}, 200, 200)`}
                />
              ))}
            </svg>

            {/* Region markers */}
            {regions.map((region, index) => {
              const positions = [
                { x: 25, y: 35 }, // NA
                { x: 55, y: 30 }, // EU
                { x: 75, y: 40 }, // Asia
                { x: 35, y: 65 }, // SA
              ];
              const pos = positions[index];

              return (
                <motion.button
                  key={region.id}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute z-10"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onMouseEnter={() => setIsHovering(region.id)}
                  onMouseLeave={() => setIsHovering(null)}
                  onClick={() => setSelectedRegion(region)}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: isHovering === region.id ? 1.5 : 1,
                        boxShadow:
                          isHovering === region.id
                            ? "0 0 30px rgba(99, 102, 241, 0.8)"
                            : "0 0 15px rgba(99, 102, 241, 0.4)",
                      }}
                      className={`w-4 h-4 rounded-full ${getStatusColor(region.status)} cursor-pointer`}
                    />
                    {/* Pulse effect */}
                    <div
                      className={`absolute inset-0 rounded-full ${getStatusColor(region.status)} animate-ping opacity-30`}
                    />
                  </div>
                </motion.button>
              );
            })}

            {/* Globe glow */}
            <div className="absolute inset-[-20%] rounded-full bg-cosmic-glow/10 blur-3xl -z-10" />
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: selectedRegion ? 1 : 0.5,
              x: selectedRegion ? 0 : 20,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="glass-card p-6 md:p-8 border-glow">
              {selectedRegion ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-heading font-bold text-star-white">
                      {selectedRegion.name}
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedRegion.status === "visible"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {selectedRegion.visibility}% Visible
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                      <Clock className="w-5 h-5 text-cosmic-glow flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Best viewing time
                        </p>
                        <p className="text-star-white font-medium">
                          {selectedRegion.localTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                      <Compass className="w-5 h-5 text-cosmic-glow flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Look towards
                        </p>
                        <p className="text-star-white font-medium">
                          {selectedRegion.direction}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                      <Eye className="w-5 h-5 text-cosmic-glow flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Event visibility
                        </p>
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full bg-gradient-cosmic"
                            style={{ width: `${selectedRegion.visibility}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="btn-cosmic flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      AR View
                    </button>
                    <button className="btn-ghost-cosmic flex-1">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </button>
                  </div>

                  <button className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-cosmic-glow transition-colors">
                    <Info className="w-4 h-4" />
                    Why does visibility vary?
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Click on a region to see event visibility
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveGlobe;
