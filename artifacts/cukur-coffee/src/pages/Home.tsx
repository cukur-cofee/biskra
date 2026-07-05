import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/sections/AnnouncementBar";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Menu from "@/components/sections/Menu";
import SummerOffers from "@/components/sections/SummerOffers";
import BuildYourRecipe from "@/components/sections/BuildYourRecipe";
import NosBoxes from "@/components/sections/NosBoxes";
import Story from "@/components/sections/Story";
import Stats from "@/components/sections/Stats";
import Footer from "@/components/sections/Footer";
import VideoLoader from "@/components/VideoLoader";

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!loaderDone && (
          <VideoLoader onFinished={() => setLoaderDone(true)} />
        )}
      </AnimatePresence>

      <div className="bg-background min-h-screen text-foreground overflow-x-hidden font-sans">
        <AnnouncementBar />
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Menu />
          <SummerOffers />
          <BuildYourRecipe />
          <NosBoxes />
          <Story />
          <Stats />
        </main>
        <Footer />
      </div>
    </>
  );
}
