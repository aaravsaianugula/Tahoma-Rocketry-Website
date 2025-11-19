import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Fundraising from "@/components/sections/Fundraising";
import Leadership from "@/components/sections/Leadership";
import JoinCTA from "@/components/sections/JoinCTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Welcome />
      <Fundraising />
      <Leadership />
      <JoinCTA />
    </main>
  );
}
