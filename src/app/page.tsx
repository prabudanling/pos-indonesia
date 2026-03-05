"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  Plane, Ship, Truck, Building2, Database, CreditCard, Warehouse, Globe,
  Calendar, MapPin, Users, Package, Zap, Leaf, Rocket, Target,
  ChevronDown, ExternalLink, Play, Star, Award, TrendingUp, Clock,
  GraduationCap, Briefcase, Medal, UserCog, BookOpen
} from "lucide-react";

// ============== PARTICLES BACKGROUND ==============
const ParticlesBackground = () => {
  const [mounted, setMounted] = useState(false);
  // Store particles in state to avoid hydration issues
  const [particles, setParticles] = useState<Array<{x: number, y: number, scale: number, duration: number, moveX: number, moveY: number}>>([]);

  useEffect(() => {
    if (!mounted) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const newParticles = [...Array(30)].map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 10 + 10,
        moveX: Math.random() * 500 - 250,
        moveY: Math.random() * 500 - 250,
      }));
      // Using setTimeout to avoid setState in effect warning
      const timer = setTimeout(() => {
        setParticles(newParticles);
        setMounted(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  if (!mounted || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: i % 3 === 0 ? 'rgba(196, 30, 58, 0.4)' : i % 3 === 1 ? 'rgba(234, 88, 12, 0.4)' : 'rgba(249, 115, 22, 0.3)' }}
          initial={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
          }}
          animate={{
            x: [null, particle.moveX],
            y: [null, particle.moveY],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      {/* Floating Orbs - Red/Orange on White */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "10%", background: 'rgba(196, 30, 58, 0.08)' }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "20%", right: "15%", background: 'rgba(234, 88, 12, 0.08)' }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "50%", left: "60%", background: 'rgba(249, 115, 22, 0.06)' }}
      />
    </div>
  );
};

// ============== ANIMATED COUNTER ==============
const AnimatedCounter = ({ end, suffix = "", prefix = "", duration = 2 }: { end: number; suffix?: string; prefix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// ============== TYPEWRITER TEXT ==============
const TypewriterText = ({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !started) {
      setTimeout(() => {
        setStarted(true);
      }, delay);
    }
  }, [isInView, delay, started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [started, text, speed]);

  return <span ref={ref}>{displayedText}<span className="animate-pulse">|</span></span>;
};

// ============== FLOATING ICON ==============
const FloatingIcon = ({ icon: Icon, delay = 0, color = "text-red-500" }: { icon: React.ElementType; delay?: number; color?: string }) => {
  return (
    <motion.div
      className={`w-16 h-16 rounded-xl glass flex items-center justify-center ${color}`}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.2, rotate: 15 }}
    >
      <Icon className="w-8 h-8" />
    </motion.div>
  );
};

// ============== MAGNETIC BUTTON ==============
const MagneticButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
};

// ============== EXECUTIVE SUMMARY SECTION ==============
const ExecutiveSummarySection = () => {
  const keyPoints = [
    { icon: Target, title: "Revenue Target", value: "USD 50 Miliar", year: "2045" },
    { icon: Award, title: "Market Cap Target", value: "USD 120 Miliar", year: "2045" },
    { icon: Users, title: "Karyawan", value: "250.000+", year: "2045" },
    { icon: Globe, title: "Negara Operasi", value: "35 Negara", year: "2045" },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-red-50/20" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Star className="w-5 h-5 text-orange-500 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="font-semibold text-orange-500">EXECUTIVE SUMMARY</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Mega Blueprint Transformasi</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-slate-700 leading-relaxed">
              <TypewriterText 
                text="Menjadikan PT POS Indonesia sebagai Super Holding Logistik Pan-Asia: Pemimpin End-to-End Multimodal Logistics (Darat, Udara, Laut, Digital, Keuangan) dengan Revenue USD 50 Miliar dan Market Cap USD 120 Miliar — sejajar DHL, FedEx, dan SF Express."
                delay={500}
                speed={20}
              />
            </p>
          </div>
        </motion.div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {keyPoints.map((point, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 text-center relative overflow-hidden group"
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, type: "spring" }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                <point.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-3xl font-black text-slate-800 mb-1">{point.value}</div>
              <div className="text-sm text-slate-600">{point.title}</div>
              <div className="text-xs text-orange-500 font-semibold mt-2">{point.year}</div>
            </motion.div>
          ))}
        </div>

        {/* Why POS Indonesia - Updated with Kecamatan & Desa */}
        <motion.div
          className="glass rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 gradient-text">
            Mengapa POS Indonesia?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { title: "279 Tahun", subtitle: "Sejarah", desc: "Modal sosial tak ternilai", icon: Calendar },
              { title: "4.000+", subtitle: "Kantor Pos", desc: "Infrastruktur terluas", icon: Building2 },
              { title: "514", subtitle: "Kab/Kota", desc: "Seluruh Indonesia", icon: MapPin },
              { title: "7.285", subtitle: "Kecamatan", desc: "Jangkauan penuh", icon: MapPin },
              { title: "84.276", subtitle: "Desa/Kel", desc: "Sampai ke pelosok", icon: MapPin },
              { title: "Lisensi", subtitle: "Pos Nasional", desc: "Dilindungi negara", icon: Award },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all border border-red-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <item.icon className="w-7 h-7 text-red-500 mb-2" />
                <div className="text-2xl font-black text-slate-800">{item.title}</div>
                <div className="text-sm font-semibold text-orange-500">{item.subtitle}</div>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============== EKOSISTEM BUMN TERINTEGRASI SECTION ==============
const bumnEcosystem = [
  { 
    name: "HULU", 
    desc: "Upstream Logistics",
    items: ["PERTAMINA", "PLN", "BUKAKA", "PAL Indonesia"],
    color: "from-blue-500 to-cyan-500",
    icon: Building2
  },
  { 
    name: "TENGAH", 
    desc: "Core Operations",
    items: ["POS Indonesia", "Pelni", "Garuda", "Sriwijaya Air"],
    color: "from-red-500 to-orange-500",
    icon: Package
  },
  { 
    name: "HILIR", 
    desc: "Downstream Services",
    items: ["BRI", "Mandiri", "BNI", "BTN", "Jasa Marga"],
    color: "from-emerald-500 to-teal-500",
    icon: CreditCard
  },
];

const integrationNodes = [
  { name: "Energy & Fuel", bumn: "PERTAMINA", type: "hulu" },
  { name: "Power Grid", bumn: "PLN", type: "hulu" },
  { name: "Manufacturing", bumn: "BUKAKA", type: "hulu" },
  { name: "Land Transport", bumn: "POS Indonesia", type: "tengah" },
  { name: "Sea Transport", bumn: "Pelni", type: "tengah" },
  { name: "Air Transport", bumn: "Garuda", type: "tengah" },
  { name: "Banking & Finance", bumn: "BRI Group", type: "hilir" },
  { name: "Digital Payment", bumn: "LinkAja", type: "hilir" },
  { name: "E-Commerce", bumn: "PaDi UMKM", type: "hilir" },
];

const EkosistemBUMNSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/30 to-white" />
        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(196, 30, 58, 0.1)" />
              <stop offset="50%" stopColor="rgba(234, 88, 12, 0.3)" />
              <stop offset="100%" stopColor="rgba(196, 30, 58, 0.1)" />
            </linearGradient>
          </defs>
          {/* Animated Connection Lines */}
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={i}
              x1="0"
              y1={`${20 + i * 15}%`}
              x2="100%"
              y2={`${25 + i * 12}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Globe className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="font-semibold text-red-500">EKOSISTEM BUMN TERINTEGRASI</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Dari Hulu ke Hilir</span>
          </h2>
          
          <p className="text-xl text-slate-800/80 max-w-4xl mx-auto leading-relaxed">
            Sinergi 142 BUMN Indonesia dalam satu ekosistem logistik terintegrasi — 
            <span className="text-red-500 font-bold"> Super Holding</span> yang menghubungkan seluruh rantai nilai
          </p>
        </motion.div>

        {/* Main Ecosystem Image */}
        <motion.div
          className="relative mb-16 rounded-3xl overflow-hidden glass p-2"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/upload/super%20holding%20interconnecting.jpeg"
              alt="Ekosistem BUMN Terintegrasi"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <motion.div
              className="absolute bottom-4 left-4 right-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <span className="px-4 py-2 rounded-full bg-white/90 text-red-600 font-bold text-sm backdrop-blur-sm">
                142 BUMN Terintegrasi dalam Super Holding
              </span>
            </motion.div>
          </motion.div>
          
          {/* Decorative Corner Elements */}
          <motion.div
            className="absolute -top-4 -left-4 w-20 h-20 border-l-4 border-t-4 border-red-500 rounded-tl-3xl"
            initial={{ opacity: 0, x: -20, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          />
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 border-r-4 border-t-4 border-orange-500 rounded-tr-3xl"
            initial={{ opacity: 0, x: 20, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-20 h-20 border-l-4 border-b-4 border-orange-500 rounded-bl-3xl"
            initial={{ opacity: 0, x: -20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-20 h-20 border-r-4 border-b-4 border-red-500 rounded-br-3xl"
            initial={{ opacity: 0, x: 20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          />
        </motion.div>

        {/* Three Pillars: Hulu - Tengah - Hilir */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {bumnEcosystem.map((pillar, index) => (
            <motion.div
              key={index}
              className="glass rounded-3xl p-8 relative overflow-hidden group"
              initial={{ opacity: 0, y: 50, rotateY: 30 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.03, y: -10 }}
              style={{ perspective: 1000 }}
            >
              {/* Background Glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />
              
              {/* Icon */}
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <pillar.icon className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl font-black text-slate-800 mb-1">{pillar.name}</h3>
              <p className="text-sm text-orange-500 mb-6">{pillar.desc}</p>

              {/* BUMN List */}
              <div className="space-y-3">
                {pillar.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + i * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${pillar.color}`} />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Animated Border */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${pillar.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Integration Flow */}
        <motion.div
          className="glass rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 gradient-text">
            Flow Integrasi Super Holding
          </h3>
          
          {/* Animated Flow Diagram */}
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {integrationNodes.map((node, index) => (
                <motion.div
                  key={index}
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {/* Node Circle */}
                  <motion.div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                      node.type === 'hulu' 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                        : node.type === 'tengah'
                        ? 'bg-gradient-to-br from-red-500 to-orange-500'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                    }`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Package className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <span className="text-xs font-bold text-slate-800 text-center">{node.name}</span>
                  <span className="text-xs text-orange-500">{node.bumn}</span>

                  {/* Connection Arrow */}
                  {index < integrationNodes.length - 1 && (
                    <motion.div
                      className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-8"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <svg width="32" height="12" viewBox="0 0 32 12">
                        <motion.path
                          d="M0 6 L26 6 L20 1 M26 6 L20 11"
                          stroke="rgba(234, 88, 12, 0.5)"
                          strokeWidth="2"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Integration Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { value: "142", label: "BUMN Terintegrasi", suffix: "" },
              { value: "270", label: "Juta Penduduk Terlayani", suffix: "J" },
              { value: "514", label: "Kab/Kota Jangkauan", suffix: "" },
              { value: "100", label: "Persen NKRI Coverage", suffix: "%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-4 rounded-xl bg-white/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-black text-red-500">
                  <AnimatedCounter end={parseInt(stat.value)} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* POS Indonesia as Orchestrator */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/10 to-red-500/5"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <Award className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              POS Indonesia sebagai <span className="gradient-text">Orchestrator</span>
            </h3>
            <p className="text-slate-700 max-w-2xl mx-auto">
              Dengan jaringan <span className="font-bold text-red-500">4.000+ kantor pos</span> di seluruh Indonesia,
              POS Indonesia menjadi penghubung utama ekosistem BUMN — dari energi, transportasi, 
              hingga layanan keuangan — dalam satu platform terintegrasi.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============== KDMP & N-LOS SECTION ==============
const kdmopStats = [
  { value: 80000, label: "KDMP Aktif", suffix: "", desc: "Koperasi Desa Merah Putih" },
  { value: 514, label: "Hub Kabupaten", suffix: "", desc: "Cross-dock & sorting regional" },
  { value: 15, label: "Mega Hub", suffix: "", desc: "Nasional terintegrasi" },
  { value: 195, label: "Negara", suffix: "", desc: "Jangkauan internasional" },
];

const fourLayers = [
  { 
    layer: "LAYER 1", 
    title: "80.000 KDMP", 
    desc: "Micro-hub desa sebagai Agen Pos fungsional",
    items: ["Gudang penyimpanan", "Cold storage", "Payment point", "Gerai distribusi"],
    color: "from-emerald-500 to-teal-500",
    icon: Building2
  },
  { 
    layer: "LAYER 2", 
    title: "514 Hub Kabupaten", 
    desc: "Cross-dock & sorting regional",
    items: ["Konsolidasi kargo", "Sorting otomatis", "Fleet management"],
    color: "from-blue-500 to-cyan-500",
    icon: Package
  },
  { 
    layer: "LAYER 3", 
    title: "15 Mega Hub", 
    desc: "Integrasi pelabuhan, bandara, kereta",
    items: ["Pelindo integration", "Angkasa Pura", "KAI Logistik"],
    color: "from-purple-500 to-pink-500",
    icon: Warehouse
  },
  { 
    layer: "LAYER 4", 
    title: "Koridor Global", 
    desc: "ASEAN - Asia - Dunia",
    items: ["Singapura-Malaysia", "Thailand-Vietnam", "China-Jepang-Australia"],
    color: "from-red-500 to-orange-500",
    icon: Globe
  },
];

const nlosModules = [
  { name: "OMS", full: "Order Management", desc: "Satu pintu seluruh pesanan" },
  { name: "TMS", full: "Transport Management", desc: "Route planning & fleet" },
  { name: "WMS", full: "Warehouse Management", desc: "Inventory real-time" },
  { name: "Track & Trace", full: "Visibility Platform", desc: "End-to-end tracking" },
  { name: "AI Analytics", full: "Intelligence Platform", desc: "Demand forecasting" },
  { name: "Blockchain", full: "Audit Trail", desc: "Traceability immutable" },
];

const KDMPNLOSSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Building2 className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-emerald-500">INFRASTRUKTUR SUPER HOLDING</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">KDMP & N-LOS</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            <span className="font-bold text-emerald-500">80.000 KDMP</span> sebagai jaringan kapiler desa + 
            <span className="font-bold text-teal-500"> N-LOS</span> sebagai sistem saraf digital nasional
          </p>
        </motion.div>

        {/* KDMP Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {kdmopStats.map((stat, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-4xl md:text-5xl font-black text-emerald-500 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-lg font-bold text-slate-800">{stat.label}</div>
              <div className="text-sm text-slate-500">{stat.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* 4-Layer Architecture */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 gradient-text">
            4-Layer Architecture
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourLayers.map((layer, index) => (
              <motion.div
                key={index}
                className="glass rounded-2xl p-6 relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Layer Badge */}
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <layer.icon className="w-6 h-6 text-white" />
                </motion.div>

                <div className="text-xs font-bold text-slate-500 mb-1">{layer.layer}</div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{layer.title}</h4>
                <p className="text-sm text-slate-600 mb-4">{layer.desc}</p>

                <div className="space-y-2">
                  {layer.items.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 text-sm text-slate-600"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${layer.color}`} />
                      {item}
                    </motion.div>
                  ))}
                </div>

                {/* Animated Border */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${layer.color}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* N-LOS Platform */}
        <motion.div
          className="glass rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
              N-LOS: National Logistics Operating System
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sistem saraf digital yang menghubungkan <span className="font-bold text-emerald-500">21 BUMN logistik</span>, 
              <span className="font-bold text-teal-500"> 80.000 KDMP</span>, dan ribuan mitra dalam satu platform real-time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nlosModules.map((module, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-lg font-black text-emerald-500 mb-1">{module.name}</div>
                <div className="text-xs font-semibold text-slate-700 mb-1">{module.full}</div>
                <div className="text-xs text-slate-500">{module.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Target Biaya Logistik */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/10 to-emerald-500/5"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Target Penurunan Biaya Logistik Nasional
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-black text-red-500 mb-2">14.29%</div>
                <div className="text-slate-600">Biaya Logistik 2025</div>
                <div className="text-sm text-slate-400">dari PDB</div>
              </motion.div>

              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-32 h-2 bg-gradient-to-r from-red-500 to-emerald-500 rounded-full relative">
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center"
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xs">→</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-black text-emerald-500 mb-2">8%</div>
                <div className="text-slate-600">Target 2045</div>
                <div className="text-sm text-slate-400">dari PDB</div>
              </motion.div>
            </div>

            <p className="text-slate-600 mt-6">
              Penurunan <span className="font-bold text-emerald-500">Rp 2.000+ Triliun/tahun</span> biaya logistik nasional
            </p>
          </div>
        </motion.div>

        {/* 21 BUMN Konsolidasi */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/10 to-red-500/5"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <Award className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              21 BUMN Logistik Terkonsolidasi
            </h3>
            <p className="text-slate-600 mb-6">
              Di bawah koordinasi <span className="font-bold text-red-500">Danantara Indonesia</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {["POS Indonesia", "KAI Logistik", "Pelindo", "PELNI", "ASDP", "DAMRI", "Garuda Cargo", "Sriwijaya Air", "ANGKASA PURA", "PT KAI", "Jasa Marga", "WASKITA", "PP (Persero)", "ADHI", "WIKA", "Brantas Abipraya", "Nindya Karya", "Pembangunan Perumahan", "HK Realtindo", "ReKA JAYA", "Len Industri"].map((bumn, i) => (
                <motion.span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-sm font-medium text-slate-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                >
                  {bumn}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============== DIAGNOSIS & KOMPETITOR SECTION ==============
const diagnosisData = [
  { dimension: "Infrastruktur IT", issue: "Legacy system 1990s-2000s, silo data", impact: "Tidak bisa bersaing real-time tracking" },
  { dimension: "Model Bisnis", issue: "Berbasis surat & paket konvensional", impact: "Kalah dari J&T, JNE, SiCepat" },
  { dimension: "SDM & Kultur", issue: "Birokrasi kental, resistansi perubahan", impact: "Inovasi lambat, produktivitas rendah" },
  { dimension: "Armada", issue: "Armada tua, tidak elektrifikasi", impact: "Biaya operasional tinggi" },
  { dimension: "Teknologi", issue: "Tidak ada AI/ML, IoT minimal", impact: "Blind spot supply chain" },
];

const kompetitorData = [
  { name: "DHL (Jerman)", strength: "Global network 220 negara", weakness: "Tidak ada last-mile rural Indonesia", strategy: "Kuasai first & last mile" },
  { name: "FedEx (AS)", strength: "Express udara dominan, B2B kuat", weakness: "Tidak punya kantor fisik masif", strategy: "Bangun POS Air kompetitor" },
  { name: "SF Express (China)", strength: "Speed & tech terdepan di Asia", weakness: "Ekspansi ke RI masih terbatas", strategy: "Lawan di ASEAN lebih dulu" },
  { name: "J&T Express", strength: "Kuat di e-commerce, harga kompetitif", weakness: "Tidak punya lisensi pos nasional", strategy: "Gunakan regulasi barrier" },
  { name: "JNE/SiCepat", strength: "Brand lokal kuat, network Java-sentris", weakness: "Lemah di luar Jawa & internasional", strategy: "Dominasi non-Java & regional" },
];

const DiagnosisSection = () => {
  const [activeTab, setActiveTab] = useState<"diagnosis" | "kompetitor">("diagnosis");

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span className="text-red-500 font-semibold text-lg tracking-wider">
            SITUASI SAAT INI
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">Diagnosis & Kompetitor</span>
          </h2>
        </motion.div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {["diagnosis", "kompetitor"].map((tab) => (
            <MagneticButton
              key={tab}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                activeTab === tab 
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30" 
                  : "glass text-slate-700 hover:text-red-600"
              }`}
              onClick={() => setActiveTab(tab as "diagnosis" | "kompetitor")}
            >
              {tab === "diagnosis" ? "🔍 Diagnosis" : "⚔️ Kompetitor"}
            </MagneticButton>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "diagnosis" ? (
            <motion.div
              key="diagnosis"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-red-500 to-orange-500">
                      <th className="p-4 text-left text-white font-bold">Dimensi</th>
                      <th className="p-4 text-left text-white font-bold">Kondisi</th>
                      <th className="p-4 text-left text-white font-bold">Dampak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnosisData.map((item, i) => (
                      <motion.tr
                        key={i}
                        className="border-b border-red-100 hover:bg-red-50 transition-colors"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <td className="p-4 font-bold text-red-600">{item.dimension}</td>
                        <td className="p-4 text-slate-700">{item.issue}</td>
                        <td className="p-4 text-orange-600 font-medium">{item.impact}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="kompetitor"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {kompetitorData.map((comp, i) => (
                <motion.div
                  key={i}
                  className="glass rounded-2xl p-6 card-hover relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-2xl" />
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{comp.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-emerald-600 font-semibold">KEKUATAN</span>
                      <p className="text-slate-600 text-sm">{comp.strength}</p>
                    </div>
                    <div>
                      <span className="text-xs text-red-500 font-semibold">KELEMAHAN</span>
                      <p className="text-slate-600 text-sm">{comp.weakness}</p>
                    </div>
                    <div>
                      <span className="text-xs text-orange-500 font-semibold">STRATEGI COUNTER</span>
                      <p className="text-slate-600 text-sm">{comp.strategy}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// ============== HERITAGE ADVANTAGE - 5 DIMENSI SECTION ==============
const heritageDimensions = [
  { 
    roman: "I", 
    title: "Institutional Trust", 
    subtitle: "Kepercayaan Institusional 279 Tahun",
    desc: "Tidak ada kompetitor yang bisa membeli kepercayaan 279 tahun. Brand equity minimal USD 5-8 Miliar — aset tak berwujud terbesar.",
    icon: Star,
    color: "from-red-500 to-rose-500"
  },
  { 
    roman: "II", 
    title: "Geographic Omnipresence", 
    subtitle: "Ada di Mana Kompetitor Tidak Berani",
    desc: "4.000+ titik di seluruh NKRI termasuk desa terpencil. Jaringan yang membutuhkan 50 tahun dan Rp 500 Triliun untuk ditiru.",
    icon: MapPin,
    color: "from-orange-500 to-amber-500"
  },
  { 
    roman: "III", 
    title: "Sovereign Mandate", 
    subtitle: "Mandat Negara Dilindungi Konstitusi",
    desc: "UU No. 38/2009 memberikan hak eksklusif sebagai penyelenggara layanan pos universal — mandat konstitusional.",
    icon: Award,
    color: "from-yellow-500 to-lime-500"
  },
  { 
    roman: "IV", 
    title: "Real Estate Premium", 
    subtitle: "4.000 Properti Emas di Jantung Kota",
    desc: "Nilai properti konservatif Rp 150 Triliun. Setiap kantor pos di lokasi paling strategis selama 279 tahun.",
    icon: Building2,
    color: "from-emerald-500 to-teal-500"
  },
  { 
    roman: "V", 
    title: "Cultural DNA", 
    subtitle: "Menyatu dengan 270 Juta Rakyat",
    desc: "POS ada di setiap cerita kehidupan rakyat Indonesia. Emotional brand equity yang tidak bisa ditiru.",
    icon: Users,
    color: "from-cyan-500 to-blue-500"
  },
];

// Pre-generated random values for HeritageAdvantageSection (to avoid hydration mismatch)
const heritageParticles = [
  { left: 12.5, top: 25.3, duration: 3.2, delay: 0.5 },
  { left: 45.8, top: 67.2, duration: 4.1, delay: 1.2 },
  { left: 78.4, top: 15.9, duration: 3.7, delay: 0.8 },
  { left: 33.2, top: 89.1, duration: 4.5, delay: 1.5 },
  { left: 91.6, top: 42.7, duration: 3.4, delay: 0.3 },
  { left: 18.9, top: 58.4, duration: 4.2, delay: 1.8 },
  { left: 65.3, top: 31.6, duration: 3.9, delay: 0.6 },
  { left: 52.1, top: 76.8, duration: 4.8, delay: 1.1 },
  { left: 8.7, top: 93.2, duration: 3.1, delay: 1.9 },
  { left: 38.4, top: 12.5, duration: 4.3, delay: 0.4 },
  { left: 71.2, top: 55.8, duration: 3.6, delay: 1.4 },
  { left: 25.6, top: 38.9, duration: 4.7, delay: 0.9 },
  { left: 83.1, top: 71.4, duration: 3.3, delay: 1.7 },
  { left: 47.9, top: 19.7, duration: 4.0, delay: 0.2 },
  { left: 14.3, top: 82.5, duration: 3.8, delay: 1.6 },
  { left: 59.8, top: 46.3, duration: 4.4, delay: 0.7 },
  { left: 96.2, top: 28.1, duration: 3.5, delay: 1.3 },
  { left: 31.7, top: 64.9, duration: 4.6, delay: 1.0 },
  { left: 74.5, top: 95.3, duration: 3.2, delay: 0.1 },
  { left: 21.8, top: 51.6, duration: 4.9, delay: 1.8 },
];

const HeritageAdvantageSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {heritageParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-500/20 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6"
          >
            <Medal className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-orange-500">HERITAGE ADVANTAGE</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">5 Dimensi Keunggulan</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Warisan sebagai Senjata Kompetitif — The Heritage Advantage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {heritageDimensions.map((dim, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 100, rotateY: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: -5,
                boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.2)"
              }}
              style={{ perspective: 1000 }}
            >
              {/* Background Glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${dim.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />
              
              {/* Roman Numeral */}
              <motion.div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${dim.color} flex items-center justify-center mb-4`}
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-2xl font-black text-white">{dim.roman}</span>
              </motion.div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">{dim.title}</h3>
              <p className="text-sm text-red-500 mb-3">{dim.subtitle}</p>
              <p className="text-sm text-slate-600">{dim.desc}</p>

              {/* Animated Border */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${dim.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Insight Box */}
        <motion.div
          className="mt-12 glass rounded-2xl p-8 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">INSIGHT GENIUS</h3>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            <span className="text-orange-500 font-bold">USIA 279 TAHUN = BARRIER TO ENTRY SENILAI TRILIUNAN</span>
            <br />
            Berapa biaya untuk membangun kepercayaan 279 tahun? Tidak bisa dibeli dengan uang.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ============== 10 REVENUE STREAMS SECTION ==============
const revenueStreams = [
  { name: "Core Logistics", value: 30, amount: "USD 18 M", desc: "Pengiriman paket darat/udara/laut" },
  { name: "International Express", value: 13, amount: "USD 8 M", desc: "Cross-border & ekspansi Asia" },
  { name: "Financial Services", value: 15, amount: "USD 9 M", desc: "PosePay, asuransi, pinjaman" },
  { name: "Warehousing", value: 12, amount: "USD 7 M", desc: "Sewa gudang, fulfillment fee" },
  { name: "Technology SaaS", value: 10, amount: "USD 6 M", desc: "POSApp B2B, API logistics" },
  { name: "Government PSO+", value: 5, amount: "USD 3 M", desc: "PSO premium + data services" },
  { name: "Real Estate", value: 3, amount: "USD 2 M", desc: "Monetisasi 4.000 kantor pos" },
  { name: "Data & Analytics", value: 3, amount: "USD 2 M", desc: "Insights platform B2B" },
  { name: "EV & Energy", value: 3, amount: "USD 2 M", desc: "Charging station, solar farm" },
  { name: "Drone Services", value: 5, amount: "USD 3 M", desc: "POSFLY komersial & govtech" },
];

// Pre-calculated SVG paths for Revenue Donut Chart (to avoid hydration mismatch from floating-point precision)
const revenueChartColors = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#ec4899"
];

// Pre-calculate all SVG arc paths
const calculateArcPaths = () => {
  const total = revenueStreams.reduce((acc, curr) => acc + curr.value, 0);
  const paths: { d: string; color: string }[] = [];
  
  revenueStreams.forEach((stream, i) => {
    const prevStreams = revenueStreams.slice(0, i);
    const prevTotal = prevStreams.reduce((acc, curr) => acc + curr.value, 0);
    const startAngle = (prevTotal / total) * 360;
    const endAngle = ((prevTotal + stream.value) / total) * 360;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    paths.push({
      d: `M 50 50 L ${x1.toFixed(4)} ${y1.toFixed(4)} A 40 40 0 ${largeArc} 1 ${x2.toFixed(4)} ${y2.toFixed(4)} Z`,
      color: revenueChartColors[i]
    });
  });
  
  return paths;
};

const revenueArcPaths = calculateArcPaths();

const RevenueStreamsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = revenueStreams.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span className="text-emerald-600 font-semibold text-lg tracking-wider">
            DIVERSIFIKASI TOTAL
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">10 Revenue Streams</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Model Revenue Diversifikasi — Target USD 60 Miliar pada 2045
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Donut Chart Visualization */}
          <motion.div
            className="relative aspect-square max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {revenueArcPaths.map((arc, i) => (
                <motion.path
                  key={i}
                  d={arc.d}
                  fill={arc.color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: hoveredIndex === i ? 1 : 0.7, scale: hoveredIndex === i ? 1.05 : 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  style={{ transformOrigin: "center" }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
              ))}
              <circle cx="50" cy="50" r="25" fill="white" stroke="#e5e7eb" strokeWidth="1" />
              <text x="50" y="48" textAnchor="middle" fill="#374151" fontSize="6" fontWeight="bold">
                TOTAL
              </text>
              <text x="50" y="56" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold">
                $60 M
              </text>
            </svg>
          </motion.div>

          {/* Revenue List */}
          <div className="space-y-3">
            {revenueStreams.map((stream, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-4 cursor-pointer transition-all"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, x: 10 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  background: hoveredIndex === i ? "rgba(239, 68, 68, 0.1)" : undefined 
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        background: [
                          "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
                          "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#ec4899"
                        ][i]
                      }}
                    />
                    <span className="font-semibold text-slate-800">{stream.name}</span>
                  </div>
                  <span className="font-bold text-orange-500">{stream.amount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ 
                        background: [
                          "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
                          "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#ec4899"
                        ][i]
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(stream.value / total) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm text-slate-800/60 w-12 text-right">{stream.value}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============== SDM & BUDAYA SECTION ==============
const sdmData = [
  { category: "Technology & Digital", current: 500, target: 50000, percentage: 20 },
  { category: "Operations & Logistics", current: 15000, target: 100000, percentage: 40 },
  { category: "Business Development", current: 1000, target: 30000, percentage: 12 },
  { category: "Finance & Compliance", current: 2000, target: 20000, percentage: 8 },
  { category: "Customer Experience", current: 3000, target: 25000, percentage: 10 },
  { category: "International Operations", current: 200, target: 25000, percentage: 10 },
];

const budayaPillars = [
  { title: "MOVE FAST", desc: "Agile methodology, sprint 2 minggu, fail-fast culture", icon: Zap },
  { title: "INNOVATE ALWAYS", desc: "POS Innovation Lab, hackathon bulanan, 10% waktu untuk inovasi", icon: Rocket },
  { title: "THINK GLOBAL", desc: "Rekrut talent diaspora, rotasi internasional wajib", icon: Globe },
  { title: "DATA-DRIVEN", desc: "Semua keputusan berbasis data, dashboard real-time", icon: Database },
  { title: "SUSTAINABILITY FIRST", desc: "ESG embedded di semua KPI, green logistics", icon: Leaf },
];

const SDMBudayaSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span className="text-purple-600 font-semibold text-lg tracking-wider">
            TRANSFORMASI SDM
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">24.000 → 250.000 Karyawan</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            People Strategy — Dari Birokrasi ke Tech-Driven Powerhouse
          </p>
        </motion.div>

        {/* SDM Growth Chart */}
        <motion.div
          className="glass rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Komposisi SDM 2045</h3>
          <div className="space-y-4">
            {sdmData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-40 text-sm text-slate-700">{item.category}</div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 relative"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                    >
                      <motion.span
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                      >
                        {item.target.toLocaleString()}
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-purple-600 font-semibold">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5 Pilar Budaya */}
        <h3 className="text-2xl font-bold text-center mb-8 gradient-text">5 Pilar Budaya Baru</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {budayaPillars.map((pillar, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6 text-center card-hover"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <pillar.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h4 className="font-bold text-slate-800 mb-2">{pillar.title}</h4>
              <p className="text-xs text-slate-500">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============== SOCIAL IMPACT SECTION ==============
const socialPrograms = [
  { title: "UMKM Onboarding Massal", target: "5 juta UMKM naik kelas via POS logistik platform 2030", icon: Package },
  { title: "Inklusi Keuangan", target: "30 juta unbanked population dapat akses keuangan via 4.000 kantor pos", icon: CreditCard },
  { title: "Pemberdayaan Perempuan", target: "50% kurir mitra adalah perempuan, program pinjaman khusus UMKM", icon: Users },
  { title: "Pemerataan Logistik 3T", target: "Subsidi silang: kota besar subsidi pengiriman ke daerah 3T", icon: MapPin },
  { title: "POS Edu-Delivery", target: "Distribusi buku pelajaran, alat sekolah ke seluruh pelosok Indonesia", icon: BookOpen },
  { title: "Emergency Logistics", target: "Backbone logistik bencana nasional: obat, makanan 48 jam ke mana saja", icon: Zap },
];

// Pre-generated random values for SocialImpactSection (to avoid hydration mismatch)
const socialImpactHearts = [
  { left: 15.3, top: 22.7, fontSize: 18, duration: 3.5, delay: 0.4 },
  { left: 48.9, top: 65.4, fontSize: 24, duration: 4.2, delay: 1.1 },
  { left: 82.1, top: 18.9, fontSize: 15, duration: 3.8, delay: 0.7 },
  { left: 28.6, top: 88.3, fontSize: 22, duration: 4.6, delay: 1.5 },
  { left: 67.4, top: 42.1, fontSize: 12, duration: 3.2, delay: 0.2 },
  { left: 35.8, top: 55.6, fontSize: 28, duration: 4.8, delay: 1.3 },
  { left: 91.2, top: 31.8, fontSize: 16, duration: 3.9, delay: 0.9 },
  { left: 12.4, top: 78.5, fontSize: 20, duration: 4.1, delay: 1.7 },
  { left: 55.7, top: 11.2, fontSize: 14, duration: 3.6, delay: 0.5 },
  { left: 73.9, top: 94.8, fontSize: 26, duration: 4.4, delay: 1.2 },
];

const SocialImpactSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Animated Background with Hearts */}
      <div className="absolute inset-0">
        {socialImpactHearts.map((h, i) => (
          <motion.div
            key={i}
            className="absolute text-red-500/20"
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              fontSize: `${h.fontSize}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              delay: h.delay,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6"
          >
            <span className="text-2xl">❤️</span>
            <span className="font-semibold text-rose-400">POS UNTUK RAKYAT</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Social Impact</span>
          </h2>
          <p className="text-xl text-slate-800/70 max-w-2xl mx-auto">
            POS untuk 270 Juta Rakyat Indonesia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPrograms.map((program, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-8 card-hover relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Heart Animation on Hover */}
              <motion.div
                className="absolute top-4 right-4 text-rose-500/50 text-2xl"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ❤️
              </motion.div>

              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                <program.icon className="w-7 h-7 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">{program.title}</h3>
              <p className="text-slate-600">{program.target}</p>
            </motion.div>
          ))}
        </div>

        {/* Impact Counter */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="glass rounded-2xl p-8 inline-block">
            <p className="text-lg text-slate-800/70 mb-2">Didedikasikan untuk transformasi</p>
            <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
              <AnimatedCounter end={287.6} suffix=" Juta" /> Kehidupan Indonesia
            </div>
            <p className="text-slate-800/60 mt-2">melalui orkestrasi logistik terbesar dalam sejarah bangsa</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============== HERO SECTION ==============
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 via-white to-amber-50/30" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(196, 30, 58, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(196, 30, 58, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Star className="w-5 h-5 text-amber-500" />
          </motion.div>
          <span className="text-sm md:text-base font-medium text-slate-700">
            BUMN Tertua Indonesia — Est. 26 Agustus 1746
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <span className="gradient-text">POS INDONESIA</span>
          </motion.h1>
          
          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            SUPER HOLDING LOGISTIK NASIONAL
          </motion.h2>
          
          <motion.div
            className="h-1 w-48 md:w-64 mx-auto bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full my-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          />
          
          <motion.p
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Mega Blueprint Transformasi 2025-2045
            <br />
            <span className="text-red-600 font-semibold">Menjadi Raksasa Logistik Terbesar di Asia</span>
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {[
            { number: 279, suffix: " Tahun", label: "Warisan Bersejarah" },
            { number: 4000, suffix: "+", label: "Kantor Pos Aktif" },
            { number: 514, label: "Kab/Kota Terjangkau" },
            { number: 100, suffix: "%", label: "Wilayah NKRI" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6 card-hover"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl md:text-4xl font-black text-red-600 mb-2">
                <AnimatedCounter end={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            className="btn-primary text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="w-5 h-5" />
            Jelajahi Blueprint
          </motion.button>
          <motion.button
            className="glass px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 text-slate-700 hover:bg-red-50 transition-colors border border-red-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 text-red-600" />
            Tonton Video
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-red-500" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ============== HERITAGE TIMELINE SECTION ==============
const heritageEvents = [
  { year: "1746", title: "Pos Batavia Berdiri", desc: "VOC mendirikan kantor pos pertama di Batavia oleh Gubernur Jenderal Gustaaf Willem van Imhoff" },
  { year: "1811", title: "British Interregnum", desc: "Inggris mengambil alih Nusantara, sistem pos tetap beroperasi" },
  { year: "1864", title: "Ekspansi Luar Jawa", desc: "Jaringan pos diperluas ke Sumatra, Kalimantan, Sulawesi, dan Maluku" },
  { year: "1906", title: "Lahirnya Pos Giro", desc: "Sistem transfer uang via kantor pos diperkenalkan" },
  { year: "1945", title: "Kemerdekaan Indonesia", desc: "Kantor pos menjadi aset pertama yang direbut pejuang kemerdekaan" },
  { year: "1978", title: "Modernisasi Era Soeharto", desc: "POS menjadi PERUM, lalu Persero dengan ekspansi nasional masif" },
  { year: "2025", title: "Titik Balik Sejarah", desc: "Mega Blueprint dilahirkan, era Super Holding dimulai" },
  { year: "2045", title: "Raksasa Logistik Asia", desc: "Target: Perusahaan logistik #1 Asia dengan revenue USD 60 Miliar" },
];

const HeritageTimeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden bg-gradient-to-b from-red-50 via-white to-amber-50">
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-red-600 font-semibold text-lg tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            WARISAN 279 TAHUN
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">Dari Abad ke Abad</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Dari Hati ke Hati — Perjalanan epik dari Pos VOC hingga Super Holding Asia
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="space-y-16">
            {heritageEvents.map((event, index) => (
              <motion.div
                key={index}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <motion.div
                    className="glass rounded-2xl p-8 card-hover inline-block max-w-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl font-black text-red-600 mb-2">{event.year}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                    <p className="text-slate-600">{event.desc}</p>
                  </motion.div>
                </div>

                {/* Timeline Node */}
                <motion.div
                  className="w-6 h-6 rounded-full bg-red-600 border-4 border-red-300 z-10 relative"
                  whileInView={{ scale: [0, 1.5, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-500"
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                </motion.div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============== 8 PILLARS SECTION ==============
const pillars = [
  { icon: Truck, name: "POS DARAT", company: "PT Pos Express Nusantara", desc: "Penguasa logistik darat multimodal: truk, kereta, sepeda motor, kendaraan listrik", color: "from-red-500 to-orange-500" },
  { icon: Plane, name: "POS UDARA", company: "PT Pos Cargo Airlines", desc: "Maskapai kargo udara nasional & internasional dengan fleet pesawat freighter", color: "from-blue-500 to-cyan-500" },
  { icon: Ship, name: "POS LAUT", company: "PT Pos Maritim Indonesia", desc: "Penguasa jalur laut antar pulau & internasional dengan kapal kontainer", color: "from-teal-500 to-green-500" },
  { icon: Database, name: "POS DIGITAL", company: "PT Pos Tech Indonesia", desc: "Platform digital super-app logistik: AI/ML routing, IoT tracking, blockchain", color: "from-purple-500 to-pink-500" },
  { icon: CreditCard, name: "POS FINANSIAL", company: "PT Pos Giro Fintech", desc: "Bank digital BUMN: PosePay, asuransi logistik, pinjaman UMKM supply chain", color: "from-amber-500 to-yellow-500" },
  { icon: Warehouse, name: "POS WAREHOUSING", company: "PT Pos Gudang Nusantara", desc: "Jaringan smart fulfillment center & cold chain logistics nasional", color: "from-emerald-500 to-teal-500" },
  { icon: Globe, name: "POS INTERNASIONAL", company: "PT Pos Global Asia", desc: "Hub ekspansi regional & global: operasi di 35 negara Asia-Pasifik", color: "from-indigo-500 to-purple-500" },
  { icon: Building2, name: "POS PROPERTI", company: "PT Pos Aset Strategis", desc: "Monetisasi 4.000+ aset properti strategis: logistik hub, EV charging, data center", color: "from-rose-500 to-red-500" },
];

const PillarsSection = () => {
  const containerRef = useRef(null);
  
  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-red-600 font-semibold text-lg tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ARSITEKTUR SUPER HOLDING
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">8 Pilar Utama</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Struktur multi-subsidiary yang melingkupi seluruh ekosistem logistik nasional
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="glass rounded-2xl p-6 h-full card-hover relative overflow-hidden"
                whileHover={{ y: -10 }}
              >
                {/* Gradient Overlay on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />
                
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                >
                  <pillar.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-800 mb-1">{pillar.name}</h3>
                <p className="text-sm text-red-500 mb-3">{pillar.company}</p>
                <p className="text-sm text-slate-600">{pillar.desc}</p>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pillar.color} opacity-20 transform rotate-45 translate-x-16 -translate-y-16`} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============== VISION 2045 SECTION ==============
const visionStats = [
  { icon: TrendingUp, label: "Revenue Konsolidasi", value: 50, suffix: " Miliar USD", desc: "Dari Rp 7 Triliun ke USD 50 Miliar" },
  { icon: Award, label: "Market Cap", value: 120, suffix: " Miliar USD", desc: "BUMN terbesar sepanjang sejarah" },
  { icon: Users, label: "Karyawan Global", value: 250, suffix: " Ribu+", desc: "Dari 24 ribu ke 250 ribu+" },
  { icon: Globe, label: "Negara Operasional", value: 35, suffix: " Negara", desc: "Asia-Pasifik dominasi" },
  { icon: Package, label: "Volume/Hari", value: 100, suffix: " Juta Paket", desc: "Dari 3 juta ke 100 juta" },
  { icon: Plane, label: "Drone Hub", value: 5000, suffix: " Hub Asia", desc: "Jaringan drone terbesar Asia" },
];

const VisionSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Target className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-red-500">HORIZON 2045</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">ASIA #1 LOGISTICS</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Menjadikan PT POS Indonesia sebagai Super Holding Logistik Pan-Asia: 
            Pemimpin End-to-End Multimodal Logistics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visionStats.map((stat, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-8 text-center relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </motion.div>

              <div className="text-4xl md:text-5xl font-black text-slate-800 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              
              <div className="text-lg font-semibold text-red-500 mb-2">{stat.label}</div>
              <div className="text-sm text-slate-500">{stat.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Chart */}
        <motion.div
          className="mt-16 glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            <span className="gradient-text">Perbandingan Global</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "DHL (Jerman)", revenue: "$84 M", employees: "600.000", status: "Global #1" },
              { name: "SF Express (China)", revenue: "$40 M", employees: "400.000", status: "Asia #1" },
              { name: "POS Indonesia 2045", revenue: "$60 M", employees: "250.000", status: "Target Asia #1", highlight: true },
            ].map((company, i) => (
              <motion.div
                key={i}
                className={`rounded-xl p-6 ${company.highlight ? 'bg-gradient-to-br from-red-600 to-red-800 glow-red' : 'bg-white/5'}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl font-bold text-slate-800 mb-4">{company.name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-800/70">Revenue</span>
                    <span className="font-bold text-slate-800">{company.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-800/70">Karyawan</span>
                    <span className="font-bold text-slate-800">{company.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-800/70">Status</span>
                    <span className={`font-bold ${company.highlight ? 'text-amber-300' : 'text-red-500'}`}>{company.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============== ROADMAP SECTION ==============
const roadmapPhases = [
  {
    phase: "FASE 1",
    years: "2025-2027",
    title: "Stabilisasi & Fondasi",
    color: "from-red-500 to-orange-500",
    items: [
      "Restrukturisasi korporasi menjadi Super Holding",
      "Rekrut 500 technology talent kelas dunia",
      "Luncurkan POSApp versi 1.0",
      "Pilot drone delivery: 50 lokasi 3T",
      "IPO POS Indonesia Holdings di BEI",
    ]
  },
  {
    phase: "FASE 2",
    years: "2027-2032",
    title: "Akselerasi & Ekspansi",
    color: "from-orange-500 to-amber-500",
    items: [
      "Luncurkan POS Cargo Airlines",
      "Ekspansi ke 8 negara ASEAN",
      "500 hub drone operasional",
      "PosePay 10 juta pengguna aktif",
      "IPO POS Tech Indonesia",
    ]
  },
  {
    phase: "FASE 3",
    years: "2032-2038",
    title: "Dominasi Regional",
    color: "from-amber-500 to-yellow-500",
    items: [
      "Fleet 50 pesawat, 25 negara",
      "100% elektrifikasi armada darat",
      "Backbone logistik IKN Nusantara",
      "Masuk Fortune Global 500",
      "Pimpin kursi strategis di UPU",
    ]
  },
  {
    phase: "FASE 4",
    years: "2038-2045",
    title: "Kepemimpinan Asia",
    color: "from-yellow-500 to-green-500",
    items: [
      "Revenue USD 50-60 Miliar",
      "Market Cap USD 120 Miliar",
      "5.000 hub drone pan-Asia",
      "100% Net Zero Carbon",
      "Asia's #1 Logistics Company",
    ]
  },
];

const RoadmapSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-orange-500 font-semibold text-lg tracking-wider"
          >
            ROADMAP IMPLEMENTASI
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">4 Fase 20 Tahun</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transformasi berkelanjutan dengan prinsip "Transform While Operating"
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-red-500 via-amber-500 to-green-500 hidden lg:block" />

          <div className="space-y-12">
            {roadmapPhases.map((phase, index) => (
              <motion.div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <motion.div
                    className="glass rounded-2xl p-8 inline-block max-w-xl w-full card-hover"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${phase.color} text-white font-bold mb-4`}>
                      {phase.phase} • {phase.years}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-2 text-slate-600"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Center Node */}
                <motion.div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center z-10 relative`}
                  whileInView={{ scale: [0, 1.3, 1] }}
                  viewport={{ once: true }}
                >
                  <span className="font-bold text-white text-sm">{index + 1}</span>
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase.color}`}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============== TECHNOLOGY SECTION ==============
const techLayers = [
  { layer: 1, name: "AI & Machine Learning", desc: "Demand forecasting, route optimization AI, fraud detection, chatbot CS multi-bahasa", icon: Zap },
  { layer: 2, name: "IoT & Real-Time Tracking", desc: "GPS tracker, RFID, sensor cold chain, smart locker IoT, drone telemetry", icon: Database },
  { layer: 3, name: "Blockchain Supply Chain", desc: "POSChain: track & trace tak terpalsukan, smart contract, sertifikasi halal", icon: Award },
  { layer: 4, name: "Cloud & Edge Computing", desc: "Multi-cloud, edge computing di 500 hub, 99.99% uptime, 10 miliar event/hari", icon: Globe },
  { layer: 5, name: "Super App — POSApp", desc: "One-stop logistics app: kirim paket, lacak, booking gudang, pembayaran", icon: Package },
  { layer: 6, name: "Autonomous & Robotics", desc: "Sorting robot, autonomous vehicle, drone delivery 3T, robotic arm", icon: Rocket },
  { layer: 7, name: "Data Intelligence Platform", desc: "POSDATA Lake: 270 juta data poin, analytics, B2B insight platform", icon: TrendingUp },
];

const TechnologySection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-purple-600 font-semibold text-lg tracking-wider"
          >
            POSTECH ECOSYSTEM
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">7 Layer Teknologi</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ekosistem teknologi kelas dunia sebagai tulang punggung transformasi
          </p>
        </motion.div>

        <div className="space-y-4">
          {techLayers.map((tech, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 card-hover group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-6">
                <motion.div
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-purple-600">Layer {tech.layer}</span>
                    <h3 className="text-xl font-bold text-slate-800">{tech.name}</h3>
                  </div>
                  <p className="text-slate-600">{tech.desc}</p>
                </div>

                <motion.div
                  className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  <span className="font-bold text-purple-600 text-lg">{tech.layer}</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============== GLOBAL EXPANSION SECTION ==============
const expansionRings = [
  { ring: "Ring 1", region: "ASEAN Core", countries: "Malaysia, Singapura, Thailand, Vietnam, Filipina", year: "2026-2030" },
  { ring: "Ring 2", region: "ASEAN Emerging", countries: "Myanmar, Kamboja, Laos, Brunei, Timor Leste", year: "2028-2032" },
  { ring: "Ring 3", region: "Asia Selatan", countries: "India, Bangladesh, Sri Lanka, Pakistan", year: "2030-2035" },
  { ring: "Ring 4", region: "Asia Timur", countries: "China, Jepang, Korea, Hong Kong, Taiwan", year: "2032-2038" },
  { ring: "Ring 5", region: "Pasifik & Timur Tengah", countries: "Australia, Papua Nugini, UAE, Saudi Arabia", year: "2035-2045" },
];

const GlobalExpansionSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-blue-600 font-semibold text-lg tracking-wider"
          >
            EKSPANSI INTERNASIONAL
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">5 Ring Strategis</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Pendekatan ring-ripple: mulai dari ASEAN hingga Asia-Pasifik
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Map Visualization */}
          <motion.div
            className="glass rounded-2xl p-8 aspect-square relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Animated Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[1, 2, 3, 4, 5].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border-2 border-blue-500/30"
                  style={{ width: `${ring * 18}%`, height: `${ring * 18}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: ring * 0.2, duration: 0.8 }}
                />
              ))}
              {/* Center Point */}
              <motion.div
                className="absolute w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-slate-800">RI</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Ring List */}
          <div className="space-y-4">
            {expansionRings.map((ring, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-6 card-hover"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Globe className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-blue-600">{ring.ring}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-orange-500">{ring.year}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{ring.region}</h3>
                    <p className="text-sm text-slate-800/70">{ring.countries}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============== GREEN LOGISTICS SECTION ==============
const greenStats = [
  { year: "2030", ev: "30%", renewable: "30%", emission: "-30%", packaging: "50%" },
  { year: "2040", ev: "70%", renewable: "60%", emission: "-70%", packaging: "80%" },
  { year: "2045", ev: "100%", renewable: "100%", emission: "Net Zero", packaging: "100%" },
];

const GreenLogisticsSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6"
          >
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-emerald-500">SUSTAINABILITY</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Green Logistics</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Target Net Zero 2040 — 5 tahun lebih awal dari Paris Agreement
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-emerald-200">
                <th className="text-left p-4 text-emerald-600 font-bold">Target</th>
                {greenStats.map((stat, i) => (
                  <th key={i} className="text-center p-4 text-slate-800 font-bold">{stat.year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Elektrifikasi Armada EV", key: "ev" },
                { label: "Energi Terbarukan", key: "renewable" },
                { label: "Reduksi Emisi Karbon", key: "emission" },
                { label: "Sustainable Packaging", key: "packaging" },
              ].map((row, i) => (
                <motion.tr
                  key={i}
                  className="border-b border-emerald-100"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <td className="p-4 text-slate-700">{row.label}</td>
                  {greenStats.map((stat, j) => (
                    <td key={j} className="text-center p-4">
                      <motion.span
                        className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 font-bold"
                        whileHover={{ scale: 1.1 }}
                      >
                        {stat[row.key as keyof typeof stat]}
                      </motion.span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.div
          className="mt-12 glass rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Leaf className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">ESG Rating Target</h3>
          <p className="text-4xl font-black text-emerald-500 mb-2">AA+ MSCI</p>
          <p className="text-slate-600">BUMN Indonesia pertama dengan rating ESG kelas dunia</p>
        </motion.div>
      </div>
    </section>
  );
};

// ============== KILLER MOVES SECTION ==============
const killerMoves = [
  { num: 1, title: "Deklarasi Super Holding", desc: "Umumkan restrukturisasi di depan presiden & publik — 'iPhone moment' POS Indonesia" },
  { num: 2, title: "Rekrut CEO Kelas Dunia", desc: "CDO ex-Amazon/Alibaba, CTO ex-Google dengan kompensasi kompetitif" },
  { num: 3, title: "Luncurkan POSApp 1.0", desc: "Super app dalam 6 bulan, gratis ongkir 30 hari untuk viral moment" },
  { num: 4, title: "Drone Delivery Viral", desc: "Kirim paket ke Papua — video viral global, buktikan kemampuan POS" },
  { num: 5, title: "Iklan 'POS untuk Semua'", desc: "Kampanye emosional Rp 500 M: 'Dari Sabang Sampai Merauke'" },
  { num: 6, title: "IPO Kilat di BEI", desc: "Valuasi Rp 100 T dalam 18 bulan — IPO terbesar sejarah Indonesia" },
  { num: 7, title: "Alliance Strategis Global", desc: "MOU dengan FedEx/DHL — signal: 'POS setara pemain global'" },
  { num: 8, title: "Kuasai E-Commerce", desc: "Kontrak eksklusif Shopee & Tokopedia, rebut 30% market share" },
  { num: 9, title: "1.000 Smart Hub", desc: "Transformasi kantor pos jadi hub modern dalam 2 tahun" },
  { num: 10, title: "Deklarasi Net Zero 2040", desc: "Pelopor green logistics Asia, akses investor ESG global" },
];

const KillerMovesSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-red-500 font-semibold text-lg tracking-wider"
          >
            100 HARI PERTAMA
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">10 Killer Moves</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Langkah awal yang mengubah segalanya
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {killerMoves.map((move, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 card-hover group relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Number Badge */}
              <motion.div
                className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
              >
                <span className="text-2xl font-black text-white">#{move.num}</span>
              </motion.div>

              <div className="pr-12">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{move.title}</h3>
                <p className="text-slate-600">{move.desc}</p>
              </div>

              {/* Hover Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============== DEWAN PAKAR SECTION ==============
const dewanPakar = [
  { no: "I", gelar: "M.Sc., CSCP (ASCM/APICS)", bidang: "End-to-End Supply Chain & Network Design", pengalaman: "12 tahun" },
  { no: "II", gelar: "MBA, CMILT (CILT International)", bidang: "Transport, Logistics & Multimodal Integration", pengalaman: "11 tahun" },
  { no: "III", gelar: "M.Eng., PMP, CLTD", bidang: "Mega-Project Logistics & Distribution Infrastructure", pengalaman: "10 tahun" },
  { no: "IV", gelar: "M.A., CBP, CSSBB (Six Sigma Black Belt)", bidang: "Digital Transformation, Blockchain & AI Logistics", pengalaman: "9 tahun" },
  { no: "V", gelar: "S.E., M.M., CFA, FRM", bidang: "Financial Engineering, Investment & Risk Modeling", pengalaman: "11 tahun" },
  { no: "VI", gelar: "M.T., ISO 28000 Lead Auditor, ISO 14083", bidang: "Supply Chain Security & Green Logistics", pengalaman: "10 tahun" },
  { no: "VII", gelar: "S.Sos., M.Pol., CPL, CGAP", bidang: "Public Policy, Cooperative Governance & Regulatory", pengalaman: "10 tahun" },
  { no: "VIII", gelar: "M.T., CPIM (ASCM), CTL (AST&L)", bidang: "Inventory, Warehouse & Manufacturing Planning", pengalaman: "9 tahun" },
  { no: "IX", gelar: "S.Kom., M.Sc., CDMP, TOGAF Certified", bidang: "Data Governance, Enterprise Architecture & Platform", pengalaman: "9 tahun" },
  { no: "X", gelar: "M.Agr., CCA (GCCA), GlobalGAP Auditor", bidang: "Agricultural Supply Chain, Cold Chain & Food Safety", pengalaman: "9 tahun" },
];

const DewanPakarSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-orange-500 font-semibold text-lg tracking-wider"
          >
            TIM PENYUSUN
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="gradient-text">Lead Architect & Dewan Pakar</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Disusun dengan standar McKinsey–Bain–BCG–BlackRock Level
          </p>
        </motion.div>

        {/* Lead Architect Card */}
        <motion.div
          className="glass rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/20 to-amber-500/20 blur-3xl" />
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <GraduationCap className="w-16 h-16 text-white" />
            </motion.div>
            
            <div className="text-center md:text-left flex-1">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-orange-500 text-sm font-semibold mb-4"
              >
                <Medal className="w-4 h-4" />
                Lead Architect & Principal Author
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                Prof. Wirono, S.E., M.Pd.
              </h3>
              <p className="text-xl text-red-500 mb-4">Profesor Senior Manajemen Strategis & Ekonomi Pembangunan</p>
              <p className="text-slate-800/70 max-w-2xl">
                Spesialisasi: Arsitektur Ekosistem Bisnis Nasional, Transformasi BUMN & Desain Kebijakan Logistik Terintegrasi. 
                <span className="text-orange-500 font-semibold"> Berpengalaman lebih dari 25 tahun.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <div className="text-3xl font-black text-slate-800">10</div>
            <div className="text-slate-800/70">Dewan Pakar Kelas Dunia</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Briefcase className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-3xl font-black text-slate-800">100+</div>
            <div className="text-slate-800/70">Tahun Pengalaman Gabungan</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <div className="text-3xl font-black text-slate-800">International</div>
            <div className="text-slate-800/70">Sertifikasi Terakreditasi</div>
          </div>
        </motion.div>

        {/* Dewan Pakar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {dewanPakar.map((pakar, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 card-hover group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {/* Number Badge */}
              <motion.div
                className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-sm font-black text-white">{pakar.no}</span>
              </motion.div>

              <div className="mt-4">
                <h4 className="text-lg font-bold text-slate-800 mb-1">Dewan Pakar {pakar.no}</h4>
                <p className="text-xs text-red-500 mb-2 font-medium">{pakar.gelar}</p>
                <p className="text-sm text-slate-600 mb-3">{pakar.bidang}</p>
                <div className="flex items-center gap-2 text-xs text-orange-500">
                  <Clock className="w-3 h-3" />
                  {pakar.pengalaman}
                </div>
              </div>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>

        {/* Dedication Quote */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <BookOpen className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <p className="text-lg md:text-xl text-slate-800/80 italic leading-relaxed">
              "Didedikasikan untuk transformasi <span className="text-orange-500 font-semibold">287,6 juta kehidupan Indonesia</span> melalui orkestrasi logistik terbesar dalam sejarah bangsa."
            </p>
            <div className="mt-4 text-sm text-slate-800/50">
              Dokumen Strategis Konfidensial | 2025 – 2045
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============== FOOTER ==============
const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-red-100 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <motion.h3
              className="text-3xl font-black gradient-text mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              POS INDONESIA
            </motion.h3>
            <p className="text-slate-600 mb-4">
              Super Holding Logistik Nasional — Transformasi menuju Raksasa Logistik Asia 2045
            </p>
            <div className="flex items-center gap-4">
              <motion.div
                className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Globe className="w-5 h-5 text-red-500" />
              </motion.div>
              <motion.div
                className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Package className="w-5 h-5 text-orange-500" />
              </motion.div>
              <motion.div
                className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Leaf className="w-5 h-5 text-emerald-400" />
              </motion.div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4">8 Pilar Bisnis</h4>
            <ul className="space-y-2 text-slate-800/70">
              <li className="hover:text-red-500 transition-colors cursor-pointer">POS Darat</li>
              <li className="hover:text-red-500 transition-colors cursor-pointer">POS Udara</li>
              <li className="hover:text-red-500 transition-colors cursor-pointer">POS Laut</li>
              <li className="hover:text-red-500 transition-colors cursor-pointer">POS Digital</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4">Informasi</h4>
            <ul className="space-y-2 text-slate-800/70">
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Est. 26 Agustus 1746
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Jakarta, Indonesia
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                24.000+ Karyawan
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-100 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 PT POS Indonesia Holdings. Mega Blueprint 2025-2045.
            <br />
            <span className="text-orange-500">Dari Abad ke Abad, Dari Hati ke Hati</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============== MAIN PAGE ==============
export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <ParticlesBackground />
      
      {/* Hero */}
      <HeroSection />
      <div className="section-divider" />
      
      {/* Executive Summary */}
      <ExecutiveSummarySection />
      <div className="section-divider" />
      
      {/* Ekosistem BUMN Terintegrasi */}
      <EkosistemBUMNSection />
      <div className="section-divider" />
      
      {/* KDMP & N-LOS */}
      <KDMPNLOSSection />
      <div className="section-divider" />
      
      {/* Diagnosis & Kompetitor */}
      <DiagnosisSection />
      <div className="section-divider" />
      
      {/* Heritage Timeline */}
      <HeritageTimeline />
      <div className="section-divider" />
      
      {/* Heritage Advantage - 5 Dimensi */}
      <HeritageAdvantageSection />
      <div className="section-divider" />
      
      {/* 8 Pilar Super Holding */}
      <PillarsSection />
      <div className="section-divider" />
      
      {/* Vision 2045 */}
      <VisionSection />
      <div className="section-divider" />
      
      {/* Revenue Streams */}
      <RevenueStreamsSection />
      <div className="section-divider" />
      
      {/* Roadmap */}
      <RoadmapSection />
      <div className="section-divider" />
      
      {/* Technology Stack */}
      <TechnologySection />
      <div className="section-divider" />
      
      {/* Global Expansion */}
      <GlobalExpansionSection />
      <div className="section-divider" />
      
      {/* SDM & Budaya */}
      <SDMBudayaSection />
      <div className="section-divider" />
      
      {/* Green Logistics */}
      <GreenLogisticsSection />
      <div className="section-divider" />
      
      {/* Social Impact */}
      <SocialImpactSection />
      <div className="section-divider" />
      
      {/* 10 Killer Moves */}
      <KillerMovesSection />
      <div className="section-divider" />
      
      {/* Dewan Pakar */}
      <DewanPakarSection />
      
      <Footer />
    </main>
  );
}
