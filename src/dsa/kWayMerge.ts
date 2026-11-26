import { DEPARTMENT_BY_CODE, BloomInputRecord } from '../data/departments';

export const UNSORTED_QUEUE_ERROR =
  'Your garden records must be arranged by blooming time before synchronization.';

/**
 * Genuine Singly Linked List Node representing a single bloom / print record.
 */
export class BloomNode {
  public readonly uid: string;
  public readonly jobId: string;
  public readonly timestamp: number;
  public readonly departmentCode: string;
  public readonly originalPosition: number;
  public next: BloomNode | null;

  constructor(
    uid: string,
    jobId: string,
    timestamp: number,
    departmentCode: string,
    originalPosition: number
  ) {
    this.uid = uid;
    this.jobId = jobId;
    this.timestamp = timestamp;
    this.departmentCode = departmentCode;
    this.originalPosition = originalPosition;
    this.next = null;
  }

  public toSnapshot(): BloomNodeSnapshot {
    return {
      uid: this.uid,
      jobId: this.jobId,
      timestamp: this.timestamp,
      departmentCode: this.departmentCode,
      originalPosition: this.originalPosition,
    };
  }
}

export interface BloomNodeSnapshot {
  uid: string;
  jobId: string;
  timestamp: number;
  departmentCode: string;
  originalPosition: number;
}

export interface QueueValidationResult {
  departmentCode: string;
  valid: boolean;
  offendingIndex?: number;
  previousTimestamp?: number;
  offendingTimestamp?: number;
  message?: string;
}

/**
 * Genuine Singly Linked List storing a department's print / bloom queue.
 */
export class BloomLinkedList {
  public head: BloomNode | null = null;
  public tail: BloomNode | null = null;
  public length = 0;

  public append(
    uid: string,
    jobId: string,
    timestamp: number,
    departmentCode: string,
    originalPosition: number
  ): BloomNode {
    const node = new BloomNode(uid, jobId, timestamp, departmentCode, originalPosition);
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length += 1;
    return node;
  }

  public appendExisting(node: BloomNode): void {
    node.next = null;
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length += 1;
  }

  public validateSorted(departmentCode: string): QueueValidationResult {
    let curr = this.head;
    let index = 0;
    while (curr !== null && curr.next !== null) {
      if (curr.timestamp > curr.next.timestamp) {
        return {
          departmentCode,
          valid: false,
          offendingIndex: index + 1,
          previousTimestamp: curr.timestamp,
          offendingTimestamp: curr.next.timestamp,
          message: UNSORTED_QUEUE_ERROR,
        };
      }
      curr = curr.next;
      index += 1;
    }
    return { departmentCode, valid: true };
  }

  public toSnapshotArray(): BloomNodeSnapshot[] {
    const result: BloomNodeSnapshot[] = [];
    let curr = this.head;
    while (curr !== null) {
      result.push(curr.toSnapshot());
      curr = curr.next;
    }
    return result;
  }
}

/**
 * Deterministic comparator for K-Way Merge:
 * 1. Earliest timestamp comes first.
 * 2. Alphabetically smaller department code comes first (CIVIL < CS < CYBER < MATHS < MECH).
 * 3. Original position within the same department preserves input stability.
 */
export function compareBloomNodes(a: BloomNode, b: BloomNode): number {
  if (a.timestamp !== b.timestamp) {
    return a.timestamp - b.timestamp;
  }
  if (a.departmentCode !== b.departmentCode) {
    return a.departmentCode < b.departmentCode ? -1 : 1;
  }
  return a.originalPosition - b.originalPosition;
}

/**
 * Genuine Binary Min-Heap (Priority Queue) with O(K) auxiliary space.
 * Never uses Array.sort().
 */
export class BloomMinHeap {
  private readonly heap: BloomNode[] = [];
  public comparisons = 0;

  public get size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): BloomNode | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public insert(node: BloomNode): void {
    this.heap.push(node);
    this.siftUp(this.heap.length - 1);
  }

  public extractMin(): BloomNode | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop() ?? null;

    const min = this.heap[0];
    const last = this.heap.pop()!;
    this.heap[0] = last;
    this.siftDown(0);
    return min;
  }

  public snapshot(): BloomNodeSnapshot[] {
    return this.heap.map((node) => node.toSnapshot());
  }

  private compare(a: BloomNode, b: BloomNode): number {
    this.comparisons += 1;
    return compareBloomNodes(a, b);
  }

  private siftUp(index: number): void {
    let idx = index;
    while (idx > 0) {
      const parentIdx = (idx - 1) >> 1;
      if (this.compare(this.heap[idx], this.heap[parentIdx]) < 0) {
        const temp = this.heap[idx];
        this.heap[idx] = this.heap[parentIdx];
        this.heap[parentIdx] = temp;
        idx = parentIdx;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let idx = index;
    const len = this.heap.length;

    while (true) {
      const leftIdx = (idx << 1) + 1;
      const rightIdx = leftIdx + 1;
      let smallest = idx;

      if (leftIdx < len && this.compare(this.heap[leftIdx], this.heap[smallest]) < 0) {
        smallest = leftIdx;
      }
      if (rightIdx < len && this.compare(this.heap[rightIdx], this.heap[smallest]) < 0) {
        smallest = rightIdx;
      }

      if (smallest !== idx) {
        const temp = this.heap[idx];
        this.heap[idx] = this.heap[smallest];
        this.heap[smallest] = temp;
        idx = smallest;
      } else {
        break;
      }
    }
  }
}

export interface MergeStep {
  stepNumber: number;
  phase: 'init' | 'extract' | 'complete';
  narrationLines: string[];
  headline: string;
  heapBefore: BloomNodeSnapshot[];
  heapAfter: BloomNodeSnapshot[];
  selectedNode: BloomNodeSnapshot | null;
  insertedNextNode: BloomNodeSnapshot | null;
  departmentPointers: Record<string, number>;
  timelineSoFar: BloomNodeSnapshot[];
  comparisonsSoFar: number;
  tieBrokenAmong?: BloomNodeSnapshot[];
}

export interface DuplicateBloomGroup {
  timestamp: number;
  records: BloomNodeSnapshot[];
  distinctDepartments: string[];
  isCrossDepartment: boolean;
}

export interface VerificationCheckItem {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface VerificationReport {
  passed: boolean;
  totalReceived: number;
  totalProduced: number;
  missingCount: number;
  duplicateOutputCount: number;
  preservedJobIds: boolean;
  chronologicalOrdering: boolean;
  tieBreakingCorrect: boolean;
  originalOrderPreserved: boolean;
  checks: VerificationCheckItem[];
  failureSummary: string | null;
}

export interface MergeExecutionResult {
  success: boolean;
  validationErrors: QueueValidationResult[];
  mergedList: BloomLinkedList;
  mergedRecords: BloomNodeSnapshot[];
  steps: MergeStep[];
  traceOmittedForScale: boolean;
  duplicateGroups: DuplicateBloomGroup[];
  crossDepartmentConflicts: DuplicateBloomGroup[];
  verification: VerificationReport;
  metrics: {
    totalDepartments: number;
    activeDepartments: number;
    emptyDepartments: string[];
    totalRecordsReceived: number;
    totalRecordsMerged: number;
    heapComparisons: number;
    maxHeapSize: number;
    executionTimeMs: number;
  };
}

export interface DepartmentQueueInput {
  departmentCode: string;
  records: BloomInputRecord[];
}

function formatDepartmentLabel(code: string): string {
  const meta = DEPARTMENT_BY_CODE[code];
  if (!meta) return code;
  return `${meta.shortDepartmentName} (${meta.gardenName})`;
}

/**
 * Validates an individual department record array without modifying or sorting it.
 */
export function validateSingleQueue(
  departmentCode: string,
  records: BloomInputRecord[]
): QueueValidationResult {
  const list = new BloomLinkedList();
  for (let i = 0; i < records.length; i += 1) {
    const rec = records[i];
    list.append(rec.uid, rec.jobId, rec.timestamp, departmentCode, i);
  }
  return list.validateSorted(departmentCode);
}

/**
 * Detects duplicate bloom timestamps in O(N) time by walking the merged Linked List.
 */
export function detectDuplicateBloomTimes(mergedList: BloomLinkedList): DuplicateBloomGroup[] {
  const groups: DuplicateBloomGroup[] = [];
  let curr = mergedList.head;

  while (curr !== null) {
    const ts = curr.timestamp;
    const bucket: BloomNodeSnapshot[] = [curr.toSnapshot()];
    const deptSet = new Set<string>([curr.departmentCode]);
    let runner = curr.next;

    while (runner !== null && runner.timestamp === ts) {
      bucket.push(runner.toSnapshot());
      deptSet.add(runner.departmentCode);
      runner = runner.next;
    }

    if (bucket.length > 1) {
      groups.push({
        timestamp: ts,
        records: bucket,
        distinctDepartments: Array.from(deptSet),
        isCrossDepartment: deptSet.size > 1,
      });
    }

    curr = runner;
  }

  return groups;
}

/**
 * Garden Health Check — rigorous independent verification of the merged Linked List.
 */
export function verifyMergedTimeline(
  inputs: DepartmentQueueInput[],
  mergedList: BloomLinkedList
): VerificationReport {
  const inputByUid = new Map<string, { jobId: string; timestamp: number; departmentCode: string; originalPosition: number }>();
  let totalReceived = 0;

  for (const queue of inputs) {
    for (let i = 0; i < queue.records.length; i += 1) {
      const r = queue.records[i];
      totalReceived += 1;
      inputByUid.set(r.uid, {
        jobId: r.jobId,
        timestamp: r.timestamp,
        departmentCode: queue.departmentCode,
        originalPosition: i,
      });
    }
  }

  const seenUids = new Set<string>();
  let totalProduced = 0;
  let duplicateOutputCount = 0;
  let preservedJobIds = true;
  let chronologicalOrdering = true;
  let tieBreakingCorrect = true;
  let originalOrderPreserved = true;

  let prev: BloomNode | null = null;
  let curr = mergedList.head;

  while (curr !== null) {
    totalProduced += 1;

    if (seenUids.has(curr.uid)) {
      duplicateOutputCount += 1;
    } else {
      seenUids.add(curr.uid);
    }

    const original = inputByUid.get(curr.uid);
    if (
      !original ||
      original.jobId !== curr.jobId ||
      original.timestamp !== curr.timestamp ||
      original.departmentCode !== curr.departmentCode
    ) {
      preservedJobIds = false;
    }

    if (prev !== null) {
      if (prev.timestamp > curr.timestamp) {
        chronologicalOrdering = false;
      } else if (prev.timestamp === curr.timestamp) {
        if (prev.departmentCode > curr.departmentCode) {
          tieBreakingCorrect = false;
        } else if (
          prev.departmentCode === curr.departmentCode &&
          prev.originalPosition >= curr.originalPosition
        ) {
          originalOrderPreserved = false;
        }
      }
    }

    prev = curr;
    curr = curr.next;
  }

  let missingCount = 0;
  for (const uid of inputByUid.keys()) {
    if (!seenUids.has(uid)) {
      missingCount += 1;
    }
  }

  const countsMatch = totalReceived === totalProduced;
  const noMissing = missingCount === 0;
  const noDuplicateOutputs = duplicateOutputCount === 0;

  const checks: VerificationCheckItem[] = [
    {
      id: 'counts',
      label: 'Total Records Received vs Produced',
      passed: countsMatch,
      detail: `${totalReceived.toLocaleString()} received · ${totalProduced.toLocaleString()} produced`,
    },
    {
      id: 'missing',
      label: 'Missing Records',
      passed: noMissing,
      detail: noMissing ? '0 missing records' : `${missingCount} record(s) missing from timeline`,
    },
    {
      id: 'duplicates',
      label: 'Duplicate Output Records',
      passed: noDuplicateOutputs,
      detail: noDuplicateOutputs
        ? '0 duplicate output emissions'
        : `${duplicateOutputCount} duplicate output node(s) detected`,
    },
    {
      id: 'jobIds',
      label: 'Preserved Job Identifiers',
      passed: preservedJobIds,
      detail: preservedJobIds
        ? 'All original Job IDs and department tags preserved intact'
        : 'One or more Job IDs were altered or unmatched',
    },
    {
      id: 'chronological',
      label: 'Correct Chronological Ordering',
      passed: chronologicalOrdering,
      detail: chronologicalOrdering
        ? 'Non-decreasing blooming timestamps verified across full linked list'
        : 'Chronological inversion detected in merged output',
    },
    {
      id: 'tieBreak',
      label: 'Correct Alphabetical Tie-Breaking',
      passed: tieBreakingCorrect,
      detail: tieBreakingCorrect
        ? 'Equal timestamps follow strict alphabetical department code order'
        : 'Equal timestamp tie-break violated alphabetical department code order',
    },
    {
      id: 'stability',
      label: 'Preserved Original Department Order',
      passed: originalOrderPreserved,
      detail: originalOrderPreserved
        ? 'Same-department equal timestamps kept in exact submission order'
        : 'Relative order within a department was disturbed',
    },
  ];

  const failedChecks = checks.filter((c) => !c.passed);
  const passed = failedChecks.length === 0;

  return {
    passed,
    totalReceived,
    totalProduced,
    missingCount,
    duplicateOutputCount,
    preservedJobIds,
    chronologicalOrdering,
    tieBreakingCorrect,
    originalOrderPreserved,
    checks,
    failureSummary: passed
      ? null
      : `Verification failed on: ${failedChecks.map((c) => c.label).join(', ')}.`,
  };
}

/**
 * Genuine K-Way Merge using Singly Linked Lists + Binary Min-Heap.
 * Time Complexity: O(N log K)
 * Auxiliary Heap Space: O(K)
 * Output Linked List Space: O(N)
 */
export function mergeDepartmentQueues(
  inputs: DepartmentQueueInput[],
  options?: { captureTrace?: boolean; maxTraceJobs?: number }
): MergeExecutionResult {
  const startTime = performance.now();
  const captureTraceRequested = options?.captureTrace ?? true;
  const maxTraceJobs = options?.maxTraceJobs ?? 250;

  // 1. Build genuine Singly Linked Lists for each department and validate ascending order
  const listsByDept: { departmentCode: string; list: BloomLinkedList }[] = [];
  const validationErrors: QueueValidationResult[] = [];
  const emptyDepartments: string[] = [];
  let totalRecordsReceived = 0;

  for (const queue of inputs) {
    const list = new BloomLinkedList();
    for (let i = 0; i < queue.records.length; i += 1) {
      const rec = queue.records[i];
      list.append(rec.uid, rec.jobId, rec.timestamp, queue.departmentCode, i);
    }

    totalRecordsReceived += list.length;
    if (list.length === 0) {
      emptyDepartments.push(queue.departmentCode);
    }

    const validation = list.validateSorted(queue.departmentCode);
    if (!validation.valid) {
      validationErrors.push(validation);
    }

    listsByDept.push({ departmentCode: queue.departmentCode, list });
  }

  // Reject unsorted inputs cleanly without silently sorting
  if (validationErrors.length > 0) {
    const emptyMerged = new BloomLinkedList();
    const endTime = performance.now();
    return {
      success: false,
      validationErrors,
      mergedList: emptyMerged,
      mergedRecords: [],
      steps: [],
      traceOmittedForScale: false,
      duplicateGroups: [],
      crossDepartmentConflicts: [],
      verification: {
        passed: false,
        totalReceived: totalRecordsReceived,
        totalProduced: 0,
        missingCount: totalRecordsReceived,
        duplicateOutputCount: 0,
        preservedJobIds: false,
        chronologicalOrdering: false,
        tieBreakingCorrect: false,
        originalOrderPreserved: false,
        checks: [],
        failureSummary: UNSORTED_QUEUE_ERROR,
      },
      metrics: {
        totalDepartments: inputs.length,
        activeDepartments: inputs.length - emptyDepartments.length,
        emptyDepartments,
        totalRecordsReceived,
        totalRecordsMerged: 0,
        heapComparisons: 0,
        maxHeapSize: 0,
        executionTimeMs: Number((endTime - startTime).toFixed(3)),
      },
    };
  }

  const shouldRecordTrace = captureTraceRequested && totalRecordsReceived <= maxTraceJobs;
  const traceOmittedForScale = captureTraceRequested && totalRecordsReceived > maxTraceJobs;

  // 2. Initialize Min-Heap with head of each non-empty Linked List — O(K) space
  const heap = new BloomMinHeap();
  const mergedList = new BloomLinkedList();
  const steps: MergeStep[] = [];
  const departmentPointers: Record<string, number> = {};

  for (const { departmentCode, list } of listsByDept) {
    departmentPointers[departmentCode] = 0;
    if (list.head !== null) {
      heap.insert(list.head);
    }
  }

  let maxHeapSize = heap.size;
  const timelineRunning: BloomNodeSnapshot[] = [];

  if (shouldRecordTrace) {
    const initialHeap = heap.snapshot();
    const initLines =
      initialHeap.length === 0
        ? ['All gardens are currently resting with no blooming records to merge.']
        : initialHeap.map(
            (n) =>
              `${formatDepartmentLabel(n.departmentCode)} brings its first bloom ${n.jobId} at time ${n.timestamp}.`
          );

    steps.push({
      stepNumber: 0,
      phase: 'init',
      headline:
        initialHeap.length === 0
          ? 'All gardens are empty — ready to complete.'
          : `Loaded ${initialHeap.length} earliest garden bloom${initialHeap.length === 1 ? '' : 's'} into the central Min-Heap.`,
      narrationLines: initLines,
      heapBefore: [],
      heapAfter: initialHeap,
      selectedNode: null,
      insertedNextNode: null,
      departmentPointers: { ...departmentPointers },
      timelineSoFar: [],
      comparisonsSoFar: heap.comparisons,
    });
  }

  // 3. Repeatedly extract minimum node and advance its department's Linked List pointer
  let stepCounter = 1;
  while (!heap.isEmpty()) {
    const heapBefore = shouldRecordTrace ? heap.snapshot() : [];

    const minNode = heap.extractMin()!;
    const nextInDept = minNode.next;

    // Append cloned node to the output Linked List so original department chains remain inspectable
    mergedList.append(
      minNode.uid,
      minNode.jobId,
      minNode.timestamp,
      minNode.departmentCode,
      minNode.originalPosition
    );

    departmentPointers[minNode.departmentCode] =
      (departmentPointers[minNode.departmentCode] ?? 0) + 1;

    if (nextInDept !== null) {
      heap.insert(nextInDept);
      if (heap.size > maxHeapSize) {
        maxHeapSize = heap.size;
      }
    }

    if (shouldRecordTrace) {
      const selectedSnap = minNode.toSnapshot();
      const insertedSnap = nextInDept ? nextInDept.toSnapshot() : null;
      timelineRunning.push(selectedSnap);

      const narrationLines: string[] = heapBefore.map(
        (candidate) =>
          `${formatDepartmentLabel(candidate.departmentCode)} has ${candidate.jobId} at time ${candidate.timestamp}.`
      );

      const tiedCandidates = heapBefore.filter((c) => c.timestamp === selectedSnap.timestamp);
      if (tiedCandidates.length > 1) {
        narrationLines.push(
          `Multiple blooms share time ${selectedSnap.timestamp}. Alphabetical department code order selects ${selectedSnap.departmentCode} (${selectedSnap.jobId}) first.`
        );
      } else {
        narrationLines.push(
          `The earliest record ${selectedSnap.jobId} (time ${selectedSnap.timestamp}) is selected from ${formatDepartmentLabel(selectedSnap.departmentCode)}.`
        );
      }

      if (insertedSnap) {
        narrationLines.push(
          `Next bloom ${insertedSnap.jobId} (time ${insertedSnap.timestamp}) from ${formatDepartmentLabel(insertedSnap.departmentCode)} enters the Min-Heap.`
        );
      } else {
        narrationLines.push(
          `${formatDepartmentLabel(selectedSnap.departmentCode)} has no remaining blooms.`
        );
      }

      steps.push({
        stepNumber: stepCounter,
        phase: 'extract',
        headline: `Selected ${selectedSnap.jobId} (Time ${selectedSnap.timestamp}) from ${formatDepartmentLabel(selectedSnap.departmentCode)}`,
        narrationLines,
        heapBefore,
        heapAfter: heap.snapshot(),
        selectedNode: selectedSnap,
        insertedNextNode: insertedSnap,
        departmentPointers: { ...departmentPointers },
        timelineSoFar: [...timelineRunning],
        comparisonsSoFar: heap.comparisons,
        tieBrokenAmong: tiedCandidates.length > 1 ? tiedCandidates : undefined,
      });
    }

    stepCounter += 1;
  }

  if (shouldRecordTrace) {
    steps.push({
      stepNumber: stepCounter,
      phase: 'complete',
      headline: 'All gardens synchronized into the Master Bloom Timeline.',
      narrationLines: [
        `Synchronization finished with ${mergedList.length} bloom${mergedList.length === 1 ? '' : 's'} placed in chronological order using ${heap.comparisons} heap comparisons.`,
      ],
      heapBefore: [],
      heapAfter: [],
      selectedNode: null,
      insertedNextNode: null,
      departmentPointers: { ...departmentPointers },
      timelineSoFar: [...timelineRunning],
      comparisonsSoFar: heap.comparisons,
    });
  }

  const endTime = performance.now();

  const mergedRecords = mergedList.toSnapshotArray();
  const duplicateGroups = detectDuplicateBloomTimes(mergedList);
  const crossDepartmentConflicts = duplicateGroups.filter((g) => g.isCrossDepartment);
  const verification = verifyMergedTimeline(inputs, mergedList);

  return {
    success: true,
    validationErrors: [],
    mergedList,
    mergedRecords,
    steps,
    traceOmittedForScale,
    duplicateGroups,
    crossDepartmentConflicts,
    verification,
    metrics: {
      totalDepartments: inputs.length,
      activeDepartments: inputs.length - emptyDepartments.length,
      emptyDepartments,
      totalRecordsReceived,
      totalRecordsMerged: mergedList.length,
      heapComparisons: heap.comparisons,
      maxHeapSize,
      executionTimeMs: Number((endTime - startTime).toFixed(3)),
    },
  };
}
