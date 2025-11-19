import { Target, Wrench, Rocket, BookOpen, Trophy, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Rocket Design",
    description: "Learn aerospace engineering principles",
  },
  {
    icon: Wrench,
    title: "Hands-On Building",
    description: "Construct real, flight-ready rockets",
  },
  {
    icon: Rocket,
    title: "Launch Events",
    description: "Experience the thrill of liftoff",
  },
  {
    icon: BookOpen,
    title: "STEM Skills",
    description: "Mathematics, physics, and engineering",
  },
  {
    icon: Trophy,
    title: "Competitions",
    description: "Compete at regional and national levels",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work with passionate students",
  },
];

export default function Welcome() {
  return (
    <section id="welcome" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-space-darkest mb-6">
              Welcome to TRC
            </h2>
          </div>

          {/* Main content */}
          <div className="prose prose-lg max-w-4xl mx-auto mb-16 text-center animate-slide-up">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Join us at Tahoma Rocketry Club, where innovation takes flight! Our student-led team is
              dedicated to rocket design, building, and launches, all while honing valuable STEM skills.
              Established recently, our club is rapidly expanding, gearing up for an upcoming launch event.
              Come aboard every Tuesday during Power Hour A and experience the thrill of liftoff!
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 md:p-8 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-space-blue hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-space-darkest mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Call-out box */}
          <div className="glass-medium rounded-2xl p-8 md:p-12 text-center bg-gradient-primary animate-scale-in">
            <div className="max-w-2xl mx-auto">
              <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                📅 Weekly Meetings
              </div>
              <p className="text-xl md:text-2xl text-white/90 mb-2">
                Every Tuesday during Power Hour A
              </p>
              <p className="text-lg text-white/80">
                📍 Tahoma High School
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
