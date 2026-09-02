import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Process from "@/components/sections/Process";
import Painting from "@/components/sections/Painting";
import Testimonials from "@/components/sections/Testimonials";
import QuoteForm from "@/components/sections/QuoteForm";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import FloatingQuoteButton from "@/components/sections/FloatingQuoteButton";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Stats />
        <Services />
        <Portfolio />
        <Process />
        <Painting />
        <Testimonials />
        <section
          id="quote"
          className="scroll-mt-24 divider-stone px-5 py-20 sm:px-8 md:py-28"
        >
          <QuoteForm />
        </section>
        <Contact />
      </main>
      <Footer />
      <FloatingQuoteButton />
    </div>
  );
}
