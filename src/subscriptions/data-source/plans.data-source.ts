interface PlanItem {
  id: number;
  name: string;
  defaultQuotas: any;
  requiredProducts: any;
  isTrial: boolean;
}

export const plans: PlanItem[] = [
  {
    id: 0,
    name: 'Trial',
    isTrial: true,
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
    isTrial: false,
    defaultQuotas: {
      teachers: 1,
    },
    requiredProducts: ['professional', 'students', 'classroom', 'storage'],
  },
  {
    id: 2,
    name: 'Organization',
    isTrial: false,
    defaultQuotas: {},
    requiredProducts: [
      'organization',
      'teachers',
      'students',
      'classroom',
      'storage',
    ],
  },
];
