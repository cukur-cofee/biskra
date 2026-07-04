import AnnouncementBar from "@/components/sections/AnnouncementBar";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Menu from "@/components/sections/Menu";
import SummerOffers from "@/components/sections/SummerOffers";
import BuildYourRecipe from "@/components/sections/BuildYourRecipe";
import Story from "@/components/sections/Story";
import Stats from "@/components/sections/Stats";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden font-sans">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Menu />
        <SummerOffers />
        <BuildYourRecipe />
        <Story />
        <Stats />
      </main>
      <Footer />
    </div>
  );
}
