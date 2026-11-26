import { createRecordUid } from '../data/departments';
import {
  DepartmentQueueInput,
  mergeDepartmentQueues,
  UNSORTED_QUEUE_ERROR,
} from './kWayMerge';

export interface TestCaseResult {
  id: string;
  name: string;
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTimeMs: number;
  comparisons: number;
}

function makeQueue(
  departmentCode: string,
  items: Array<[string, number]>
): DepartmentQueueInput {
  return {
    departmentCode,
    records: items.map(([jobId, timestamp]) => ({
      uid: createRecordUid(departmentCode.toLowerCase()),
      jobId,
      timestamp,
      departmentCode,
    })),
  };
}

function formatIds(result: ReturnType<typeof mergeDepartmentQueues>): string {
  return result.mergedRecords.map((r) => `${r.jobId}(${r.departmentCode}@${r.timestamp})`).join(' → ');
}

export function runAllTestScenarios(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  // 1. Normal department records
  {
    const inputs: DepartmentQueueInput[] = [
      makeQueue('CS', [['A2', 2], ['A8', 8]]),
      makeQueue('CIVIL', [['B1', 1], ['B6', 6]]),
      makeQueue('MATHS', [['C3', 3], ['C9', 9]]),
      makeQueue('MECH', [['D5', 5]]),
      makeQueue('CYBER', [['E4', 4], ['E10', 10]]),
    ];
    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    const expectedIds = ['B1', 'A2', 'C3', 'E4', 'D5', 'B6', 'A8', 'C9', 'E10'];
    const actualIds = res.mergedRecords.map((r) => r.jobId);
    const passed =
      res.success &&
      res.verification.passed &&
      expectedIds.length === actualIds.length &&
      expectedIds.every((id, i) => id === actualIds[i]);

    results.push({
      id: 'normal',
      name: '1. Normal Department Records',
      description: 'Five populated gardens with distinct ascending blooming timestamps.',
      expected: expectedIds.join(' → '),
      actual: actualIds.join(' → '),
      passed,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  // 2. Identical timestamps across all 5 departments (tests strict alphabetical code order)
  {
    const inputs: DepartmentQueueInput[] = [
      makeQueue('CS', [['R7', 7]]),
      makeQueue('CIVIL', [['S7', 7]]),
      makeQueue('MATHS', [['T7', 7]]),
      makeQueue('MECH', [['CB7', 7]]),
      makeQueue('CYBER', [['F7', 7]]),
    ];
    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    // Alphabetical department codes: CIVIL < CS < CYBER < MATHS < MECH
    const expected = 'S7(CIVIL@7) → R7(CS@7) → F7(CYBER@7) → T7(MATHS@7) → CB7(MECH@7)';
    const actual = formatIds(res);
    const passed = res.success && res.verification.passed && actual === expected;

    results.push({
      id: 'identical-timestamps',
      name: '2. Identical Timestamps Tie-Break',
      description: 'All five departments bloom at timestamp 7; breaks ties by alphabetical department code.',
      expected,
      actual,
      passed,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  // 3. Empty gardens (all 5 empty)
  {
    const inputs: DepartmentQueueInput[] = [
      makeQueue('CS', []),
      makeQueue('CIVIL', []),
      makeQueue('MATHS', []),
      makeQueue('MECH', []),
      makeQueue('CYBER', []),
    ];
    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    const passed =
      res.success &&
      res.verification.passed &&
      res.mergedRecords.length === 0 &&
      res.metrics.emptyDepartments.length === 5;

    results.push({
      id: 'empty-gardens',
      name: '3. All Empty Gardens',
      description: 'All five departments submit zero records.',
      expected: '0 records merged · 5 empty departments · Verification PASSED',
      actual: `${res.mergedRecords.length} records merged · ${res.metrics.emptyDepartments.length} empty departments · Verification ${res.verification.passed ? 'PASSED' : 'FAILED'}`,
      passed,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  // 4. One empty garden and four populated gardens
  {
    const inputs: DepartmentQueueInput[] = [
      makeQueue('CS', [['A4', 4]]),
      makeQueue('CIVIL', [['B2', 2]]),
      makeQueue('MATHS', []), // empty
      makeQueue('MECH', [['D6', 6]]),
      makeQueue('CYBER', [['E1', 1]]),
    ];
    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    const expected = 'E1(CYBER@1) → B2(CIVIL@2) → A4(CS@4) → D6(MECH@6)';
    const actual = formatIds(res);
    const passed =
      res.success &&
      res.verification.passed &&
      actual === expected &&
      res.metrics.emptyDepartments.length === 1;

    results.push({
      id: 'one-empty-four-populated',
      name: '4. One Empty & Four Populated Gardens',
      description: 'Mathematics (Tulip Garden) is empty while the other four gardens have blooms.',
      expected,
      actual,
      passed,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  // 5. Uneven queue sizes
  {
    const inputs: DepartmentQueueInput[] = [
      makeQueue('CS', [
        ['A1', 1],
        ['A2', 2],
        ['A3', 3],
        ['A4', 4],
        ['A5', 5],
        ['A6', 6],
        ['A7', 7],
      ]),
      makeQueue('CIVIL', [['B3', 3]]),
      makeQueue('MATHS', [['C1', 1], ['C9', 9]]),
      makeQueue('MECH', []),
      makeQueue('CYBER', [['E5', 5]]),
    ];
    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    const expectedIds = ['A1', 'C1', 'A2', 'B3', 'A3', 'A4', 'A5', 'E5', 'A6', 'A7', 'C9'];
    const actualIds = res.mergedRecords.map((r) => r.jobId);
    const passed =
      res.success &&
      res.verification.passed &&
      expectedIds.length === actualIds.length &&
      expectedIds.every((id, idx) => id === actualIds[idx]);

    results.push({
      id: 'uneven-sizes',
      name: '5. Uneven Queue Sizes',
      description: 'Queue lengths of 7, 1, 2, 0, and 1 merged cleanly with O(K) heap space.',
      expected: expectedIds.join(' → '),
      actual: actualIds.join(' → '),
      passed,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  // 6. Multiple identical timestamps within one department (stability test)
  {
    const inputs: DepartmentQueueInput[] = [
      makeQueue('CS', [
        ['CS_FIRST', 5],
        ['CS_SECOND', 5],
        ['CS_THIRD', 5],
      ]),
      makeQueue('CIVIL', [['CIV_EARLY', 5]]),
      makeQueue('MATHS', [['MTH_LATE', 5]]),
      makeQueue('MECH', []),
      makeQueue('CYBER', []),
    ];
    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    const expectedIds = ['CIV_EARLY', 'CS_FIRST', 'CS_SECOND', 'CS_THIRD', 'MTH_LATE'];
    const actualIds = res.mergedRecords.map((r) => r.jobId);
    const passed =
      res.success &&
      res.verification.passed &&
      expectedIds.length === actualIds.length &&
      expectedIds.every((id, idx) => id === actualIds[idx]);

    results.push({
      id: 'same-dept-duplicates',
      name: '6. Multiple Identical Timestamps in One Department',
      description: 'Verifies original submission order is preserved when timestamp and department code match.',
      expected: expectedIds.join(' → '),
      actual: actualIds.join(' → '),
      passed,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  // 7. Large-scale stress test: 200 departments, 100,000 jobs!
  {
    const numDepartments = 200;
    const jobsPerDepartment = 500; // 200 * 500 = 100,000 jobs
    const inputs: DepartmentQueueInput[] = [];

    for (let d = 0; d < numDepartments; d += 1) {
      const code = `DEPT_${String(d + 1).padStart(3, '0')}`;
      const records = [];
      let currentTs = d % 17;
      for (let j = 0; j < jobsPerDepartment; j += 1) {
        currentTs += (j * 7 + d * 3) % 11; // strictly non-decreasing (allows duplicates!)
        records.push({
          uid: `${d}_${j}`,
          jobId: `J${d}-${j}`,
          timestamp: currentTs,
          departmentCode: code,
        });
      }
      inputs.push({ departmentCode: code, records });
    }

    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    const passed =
      res.success &&
      res.verification.passed &&
      res.metrics.totalDepartments === 200 &&
      res.metrics.totalRecordsMerged === 100000 &&
      res.metrics.maxHeapSize <= 200;

    results.push({
      id: 'large-scale-200-100k',
      name: '7. Large Scale — 200 Departments & 100,000 Jobs',
      description: 'Executes genuine Linked List + Min-Heap K-Way Merge across 200 queues and 100,000 blooms.',
      expected: '100,000 merged · max heap size ≤ 200 · Verification PASSED',
      actual: `${res.metrics.totalRecordsMerged.toLocaleString()} merged · max heap size ${res.metrics.maxHeapSize} · ${res.metrics.executionTimeMs.toFixed(1)} ms · Verification ${res.verification.passed ? 'PASSED' : 'FAILED'}`,
      passed,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  // 8. Unsorted input validation (must reject, never silently sort)
  {
    const inputs: DepartmentQueueInput[] = [
      makeQueue('CS', [['A8', 8], ['A2', 2]]), // unsorted!
      makeQueue('CIVIL', [['B1', 1], ['B5', 5]]),
      makeQueue('MATHS', []),
      makeQueue('MECH', []),
      makeQueue('CYBER', []),
    ];
    const res = mergeDepartmentQueues(inputs, { captureTrace: false });
    const rejectedProperly =
      !res.success &&
      res.validationErrors.length === 1 &&
      res.validationErrors[0].departmentCode === 'CS' &&
      res.validationErrors[0].message === UNSORTED_QUEUE_ERROR &&
      res.mergedRecords.length === 0;

    results.push({
      id: 'unsorted-validation',
      name: '8. Unsorted Input Validation',
      description: 'Detects out-of-order blooming timestamps in Computer Science without silently sorting.',
      expected: `Rejected with: "${UNSORTED_QUEUE_ERROR}"`,
      actual: res.success
        ? 'Unexpectedly succeeded'
        : `Rejected (${res.validationErrors[0]?.departmentCode}) with: "${res.validationErrors[0]?.message}"`,
      passed: rejectedProperly,
      executionTimeMs: res.metrics.executionTimeMs,
      comparisons: res.metrics.heapComparisons,
    });
  }

  return results;
}
