export type DepartmentCode = 'CS' | 'CIVIL' | 'MATHS' | 'MECH' | 'CYBER';

export interface DepartmentMeta {
  code: DepartmentCode;
  departmentName: string;
  shortDepartmentName: string;
  flowerName: string;
  gardenName: string;
  accentColor: string;
  tintBg: string;
  borderColor: string;
  imageUrl: string;
  description: string;
  samplePrefix: string;
}

export interface BloomInputRecord {
  uid: string;
  jobId: string;
  timestamp: number;
  departmentCode: string;
}

export const HERO_GARDEN_IMAGE =
  '/src/assets/images/hero_secret_garden_1795676293031.jpg';

export const DEPARTMENTS: DepartmentMeta[] = [
  {
    code: 'CS',
    departmentName: 'Computer Science Department',
    shortDepartmentName: 'Computer Science',
    flowerName: 'Rose',
    gardenName: 'Rose Garden',
    accentColor: '#D88F9A',
    tintBg: '#FDF2F4',
    borderColor: '#EBC9CF',
    imageUrl: '/src/assets/images/flower_rose_botanical_1795676293153.jpg',
    description: 'Algorithm sheets, compiler drafts, and lab print logs from the Rose conservatory.',
    samplePrefix: 'A',
  },
  {
    code: 'CIVIL',
    departmentName: 'Civil Engineering Department',
    shortDepartmentName: 'Civil Engineering',
    flowerName: 'Sunflower',
    gardenName: 'Sunflower Garden',
    accentColor: '#E7BC52',
    tintBg: '#FDF8EA',
    borderColor: '#EEDB9E',
    imageUrl: '/src/assets/images/flower_sunflower_botanical_1795676293781.jpg',
    description: 'Structural blueprints, site surveys, and terrace schedules from the Sunflower beds.',
    samplePrefix: 'B',
  },
  {
    code: 'MATHS',
    departmentName: 'Mathematics Department',
    shortDepartmentName: 'Mathematics',
    flowerName: 'Tulip',
    gardenName: 'Tulip Garden',
    accentColor: '#B9A4D4',
    tintBg: '#F6F2FA',
    borderColor: '#DDD2EC',
    imageUrl: '/src/assets/images/flower_tulip_botanical_1795676294769.jpg',
    description: 'Proof folios, theorem sets, and numerical tables cultivated in the Tulip meadow.',
    samplePrefix: 'C',
  },
  {
    code: 'MECH',
    departmentName: 'Mechanical Engineering Department',
    shortDepartmentName: 'Mechanical Engineering',
    flowerName: 'Cherry Blossom',
    gardenName: 'Cherry Blossom Garden',
    accentColor: '#F3B9C5',
    tintBg: '#FEF4F6',
    borderColor: '#F2D2DA',
    imageUrl: '/src/assets/images/flower_cherry_blossom_botanical_1795676295657.jpg',
    description: 'CAD schematics, turbine diagrams, and workshop logs beneath the Cherry Blossom canopy.',
    samplePrefix: 'D',
  },
  {
    code: 'CYBER',
    departmentName: 'Cyber Security Department',
    shortDepartmentName: 'Cyber Security',
    flowerName: 'Fern',
    gardenName: 'Fern Garden',
    accentColor: '#8FB89A',
    tintBg: '#F1F7F3',
    borderColor: '#C9DFCF',
    imageUrl: '/src/assets/images/flower_fern_botanical_1795676296090.jpg',
    description: 'Audit trails, cipher dossiers, and network ledgers sheltered in the Fern grotto.',
    samplePrefix: 'E',
  },
];

export const DEPARTMENT_BY_CODE: Record<string, DepartmentMeta> = Object.fromEntries(
  DEPARTMENTS.map((dept) => [dept.code, dept])
);

export const ALPHABETICAL_DEPARTMENT_CODES: DepartmentCode[] = [
  'CIVIL',
  'CS',
  'CYBER',
  'MATHS',
  'MECH',
];

let recordCounter = 100;
export function createRecordUid(prefix = 'rec'): string {
  recordCounter += 1;
  return `${prefix}_${recordCounter}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createSampleQueues(): Record<DepartmentCode, BloomInputRecord[]> {
  return {
    CS: [
      { uid: createRecordUid('cs'), jobId: 'A2', timestamp: 2, departmentCode: 'CS' },
      { uid: createRecordUid('cs'), jobId: 'A7', timestamp: 7, departmentCode: 'CS' },
      { uid: createRecordUid('cs'), jobId: 'A14', timestamp: 14, departmentCode: 'CS' },
    ],
    CIVIL: [
      { uid: createRecordUid('civil'), jobId: 'B1', timestamp: 1, departmentCode: 'CIVIL' },
      { uid: createRecordUid('civil'), jobId: 'B7', timestamp: 7, departmentCode: 'CIVIL' },
      { uid: createRecordUid('civil'), jobId: 'B12', timestamp: 12, departmentCode: 'CIVIL' },
    ],
    MATHS: [
      { uid: createRecordUid('maths'), jobId: 'C3', timestamp: 3, departmentCode: 'MATHS' },
      { uid: createRecordUid('maths'), jobId: 'C10', timestamp: 10, departmentCode: 'MATHS' },
    ],
    MECH: [
      { uid: createRecordUid('mech'), jobId: 'D9', timestamp: 9, departmentCode: 'MECH' },
      { uid: createRecordUid('mech'), jobId: 'D15', timestamp: 15, departmentCode: 'MECH' },
    ],
    CYBER: [
      { uid: createRecordUid('cyber'), jobId: 'E5', timestamp: 5, departmentCode: 'CYBER' },
      { uid: createRecordUid('cyber'), jobId: 'E10', timestamp: 10, departmentCode: 'CYBER' },
    ],
  };
}

export function createConflictDemoQueues(): Record<DepartmentCode, BloomInputRecord[]> {
  return {
    CS: [
      { uid: createRecordUid('cs'), jobId: 'CS-4a', timestamp: 4, departmentCode: 'CS' },
      { uid: createRecordUid('cs'), jobId: 'CS-4b', timestamp: 4, departmentCode: 'CS' },
      { uid: createRecordUid('cs'), jobId: 'CS-9', timestamp: 9, departmentCode: 'CS' },
    ],
    CIVIL: [
      { uid: createRecordUid('civil'), jobId: 'CIV-4', timestamp: 4, departmentCode: 'CIVIL' },
      { uid: createRecordUid('civil'), jobId: 'CIV-9', timestamp: 9, departmentCode: 'CIVIL' },
    ],
    MATHS: [
      { uid: createRecordUid('maths'), jobId: 'MTH-4', timestamp: 4, departmentCode: 'MATHS' },
      { uid: createRecordUid('maths'), jobId: 'MTH-11', timestamp: 11, departmentCode: 'MATHS' },
    ],
    MECH: [
      { uid: createRecordUid('mech'), jobId: 'MCH-4', timestamp: 4, departmentCode: 'MECH' },
      { uid: createRecordUid('mech'), jobId: 'MCH-9', timestamp: 9, departmentCode: 'MECH' },
    ],
    CYBER: [
      { uid: createRecordUid('cyber'), jobId: 'CYB-4', timestamp: 4, departmentCode: 'CYBER' },
      { uid: createRecordUid('cyber'), jobId: 'CYB-9', timestamp: 9, departmentCode: 'CYBER' },
    ],
  };
}

export function createEmptyQueues(): Record<DepartmentCode, BloomInputRecord[]> {
  return {
    CS: [],
    CIVIL: [],
    MATHS: [],
    MECH: [],
    CYBER: [],
  };
}
