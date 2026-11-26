import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../data/departments';
import { BotanicalImage } from './BotanicalImage';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterGarden: () => void;
}

const STEPS = [
  {
    number: '01',
    title: 'Visit the Five Department Gardens',
    text: 'Each university department tends its own flower garden — Computer Science (Rose), Civil Engineering (Sunflower), Mathematics (Tulip), Mechanical Engineering (Cherry Blossom), and Cyber Security (Fern).',
  },
  {
    number: '02',
    title: 'Add Blooming Records in Time Order',
    text: 'Enter a Job ID (such as A2) and a Blooming Time (such as 2) for any garden. Keep each garden’s own list in ascending blooming time order.',
  },
  {
    number: '03',
    title: 'Synchronize All Gardens',
    text: 'Click Synchronize and watch the garden’s central Min-Heap gently select the earliest bloom from across all five departments step by step.',
  },
  {
    number: '04',
    title: 'Inspect the Restored Timeline & Report',
    text: 'Explore the Master Bloom Timeline, see overlapping blooms sorted alphabetically by department code, verify every bloom passed the Garden Health Check, and download your report.',
  },
];

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onEnterGarden,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#344B38]/45 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFF9F0] border border-[#344B38]/15 shadow-xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#344B38]/10">
          <div>
            <p className="text-sm font-medium text-[#667855]">Visitor Guide</p>
            <h2
              id="how-to-play-title"
              className="font-display text-2xl sm:text-3xl font-semibold text-[#344B38] mt-1"
            >
              How to Restore the Secret Garden
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#344B38]/15 text-[#344B38] hover:bg-[#FAF2E4] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-5 text-sm sm:text-base text-[#344B38]/80 leading-relaxed">
          No computer science background is needed. Think of Secret Garden as five
          botanical notebooks whose flower timestamps need to be woven into one
          complete master chronicle.
        </p>

        <ol className="mt-6 space-y-5">
          {STEPS.map((step) => (
            <li key={step.number} className="flex gap-4">
              <span className="font-mono text-sm font-semibold text-[#8A9A75] tabular-nums pt-0.5 shrink-0">
                {step.number}.
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#344B38]">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-[#344B38]/80 leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7 pt-5 border-t border-[#344B38]/10">
          <p className="text-xs font-medium text-[#344B38]/65 mb-3">
            Tie-breaking rule when two gardens bloom at the exact same time: alphabetical department code order
            (CIVIL · CS · CYBER · MATHS · MECH).
          </p>
          <div className="grid grid-cols-5 gap-2">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.code} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden bg-[#FAF2E4]">
                  <BotanicalImage
                    src={dept.imageUrl}
                    alt={`${dept.departmentName} — ${dept.flowerName}`}
                    accentColor={dept.accentColor}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="mt-1.5 text-xs font-semibold text-[#344B38] truncate">
                  {dept.code}
                </p>
                <p className="text-[11px] text-[#344B38]/65 truncate">{dept.flowerName}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#344B38] border border-[#344B38]/20 rounded-lg hover:bg-[#FAF2E4] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEnterGarden();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#27392A] rounded-lg transition-colors cursor-pointer"
          >
            Enter the Garden
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
