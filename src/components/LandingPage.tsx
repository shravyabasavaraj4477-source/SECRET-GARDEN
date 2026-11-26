import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { DEPARTMENTS, HERO_GARDEN_IMAGE } from '../data/departments';
import { BotanicalImage } from './BotanicalImage';
import { AnimatedButterfly, BotanicalLeafSprig } from './BotanicalAtmosphere';

interface LandingPageProps {
  onEnterGarden: () => void;
  onOpenHowToPlay: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterGarden,
  onOpenHowToPlay,
}) => {
  return (
    <div className="relative z-10 min-h-screen flex flex-col justify-between bg-[#FFF9F0]">
      {/* Top quiet header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-between gap-8">
        <span className="font-display text-xl font-semibold tracking-tight text-[#344B38] whitespace-nowrap shrink-0">
          Secret Garden
        </span>
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="text-sm font-medium text-[#344B38]/80 hover:text-[#344B38] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How to Play
          </button>
          <button
            type="button"
            onClick={onEnterGarden}
            className="px-4 py-2 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#27392A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Enter Garden
          </button>
        </div>
      </header>

      {/* Hero Split & Central Conservatory */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Narrative & CTA Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <BotanicalLeafSprig className="w-24 h-8 mb-3 opacity-85" />
            <p className="text-sm font-medium text-[#667855] tracking-wide">
              Every Flower Has a Time. Every Garden Has a Story.
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#344B38] leading-[1.08]">
              Secret Garden
            </h1>
            <p className="mt-2 font-display italic text-xl sm:text-2xl text-[#667855]">
              The Mystery of the Lost Bloom
            </p>

            <div className="mt-6 space-y-3 text-base text-[#344B38]/85 leading-relaxed max-w-prose">
              <p>
                Five gardens. Countless blooming records. One missing timeline.
              </p>
              <p>
                Each garden holds a piece of the story. Your mission is to bring
                every bloom into its rightful place.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onEnterGarden}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] active:scale-[0.99] rounded-xl shadow-sm transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344B38]"
              >
                Enter the Garden
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenHowToPlay}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm sm:text-base font-medium text-[#344B38] bg-[#FAF2E4] hover:bg-[#F3E7D3] border border-[#344B38]/15 rounded-xl transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344B38]"
              >
                <BookOpen className="w-4 h-4" />
                How to Play
              </button>
            </div>
          </motion.div>

          {/* Central Magical Conservatory Artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#344B38]/12 bg-[#FAF2E4] shadow-md">
              <BotanicalImage
                src={HERO_GARDEN_IMAGE}
                alt="An enchanted botanical garden archway framed by roses, sunflowers, tulips, cherry blossoms, and ferns"
                blendOnCream={false}
                className="w-full aspect-[16/10] object-cover"
              />
              {/* Subtle animated butterflies perched in flight over the conservatory */}
              <div
                aria-hidden="true"
                className="animate-butterfly absolute top-6 left-8 pointer-events-none"
                style={{ '--bf-duration': '9s', '--bf-delay': '0s' } as React.CSSProperties}
              >
                <AnimatedButterfly color="#D88F9A" size={28} />
              </div>
              <div
                aria-hidden="true"
                className="animate-butterfly absolute bottom-10 right-10 pointer-events-none"
                style={{ '--bf-duration': '11s', '--bf-delay': '-3s' } as React.CSSProperties}
              >
                <AnimatedButterfly color="#E7BC52" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Five Botanical Department Plates — Department Name larger than Flower Name */}
        <section aria-label="The Five Flower Departments" className="mt-12 lg:mt-16 pt-8 border-t border-[#344B38]/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#344B38]">
                The Five Botanical Research Departments
              </h2>
              <p className="text-sm text-[#344B38]/70 mt-1">
                Each department maintains its own blooming record chain waiting to be harmonized.
              </p>
            </div>
            <p className="text-xs font-mono text-[#667855]">
              Tie-break order: CIVIL · CS · CYBER · MATHS · MECH
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {DEPARTMENTS.map((dept, index) => (
              <motion.button
                key={dept.code}
                type="button"
                onClick={onEnterGarden}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="group text-left rounded-xl bg-[#FFFDF9] border border-[#344B38]/12 hover:border-[#8A9A75] p-4 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344B38]"
              >
                <div
                  className="w-full aspect-square rounded-lg overflow-hidden mb-3 flex items-center justify-center p-2"
                  style={{ backgroundColor: dept.tintBg }}
                >
                  <BotanicalImage
                    src={dept.imageUrl}
                    alt={`${dept.departmentName} illustrated by ${dept.flowerName}`}
                    accentColor={dept.accentColor}
                    animate="sway"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Department Name prominently LARGER than Flower Name */}
                <h3 className="font-display text-lg font-semibold text-[#344B38] leading-snug">
                  {dept.shortDepartmentName}
                </h3>
                <p className="mt-1 text-xs text-[#344B38]/70">
                  {dept.gardenName} · <span className="font-mono font-medium">{dept.code}</span>
                </p>
              </motion.button>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-[#344B38]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#344B38]/65">
        <span>Secret Garden · Botanical Print Queue Consolidation System</span>
        <span>Linked Lists · Binary Min-Heap · K-Way Merge</span>
      </footer>
    </div>
  );
};
