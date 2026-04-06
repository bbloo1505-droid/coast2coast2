import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wrench, Clock, MapPin, CheckCircle2, Phone, Mail, Menu, X, ArrowRight, ShieldCheck, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  FadeIn,
  Stagger,
  staggerItem,
  easeOutExpo,
} from "@/components/ScrollReveal";
import logoUrl from "@assets/image_1775463095020.png";
import heroBg from "@/assets/images/hero-bg.png";
import mechanicPortrait from "@/assets/images/mechanic-portrait.png";
import engineWork from "@/assets/images/engine-work.png";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(8, { message: "Please enter a valid phone number." }),
  serviceType: z.string({ required_error: "Please select a service type." }),
  message: z.string().optional(),
});

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.18 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOutExpo },
  },
};

const REVIEWS = [
  { text: "Mitch was able to calmly and patiently explain to me what to do and what to look for. Response time was ASAP. Treated my car emergency with urgency and professionalism. Very grateful!", author: "Cat Johnson" },
  { text: "Mitch is a fantastic mechanic. Called him this morning (Saturday) to see if he could pressure test my radiator. Was here within an hour. Sourced a new radiator, we picked it up while he went to his next job, then he came back and fitted it. Above and beyond.", author: "Sarah Fleming" },
  { text: "Mitch was an absolute champion, fixed up my undrivable Colorado within an hour. Really honest and genuine and the price was great.", author: "Wyatt" },
  { text: "Came out at 8pm on a Friday night and knew exactly what he was doing. Sorted us out in a tight pinch so we could get home, very affordable. Extremely happy.", author: "Amy" },
  { text: "Went above and beyond: came out at 4am and also went to Brisbane to pick up a part for me. Great mechanic, would definitely recommend.", author: "Anita" },
  { text: "Fantastic service, cannot recommend Mitch enough: reliable, great value. Just an honest mechanic. Not many left!", author: "Tom" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "22%"],
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      serviceType: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Quote request sent successfully",
      description: "Mitch will get back to you shortly.",
    });
    form.reset();
  }

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <motion.header
        initial={prefersReducedMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b border-border py-3 shadow-lg" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollTo("hero")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={logoUrl} alt="Coast 2 Coast Mobile Mechanics Logo" className="h-10 md:h-12 object-contain" />
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("services")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</button>
            <button onClick={() => scrollTo("about")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollTo("reviews")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Reviews</button>
            <button onClick={() => scrollTo("contact")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Call Mitch Directly</span>
              <a href="tel:0435835688" className="text-lg font-display tracking-wider font-bold text-foreground hover:text-primary transition-colors">0435 835 688</a>
            </div>
            <Button onClick={() => scrollTo("contact")} className="font-display text-lg tracking-wider px-8 h-12 uppercase rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
              Get A Quote
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: easeOutExpo }}
              className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl overflow-hidden"
            >
              <div className="py-4 px-6 flex flex-col gap-4">
                <button onClick={() => scrollTo("services")} className="text-left text-lg font-medium text-foreground py-2 border-b border-border/50">Services</button>
                <button onClick={() => scrollTo("about")} className="text-left text-lg font-medium text-foreground py-2 border-b border-border/50">About</button>
                <button onClick={() => scrollTo("reviews")} className="text-left text-lg font-medium text-foreground py-2 border-b border-border/50">Reviews</button>
                <button onClick={() => scrollTo("contact")} className="text-left text-lg font-medium text-foreground py-2 border-b border-border/50">Contact</button>
                <div className="pt-4 flex flex-col gap-3">
                  <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Call Mitch Directly</span>
                  <a href="tel:0435835688" className="text-2xl font-display tracking-wider font-bold text-primary">0435 835 688</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          ref={heroRef}
          id="hero"
          className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 z-10" />
            <motion.div style={{ y: heroBgY }} className="absolute inset-0 will-change-transform">
              <img
                src={heroBg}
                alt="Mobile Mechanic Workshop"
                className="w-full h-full object-cover object-center scale-105"
              />
            </motion.div>
          </div>

          <div className="container relative z-20 mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-3xl"
              variants={heroContainer}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
            >
              <motion.div
                variants={heroChild}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 text-primary mb-6"
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-primary block"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
                  }
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-sm font-semibold tracking-widest uppercase">7 Days A Week • Sunshine Coast</span>
              </motion.div>

              <motion.h1
                variants={heroChild}
                className="text-5xl md:text-7xl lg:text-8xl font-display leading-[0.9] text-white mb-6 uppercase"
              >
                When everyone else is shut, <span className="text-primary">we're on site.</span>
              </motion.h1>

              <motion.p
                variants={heroChild}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
              >
                Premium mobile mechanic service covering Maleny to Maroochydore and Caloundra to Cooroy. We turn up fast, fix it right, and talk to you like a human. No BS, no hidden fees.
              </motion.p>

              <motion.div variants={heroChild} className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="tel:0435835688"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-primary text-primary-foreground font-display text-xl tracking-wider uppercase hover:bg-primary/90 transition-colors"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  <Phone size={20} />
                  Call Mitch Now
                </motion.a>
                <Button
                  onClick={() => scrollTo("contact")}
                  variant="outline"
                  className="h-14 px-8 border-2 border-white/20 text-white font-display text-xl tracking-wider uppercase hover:bg-white hover:text-black transition-colors rounded-none"
                >
                  Get A Quote
                </Button>
              </motion.div>

              <motion.div
                variants={heroChild}
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8"
              >
                {[
                  { k: "24/7", l: "Always Open" },
                  { k: "100%", l: "Mobile Service" },
                  { k: "RWC", l: "Licensed Checks" },
                  { k: "LR", l: "Land Rover Spec" },
                ].map((stat) => (
                  <div key={stat.k} className="flex flex-col gap-1">
                    <span className="font-display text-3xl text-primary">{stat.k}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">{stat.l}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Tagline Bar */}
        <div className="bg-primary py-8 overflow-hidden flex items-center justify-center border-y border-primary-border relative">
          <motion.div
            className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.15)_0%,_transparent_70%)]"
            aria-hidden
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.4, 0.65, 0.4] }
            }
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2
              className="text-3xl md:text-5xl font-display tracking-[0.2em] text-white uppercase m-0"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: easeOutExpo }}
            >
              On Location <span className="text-black mx-4">•</span> On Time <span className="text-black mx-4">•</span> On Point
            </motion.h2>
          </div>
        </div>

        {/* Services Section */}
        <section id="services" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <FadeIn className="max-w-2xl">
                <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">Our Services</h2>
                <h3 className="text-4xl md:text-6xl font-display uppercase leading-none">Complete Auto Care, <br/>Delivered to your door.</h3>
              </FadeIn>
              <FadeIn className="text-muted-foreground max-w-md md:text-right" delay={0.1}>
                Whether you're stuck on the side of the road or need a logbook service in your driveway, we bring the workshop to you.
              </FadeIn>
            </div>

            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Wrench, title: "Mobile Auto Repair", desc: "From brake pads to alternators, we handle comprehensive mechanical repairs on-site with professional tooling." },
                { icon: Clock, title: "Breakdowns & Emergencies", desc: "Stuck? We prioritize urgent callouts to get you back on the road safely and quickly without the tow truck fees." },
                { icon: ShieldCheck, title: "Logbook Servicing", desc: "Maintain your manufacturer warranty with our comprehensive logbook servicing, performed at your home or workplace." },
                { icon: PenTool, title: "Roadworthiness Checks", desc: "Fully licensed to perform RWC inspections and provide certificates so you can register or sell your vehicle." },
                { icon: CheckCircle2, title: "Pre-Purchase Inspections", desc: "Buying a used car? We'll inspect it top to bottom and give you an honest, unbiased report before you hand over cash." },
                { icon: MapPin, title: "Land Rover Specialists", desc: "Extensive experience with Land Rover engines, gearboxes, and diffs. We know their quirks and how to fix them." },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="bg-card border border-border p-8 hover:border-primary/50 transition-colors group relative overflow-hidden"
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -6, transition: { duration: 0.25, ease: easeOutExpo } }
                  }
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
                  <motion.div
                    whileHover={prefersReducedMotion ? undefined : { rotate: [0, -8, 8, 0], transition: { duration: 0.45 } }}
                  >
                    <service.icon className="w-10 h-10 text-primary mb-6" />
                  </motion.div>
                  <h4 className="text-2xl font-display uppercase tracking-wide mb-3">{service.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </section>

        {/* About / Land Rover Specialty */}
        <section id="about" className="py-24 bg-[#0a0a0a] border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative"
                initial={prefersReducedMotion ? false : { opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, ease: easeOutExpo }}
              >
                <motion.div
                  className="aspect-[4/5] relative z-10 overflow-hidden"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                  transition={{ duration: 0.45, ease: easeOutExpo }}
                >
                  <img src={mechanicPortrait} alt="Mitch - Coast 2 Coast Mobile Mechanic" className="w-full h-full object-cover border border-white/10 grayscale contrast-125" />
                  <div className="absolute inset-0 bg-primary mix-blend-multiply opacity-20" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-8 -right-8 w-2/3 aspect-square z-20 border-8 border-[#0a0a0a] overflow-hidden"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.6, ease: easeOutExpo }}
                >
                  <img src={engineWork} alt="Engine Repair" className="w-full h-full object-cover grayscale contrast-125" />
                  <div className="absolute inset-0 bg-black/40" />
                </motion.div>
                <motion.div
                  className="absolute -top-4 -left-4 w-24 h-24 bg-primary z-0"
                  initial={prefersReducedMotion ? false : { scale: 0.85, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.45, ease: easeOutExpo }}
                />
              </motion.div>

              <FadeIn>
                <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">Meet The Mechanic</h2>
                <h3 className="text-4xl md:text-6xl font-display uppercase leading-none mb-6">Honest Work.<br/>No Bullshit.</h3>

                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed mb-10">
                  <p>
                    I'm Mitch, the owner and operator of Coast 2 Coast Mobile Mechanics. I started this business because I was tired of seeing locals get ripped off by workshops that overcharge and underdeliver.
                  </p>
                  <p>
                    My philosophy is simple: turn up when I say I will, fix the problem properly, and charge a fair price. I'll walk you through exactly what's wrong with your car in plain English, with no confusing mechanic jargon.
                  </p>
                  <motion.div
                    className="p-6 bg-card border border-border border-l-4 border-l-primary"
                    whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h4 className="text-xl font-display uppercase text-foreground mb-2 tracking-wide">The Land Rover Specialist</h4>
                    <p className="text-sm">
                      Got a Landy? I've got years of dedicated experience working on Land Rover engines, gearboxes, and diffs. They're incredible machines, but they need someone who actually knows how they tick. That's me.
                    </p>
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                  <div>
                    <h5 className="font-display text-2xl text-white mb-2 uppercase">Coverage Area</h5>
                    <p className="text-sm text-muted-foreground">Maleny to Maroochydore<br/>Caloundra to Cooroy</p>
                  </div>
                  <div>
                    <h5 className="font-display text-2xl text-white mb-2 uppercase">Availability</h5>
                    <p className="text-sm text-muted-foreground">7 Days a week<br/>Including after hours</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">Customer Feedback</h2>
              <h3 className="text-4xl md:text-6xl font-display uppercase leading-none mb-6">Don't Just Take<br/>Our Word For It.</h3>
              <p className="text-muted-foreground">
                We've built our reputation on the Sunshine Coast through hard work, reliability, and honesty. Here's what our customers have to say.
              </p>
            </FadeIn>

            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.06}>
              {REVIEWS.map((review, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="bg-[#151515] p-8 border border-white/5 flex flex-col justify-between transition-colors hover:border-primary/25"
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-primary fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed italic">"{review.text}"</p>
                  </div>
                  <div className="font-display tracking-wider text-lg uppercase">{review.author}</div>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </section>

        {/* CTA / Contact Section */}
        <section id="contact" className="py-24 bg-card border-t border-border relative overflow-hidden">
          {/* Background decoration */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"
            aria-hidden
            initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16">
              <FadeIn>
                <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">Get In Touch</h2>
                <h3 className="text-4xl md:text-6xl font-display uppercase leading-none mb-6">Need A Fix?<br/>Let's Sort It Out.</h3>
                <p className="text-muted-foreground text-lg mb-10">
                  Fill out the form with your details and what's going wrong with your car, and I'll get back to you with a quote ASAP. For emergencies, always call.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-background flex items-center justify-center border border-border shrink-0">
                      <Phone className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl uppercase tracking-wider mb-1">Call Us Direct</h4>
                      <a href="tel:0435835688" className="text-muted-foreground hover:text-white transition-colors">0435 835 688</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-background flex items-center justify-center border border-border shrink-0">
                      <Mail className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl uppercase tracking-wider mb-1">Email Us</h4>
                      <a href="mailto:coast2coastmm@outlook.com" className="text-muted-foreground hover:text-white transition-colors">coast2coastmm@outlook.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-background flex items-center justify-center border border-border shrink-0">
                      <MapPin className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl uppercase tracking-wider mb-1">Service Area</h4>
                      <p className="text-muted-foreground">Maleny to Maroochydore<br/>Caloundra to Cooroy</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.12} className="bg-background p-8 border border-border">
                <h4 className="font-display text-3xl uppercase tracking-wide mb-6 border-b border-border pb-4">Request a Quote</h4>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-card border-border h-12 rounded-none focus-visible:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="0400 000 000" className="bg-card border-border h-12 rounded-none focus-visible:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Service Required</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-card border-border h-12 rounded-none focus-visible:ring-primary">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-none border-border">
                              <SelectItem value="repair">General Repair</SelectItem>
                              <SelectItem value="service">Logbook Service</SelectItem>
                              <SelectItem value="breakdown">Breakdown / Emergency</SelectItem>
                              <SelectItem value="rwc">Roadworthy Certificate (RWC)</SelectItem>
                              <SelectItem value="landrover">Land Rover Specialist Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Vehicle Details & Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Make, model, year, and what the issue is..." 
                              className="bg-card border-border min-h-[120px] rounded-none focus-visible:ring-primary resize-y" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-14 font-display text-xl tracking-wider uppercase rounded-none bg-primary text-primary-foreground hover:bg-primary/90 mt-4 group">
                      Send Request
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </Form>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10 pb-24 md:pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <img src={logoUrl} alt="Coast 2 Coast Mobile Mechanics Logo" className="h-8 object-contain grayscale opacity-50" />
              <p className="text-muted-foreground text-sm mt-4">© {new Date().getFullYear()} Coast 2 Coast Mobile Mechanics. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground uppercase tracking-widest">
              <span>ABN / Licenced Mechanic</span>
              <span>Sunshine Coast, QLD</span>
            </div>
          </FadeIn>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border z-50 flex gap-4"
        initial={prefersReducedMotion ? false : { y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.45, ease: easeOutExpo }}
      >
        <motion.a
          href="tel:0435835688"
          className="flex-1 flex items-center justify-center gap-2 h-14 bg-primary text-primary-foreground font-display text-lg tracking-wider uppercase"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        >
          <Phone size={18} />
          Call Now
        </motion.a>
      </motion.div>
    </div>
  );
}
