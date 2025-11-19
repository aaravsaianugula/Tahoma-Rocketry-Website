import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Pizza } from "lucide-react";

export default function Fundraising() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-space-darkest mb-6">
              Fundraising
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Join us in supporting Tahoma Rocketry Club by participating in our upcoming fundraiser
              event with MOD Pizza in Maple Valley on Nov 21, 2025. Your contribution will help us
              continue to inspire and educate future rocketry enthusiasts. The event will run all day.
              Click below for more details and to show your support!
            </p>
          </div>

          {/* Event card */}
          <Card className="overflow-hidden border-2 border-space-blue/20 hover:border-space-blue hover:shadow-2xl transition-all duration-300 animate-scale-in">
            <CardHeader className="bg-gradient-primary text-white pb-8">
              <div className="flex items-center gap-3 mb-2">
                <Pizza className="w-8 h-8" />
                <CardTitle className="text-3xl md:text-4xl font-heading">
                  MOD Pizza Fundraiser
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rocket-orange/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-rocket-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-space-darkest mb-1">Date</h3>
                    <p className="text-gray-600">November 21, 2025</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-space-blue/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-space-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-space-darkest mb-1">Time</h3>
                    <p className="text-gray-600">All Day Event</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="w-12 h-12 rounded-full bg-rocket-teal/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-rocket-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-space-darkest mb-1">Location</h3>
                    <p className="text-gray-600">MOD Pizza, Maple Valley</p>
                  </div>
                </div>
              </div>

              {/* Impact stats */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-heading font-bold text-xl text-space-darkest mb-4">
                  Your Support Helps:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-space-blue"></span>
                    <span className="text-gray-700">Funds raised help purchase rocket motors</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-rocket-orange"></span>
                    <span className="text-gray-700">Support competition travel costs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-rocket-teal"></span>
                    <span className="text-gray-700">Provide materials for club projects</span>
                  </li>
                </ul>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="gradient" size="lg" className="flex-1">
                  Learn More
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  Add to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
