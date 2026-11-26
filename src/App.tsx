import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BloomInputRecord,
  createConflictDemoQueues,
  createEmptyQueues,
  createRecordUid,
  createSampleQueues,
  DEPARTMENTS,
  DepartmentCode,
} from './data/departments';
import {
  DepartmentQueueInput,
  MergeExecutionResult,
  mergeDepartmentQueues,
  QueueValidationResult,
  validateSingleQueue,
} from './dsa/kWayMerge';
import { BotanicalAtmosphere } from './components/BotanicalAtmosphere';
import { LandingPage } from './components/LandingPage';
import { Navbar, NavTab } from './components/Navbar';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DashboardView } from './components/DashboardView';
import { MyGardensView } from './components/MyGardensView';
import { DepartmentDetailView } from './components/DepartmentDetailView';
import { BloomTimelineView } from './components/BloomTimelineView';
import { RestoredCelebrationModal } from './components/RestoredCelebrationModal';
import { HowItWorksView } from './components/HowItWorksView';
import { GardenReportView } from './components/GardenReportView';

export default function App() {
  const [enteredGarden, setEnteredGarden] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode | null>(null);

  const [queues, setQueues] = useState<Record<DepartmentCode, BloomInputRecord[]>>(() =>
    createSampleQueues()
  );
  const [mergeResult, setMergeResult] = useState<MergeExecutionResult | null>(null);
  const [syncRunId, setSyncRunId] = useState(0);
  const [isDirty, setIsDirty] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // Close open modals on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (howToPlayOpen) setHowToPlayOpen(false);
        if (showCelebration) setShowCelebration(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [howToPlayOpen, showCelebration]);

  // Live reactive sort-order validation for each department (never silently sorts)
  const validations = useMemo<Record<DepartmentCode, QueueValidationResult>>(() => {
    const map = {} as Record<DepartmentCode, QueueValidationResult>;
    for (const dept of DEPARTMENTS) {
      map[dept.code] = validateSingleQueue(dept.code, queues[dept.code]);
    }
    return map;
  }, [queues]);

  const handleAddRecord = useCallback(
    (dept: DepartmentCode, jobId: string, timestamp: number) => {
      const newRec: BloomInputRecord = {
        uid: createRecordUid(dept.toLowerCase()),
        jobId,
        timestamp,
        departmentCode: dept,
      };
      setQueues((prev) => ({
        ...prev,
        [dept]: [...prev[dept], newRec],
      }));
      setIsDirty(true);
    },
    []
  );

  const handleEditRecord = useCallback(
    (dept: DepartmentCode, uid: string, jobId: string, timestamp: number) => {
      setQueues((prev) => ({
        ...prev,
        [dept]: prev[dept].map((r) =>
          r.uid === uid ? { ...r, jobId, timestamp } : r
        ),
      }));
      setIsDirty(true);
    },
    []
  );

  const handleDeleteRecord = useCallback((dept: DepartmentCode, uid: string) => {
    setQueues((prev) => ({
      ...prev,
      [dept]: prev[dept].filter((r) => r.uid !== uid),
    }));
    setIsDirty(true);
  }, []);

  const handleClearDepartment = useCallback((dept: DepartmentCode) => {
    setQueues((prev) => ({
      ...prev,
      [dept]: [],
    }));
    setIsDirty(true);
  }, []);

  const handleLoadSample = useCallback(() => {
    setQueues(createSampleQueues());
    setMergeResult(null);
    setIsDirty(true);
  }, []);

  const handleLoadConflictDemo = useCallback(() => {
    setQueues(createConflictDemoQueues());
    setMergeResult(null);
    setIsDirty(true);
  }, []);

  const handleClearAll = useCallback(() => {
    setQueues(createEmptyQueues());
    setMergeResult(null);
    setIsDirty(true);
  }, []);

  const handleOpenDepartment = useCallback((dept: DepartmentCode) => {
    setSelectedDepartment(dept);
    setActiveTab('gardens');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectTab = useCallback((tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'gardens') {
      setSelectedDepartment(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Genuine K-Way Merge Synchronization — reactive from any screen
  const handleSynchronize = useCallback(() => {
    const inputs: DepartmentQueueInput[] = DEPARTMENTS.map((dept) => ({
      departmentCode: dept.code,
      records: queues[dept.code],
    }));

    const result = mergeDepartmentQueues(inputs, {
      captureTrace: true,
      maxTraceJobs: 250,
    });

    setMergeResult(result);
    setActiveTab('timeline');
    setSelectedDepartment(null);

    if (result.success) {
      setIsDirty(false);
      setSyncRunId((prev) => prev + 1);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [queues]);

  const handleAnimationFinished = useCallback(() => {
    setShowCelebration(true);
  }, []);

  if (!enteredGarden) {
    return (
      <>
        <BotanicalAtmosphere intensity="subtle" />
        <LandingPage
          onEnterGarden={() => {
            setEnteredGarden(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
        />
        <HowToPlayModal
          isOpen={howToPlayOpen}
          onClose={() => setHowToPlayOpen(false)}
          onEnterGarden={() => {
            setEnteredGarden(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FFF9F0] text-[#344B38]">
      <BotanicalAtmosphere intensity="subtle" />

      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onReturnLanding={() => {
          setEnteredGarden(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSyncNow={handleSynchronize}
      />

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'home' && (
          <DashboardView
            queues={queues}
            validations={validations}
            mergeResult={mergeResult}
            isDirty={isDirty}
            onAddRecord={handleAddRecord}
            onOpenDepartment={handleOpenDepartment}
            onSynchronize={handleSynchronize}
            onLoadSample={handleLoadSample}
            onLoadConflictDemo={handleLoadConflictDemo}
            onClearAll={handleClearAll}
            onGoToTimeline={() => handleSelectTab('timeline')}
          />
        )}

        {activeTab === 'gardens' &&
          (selectedDepartment ? (
            <DepartmentDetailView
              departmentCode={selectedDepartment}
              records={queues[selectedDepartment]}
              validation={validations[selectedDepartment]}
              onBack={() => setSelectedDepartment(null)}
              onAddRecord={handleAddRecord}
              onEditRecord={handleEditRecord}
              onDeleteRecord={handleDeleteRecord}
              onClearDepartment={handleClearDepartment}
              onSynchronize={handleSynchronize}
            />
          ) : (
            <MyGardensView
              queues={queues}
              validations={validations}
              onAddRecord={handleAddRecord}
              onOpenDepartment={handleOpenDepartment}
              onSynchronize={handleSynchronize}
            />
          ))}

        {activeTab === 'timeline' && (
          <BloomTimelineView
            queues={queues}
            validations={validations}
            mergeResult={mergeResult}
            syncRunId={syncRunId}
            isDirty={isDirty}
            onSynchronize={handleSynchronize}
            onOpenDepartment={handleOpenDepartment}
            onAnimationFinished={handleAnimationFinished}
            onShowCelebration={() => setShowCelebration(true)}
          />
        )}

        {activeTab === 'how-it-works' && <HowItWorksView />}

        {activeTab === 'report' && (
          <GardenReportView
            mergeResult={mergeResult}
            onSynchronize={handleSynchronize}
          />
        )}
      </main>

      <footer className="relative z-10 mt-auto border-t border-[#344B38]/10 bg-[#FFF9F0]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#344B38]/65">
          <span>Secret Garden — The Mystery of the Lost Bloom</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setHowToPlayOpen(true)}
              className="hover:text-[#344B38] transition-colors cursor-pointer"
            >
              How to Play
            </button>
            <span aria-hidden="true">·</span>
            <span>Every Flower Has a Time. Every Garden Has a Story.</span>
          </div>
        </div>
      </footer>

      <HowToPlayModal
        isOpen={howToPlayOpen}
        onClose={() => setHowToPlayOpen(false)}
        onEnterGarden={() => setHowToPlayOpen(false)}
      />

      <RestoredCelebrationModal
        isOpen={showCelebration}
        mergeResult={mergeResult}
        onExplore={() => {
          setShowCelebration(false);
          setActiveTab('timeline');
        }}
      />
    </div>
  );
}
