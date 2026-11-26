import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  FastForward,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  SkipForward,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  BloomInputRecord,
  DEPARTMENT_BY_CODE,
  DEPARTMENTS,
  DepartmentCode,
} from '../data/departments';
import {
  MergeExecutionResult,
  QueueValidationResult,
  UNSORTED_QUEUE_ERROR,
} from '../dsa/kWayMerge';
import { BotanicalImage } from './BotanicalImage';
import { BotanicalLeafSprig } from './BotanicalAtmosphere';

interface BloomTimelineViewProps {
  queues: Record<DepartmentCode, BloomInputRecord[]>;
  validations: Record<DepartmentCode, QueueValidationResult>;
  mergeResult: MergeExecutionResult | null;
  syncRunId: number;
  isDirty: boolean;
  onSynchronize: () => void;
  onOpenDepartment: (dept: DepartmentCode) => void;
  onAnimationFinished: () => void;
  onShowCelebration: () => void;
}

export const BloomTimelineView: React.FC<BloomTimelineViewProps> = ({
  queues,
  validations,
  mergeResult,
  syncRunId,
  isDirty,
  onSynchronize,
  onOpenDepartment,
  onAnimationFinished,
  onShowCelebration,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState<number>(1150);
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [celebrationFiredForRun, setCelebrationFiredForRun] = useState<number>(0);

  const steps = mergeResult?.steps ?? [];
  const totalSteps = steps.length;
  const currentStep = totalSteps > 0 ? steps[Math.min(stepIndex, totalSteps - 1)] : null;
  const isAtEnd = totalSteps > 0 && stepIndex >= totalSteps - 1;

  // Reset & auto-play whenever a fresh sync run completes
  useEffect(() => {
    if (syncRunId === 0 || !mergeResult?.success) return;
    if (mergeResult.steps.length <= 1) {
      setStepIndex(Math.max(0, mergeResult.steps.length - 1));
      setIsPlaying(false);
      if (celebrationFiredForRun !== syncRunId) {
        setCelebrationFiredForRun(syncRunId);
        onAnimationFinished();
      }
      return;
    }
    setStepIndex(0);
    setIsPlaying(true);
  }, [syncRunId, mergeResult]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying || totalSteps === 0) return;
    if (stepIndex >= totalSteps - 1) {
      setIsPlaying(false);
      if (celebrationFiredForRun !== syncRunId && mergeResult?.verification.passed) {
        setCelebrationFiredForRun(syncRunId);
        const timer = window.setTimeout(() => {
          onAnimationFinished();
        }, 450);
        return () => window.clearTimeout(timer);
      }
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
    }, speedMs);

    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, totalSteps, speedMs, syncRunId, celebrationFiredForRun, mergeResult, onAnimationFinished]);

  const sharedTimestamps = useMemo(() => {
    const set = new Set<number>();
    if (!mergeResult) return set;
    for (const group of mergeResult.duplicateGroups) {
      set.add(group.timestamp);
    }
    return set;
  }, [mergeResult]);

  const unsortedDepts = DEPARTMENTS.filter((d) => !validations[d.code].valid);

  const handleRestart = () => {
    setStepIndex(0);
    setIsPlaying(true);
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, Math.max(0, totalSteps - 1)));
  };

  const handleSkipAnimation = () => {
    setIsPlaying(false);
    const lastIdx = Math.max(0, totalSteps - 1);
    setStepIndex(lastIdx);
    if (celebrationFiredForRun !== syncRunId && mergeResult?.verification.passed) {
      setCelebrationFiredForRun(syncRunId);
      onAnimationFinished();
    }
  };

  const progressPct =
    totalSteps > 1 ? Math.round((stepIndex / (totalSteps - 1)) * 100) : mergeResult?.success ? 100 : 0;

  return (
    <div className="space-y-10">
      {/* Header & Synchronize CTA */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <BotanicalLeafSprig className="w-24 h-7 mb-2 opacity-80" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#344B38]">
            Restore the Master Bloom Timeline
          </h1>
          <p className="mt-2 text-base text-[#344B38]/75 max-w-2xl">
            Each garden has its own blooming schedule. Let&apos;s bring them together
            into one beautiful timeline using linked lists and a central Min-Heap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSynchronize}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] active:scale-[0.99] rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Synchronize All Gardens
          </button>
          {mergeResult?.success && mergeResult.verification.passed && !isDirty && (
            <button
              type="button"
              onClick={onShowCelebration}
              className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-[#344B38] bg-[#FAF2E4] hover:bg-[#EFE2CB] border border-[#344B38]/15 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8A9A75]" />
              Restored View
            </button>
          )}
        </div>
      </section>

      {/* Unsorted Input Error Alert */}
      {(unsortedDepts.length > 0 || (mergeResult && !mergeResult.success)) && (
        <div
          role="alert"
          className="rounded-xl bg-[#FEF4F2] border border-[#C97B72]/45 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#A43B32] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#7F2922]">
                {UNSORTED_QUEUE_ERROR}
              </p>
              <p className="text-xs text-[#7F2922]/85 mt-1">
                Unsorted records detected in:{' '}
                {unsortedDepts.map((d) => `${d.departmentName} (${d.gardenName})`).join(', ')}.
                Individual queues are validated as-is and never silently sorted.
              </p>
            </div>
          </div>
          {unsortedDepts[0] && (
            <button
              type="button"
              onClick={() => onOpenDepartment(unsortedDepts[0].code)}
              className="px-4 py-2 text-xs font-semibold text-[#7F2922] bg-white border border-[#C97B72]/40 rounded-lg hover:bg-[#FCEBE8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Open {unsortedDepts[0].shortDepartmentName}
            </button>
          )}
        </div>
      )}

      {/* Dirty state reminder if user added records since last sync */}
      {isDirty && mergeResult?.success && unsortedDepts.length === 0 && (
        <div className="rounded-xl bg-[#FDF8EA] border border-[#E7BC52]/55 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[#5E4815]">
          <span>
            You have updated garden records since the last synchronization. Click Synchronize All Gardens to refresh the timeline.
          </span>
          <button
            type="button"
            onClick={onSynchronize}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Sync Now
          </button>
        </div>
      )}

      {/* Empty prompt state before first sync */}
      {!mergeResult && unsortedDepts.length === 0 && (
        <section className="rounded-2xl bg-[#FFFDF9] border border-dashed border-[#344B38]/20 p-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-[#344B38]">
            Ready to Begin Synchronization
          </h2>
          <p className="mt-2 text-sm text-[#344B38]/75 max-w-lg mx-auto">
            Click <strong>Synchronize All Gardens</strong> above to watch the five department linked lists feed into the central Min-Heap and bloom into one ordered timeline.
          </p>
        </section>
      )}

      {/* LIVE BLOOM ANIMATION STAGE */}
      {mergeResult?.success && currentStep && (
        <section aria-label="Live Bloom Synchronization" className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#344B38]">
                Live Bloom Synchronization
              </h2>
              <p className="text-sm text-[#344B38]/70 mt-1">
                Every step below reflects real Linked List pointer advances and Binary Min-Heap extractions.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#344B38]/75 tabular-nums">
              <span>
                Step {Math.min(stepIndex + 1, totalSteps)} / {totalSteps}
              </span>
              <span aria-hidden="true">·</span>
              <span>Heap Comparisons: {currentStep.comparisonsSoFar}</span>
            </div>
          </div>

          {/* Progress Bar + Playback Controls */}
          <div className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-5 space-y-4">
            <div className="w-full h-2 rounded-full bg-[#344B38]/10 overflow-hidden">
              <div
                className="h-full bg-[#8A9A75] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {isPlaying ? (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-lg transition-colors cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (isAtEnd) {
                        setStepIndex(0);
                      }
                      setIsPlaying(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-lg transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    {isAtEnd ? 'Replay' : 'Resume'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isAtEnd}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#344B38] bg-[#FAF2E4] hover:bg-[#EFE2CB] disabled:opacity-45 border border-[#344B38]/15 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-4 h-4" />
                  Next Step
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#344B38] bg-[#FAF2E4] hover:bg-[#EFE2CB] border border-[#344B38]/15 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart
                </button>

                <button
                  type="button"
                  onClick={handleSkipAnimation}
                  disabled={isAtEnd}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#344B38] bg-white hover:bg-[#FAF2E4] disabled:opacity-45 border border-[#344B38]/15 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <FastForward className="w-4 h-4" />
                  Skip Animation
                </button>
              </div>

              {/* Speed segmented control */}
              <div className="flex items-center gap-1 p-1 bg-[#FAF2E4] rounded-lg border border-[#344B38]/10 text-xs">
                {[
                  { label: 'Slow', ms: 1800 },
                  { label: 'Normal', ms: 1150 },
                  { label: 'Fast', ms: 500 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSpeedMs(opt.ms)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      speedMs === opt.ms
                        ? 'bg-[#344B38] text-[#FFF9F0]'
                        : 'text-[#344B38]/75 hover:text-[#344B38]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Two-Zone Sandbox Stage: 5 Linked Lists + Central Min-Heap + Step Narration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Zone: Five Department Linked Lists */}
            <div className="lg:col-span-7 rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-5 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#344B38]/10">
                <h3 className="font-display text-lg font-semibold text-[#344B38]">
                  Five Garden Linked Lists
                </h3>
                <span className="text-xs text-[#344B38]/65">
                  Highlighted node = current head in Min-Heap
                </span>
              </div>

              {DEPARTMENTS.map((dept) => {
                const records = queues[dept.code];
                const pointerIdx = currentStep.departmentPointers[dept.code] ?? 0;
                const justSelected =
                  currentStep.selectedNode?.departmentCode === dept.code;

                return (
                  <div
                    key={dept.code}
                    className={`rounded-xl border p-3.5 transition-colors ${
                      justSelected
                        ? 'bg-[#F4F8F2] border-[#8A9A75]'
                        : 'bg-[#FFF9F0]/65 border-[#344B38]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-lg overflow-hidden shrink-0 p-0.5"
                          style={{ backgroundColor: dept.tintBg }}
                        >
                          <BotanicalImage
                            src={dept.imageUrl}
                            alt={dept.departmentName}
                            accentColor={dept.accentColor}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-base font-bold text-[#344B38] leading-tight truncate">
                            {dept.shortDepartmentName}
                          </p>
                          <p className="text-xs text-[#344B38]/65">
                            {dept.gardenName} · <span className="font-mono">{dept.code}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#344B38]/65 tabular-nums shrink-0">
                        {Math.min(pointerIdx, records.length)}/{records.length} merged
                      </span>
                    </div>

                    <div className="overflow-x-auto pb-1">
                      <div className="inline-flex items-center gap-1.5 min-w-max">
                        {records.length === 0 ? (
                          <span className="text-xs italic text-[#344B38]/50">
                            Empty garden (NULL)
                          </span>
                        ) : (
                          records.map((rec, idx) => {
                            const isMerged = idx < pointerIdx;
                            const isActiveHead = idx === pointerIdx && !isAtEnd;
                            const wasJustExtracted =
                              currentStep.selectedNode?.uid === rec.uid;

                            return (
                              <React.Fragment key={rec.uid}>
                                <motion.div
                                  layout
                                  animate={{
                                    scale: wasJustExtracted ? 1.06 : 1,
                                    opacity: isMerged && !wasJustExtracted ? 0.35 : 1,
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs tabular-nums ${
                                    wasJustExtracted
                                      ? 'bg-[#344B38] text-[#FFF9F0] border-[#344B38] shadow-sm'
                                      : isActiveHead
                                      ? 'bg-white text-[#344B38] border-[#8A9A75] ring-2 ring-[#8A9A75]/25 font-semibold'
                                      : 'bg-white/75 text-[#344B38]/80 border-[#344B38]/12'
                                  }`}
                                >
                                  <span>{rec.jobId}</span>
                                  <span className="opacity-70 ml-1">t={rec.timestamp}</span>
                                </motion.div>
                                {idx < records.length - 1 && (
                                  <span aria-hidden="true" className="text-xs text-[#8A9A75]">
                                    →
                                  </span>
                                )}
                              </React.Fragment>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Zone: Central Magical Min-Heap Sanctuary + Plain Narration */}
            <div className="lg:col-span-5 space-y-5">
              {/* Central Min-Heap Sanctuary */}
              <div className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#344B38]/10">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#344B38]">
                      Central Min-Heap Sanctuary
                    </h3>
                    <p className="text-xs text-[#344B38]/65">
                      Holds at most K = 5 active flower heads (O(K) space)
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#344B38] tabular-nums">
                    Size: {currentStep.heapAfter.length}
                  </span>
                </div>

                {/* Selected Bloom Spotlight */}
                <AnimatePresence mode="wait">
                  {currentStep.selectedNode ? (
                    <motion.div
                      key={currentStep.selectedNode.uid}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 rounded-xl bg-[#344B38] text-[#FFF9F0] p-4 flex items-center gap-3.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#FFF9F0] p-1 shrink-0 overflow-hidden">
                        <BotanicalImage
                          src={
                            DEPARTMENT_BY_CODE[currentStep.selectedNode.departmentCode]
                              ?.imageUrl ?? ''
                          }
                          alt={currentStep.selectedNode.departmentCode}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#C8D5BA]">
                          Earliest Bloom Selected → Master Timeline
                        </p>
                        <p className="font-display text-lg font-bold leading-snug">
                          {DEPARTMENT_BY_CODE[currentStep.selectedNode.departmentCode]
                            ?.shortDepartmentName ?? currentStep.selectedNode.departmentCode}
                        </p>
                        <p className="text-xs font-mono text-[#FFF9F0]/85 tabular-nums">
                          Job {currentStep.selectedNode.jobId} · Time{' '}
                          {currentStep.selectedNode.timestamp} ·{' '}
                          {DEPARTMENT_BY_CODE[currentStep.selectedNode.departmentCode]
                            ?.gardenName ?? ''}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`phase-${currentStep.phase}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 rounded-xl bg-[#FAF2E4] border border-[#344B38]/10 p-4 text-sm text-[#344B38]"
                    >
                      {currentStep.headline}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active Heap Nodes */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-[#344B38]/65 mb-2.5">
                    Currently Waiting in the Min-Heap
                  </p>
                  {currentStep.heapAfter.length === 0 ? (
                    <p className="text-xs italic text-[#344B38]/55 py-3 text-center rounded-lg bg-[#FFF9F0]">
                      Min-Heap is empty — all blooms have been placed in order.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentStep.heapAfter.map((node, idx) => {
                        const dept = DEPARTMENT_BY_CODE[node.departmentCode];
                        const isRoot = idx === 0;
                        const isNewlyInserted =
                          currentStep.insertedNextNode?.uid === node.uid;
                        return (
                          <motion.div
                            key={node.uid}
                            layout
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`rounded-xl border p-2.5 flex items-center gap-2.5 ${
                              isRoot
                                ? 'bg-[#F4F8F2] border-[#8A9A75]'
                                : 'bg-[#FFF9F0] border-[#344B38]/12'
                            }`}
                          >
                            <div
                              className="w-9 h-9 rounded-lg overflow-hidden shrink-0 p-0.5"
                              style={{ backgroundColor: dept?.tintBg ?? '#FAF2E4' }}
                            >
                              <BotanicalImage
                                src={dept?.imageUrl ?? ''}
                                alt={dept?.flowerName ?? node.departmentCode}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#344B38] truncate">
                                {dept?.shortDepartmentName ?? node.departmentCode}
                              </p>
                              <p className="font-mono text-xs text-[#344B38]/80 tabular-nums">
                                {node.jobId} · t={node.timestamp}
                              </p>
                              <p className="text-[11px] text-[#667855]">
                                {isRoot
                                  ? 'Next earliest (Heap Root)'
                                  : isNewlyInserted
                                  ? 'Just entered heap'
                                  : dept?.flowerName ?? node.departmentCode}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Plain-Language Step Narration */}
              <div className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-5">
                <h3 className="font-display text-lg font-semibold text-[#344B38]">
                  What Is Happening Now
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-[#344B38]/85 leading-relaxed">
                  {currentStep.narrationLines.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-[#8A9A75] font-bold">
                        ·
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Live Growing Timeline Strip during playback */}
          {!isAtEnd && currentStep.timelineSoFar.length > 0 && (
            <div className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-5">
              <p className="text-xs font-medium text-[#344B38]/65 mb-3">
                Master Timeline Growing Live ({currentStep.timelineSoFar.length} of{' '}
                {mergeResult.mergedRecords.length})
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {currentStep.timelineSoFar.map((node, idx) => {
                  const dept = DEPARTMENT_BY_CODE[node.departmentCode];
                  return (
                    <React.Fragment key={node.uid}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#FFF9F0] border border-[#344B38]/15 px-2.5 py-1.5 text-xs font-mono tabular-nums"
                      >
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0">
                          <BotanicalImage
                            src={dept?.imageUrl ?? ''}
                            alt={dept?.flowerName ?? node.departmentCode}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-semibold text-[#344B38]">{node.jobId}</span>
                        <span className="text-[#344B38]/60">t={node.timestamp}</span>
                      </motion.div>
                      {idx < currentStep.timelineSoFar.length - 1 && (
                        <span aria-hidden="true" className="text-[#8A9A75] text-xs">
                          →
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* BLOOMING TOGETHER — DUPLICATE BLOOM TIME DETECTOR */}
      {mergeResult?.success && (
        <section
          aria-label="Blooming Together — Duplicate Bloom Time Detector"
          className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-[#667855]">
                Duplicate Bloom Time Detector
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#344B38] mt-0.5">
                Blooming Together
              </h2>
            </div>
            <p className="text-xs font-mono text-[#344B38]/70">
              Alphabetical rule: CIVIL &lt; CS &lt; CYBER &lt; MATHS &lt; MECH
            </p>
          </div>

          {mergeResult.crossDepartmentConflicts.length === 0 ? (
            <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-5 text-sm text-[#344B38]/75">
              No cross-department blooming overlaps were found in this run. Try adding matching timestamps across two departments (or click <strong>Same-Time Demo</strong> on Home) to watch alphabetical tie-breaking in action.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#344B38]/80 leading-relaxed">
                When timestamps are equal, records are arranged according to department code in alphabetical order.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mergeResult.crossDepartmentConflicts.map((group) => (
                  <div
                    key={group.timestamp}
                    className="rounded-xl bg-[#FDF8EA]/75 border border-[#E7BC52]/55 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-[#344B38]">
                        {group.distinctDepartments.length === 2
                          ? 'Two gardens recorded a bloom at the same time!'
                          : `${group.distinctDepartments.length} gardens recorded a bloom at the same time!`}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-[#344B38] tabular-nums shrink-0">
                        Time {group.timestamp}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.records.map((rec, orderIdx) => {
                        const dept = DEPARTMENT_BY_CODE[rec.departmentCode];
                        return (
                          <div
                            key={rec.uid}
                            className="flex items-center justify-between gap-3 rounded-lg bg-[#FFFDF9] border border-[#344B38]/10 px-3 py-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="font-mono text-xs text-[#667855] tabular-nums">
                                {orderIdx + 1}.
                              </span>
                              <div className="w-7 h-7 rounded overflow-hidden shrink-0">
                                <BotanicalImage
                                  src={dept?.imageUrl ?? ''}
                                  alt={dept?.flowerName ?? rec.departmentCode}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#344B38] truncate">
                                  {dept?.shortDepartmentName ?? rec.departmentCode}
                                </p>
                                <p className="text-xs text-[#344B38]/65">
                                  {dept?.gardenName} ·{' '}
                                  <span className="font-mono">{rec.departmentCode}</span>
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-semibold text-[#344B38] tabular-nums shrink-0">
                              {rec.jobId}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* MASTER BLOOM TIMELINE */}
      {mergeResult?.success && (
        <section
          aria-label="Master Bloom Timeline"
          className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#667855]">Master Bloom Timeline</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#344B38] mt-0.5">
                Your Garden Is Back in Order!
              </h2>
              <p className="text-sm text-[#344B38]/70 mt-1">
                Generated directly from the merged singly linked list ({mergeResult.mergedRecords.length}{' '}
                {mergeResult.mergedRecords.length === 1 ? 'bloom' : 'blooms'}).
              </p>
            </div>

            {/* Interactive Layout Switch */}
            <div className="inline-flex items-center gap-1 p-1 bg-[#FAF2E4] rounded-lg border border-[#344B38]/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setLayoutMode('horizontal')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  layoutMode === 'horizontal'
                    ? 'bg-[#344B38] text-[#FFF9F0]'
                    : 'text-[#344B38]/75 hover:text-[#344B38]'
                }`}
              >
                Horizontal Path
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('vertical')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  layoutMode === 'vertical'
                    ? 'bg-[#344B38] text-[#FFF9F0]'
                    : 'text-[#344B38]/75 hover:text-[#344B38]'
                }`}
              >
                Vertical Chronicle
              </button>
            </div>
          </div>

          {mergeResult.mergedRecords.length === 0 ? (
            <div className="rounded-xl bg-[#FFF9F0] border border-dashed border-[#344B38]/20 p-8 text-center text-sm text-[#344B38]/70">
              All five gardens are currently empty — the merged master timeline contains 0 blooms.
            </div>
          ) : (
            <>
              {/* Compact Sequence Summary */}
              <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 px-4 py-3 overflow-x-auto">
                <p className="text-xs font-mono text-[#344B38] whitespace-nowrap tabular-nums">
                  {mergeResult.mergedRecords
                    .map((r) => `${r.jobId} (${r.departmentCode} · t=${r.timestamp})`)
                    .join('  →  ')}
                </p>
              </div>

              {layoutMode === 'horizontal' ? (
                <div className="overflow-x-auto pb-3">
                  <div className="inline-flex items-stretch gap-3 min-w-max">
                    {mergeResult.mergedRecords.map((node, index) => {
                      const dept = DEPARTMENT_BY_CODE[node.departmentCode];
                      const isShared = sharedTimestamps.has(node.timestamp);
                      return (
                        <React.Fragment key={node.uid}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.03, 0.4) }}
                            className={`w-52 rounded-xl border p-4 flex flex-col justify-between ${
                              isShared
                                ? 'bg-[#FDF8EA]/80 border-[#E7BC52]'
                                : 'bg-[#FFF9F0] border-[#344B38]/12'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums text-[#344B38]/65">
                              <span>#{index + 1}</span>
                              <span className="font-semibold text-[#344B38]">
                                Time {node.timestamp}
                              </span>
                            </div>

                            <div
                              className="w-20 h-20 mx-auto my-3 rounded-xl overflow-hidden p-1.5"
                              style={{ backgroundColor: dept?.tintBg ?? '#FAF2E4' }}
                            >
                              <BotanicalImage
                                src={dept?.imageUrl ?? ''}
                                alt={`${dept?.departmentName ?? node.departmentCode}`}
                                accentColor={dept?.accentColor}
                                animate="sway"
                                className="w-full h-full object-contain"
                              />
                            </div>

                            <div className="text-center">
                              <p className="font-mono text-sm font-bold text-[#344B38]">
                                {node.jobId}
                              </p>
                              {/* Department Name LARGER than Flower Name */}
                              <p className="mt-1 font-display text-base font-bold text-[#344B38] leading-snug">
                                {dept?.shortDepartmentName ?? node.departmentCode}
                              </p>
                              <p className="text-xs text-[#344B38]/65">
                                {dept?.gardenName} · {node.departmentCode}
                              </p>
                              {isShared && (
                                <p className="mt-1.5 text-[11px] font-medium text-[#8B6214]">
                                  Blooming Together
                                </p>
                              )}
                            </div>
                          </motion.div>

                          {index < mergeResult.mergedRecords.length - 1 && (
                            <div className="flex items-center text-[#8A9A75] font-mono text-sm">
                              →
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <ol className="space-y-3">
                  {mergeResult.mergedRecords.map((node, index) => {
                    const dept = DEPARTMENT_BY_CODE[node.departmentCode];
                    const isShared = sharedTimestamps.has(node.timestamp);
                    return (
                      <li
                        key={node.uid}
                        className={`rounded-xl border p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 ${
                          isShared
                            ? 'bg-[#FDF8EA]/80 border-[#E7BC52]'
                            : 'bg-[#FFF9F0] border-[#344B38]/12'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="font-mono text-xs text-[#344B38]/55 w-7 tabular-nums shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div
                            className="w-12 h-12 rounded-xl overflow-hidden p-1 shrink-0"
                            style={{ backgroundColor: dept?.tintBg ?? '#FAF2E4' }}
                          >
                            <BotanicalImage
                              src={dept?.imageUrl ?? ''}
                              alt={dept?.departmentName ?? node.departmentCode}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-lg font-bold text-[#344B38] leading-snug">
                              {dept?.departmentName ?? node.departmentCode}
                            </p>
                            <p className="text-xs text-[#344B38]/70">
                              {dept?.gardenName} · Code:{' '}
                              <span className="font-mono">{node.departmentCode}</span>
                              {isShared && ' · Blooming Together'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 font-mono text-sm tabular-nums shrink-0">
                          <div>
                            <span className="text-xs text-[#344B38]/55 block">Job ID</span>
                            <span className="font-semibold text-[#344B38]">{node.jobId}</span>
                          </div>
                          <div>
                            <span className="text-xs text-[#344B38]/55 block">Blooming Time</span>
                            <span className="font-semibold text-[#344B38]">
                              {node.timestamp}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </>
          )}
        </section>
      )}

      {/* GARDEN HEALTH CHECK — VERIFICATION */}
      {mergeResult?.success && (
        <section
          aria-label="Garden Health Check — Verification"
          className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#344B38]/10">
            <div>
              <p className="text-xs font-medium text-[#667855]">Garden Health Check</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#344B38] mt-0.5">
                {mergeResult.verification.passed
                  ? 'All Blooms Accounted For!'
                  : 'Garden Verification Failed'}
              </h2>
              <p
                className={`mt-1 text-sm font-semibold ${
                  mergeResult.verification.passed ? 'text-[#4E7A52]' : 'text-[#A43B32]'
                }`}
              >
                {mergeResult.verification.passed
                  ? 'GARDEN RESTORATION SUCCESSFUL.'
                  : mergeResult.verification.failureSummary}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold">
              {mergeResult.verification.passed ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-[#4E7A52]" />
                  <span className="text-[#4E7A52]">Verification Passed</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-[#A43B32]" />
                  <span className="text-[#A43B32]">Verification Failed</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {mergeResult.verification.checks.map((check) => (
              <div
                key={check.id}
                className={`rounded-xl border p-4 flex items-start gap-3 ${
                  check.passed
                    ? 'bg-[#F5F9F4] border-[#8A9A75]/35'
                    : 'bg-[#FEF4F2] border-[#C97B72]/45'
                }`}
              >
                {check.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#4E7A52] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#A43B32] shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold text-[#344B38]">{check.label}</p>
                  <p className="text-xs text-[#344B38]/75 mt-0.5 tabular-nums">
                    {check.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
