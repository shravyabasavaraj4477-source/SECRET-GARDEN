import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import {
  BloomInputRecord,
  DEPARTMENT_BY_CODE,
  DepartmentCode,
} from '../data/departments';
import {
  QueueValidationResult,
  UNSORTED_QUEUE_ERROR,
} from '../dsa/kWayMerge';
import { BotanicalImage } from './BotanicalImage';

interface DepartmentDetailViewProps {
  departmentCode: DepartmentCode;
  records: BloomInputRecord[];
  validation: QueueValidationResult;
  onBack: () => void;
  onAddRecord: (dept: DepartmentCode, jobId: string, timestamp: number) => void;
  onEditRecord: (
    dept: DepartmentCode,
    uid: string,
    jobId: string,
    timestamp: number
  ) => void;
  onDeleteRecord: (dept: DepartmentCode, uid: string) => void;
  onClearDepartment: (dept: DepartmentCode) => void;
  onSynchronize: () => void;
}

export const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({
  departmentCode,
  records,
  validation,
  onBack,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onClearDepartment,
  onSynchronize,
}) => {
  const dept = DEPARTMENT_BY_CODE[departmentCode];
  const [jobId, setJobId] = useState('');
  const [timestampInput, setTimestampInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editJobId, setEditJobId] = useState('');
  const [editTimestamp, setEditTimestamp] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = jobId.trim();
    const parsedTs = Number(timestampInput);

    if (!trimmed) {
      setFormError('Please enter a Job ID (for example, A2).');
      return;
    }
    if (timestampInput.trim() === '' || Number.isNaN(parsedTs) || !Number.isFinite(parsedTs)) {
      setFormError('Please enter a valid number for Blooming Time.');
      return;
    }

    onAddRecord(departmentCode, trimmed, parsedTs);
    setJobId('');
    setTimestampInput('');
    setFormError(null);
  };

  const startEdit = (record: BloomInputRecord) => {
    setEditingUid(record.uid);
    setEditJobId(record.jobId);
    setEditTimestamp(String(record.timestamp));
  };

  const saveEdit = (uid: string) => {
    const trimmed = editJobId.trim();
    const parsedTs = Number(editTimestamp);
    if (!trimmed || editTimestamp.trim() === '' || Number.isNaN(parsedTs)) {
      return;
    }
    onEditRecord(departmentCode, uid, trimmed, parsedTs);
    setEditingUid(null);
  };

  return (
    <div className="space-y-8">
      {/* Top navigation & sync shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#344B38] hover:text-[#667855] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Gardens
        </button>

        <button
          type="button"
          onClick={onSynchronize}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Synchronize All Gardens
        </button>
      </div>

      {/* Department Banner — Department Name clearly LARGER than Flower Name */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 p-2.5 flex items-center justify-center"
          style={{ backgroundColor: dept.tintBg }}
        >
          <BotanicalImage
            src={dept.imageUrl}
            alt={`${dept.departmentName} — ${dept.flowerName}`}
            accentColor={dept.accentColor}
            animate="sway"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center sm:text-left flex-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#344B38]">
            {dept.departmentName}
          </h1>
          <p className="mt-1.5 text-base text-[#344B38]/75">
            {dept.gardenName} · Department Code:{' '}
            <span className="font-mono font-semibold text-[#344B38]">{dept.code}</span>{' '}
            ·{' '}
            <span className="tabular-nums">
              {records.length} {records.length === 1 ? 'bloom record' : 'bloom records'}
            </span>
          </p>
          <p className="mt-2.5 text-sm text-[#344B38]/70 max-w-2xl">
            {dept.description}
          </p>
        </div>
      </section>

      {/* Unsorted Queue Validation Banner */}
      {!validation.valid && (
        <div
          role="alert"
          className="rounded-xl bg-[#FEF4F2] border border-[#C97B72]/45 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-[#A43B32] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#7F2922]">
              {UNSORTED_QUEUE_ERROR}
            </p>
            <p className="text-xs text-[#7F2922]/85 mt-1">
              Record #{(validation.offendingIndex ?? 0) + 1} has blooming time{' '}
              <span className="font-mono font-semibold">{validation.offendingTimestamp}</span>,
              which comes before the previous time{' '}
              <span className="font-mono font-semibold">{validation.previousTimestamp}</span>.
              Edit or remove the out-of-order entry — this garden does not silently re-sort your records.
            </p>
          </div>
        </div>
      )}

      {/* Add Flower Record Form */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6">
        <h2 className="font-display text-2xl font-semibold text-[#344B38]">
          Add Flower Record
        </h2>
        <p className="mt-1 text-sm text-[#344B38]/70">
          Enter a Job ID and Blooming Time in ascending order. Duplicate blooming times are accepted.
        </p>

        <form onSubmit={handleAdd} className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label
              htmlFor="detail-job-id"
              className="block text-xs font-medium text-[#344B38]/80 mb-1.5"
            >
              Job ID
            </label>
            <input
              id="detail-job-id"
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder={`e.g. ${dept.samplePrefix}2`}
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFF9F0] border border-[#344B38]/20 text-sm font-mono text-[#344B38] placeholder:text-[#344B38]/40 focus:outline-none focus:border-[#344B38]"
            />
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="detail-time"
              className="block text-xs font-medium text-[#344B38]/80 mb-1.5"
            >
              Blooming Time
            </label>
            <input
              id="detail-time"
              type="number"
              step="any"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 2"
              className="w-full h-11 px-3.5 rounded-lg bg-[#FFF9F0] border border-[#344B38]/20 text-sm font-mono tabular-nums text-[#344B38] placeholder:text-[#344B38]/40 focus:outline-none focus:border-[#344B38]"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </form>

        {formError && (
          <p className="mt-3 text-xs font-medium text-[#A43B32]">{formError}</p>
        )}
      </section>

      {/* Live Linked List Chain Preview */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#344B38]">
              Linked Flower Chain ({dept.code})
            </h2>
            <p className="text-xs text-[#344B38]/65 mt-0.5">
              Each record connects directly to the next bloom via its linked-list pointer.
            </p>
          </div>
          {records.length > 0 && (
            <button
              type="button"
              onClick={() => onClearDepartment(departmentCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#7B3E3E] hover:bg-[#FDF2F2] border border-[#7B3E3E]/20 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Garden
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="rounded-xl bg-[#FFF9F0] border border-dashed border-[#344B38]/20 p-8 text-center">
            <p className="text-sm text-[#344B38]/70">
              This garden currently has no blooming records (HEAD → NULL).
            </p>
            <p className="text-xs text-[#344B38]/55 mt-1">
              Add a record above, or leave this garden empty during synchronization.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Horizontal Chain Visual */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex items-center gap-2 min-w-max">
                <span className="font-mono text-xs font-semibold text-[#667855] pr-1">
                  HEAD →
                </span>
                {records.map((rec, idx) => {
                  const isBad = !validation.valid && validation.offendingIndex === idx;
                  return (
                    <React.Fragment key={rec.uid}>
                      <div
                        className={`rounded-xl border px-3.5 py-2.5 flex items-center gap-2.5 ${
                          isBad
                            ? 'bg-[#FEF4F2] border-[#C97B72]'
                            : 'bg-[#FFF9F0] border-[#344B38]/15'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                          <BotanicalImage
                            src={dept.imageUrl}
                            alt={dept.flowerName}
                            accentColor={dept.accentColor}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="font-mono text-xs tabular-nums">
                          <p className="font-semibold text-[#344B38]">{rec.jobId}</p>
                          <p className={isBad ? 'text-[#A43B32] font-semibold' : 'text-[#344B38]/70'}>
                            Time {rec.timestamp}
                          </p>
                        </div>
                      </div>
                      <span aria-hidden="true" className="font-mono text-xs text-[#8A9A75]">
                        →
                      </span>
                    </React.Fragment>
                  );
                })}
                <span className="font-mono text-xs text-[#344B38]/50">NULL</span>
              </div>
            </div>

            {/* Editable Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#344B38]/12 text-xs font-medium text-[#344B38]/65">
                    <th className="py-2.5 pr-4">Position</th>
                    <th className="py-2.5 pr-4">Job ID</th>
                    <th className="py-2.5 pr-4">Blooming Time</th>
                    <th className="py-2.5 pr-4">Order Status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#344B38]/8 text-sm">
                  {records.map((rec, idx) => {
                    const isEditing = editingUid === rec.uid;
                    const isBad = !validation.valid && validation.offendingIndex === idx;

                    return (
                      <tr key={rec.uid} className={isBad ? 'bg-[#FEF4F2]/70' : ''}>
                        <td className="py-3 pr-4 font-mono text-xs text-[#344B38]/65 tabular-nums">
                          #{idx + 1}
                        </td>
                        <td className="py-3 pr-4 font-mono font-medium text-[#344B38]">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editJobId}
                              onChange={(e) => setEditJobId(e.target.value)}
                              aria-label="Edit Job ID"
                              className="w-28 h-8 px-2 rounded bg-white border border-[#344B38]/30 text-sm font-mono"
                            />
                          ) : (
                            rec.jobId
                          )}
                        </td>
                        <td className="py-3 pr-4 font-mono tabular-nums text-[#344B38]">
                          {isEditing ? (
                            <input
                              type="number"
                              step="any"
                              value={editTimestamp}
                              onChange={(e) => setEditTimestamp(e.target.value)}
                              aria-label="Edit Blooming Time"
                              className="w-24 h-8 px-2 rounded bg-white border border-[#344B38]/30 text-sm font-mono tabular-nums"
                            />
                          ) : (
                            rec.timestamp
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs">
                          {isBad ? (
                            <span className="font-semibold text-[#A43B32]">
                              Out of order (must be ≥ {validation.previousTimestamp})
                            </span>
                          ) : (
                            <span className="text-[#4E7A52]">Valid ascending</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => saveEdit(rec.uid)}
                                  aria-label="Save changes"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#344B38] text-[#FFF9F0] hover:bg-[#263829] cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingUid(null)}
                                  aria-label="Cancel edit"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#344B38]/20 text-[#344B38] hover:bg-[#FAF2E4] cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(rec)}
                                  aria-label={`Edit record ${rec.jobId}`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#344B38]/15 text-[#344B38] hover:bg-[#FAF2E4] cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteRecord(departmentCode, rec.uid)}
                                  aria-label={`Remove record ${rec.jobId}`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#7B3E3E]/20 text-[#7B3E3E] hover:bg-[#FDF2F2] cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
