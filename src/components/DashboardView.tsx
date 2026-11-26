import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  BloomInputRecord,
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

interface DashboardViewProps {
  queues: Record<DepartmentCode, BloomInputRecord[]>;
  validations: Record<DepartmentCode, QueueValidationResult>;
  mergeResult: MergeExecutionResult | null;
  isDirty: boolean;
  onAddRecord: (dept: DepartmentCode, jobId: string, timestamp: number) => void;
  onOpenDepartment: (dept: DepartmentCode) => void;
  onSynchronize: () => void;
  onLoadSample: () => void;
  onLoadConflictDemo: () => void;
  onClearAll: () => void;
  onGoToTimeline: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  queues,
  validations,
  mergeResult,
  isDirty,
  onAddRecord,
  onOpenDepartment,
  onSynchronize,
  onLoadSample,
  onLoadConflictDemo,
  onClearAll,
  onGoToTimeline,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentCode>('CS');
  const [jobId, setJobId] = useState('');
  const [timestampInput, setTimestampInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const totalBlooms = DEPARTMENTS.reduce(
    (sum, dept) => sum + queues[dept.code].length,
    0
  );

  const isRestored =
    Boolean(mergeResult?.success && mergeResult.verification.passed) && !isDirty;
  const organizedBlooms = isRestored
    ? mergeResult?.metrics.totalRecordsMerged ?? 0
    : 0;

  const unsortedDepts = DEPARTMENTS.filter((d) => !validations[d.code].valid);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = jobId.trim();
    const parsedTime = Number(timestampInput);

    if (!trimmedId) {
      setFormError('Please enter a Job ID (for example, A2 or B5).');
      return;
    }
    if (timestampInput.trim() === '' || Number.isNaN(parsedTime) || !Number.isFinite(parsedTime)) {
      setFormError('Please enter a valid numeric blooming time.');
      return;
    }

    onAddRecord(selectedDept, trimmedId, parsedTime);
    setJobId('');
    setTimestampInput('');
    setFormError(null);
  };

  const kpiCards = [
    {
      label: 'Total Gardens',
      value: String(DEPARTMENTS.length),
      subtext: '5 active research departments',
      image: DEPARTMENTS[0].imageUrl,
      accent: DEPARTMENTS[0].accentColor,
      tint: DEPARTMENTS[0].tintBg,
    },
    {
      label: 'Total Blooms',
      value: totalBlooms.toLocaleString(),
      subtext: 'Submitted flower records',
      image: DEPARTMENTS[1].imageUrl,
      accent: DEPARTMENTS[1].accentColor,
      tint: DEPARTMENTS[1].tintBg,
    },
    {
      label: 'Organized Blooms',
      value: organizedBlooms.toLocaleString(),
      subtext: isRestored ? 'Merged into master timeline' : 'Awaiting synchronization',
      image: DEPARTMENTS[2].imageUrl,
      accent: DEPARTMENTS[2].accentColor,
      tint: DEPARTMENTS[2].tintBg,
    },
    {
      label: 'Garden Status',
      value: isRestored ? 'Successfully Restored' : 'Pending',
      subtext: isRestored
        ? 'All blooms verified in order'
        : unsortedDepts.length > 0
        ? 'Check unsorted garden order'
        : 'Ready to synchronize',
      image: DEPARTMENTS[4].imageUrl,
      accent: DEPARTMENTS[4].accentColor,
      tint: DEPARTMENTS[4].tintBg,
      isStatus: true,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <BotanicalLeafSprig className="w-24 h-7 mb-2 opacity-80" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#344B38] tracking-tight">
            Welcome to Your Secret Garden
          </h1>
          <p className="mt-2 text-base text-[#344B38]/75 max-w-2xl">
            Let&apos;s organize every bloom and restore the garden&apos;s timeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#344B38] bg-[#FAF2E4] hover:bg-[#F2E6D2] border border-[#344B38]/15 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sample Blooms
          </button>
          <button
            type="button"
            onClick={onLoadConflictDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#344B38] bg-[#FAF2E4] hover:bg-[#F2E6D2] border border-[#344B38]/15 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Same-Time Demo
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#7B3E3E] bg-[#FFFDF9] hover:bg-[#FDF2F2] border border-[#7B3E3E]/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      </section>

      {/* Four Information Cards */}
      <section aria-label="Garden Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.35 }}
            className="rounded-xl bg-[#FFFDF9] border border-[#344B38]/12 p-5 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#344B38]/65">{card.label}</p>
              {card.isStatus ? (
                <div className="mt-1.5 flex items-center gap-2">
                  {isRestored ? (
                    <CheckCircle2 className="w-5 h-5 text-[#4E7A52] shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-[#B47B2B] shrink-0" />
                  )}
                  <p className="font-display text-lg font-semibold text-[#344B38] leading-snug">
                    {card.value}
                  </p>
                </div>
              ) : (
                <p className="mt-1 font-display text-3xl font-bold text-[#344B38] tabular-nums">
                  {card.value}
                </p>
              )}
              <p className="mt-1 text-xs text-[#344B38]/65">{card.subtext}</p>
            </div>
            <div
              className="w-14 h-14 rounded-xl overflow-hidden shrink-0 p-1.5 flex items-center justify-center"
              style={{ backgroundColor: card.tint }}
            >
              <BotanicalImage
                src={card.image}
                alt={card.label}
                accentColor={card.accent}
                animate="float"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Validation Alert if any department queue is unsorted */}
      {unsortedDepts.length > 0 && (
        <div
          role="alert"
          className="rounded-xl bg-[#FEF4F2] border border-[#C97B72]/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#A43B32] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#7F2922]">
                {UNSORTED_QUEUE_ERROR}
              </p>
              <p className="text-xs text-[#7F2922]/85 mt-0.5">
                Needs ordering in:{' '}
                {unsortedDepts.map((d) => `${d.departmentName} (${d.gardenName})`).join(', ')}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenDepartment(unsortedDepts[0].code)}
            className="px-3.5 py-2 text-xs font-semibold text-[#7F2922] bg-white border border-[#C97B72]/40 rounded-lg hover:bg-[#FCEBE8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Fix in {unsortedDepts[0].shortDepartmentName}
          </button>
        </div>
      )}

      {/* Quick Add Bloom & Instant Synchronize Workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Quick Add Record Form */}
        <div className="lg:col-span-7 rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#344B38]">
              Add a Flower Record Quickly
            </h2>
            <p className="mt-1 text-sm text-[#344B38]/70">
              Choose a department, add your Job ID and blooming time, then click Synchronize to restore the garden right away.
            </p>

            <form onSubmit={handleQuickAdd} className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              <div className="sm:col-span-5">
                <label
                  htmlFor="quick-dept"
                  className="block text-xs font-medium text-[#344B38]/80 mb-1.5"
                >
                  Department
                </label>
                <select
                  id="quick-dept"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value as DepartmentCode)}
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF9F0] border border-[#344B38]/20 text-sm text-[#344B38] focus:outline-none focus:border-[#344B38]"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {dept.shortDepartmentName} ({dept.flowerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="quick-job-id"
                  className="block text-xs font-medium text-[#344B38]/80 mb-1.5"
                >
                  Job ID
                </label>
                <input
                  id="quick-job-id"
                  type="text"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="e.g. A16"
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF9F0] border border-[#344B38]/20 text-sm font-mono text-[#344B38] placeholder:text-[#344B38]/40 focus:outline-none focus:border-[#344B38]"
                />
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="quick-time"
                  className="block text-xs font-medium text-[#344B38]/80 mb-1.5"
                >
                  Blooming Time
                </label>
                <input
                  id="quick-time"
                  type="number"
                  step="any"
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  placeholder="e.g. 16"
                  className="w-full h-11 px-3 rounded-lg bg-[#FFF9F0] border border-[#344B38]/20 text-sm font-mono tabular-nums text-[#344B38] placeholder:text-[#344B38]/40 focus:outline-none focus:border-[#344B38]"
                />
              </div>

              <div className="sm:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="min-h-5">
                  {formError && (
                    <p className="text-xs font-medium text-[#A43B32]">{formError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#344B38] bg-[#FAF2E4] hover:bg-[#EFE2CB] border border-[#344B38]/20 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Flower Record
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Restore / Synchronize Callout Card */}
        <div className="lg:col-span-5 rounded-2xl bg-[#344B38] text-[#FFF9F0] p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-[#C8D5BA]">
              Master Bloom Synchronization
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold text-[#FFF9F0]">
              Restore the Master Bloom Timeline
            </h2>
            <p className="mt-2 text-sm text-[#FFF9F0]/80 leading-relaxed">
              Each garden has its own blooming schedule. Bring all five department
              chains together into one ordered timeline using our genuine Min-Heap
              K-Way Merge.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onSynchronize}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#344B38] bg-[#FFF9F0] hover:bg-[#FAF2E4] rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Synchronize All Gardens
            </button>
            {isRestored && (
              <button
                type="button"
                onClick={onGoToTimeline}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[#FFF9F0] border border-[#FFF9F0]/25 hover:bg-[#FFF9F0]/10 rounded-xl transition-colors cursor-pointer"
              >
                View Timeline
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Five Department Gardens Overview — Department Name LARGER than Flower Name */}
      <section aria-label="Department Gardens Overview">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#344B38]">
              Your Five Department Gardens
            </h2>
            <p className="text-sm text-[#344B38]/70 mt-1">
              Click any department to view, edit, or add blooming records to its linked list.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((dept) => {
            const recs = queues[dept.code];
            const isValid = validations[dept.code].valid;
            return (
              <button
                key={dept.code}
                type="button"
                onClick={() => onOpenDepartment(dept.code)}
                className="group text-left rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 hover:border-[#8A9A75] p-5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344B38]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden shrink-0 p-1.5 flex items-center justify-center"
                    style={{ backgroundColor: dept.tintBg }}
                  >
                    <BotanicalImage
                      src={dept.imageUrl}
                      alt={`${dept.departmentName} — ${dept.flowerName}`}
                      accentColor={dept.accentColor}
                      animate="sway"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Department Name prominently LARGER than Flower Name */}
                    <h3 className="font-display text-xl font-bold text-[#344B38] leading-snug">
                      {dept.departmentName}
                    </h3>
                    <p className="mt-0.5 text-sm text-[#344B38]/70">
                      {dept.gardenName} · <span className="font-mono text-xs">{dept.code}</span>
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#344B38]/75 tabular-nums">
                      <span className="font-semibold text-[#344B38]">
                        {recs.length} {recs.length === 1 ? 'record' : 'records'}
                      </span>
                      <span aria-hidden="true">·</span>
                      {isValid ? (
                        <span className="text-[#4E7A52] font-medium">Sorted order</span>
                      ) : (
                        <span className="text-[#A43B32] font-semibold">Needs ordering</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview of first few records */}
                <div className="mt-4 pt-3.5 border-t border-[#344B38]/10 flex items-center justify-between gap-3">
                  <p className="text-xs font-mono text-[#344B38]/70 truncate">
                    {recs.length === 0
                      ? 'Empty garden queue'
                      : recs
                          .slice(0, 4)
                          .map((r) => `${r.jobId}@${r.timestamp}`)
                          .join(' → ') + (recs.length > 4 ? ` +${recs.length - 4}` : '')}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#344B38] group-hover:translate-x-0.5 transition-transform whitespace-nowrap shrink-0">
                    Open
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
