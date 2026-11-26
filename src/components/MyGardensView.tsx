import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {
  BloomInputRecord,
  DEPARTMENTS,
  DepartmentCode,
} from '../data/departments';
import {
  QueueValidationResult,
  UNSORTED_QUEUE_ERROR,
} from '../dsa/kWayMerge';
import { BotanicalImage } from './BotanicalImage';
import { BotanicalLeafSprig } from './BotanicalAtmosphere';

interface MyGardensViewProps {
  queues: Record<DepartmentCode, BloomInputRecord[]>;
  validations: Record<DepartmentCode, QueueValidationResult>;
  onAddRecord: (dept: DepartmentCode, jobId: string, timestamp: number) => void;
  onOpenDepartment: (dept: DepartmentCode) => void;
  onSynchronize: () => void;
}

export const MyGardensView: React.FC<MyGardensViewProps> = ({
  queues,
  validations,
  onAddRecord,
  onOpenDepartment,
  onSynchronize,
}) => {
  const [drafts, setDrafts] = useState<
    Record<DepartmentCode, { jobId: string; timestamp: string; error?: string }>
  >({
    CS: { jobId: '', timestamp: '' },
    CIVIL: { jobId: '', timestamp: '' },
    MATHS: { jobId: '', timestamp: '' },
    MECH: { jobId: '', timestamp: '' },
    CYBER: { jobId: '', timestamp: '' },
  });

  const updateDraft = (
    code: DepartmentCode,
    field: 'jobId' | 'timestamp',
    value: string
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [code]: { ...prev[code], [field]: value, error: undefined },
    }));
  };

  const handleCardSubmit = (e: React.FormEvent, code: DepartmentCode) => {
    e.preventDefault();
    const draft = drafts[code];
    const trimmedId = draft.jobId.trim();
    const parsedTs = Number(draft.timestamp);

    if (!trimmedId) {
      setDrafts((prev) => ({
        ...prev,
        [code]: { ...prev[code], error: 'Enter a Job ID.' },
      }));
      return;
    }
    if (draft.timestamp.trim() === '' || Number.isNaN(parsedTs) || !Number.isFinite(parsedTs)) {
      setDrafts((prev) => ({
        ...prev,
        [code]: { ...prev[code], error: 'Enter a numeric blooming time.' },
      }));
      return;
    }

    onAddRecord(code, trimmedId, parsedTs);
    setDrafts((prev) => ({
      ...prev,
      [code]: { jobId: '', timestamp: '', error: undefined },
    }));
  };

  const totalBlooms = DEPARTMENTS.reduce(
    (sum, dept) => sum + queues[dept.code].length,
    0
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <BotanicalLeafSprig className="w-24 h-7 mb-2 opacity-80" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#344B38]">
            My Gardens — Department Records
          </h1>
          <p className="mt-2 text-base text-[#344B38]/75 max-w-2xl">
            Add blooming records directly on each department card or open an individual garden to edit its linked list.
          </p>
        </div>
        <button
          type="button"
          onClick={onSynchronize}
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Synchronize All Gardens ({totalBlooms})
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DEPARTMENTS.map((dept) => {
          const records = queues[dept.code];
          const validation = validations[dept.code];
          const draft = drafts[dept.code];

          return (
            <article
              key={dept.code}
              className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 flex flex-col justify-between gap-5"
            >
              {/* Header row — Department Name LARGER than Flower Name */}
              <div className="flex items-start gap-5">
                <button
                  type="button"
                  onClick={() => onOpenDepartment(dept.code)}
                  className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 p-2 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: dept.tintBg }}
                  aria-label={`Open ${dept.departmentName}`}
                >
                  <BotanicalImage
                    src={dept.imageUrl}
                    alt={`${dept.departmentName} — ${dept.flowerName}`}
                    accentColor={dept.accentColor}
                    animate="sway"
                    className="w-full h-full object-contain"
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onOpenDepartment(dept.code)}
                    className="text-left group cursor-pointer"
                  >
                    <h2 className="font-display text-2xl font-bold text-[#344B38] group-hover:text-[#556B4E] transition-colors leading-tight">
                      {dept.departmentName}
                    </h2>
                  </button>
                  <p className="mt-1 text-sm text-[#344B38]/70">
                    {dept.gardenName} · Code:{' '}
                    <span className="font-mono font-semibold text-[#344B38]">
                      {dept.code}
                    </span>{' '}
                    ·{' '}
                    <span className="tabular-nums font-medium">
                      {records.length} {records.length === 1 ? 'record' : 'records'}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-[#344B38]/65 leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              </div>

              {/* Validation warning if unsorted */}
              {!validation.valid && (
                <div
                  role="alert"
                  className="rounded-lg bg-[#FEF4F2] border border-[#C97B72]/35 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-[#7F2922]"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#A43B32]" />
                  <span>{UNSORTED_QUEUE_ERROR}</span>
                </div>
              )}

              {/* Current Records Chain Preview */}
              <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 px-4 py-3">
                <p className="text-xs font-medium text-[#344B38]/60 mb-1.5">
                  Submitted Sequence (Entry Order)
                </p>
                {records.length === 0 ? (
                  <p className="text-xs text-[#344B38]/55 italic">
                    No blooming records yet — empty queues are accepted.
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#344B38] tabular-nums">
                    {records.map((rec, idx) => {
                      const isBad =
                        !validation.valid && validation.offendingIndex === idx;
                      return (
                        <React.Fragment key={rec.uid}>
                          <span
                            className={
                              isBad
                                ? 'font-semibold text-[#A43B32] underline decoration-wavy'
                                : ''
                            }
                          >
                            {rec.jobId}
                            <span className="text-[#344B38]/60">(t={rec.timestamp})</span>
                          </span>
                          {idx < records.length - 1 && (
                            <span aria-hidden="true" className="text-[#8A9A75]">
                              →
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Inline Add Record Section */}
              <form
                onSubmit={(e) => handleCardSubmit(e, dept.code)}
                className="space-y-3 pt-2 border-t border-[#344B38]/10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-5">
                    <label
                      htmlFor={`job-${dept.code}`}
                      className="sr-only"
                    >
                      Job ID for {dept.departmentName}
                    </label>
                    <input
                      id={`job-${dept.code}`}
                      type="text"
                      value={draft.jobId}
                      onChange={(e) => updateDraft(dept.code, 'jobId', e.target.value)}
                      placeholder={`Job ID (e.g. ${dept.samplePrefix}4)`}
                      className="w-full h-10 px-3 rounded-lg bg-[#FFF9F0] border border-[#344B38]/20 text-sm font-mono text-[#344B38] placeholder:text-[#344B38]/40 focus:outline-none focus:border-[#344B38]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor={`time-${dept.code}`}
                      className="sr-only"
                    >
                      Blooming Time for {dept.departmentName}
                    </label>
                    <input
                      id={`time-${dept.code}`}
                      type="number"
                      step="any"
                      value={draft.timestamp}
                      onChange={(e) => updateDraft(dept.code, 'timestamp', e.target.value)}
                      placeholder="Blooming time"
                      className="w-full h-10 px-3 rounded-lg bg-[#FFF9F0] border border-[#344B38]/20 text-sm font-mono tabular-nums text-[#344B38] placeholder:text-[#344B38]/40 focus:outline-none focus:border-[#344B38]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-3 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Bloom
                    </button>
                  </div>
                </div>

                {draft.error && (
                  <p className="text-xs font-medium text-[#A43B32]">{draft.error}</p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[#344B38]/60">
                    Duplicates allowed · Keep blooming times ascending
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenDepartment(dept.code)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#344B38] hover:text-[#667855] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    View Records
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
};
