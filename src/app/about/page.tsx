import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket, Target, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
            About Tahoma Rocketry Club
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Inspiring the next generation of aerospace engineers
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-space-darkest mb-6">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Our mission is to inspire and educate students in aerospace engineering through
              hands-on rocket design, construction, and launch experiences. We provide a supportive
              environment where students can explore STEM concepts while building real rockets and
              competing in regional and national competitions.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  Pushing boundaries in rocket design and exploring new aerospace technologies.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Teamwork</h3>
                <p className="text-gray-600">
                  Collaborating to achieve common goals and supporting each other&apos;s growth.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Hands-On Learning</h3>
                <p className="text-gray-600">
                  Learning through practical experience in design, building, and launching.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  Striving for the highest standards in safety, design, and performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-space-darkest mb-12 text-center">
            What We Do
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3">Design & Build Rockets</h3>
              <p className="text-gray-700 leading-relaxed">
                Members learn aerospace engineering principles by designing and constructing model
                rockets from scratch. We work with various materials and propulsion systems to create
                flight-ready rockets.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">Launch Events</h3>
              <p className="text-gray-700 leading-relaxed">
                We conduct regular launch events at certified NAR fields where members can test their
                designs and experience the thrill of seeing their rockets soar to new heights.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">Competitions</h3>
              <p className="text-gray-700 leading-relaxed">
                Our team competes in regional and national rocketry competitions, putting our skills
                to the test against other clubs and schools.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">Workshops & Education</h3>
              <p className="text-gray-700 leading-relaxed">
                We host workshops on topics ranging from aerodynamics to electronics, providing
                members with comprehensive STEM education beyond just rocket building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Info */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-space-blue">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Join Us!</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-lg font-semibold text-space-blue">When</p>
                    <p className="text-gray-700">Every Tuesday during Power Hour A</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-space-blue">Where</p>
                    <p className="text-gray-700">
                      Tahoma High School<br />
                      18200 SE 240th St, Maple Valley, WA 98038
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-space-blue">Who Can Join</p>
                    <p className="text-gray-700">
                      All Tahoma High School students (grades 9-12) interested in STEM
                    </p>
                  </div>
                </div>
                <Link href="/register">
                  <Button variant="gradient" size="xl">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
