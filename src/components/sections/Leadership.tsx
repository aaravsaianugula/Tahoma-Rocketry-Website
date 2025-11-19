import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Mail } from "lucide-react";

const officers = [
  {
    name: "Samrinder Dhaliwal",
    position: "President",
    photo: "/assets/leadership/samrinder-dhaliwal.jpg",
    email: "president@tahomarocketry.club",
  },
  {
    name: "Aarav Sai Anugula",
    position: "Vice President",
    photo: "/assets/leadership/aarav-sai-anugula.jpg",
    email: "vp@tahomarocketry.club",
  },
  {
    name: "Sos Peter",
    position: "Co-Treasurer",
    photo: "/assets/leadership/sos-peter.jpg",
    email: "treasurer@tahomarocketry.club",
  },
  {
    name: "Zaylie Russmen",
    position: "Co-Treasurer",
    photo: "/assets/leadership/zaylie-russmen.png",
    email: "treasurer@tahomarocketry.club",
  },
];

export default function Leadership() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-space-darkest mb-6">
              Our Leadership
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We&apos;re a group of students passionate about rockets, teamwork, and learning through
              hands-on projects. Together, we build, launch, and explore new ideas — making Tahoma
              Rocketry Club a place where curiosity really takes off.
            </p>
          </div>

          {/* Leadership grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {officers.map((officer, index) => (
              <Card
                key={officer.name}
                className="group overflow-hidden border-2 border-gray-200 hover:border-space-blue hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Photo */}
                  <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={officer.photo}
                      alt={officer.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-darkest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-space-darkest mb-1 group-hover:text-space-blue transition-colors">
                      {officer.name}
                    </h3>
                    <p className="text-gray-600 font-medium mb-4">
                      {officer.position}
                    </p>

                    {/* Contact buttons */}
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${officer.email}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-space-blue/10 hover:bg-space-blue hover:text-white text-space-blue transition-all duration-200 group/btn"
                        aria-label={`Email ${officer.name}`}
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">Email</span>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
