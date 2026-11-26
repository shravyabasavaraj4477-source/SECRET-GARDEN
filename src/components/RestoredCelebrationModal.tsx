import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  DEPARTMENT_BY_CODE,
  DEPARTMENTS,
  HERO_GARDEN_IMAGE,
} from '../data/departments';
import { MergeExecutionResult } from '../dsa/kWayMerge';
import { BotanicalImage } from './BotanicalImage';
import { AnimatedButterfly, BotanicalAtmosphere } from './BotanicalAtmosphere';

interface RestoredCelebrationModalProps {
  isOpen: boolean;
  mergeResult: MergeExecutionResult | null;
  onExplore: () => void;
}

export const RestoredCelebrationModal: React.FC<RestoredCelebrationModalProps> = ({
  isOpen,
  mergeResult,
  onExplore,
}) => {
  if (!isOpen || !mergeResult || !mergeResult.verification.passed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restored-garden-heading"
      className="fixed inset-0 z-50 bg-[#FFF9F0] overflow-y-auto"
    >
      <BotanicalAtmosphere intensity="celebration" />

      <div className="relative z-10 min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center items-center text-center">
        {/* Animated butterflies */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <div
            className="animate-butterfly"
            style={{ '--bf-duration': '8s', '--bf-delay': '0s' } as React.CSSProperties}
          >
            <AnimatedButterfly color="#D88F9A" size={32} />
          </div>
          <div
            className="animate-butterfly"
            style={{ '--bf-duration': '9.5s', '--bf-delay': '-2s' } as React.CSSProperties}
          >
            <AnimatedButterfly color="#E7BC52" size={28} />
          </div>
          <div
            className="animate-butterfly"
            style={{ '--bf-duration': '8.8s', '--bf-delay': '-4s' } as React.CSSProperties}
          >
            <AnimatedButterfly color="#B9A4D4" size={30} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-3"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#4E7A52]">
            <CheckCircle2 className="w-4 h-4" />
            Verification Passed · All Blooms Accounted For
          </p>
          <h1
            id="restored-garden-heading"
            className="font-display text-4xl sm:text-5xl font-bold text-[#344B38] tracking-tight"
          >
            The Secret Garden Is Restored!
          </h1>
          <p className="font-display italic text-xl text-[#667855]">
            Every bloom has found its rightful place.
          </p>
        </motion.div>

        {/* Central Blooming Conservatory + Five Blooming Plates */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-7 w-full max-w-3xl rounded-2xl overflow-hidden border border-[#344B38]/12 shadow-md bg-[#FAF2E4]"
        >
          <BotanicalImage
            src={HERO_GARDEN_IMAGE}
            alt="The restored Secret Garden blooming in full morning sunlight"
            blendOnCream={false}
            className="w-full aspect-[16/8] object-cover"
          />
        </motion.div>

        {/* Five Blooming Flowers Row */}
        <div className="mt-6 grid grid-cols-5 gap-3 w-full max-w-2xl">
          {DEPARTMENTS.map((dept, i) => (
            <motion.div
              key={dept.code}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.08, duration: 0.45 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden p-1.5 border border-[#344B38]/10"
                style={{ backgroundColor: dept.tintBg }}
              >
                <BotanicalImage
                  src={dept.imageUrl}
                  alt={dept.departmentName}
                  accentColor={dept.accentColor}
                  animate="sway"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="mt-1.5 text-xs font-semibold text-[#344B38] leading-tight">
                {dept.shortDepartmentName}
              </p>
              <p className="text-[11px] text-[#344B38]/65">{dept.flowerName}</p>
            </motion.div>
          ))}
        </div>

        {/* Verified Restoration Metrics */}
        <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          <div className="rounded-xl bg-[#FFFDF9] border border-[#344B38]/12 p-4">
            <p className="text-xs text-[#344B38]/65">Gardens Synchronized</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#344B38] tabular-nums">
              {mergeResult.metrics.totalDepartments}
            </p>
          </div>
          <div className="rounded-xl bg-[#FFFDF9] border border-[#344B38]/12 p-4">
            <p className="text-xs text-[#344B38]/65">Records Restored</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#344B38] tabular-nums">
              {mergeResult.metrics.totalRecordsMerged.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-[#FFFDF9] border border-[#344B38]/12 p-4">
            <p className="text-xs text-[#344B38]/65">Missing Records</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#4E7A52] tabular-nums">
              {mergeResult.verification.missingCount}
            </p>
          </div>
          <div className="rounded-xl bg-[#FFFDF9] border border-[#344B38]/12 p-4">
            <p className="text-xs text-[#344B38]/65">Verification</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#4E7A52]">
              PASSED
            </p>
          </div>
        </div>

        {/* Master Timeline Preview Strip */}
        {mergeResult.mergedRecords.length > 0 && (
          <div className="mt-6 w-full max-w-3xl rounded-xl bg-[#FFFDF9] border border-[#344B38]/12 p-4 text-left">
            <p className="text-xs font-medium text-[#344B38]/65 mb-2">
              Restored Master Bloom Sequence
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {mergeResult.mergedRecords.slice(0, 14).map((rec, idx) => {
                const dept = DEPARTMENT_BY_CODE[rec.departmentCode];
                return (
                  <React.Fragment key={rec.uid}>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#344B38] bg-[#FFF9F0] border border-[#344B38]/12 rounded-lg px-2 py-1 tabular-nums">
                      <img
                        src={dept?.imageUrl}
                        alt=""
                        className="w-4 h-4 object-contain mix-blend-multiply"
                      />
                      <strong>{rec.jobId}</strong>
                      <span className="text-[#344B38]/60">t={rec.timestamp}</span>
                    </span>
                    {idx < Math.min(mergeResult.mergedRecords.length, 14) - 1 && (
                      <span aria-hidden="true" className="text-xs text-[#8A9A75]">
                        →
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
              {mergeResult.mergedRecords.length > 14 && (
                <span className="text-xs text-[#344B38]/65">
                  +{mergeResult.mergedRecords.length - 14} more blooms
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Explore Your Restored Garden
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
