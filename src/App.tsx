import { useState } from "react";
import MatrixBackground from "./components/common/MatrixBackground";
import FloatingAddresses from "./components/common/FloatingAddresses";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import IntroSection from "./components/sections/IntroSection";
import AddressSpaceSection from "./components/sections/AddressSpaceSection";
import MMUSection from "./components/sections/MMUSection";
import PageFaultsSection from "./components/sections/PageFaultsSection";
import SwappingSection from "./components/sections/SwappingSection";
import SecuritySection from "./components/sections/SecuritySection";
import MemoryModel3DSection from "./components/sections/MemoryModel3DSection";
import TerminalSection from "./components/terminal/TerminalSection";
import ReferencesSection from "./components/sections/ReferencesSection";
import Footer from "./components/layout/Footer";
import LabBubble from "./components/lab/LabBubble";
import LabWorkspace from "./components/lab/LabWorkspace";

export default function App() {
  const [labOpen, setLabOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950">
      <MatrixBackground />
      <FloatingAddresses />

      <Navbar onOpenLab={() => setLabOpen(true)} />

      <main className="relative">
        <Hero onOpenLab={() => setLabOpen(true)} />
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <IntroSection />
          <AddressSpaceSection />
          <MMUSection />
          <PageFaultsSection />
          <SwappingSection />
          <SecuritySection />
          <MemoryModel3DSection />
          <TerminalSection />
          <ReferencesSection />
        </div>
      </main>

      <Footer />

      <LabBubble onOpen={() => setLabOpen(true)} />
      {labOpen && <LabWorkspace onClose={() => setLabOpen(false)} />}
    </div>
  );
}
