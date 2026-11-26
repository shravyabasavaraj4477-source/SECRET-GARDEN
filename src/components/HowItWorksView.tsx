import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Play, XCircle } from 'lucide-react';
import { DEPARTMENTS } from '../data/departments';
import { runAllTestScenarios, TestCaseResult } from '../dsa/testLab';
import { BotanicalImage } from './BotanicalImage';
import { BotanicalLeafSprig } from './BotanicalAtmosphere';

export const HowItWorksView: React.FC = () => {
  const [audienceMode, setAudienceMode] = useState<'story' | 'technical'>('story');
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleRunTests = () => {
    setIsRunningTests(true);
    // Yield one frame so the button reflects activity before running the 100,000-job test
    window.setTimeout(() => {
      const results = runAllTestScenarios();
      setTestResults(results);
      setIsRunningTests(false);
    }, 30);
  };

  const passedCount = testResults ? testResults.filter((t) => t.passed).length : 0;

  return (
    <div className="space-y-10">
      {/* Header + Audience Mode Switch */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <BotanicalLeafSprig className="w-24 h-7 mb-2 opacity-80" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#344B38]">
            How the Secret Garden Works
          </h1>
          <p className="mt-2 text-base text-[#344B38]/75 max-w-2xl">
            Explore the simple garden story behind our timeline restoration, or switch to the technical DSA specification for judges and engineers.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-[#FAF2E4] rounded-lg border border-[#344B38]/12 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setAudienceMode('story')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              audienceMode === 'story'
                ? 'bg-[#344B38] text-[#FFF9F0]'
                : 'text-[#344B38]/75 hover:text-[#344B38]'
            }`}
          >
            Simple Garden Guide
          </button>
          <button
            type="button"
            onClick={() => setAudienceMode('technical')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              audienceMode === 'technical'
                ? 'bg-[#344B38] text-[#FFF9F0]'
                : 'text-[#344B38]/75 hover:text-[#344B38]'
            }`}
          >
            Technical DSA Spec
          </button>
        </div>
      </section>

      {audienceMode === 'story' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Linked List */}
          <article className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 space-y-4">
            <p className="text-xs font-mono text-[#667855]">01. Linked List</p>
            <h2 className="font-display text-2xl font-semibold text-[#344B38]">
              A Chain of Connected Blooms
            </h2>
            <p className="text-sm text-[#344B38]/80 leading-relaxed">
              &ldquo;Imagine each flower record connected to the next flower. Together, they form a chain.&rdquo;
            </p>
            <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-4 overflow-x-auto">
              <div className="inline-flex items-center gap-2 min-w-max">
                {[
                  { id: 'A2', t: 2 },
                  { id: 'A7', t: 7 },
                  { id: 'A14', t: 14 },
                ].map((node, idx) => (
                  <React.Fragment key={node.id}>
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: idx * 0.4 }}
                      className="rounded-lg bg-white border border-[#D88F9A]/60 px-3 py-2 flex items-center gap-2"
                    >
                      <div className="w-7 h-7">
                        <BotanicalImage
                          src={DEPARTMENTS[0].imageUrl}
                          alt="Rose"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-mono text-xs text-[#344B38]">
                        {node.id} · t={node.t}
                      </span>
                    </motion.div>
                    <span className="font-mono text-xs text-[#8A9A75]">next →</span>
                  </React.Fragment>
                ))}
                <span className="font-mono text-xs text-[#344B38]/50">NULL</span>
              </div>
            </div>
          </article>

          {/* 2. Min-Heap */}
          <article className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 space-y-4">
            <p className="text-xs font-mono text-[#667855]">02. Min-Heap</p>
            <h2 className="font-display text-2xl font-semibold text-[#344B38]">
              Five Gardeners Holding Their Earliest Bloom
            </h2>
            <p className="text-sm text-[#344B38]/80 leading-relaxed">
              &ldquo;Imagine five gardeners waiting with their next flower record. The system always selects the earliest blooming record.&rdquo;
            </p>
            <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-4 flex flex-wrap items-center justify-center gap-3">
              {[
                { dept: DEPARTMENTS[1], id: 'B1', t: 1, winner: true },
                { dept: DEPARTMENTS[0], id: 'A2', t: 2, winner: false },
                { dept: DEPARTMENTS[2], id: 'C3', t: 3, winner: false },
                { dept: DEPARTMENTS[4], id: 'E5', t: 5, winner: false },
                { dept: DEPARTMENTS[3], id: 'D9', t: 9, winner: false },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border px-3 py-2 text-center ${
                    item.winner
                      ? 'bg-[#344B38] text-[#FFF9F0] border-[#344B38]'
                      : 'bg-white text-[#344B38] border-[#344B38]/12'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto rounded bg-[#FFF9F0] p-0.5 mb-1">
                    <BotanicalImage
                      src={item.dept.imageUrl}
                      alt={item.dept.flowerName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-mono text-xs font-semibold">
                    {item.id} · t={item.t}
                  </p>
                  {item.winner && (
                    <p className="text-[10px] text-[#C8D5BA] mt-0.5">Earliest Root</p>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* 3. K-Way Merge */}
          <article className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 space-y-4">
            <p className="text-xs font-mono text-[#667855]">03. K-Way Merge</p>
            <h2 className="font-display text-2xl font-semibold text-[#344B38]">
              Weaving Already-Ordered Lists Together
            </h2>
            <p className="text-sm text-[#344B38]/80 leading-relaxed">
              &ldquo;Instead of arranging all flowers from scratch, we combine the already-arranged garden lists efficiently.&rdquo;
            </p>
            <ol className="text-sm text-[#344B38]/80 space-y-2 pt-1">
              <li>1. Place the first bloom from each non-empty garden into the Min-Heap.</li>
              <li>2. Pick the earliest bloom from the top of the heap and place it into the Master Timeline.</li>
              <li>3. Ask that same garden for its next connected flower and put it into the heap.</li>
              <li>4. Repeat until every bloom from every garden has found its place.</li>
            </ol>
          </article>

          {/* 4. Complexity */}
          <article className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 space-y-4">
            <p className="text-xs font-mono text-[#667855]">04. Time &amp; Space Efficiency</p>
            <h2 className="font-display text-2xl font-semibold text-[#344B38]">
              Why It Stays Fast Even for 100,000 Blooms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-3.5">
                <p className="text-xs text-[#344B38]/65">Time Complexity</p>
                <p className="mt-1 font-mono text-lg font-bold text-[#344B38]">O(N log K)</p>
                <p className="mt-1 text-xs text-[#344B38]/70">
                  Each of N blooms enters and leaves a tiny heap of size K.
                </p>
              </div>
              <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-3.5">
                <p className="text-xs text-[#344B38]/65">Auxiliary Heap Space</p>
                <p className="mt-1 font-mono text-lg font-bold text-[#344B38]">O(K)</p>
                <p className="mt-1 text-xs text-[#344B38]/70">
                  Only 1 active bloom per department sits in the heap at once.
                </p>
              </div>
              <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-3.5">
                <p className="text-xs text-[#344B38]/65">Output Storage</p>
                <p className="mt-1 font-mono text-lg font-bold text-[#344B38]">O(N)</p>
                <p className="mt-1 text-xs text-[#344B38]/70">
                  Maintains a separate merged output linked list of all N blooms.
                </p>
              </div>
            </div>
          </article>
        </div>
      ) : (
        /* Technical DSA Specification for Judges */
        <section className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#344B38]">
              Technical DSA Architecture — Print Queue Consolidation
            </h2>
            <p className="mt-1 text-sm text-[#344B38]/75">
              Formal data structures, invariants, and comparator specification implemented in <span className="font-mono">src/dsa/kWayMerge.ts</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-4 space-y-2">
              <h3 className="font-semibold text-[#344B38]">Singly Linked List Node</h3>
              <pre className="font-mono text-xs text-[#344B38]/85 overflow-x-auto leading-relaxed">
{`class BloomNode {
  uid: string;
  jobId: string;
  timestamp: number;
  departmentCode: string;
  originalPosition: number;
  next: BloomNode | null;
}`}
              </pre>
            </div>

            <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-4 space-y-2">
              <h3 className="font-semibold text-[#344B38]">Deterministic 3-Tier Comparator</h3>
              <pre className="font-mono text-xs text-[#344B38]/85 overflow-x-auto leading-relaxed">
{`function compareBloomNodes(a, b) {
  if (a.timestamp !== b.timestamp)
    return a.timestamp - b.timestamp;
  if (a.departmentCode !== b.departmentCode)
    return a.departmentCode < b.departmentCode ? -1 : 1;
  return a.originalPosition - b.originalPosition;
}`}
              </pre>
            </div>

            <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-4 space-y-1.5">
              <h3 className="font-semibold text-[#344B38]">Algorithm Guarantees</h3>
              <ul className="text-xs text-[#344B38]/80 space-y-1.5 leading-relaxed">
                <li>· Genuine array-backed binary Min-Heap with manual <span className="font-mono">siftUp</span> and <span className="font-mono">siftDown</span>.</li>
                <li>· Zero use of <span className="font-mono">Array.sort()</span> anywhere in the merge pipeline.</li>
                <li>· Strict input validation rejects unsorted department linked lists without silent mutation.</li>
                <li>· Alphabetical department ordering: <span className="font-mono">CIVIL &lt; CS &lt; CYBER &lt; MATHS &lt; MECH</span> (and scales to arbitrary codes).</li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/10 p-4 space-y-1.5">
              <h3 className="font-semibold text-[#344B38]">Complexity &amp; Scalability</h3>
              <ul className="text-xs text-[#344B38]/80 space-y-1.5 leading-relaxed">
                <li>· <strong>Time Complexity</strong>: <span className="font-mono">O(N log K)</span> — each of N nodes performs at most one heap insert and one extractMin.</li>
                <li>· <strong>Auxiliary Heap Space</strong>: <span className="font-mono">O(K)</span> — at most one head node per queue resides in the Min-Heap.</li>
                <li>· <strong>Output Storage</strong>: <span className="font-mono">O(N)</span> — dedicated output Singly Linked List preserves input queues intact.</li>
                <li>· Tested live below at K = 200 departments and N = 100,000 jobs.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* TESTING LAB */}
      <section
        aria-label="Testing Lab"
        className="rounded-2xl bg-[#FFFDF9] border border-[#344B38]/12 p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#667855]">Automated Verification Suite</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#344B38] mt-0.5">
              Testing Lab
            </h2>
            <p className="mt-1 text-sm text-[#344B38]/75">
              Execute all 8 scenarios against the real Linked List &amp; Min-Heap K-Way Merge engine — including a 200-department, 100,000-job benchmark.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#263829] disabled:opacity-60 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            {isRunningTests ? 'Running All Tests…' : 'Run All Tests'}
          </button>
        </div>

        {testResults && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F4F8F2] border border-[#8A9A75]/40 px-4 py-3 text-sm">
              <span className="font-semibold text-[#344B38] tabular-nums">
                {passedCount} of {testResults.length} test scenarios passed
              </span>
              <span className="text-xs font-mono text-[#4E7A52] font-semibold">
                {passedCount === testResults.length ? 'ALL TESTS PASSED' : 'ATTENTION REQUIRED'}
              </span>
            </div>

            <div className="space-y-3">
              {testResults.map((tc) => (
                <div
                  key={tc.id}
                  className="rounded-xl bg-[#FFF9F0] border border-[#344B38]/12 p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-[#344B38]">
                        {tc.name}
                      </h3>
                      <p className="text-xs text-[#344B38]/70 mt-0.5">{tc.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-[#344B38]/65 tabular-nums">
                        {tc.executionTimeMs.toFixed(2)} ms · {tc.comparisons.toLocaleString()} cmp
                      </span>
                      {tc.passed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4E7A52]">
                          <CheckCircle2 className="w-4 h-4" />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#A43B32]">
                          <XCircle className="w-4 h-4" />
                          FAIL
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#344B38]/8">
                    <div>
                      <span className="text-[#344B38]/60 block mb-0.5">Expected Output</span>
                      <p className="font-mono text-[#344B38] break-words">{tc.expected}</p>
                    </div>
                    <div>
                      <span className="text-[#344B38]/60 block mb-0.5">Actual Output</span>
                      <p className="font-mono text-[#344B38] break-words">{tc.actual}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
