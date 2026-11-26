import React from 'react';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { DEPARTMENT_BY_CODE } from '../data/departments';
import { MergeExecutionResult } from '../dsa/kWayMerge';
import { BotanicalLeafSprig } from './BotanicalAtmosphere';

interface GardenReportViewProps {
  mergeResult: MergeExecutionResult | null;
  onSynchronize: () => void;
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildCsvReport(result: MergeExecutionResult): string {
  const lines: string[] = [];
  lines.push('SECRET GARDEN — MASTER BLOOM TIMELINE REPORT');
  lines.push('');
  lines.push('Metric,Value');
  lines.push(`Total Departments,${result.metrics.totalDepartments}`);
  lines.push(`Total Records Received,${result.metrics.totalRecordsReceived}`);
  lines.push(`Total Records Merged,${result.metrics.totalRecordsMerged}`);
  lines.push(
    `Empty Departments,"${
      result.metrics.emptyDepartments.length > 0
        ? result.metrics.emptyDepartments.join('; ')
        : 'None'
    }"`
  );
  lines.push(`Duplicate Timestamp Groups,${result.duplicateGroups.length}`);
  lines.push(`Cross-Department Overlap Groups,${result.crossDepartmentConflicts.length}`);
  lines.push(`Heap Comparisons,${result.metrics.heapComparisons}`);
  lines.push(`Max Heap Size (O(K)),${result.metrics.maxHeapSize}`);
  lines.push(`Execution Time (ms),${result.metrics.executionTimeMs}`);
  lines.push('Algorithm Time Complexity,O(N log K)');
  lines.push('Auxiliary Heap Space,O(K)');
  lines.push('Output Linked List Storage,O(N)');
  lines.push(
    `Verification Status,${result.verification.passed ? 'PASSED' : 'FAILED'}`
  );
  lines.push('');
  lines.push('Position,Job ID,Blooming Time,Department Code,Department Name,Flower Garden');

  result.mergedRecords.forEach((rec, idx) => {
    const dept = DEPARTMENT_BY_CODE[rec.departmentCode];
    lines.push(
      `${idx + 1},"${rec.jobId.replace(/"/g, '""')}",${rec.timestamp},${rec.departmentCode},"${
        dept?.departmentName ?? rec.departmentCode
      }","${dept?.gardenName ?? ''}"`
    );
  });

  return lines.join('\n');
}

function buildTextReport(result: MergeExecutionResult): string {
  const divider = '============================================================';
  const lines: string[] = [
    divider,
    'SECRET GARDEN — THE MYSTERY OF THE LOST BLOOM',
    'Garden Synchronization & Verification Report',
    divider,
    `Total Departments:          ${result.metrics.totalDepartments}`,
    `Total Records Received:     ${result.metrics.totalRecordsReceived}`,
    `Total Records Merged:       ${result.metrics.totalRecordsMerged}`,
    `Empty Departments:          ${
      result.metrics.emptyDepartments.length > 0
        ? result.metrics.emptyDepartments.join(', ')
        : 'None'
    }`,
    `Duplicate Timestamp Groups: ${result.duplicateGroups.length} (${result.crossDepartmentConflicts.length} cross-department)`,
    `Heap Comparisons:           ${result.metrics.heapComparisons}`,
    `Max Heap Size:              ${result.metrics.maxHeapSize}`,
    `Execution Time:             ${result.metrics.executionTimeMs} ms`,
    `Algorithm Complexity:       Time O(N log K) | Aux Heap Space O(K) | Output List O(N)`,
    `Verification Status:        ${
      result.verification.passed ? 'PASSED (All Blooms Accounted For)' : 'FAILED'
    }`,
    '',
    'MASTER BLOOM TIMELINE:',
    '------------------------------------------------------------',
  ];

  if (result.mergedRecords.length === 0) {
    lines.push('(No blooming records submitted)');
  } else {
    result.mergedRecords.forEach((rec, idx) => {
      const dept = DEPARTMENT_BY_CODE[rec.departmentCode];
      lines.push(
        `${String(idx + 1).padStart(3, ' ')}. [${rec.jobId}] Time ${rec.timestamp} — ${
          dept?.departmentName ?? rec.departmentCode
        } (${dept?.gardenName ?? rec.departmentCode})`
      );
    });
  }

  lines.push(divider);
  return lines.join('\n');
}

export const GardenReportView: React.FC<GardenReportViewProps> = ({
  mergeResult,
  onSynchronize,
}) => {
  if (!mergeResult || !mergeResult.success) {
    return (
      <div className="space-y-8">
        <div>
          <BotanicalLeafSprig className="w-24 h-7 mb-2 opacity-80" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#344B38]">
            Garden Report
          </h1>
          <p className="mt-2 text-base text-[#344B38]/75">
            Run a garden synchronization first to generate a verified execution report from real merge data.
          </p>
        </div>

        <div className="rounded-2xl bg-[#FFFDF9] border border-dashed border-[#344B38]/20 p-10 text-center space-y-4">
          <p className="text-sm text-[#344B38]/75">
            No completed synchronization report is available yet.
          </p>
          <button
            type="button"
            onClick={onSynchronize}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Synchronize All Gardens
          </button>
        </div>
      </div>
    );
  }

  const reportRows = [
    {
      label: 'Total Departments',
      value: String(mergeResult.metrics.totalDepartments),
    },
    {
      label: 'Total Records Received',
      value: mergeResult.metrics.totalRecordsReceived.toLocaleString(),
    },
    {
      label: 'Total Records Merged',
      value: mergeResult.metrics.totalRecordsMerged.toLocaleString(),
    },
    {
      label: 'Empty Departments',
      value:
        mergeResult.metrics.emptyDepartments.length === 0
          ? 'None (0)'
          : `${mergeResult.metrics.emptyDepartments.length} (${mergeResult.metrics.emptyDepartments.join(', ')})`,
    },
    {
      label: 'Duplicate Timestamp Groups',
      value: `${mergeResult.duplicateGroups.length} total · ${mergeResult.crossDepartmentConflicts.length} cross-department`,
    },
    {
      label: 'Heap Comparisons',
      value: mergeResult.metrics.heapComparisons.toLocaleString(),
    },
    {
      label: 'Execution Time',
      value: `${mergeResult.metrics.executionTimeMs.toFixed(3)} ms`,
    },
    {
      label: 'Algorithm Complexity',
      value: 'Time: O(N log K) · Aux Heap: O(K) · Output List: O(N)',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header + Download Controls */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <BotanicalLeafSprig className="w-24 h-7 mb-2 opacity-80" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#344B38]">
            Garden Synchronization Report
          </h1>
          <p className="mt-2 text-base text-[#344B38]/75 max-w-2xl">
            Generated directly from real Linked List &amp; Min-Heap execution telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              triggerDownload(
                'secret-garden-report.csv',
                buildCsvReport(mergeResult),
                'text/csv;charset=utf-8'
              )
            }
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Garden Report (CSV)
          </button>

          <button
            type="button"
            onClick={() =>
              triggerDownload(
                'secret-garden-report.txt',
                buildTextReport(mergeResult),
                'text/plain;charset=utf-8'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#344B38] bg-[#FAF2E4] hover:bg-[#EFE2CB] border border-[#344B38]/15 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Download Text (.txt)
          </button>
        </div>
      </section>

      {/* Verification Status Summary */}
      <section
        className={`rounded-2xl border p-5 flex flex-wrap items-center justify-between gap-4 ${
          mergeResult.verification.passed
            ? 'bg-[#F4F8F2] border-[#8A9A75]/45'
            : 'bg-[#FEF4F2] border-[#C97B72]/45'
        }`}
      >
        <div className="flex items-center gap-3">
          {mergeResult.verification.passed ? (
            <CheckCircle2 className="w-6 h-6 text-[#4E7A52] shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-[#A43B32] shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold text-[#344B38]">
              Verification Status:{' '}
              <span
                className={
                  mergeResult.verification.passed ? 'text-[#4E7A52]' : 'text-[#A43B32]'
                }
              >
                {mergeResult.verification.passed ? 'PASSED' : 'FAILED'}
              </span>
            </p>
            <p className="text-xs text-[#344B38]/75 mt-0.5">
              {mergeResult.verification.passed
                ? 'All blooms accounted for, chronological order verified, alphabetical tie-breaking verified, and original department order preserved.'
                : mergeResult.verification.failureSummary}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            triggerDownload(
              'secret-garden-report.csv',
              buildCsvReport(mergeResult),
              'text/csv;charset=utf-8'
            )
          }
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#344B38] hover:text-[#667855] cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </section>

      {/* Metrics Grid */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-[#344B38] mb-5">
          Execution Metrics
        </h2>
        <dl className="divide-y divide-[#344B38]/10">
          {reportRows.map((row) => (
            <div
              key={row.label}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
            >
              <dt className="text-sm text-[#344B38]/75">{row.label}</dt>
              <dd className="font-mono text-sm font-semibold text-[#344B38] tabular-nums">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Complete Merged Output Table */}
      <section className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-[#344B38] mb-4">
          Merged Chronological Ledger
        </h2>

        {mergeResult.mergedRecords.length === 0 ? (
          <p className="text-sm text-[#344B38]/65">No records in the merged ledger.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#344B38]/12 text-xs font-medium text-[#344B38]/65">
                  <th className="py-2.5 pr-4">#</th>
                  <th className="py-2.5 pr-4">Job ID</th>
                  <th className="py-2.5 pr-4">Blooming Time</th>
                  <th className="py-2.5 pr-4">Department</th>
                  <th className="py-2.5 pr-4">Flower Garden</th>
                  <th className="py-2.5 text-right">Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#344B38]/8 text-sm">
                {mergeResult.mergedRecords.map((rec, idx) => {
                  const dept = DEPARTMENT_BY_CODE[rec.departmentCode];
                  return (
                    <tr key={rec.uid}>
                      <td className="py-2.5 pr-4 font-mono text-xs text-[#344B38]/60 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-[#344B38]">
                        {rec.jobId}
                      </td>
                      <td className="py-2.5 pr-4 font-mono tabular-nums text-[#344B38]">
                        {rec.timestamp}
                      </td>
                      <td className="py-2.5 pr-4 font-medium text-[#344B38]">
                        {dept?.departmentName ?? rec.departmentCode}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-[#344B38]/70">
                        {dept?.gardenName ?? '—'}
                      </td>
                      <td className="py-2.5 text-right font-mono text-xs font-semibold text-[#344B38]">
                        {rec.departmentCode}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
