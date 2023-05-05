interface PlanItem {
  id: number;
  name: string;
  defaultQuotas: any;
  requiredProducts: any;
  trialPeriodDays?: number;
}

export const plans: PlanItem[] = [
  {
    id: 0,
    name: 'Trial',
    defaultQuotas: {
      students: 3,
      teachers: 1,
      classroom: 3,
      recording: false,
      storage: 500,
    },
    requiredProducts: [],
  },
  {
    id: 1,
    name: 'Professional',
    defaultQuotas: {
      teachers: 1,
    },
    requiredProducts: ['professional', 'students', 'classroom', 'storage'],
  },
  {
    id: 2,
    name: 'Organization',
    defaultQuotas: {},
    trialPeriodDays: 14,
    requiredProducts: [
      'organization',
      'teachers',
      'students',
      'classroom',
      'storage',
    ],
  },
];
