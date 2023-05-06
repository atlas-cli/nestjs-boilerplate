interface ProductItem {
  id: string;
  name: string;
  type: 'volume' | 'standard';
  prices: any[];
}

export const products: ProductItem[] = [
  {
    id: 'trial',
    name: 'Trial Plan',
    type: 'standard',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: 0,
          usd: 0,
        },
      },
      {
        type: 'year',
        currencies: {
          brl: 0,
          usd: 0,
        },
      },
    ],
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    type: 'standard',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: 0,
          usd: 0,
        },
      },
      {
        type: 'year',
        currencies: {
          brl: 0,
          usd: 0,
        },
      },
    ],
  },
  {
    id: 'organization',
    name: 'Organization Plan',
    type: 'standard',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: 12000,
          usd: 2300,
        },
      },
      {
        type: 'year',
        currencies: {
          brl: 120000,
          usd: 22800,
        },
      },
    ],
  },
  {
    id: 'students',
    name: 'Students',
    type: 'volume',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: [
            { amount: 3500, quantity: 10 },
            { amount: 4700, quantity: 15 },
            { amount: 5900, quantity: 20 },
            { amount: 7100, quantity: 25 },
            { amount: 8300, quantity: 30 },
            { amount: 10700, quantity: 40 },
            { amount: 13100, quantity: 50 },
            { amount: 15500, quantity: 60 },
            { amount: 17900, quantity: 70 },
            { amount: 20300, quantity: 80 },
            { amount: 22700, quantity: 90 },
            { amount: 25100, quantity: 100 },
            { amount: 29900, quantity: 120 },
            { amount: 34700, quantity: 140 },
            { amount: 39500, quantity: 160 },
            { amount: 44300, quantity: 180 },
            { amount: 49100, quantity: 200 },
            { amount: 61100, quantity: 250 },
            { amount: 73100, quantity: 300 },
            { amount: 85100, quantity: 350 },
            { amount: 97100, quantity: 400 },
            { amount: 109100, quantity: 450 },
            { amount: 121100, quantity: 500 },
            { amount: 999900, quantity: null },
          ],
          usd: [
            { amount: 700, quantity: 10 },
            { amount: 900, quantity: 15 },
            { amount: 1200, quantity: 20 },
            { amount: 1400, quantity: 25 },
            { amount: 1600, quantity: 30 },
            { amount: 2100, quantity: 40 },
            { amount: 2600, quantity: 50 },
            { amount: 3000, quantity: 60 },
            { amount: 3500, quantity: 70 },
            { amount: 3900, quantity: 80 },
            { amount: 4400, quantity: 90 },
            { amount: 4800, quantity: 100 },
            { amount: 5800, quantity: 120 },
            { amount: 6700, quantity: 140 },
            { amount: 7600, quantity: 160 },
            { amount: 8500, quantity: 180 },
            { amount: 9400, quantity: 200 },
            { amount: 11700, quantity: 250 },
            { amount: 14000, quantity: 300 },
            { amount: 16300, quantity: 350 },
            { amount: 18600, quantity: 400 },
            { amount: 20900, quantity: 450 },
            { amount: 23200, quantity: 500 },
            { amount: 999900, quantity: null },
          ],
        },
      },
      {
        type: 'year',
        currencies: {
          brl: [
            { amount: 34800, quantity: 10 },
            { amount: 46800, quantity: 15 },
            { amount: 58800, quantity: 20 },
            { amount: 70800, quantity: 25 },
            { amount: 82800, quantity: 30 },
            { amount: 106800, quantity: 40 },
            { amount: 130800, quantity: 50 },
            { amount: 154800, quantity: 60 },
            { amount: 178800, quantity: 70 },
            { amount: 202800, quantity: 80 },
            { amount: 226800, quantity: 90 },
            { amount: 250800, quantity: 100 },
            { amount: 298800, quantity: 120 },
            { amount: 346800, quantity: 140 },
            { amount: 394800, quantity: 160 },
            { amount: 442800, quantity: 180 },
            { amount: 490800, quantity: 200 },
            { amount: 610800, quantity: 250 },
            { amount: 730800, quantity: 300 },
            { amount: 850800, quantity: 350 },
            { amount: 970800, quantity: 400 },
            { amount: 1090800, quantity: 450 },
            { amount: 1210800, quantity: 500 },
            { amount: 9999900, quantity: null },
          ],
          usd: [
            { amount: 6700, quantity: 10 },
            { amount: 9000, quantity: 15 },
            { amount: 11300, quantity: 20 },
            { amount: 13600, quantity: 25 },
            { amount: 15900, quantity: 30 },
            { amount: 20400, quantity: 40 },
            { amount: 25000, quantity: 50 },
            { amount: 29600, quantity: 60 },
            { amount: 34200, quantity: 70 },
            { amount: 38800, quantity: 80 },
            { amount: 43400, quantity: 90 },
            { amount: 47900, quantity: 100 },
            { amount: 57100, quantity: 120 },
            { amount: 66300, quantity: 140 },
            { amount: 75400, quantity: 160 },
            { amount: 84600, quantity: 180 },
            { amount: 93800, quantity: 200 },
            { amount: 116700, quantity: 250 },
            { amount: 139600, quantity: 300 },
            { amount: 162500, quantity: 350 },
            { amount: 185400, quantity: 400 },
            { amount: 208300, quantity: 450 },
            { amount: 231200, quantity: 500 },
            { amount: 999900, quantity: null },
          ],
        },
      },
    ],
  },
  {
    id: 'classroom',
    name: 'Classroom',
    type: 'volume',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: [
            { amount: 0, quantity: 5 },
            { amount: 1800, quantity: 10 },
            { amount: 2800, quantity: 15 },
            { amount: 3600, quantity: 20 },
            { amount: 5400, quantity: 30 },
            { amount: 9000, quantity: 50 },
            { amount: 99900, quantity: null },
          ],
          usd: [
            { amount: 0, quantity: 5 },
            { amount: 400, quantity: 10 },
            { amount: 600, quantity: 15 },
            { amount: 700, quantity: 20 },
            { amount: 1100, quantity: 30 },
            { amount: 1800, quantity: 50 },
            { amount: 99900, quantity: null },
          ],
        },
      },
      {
        type: 'year',
        currencies: {
          brl: [
            { amount: 0, quantity: 5 },
            { amount: 18000, quantity: 10 },
            { amount: 27600, quantity: 15 },
            { amount: 36000, quantity: 20 },
            { amount: 54000, quantity: 30 },
            { amount: 90000, quantity: 50 },
            { amount: 999900, quantity: null },
          ],
          usd: [
            { amount: 0, quantity: 5 },
            { amount: 3500, quantity: 10 },
            { amount: 5300, quantity: 15 },
            { amount: 6900, quantity: 20 },
            { amount: 10300, quantity: 30 },
            { amount: 17100, quantity: 50 },
            { amount: 999900, quantity: null },
          ],
        },
      },
    ],
  },
  {
    id: 'recording',
    name: 'Recording',
    type: 'volume',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: [
            { amount: 1000, quantity: 5 },
            { amount: 1800, quantity: 10 },
            { amount: 2800, quantity: 15 },
            { amount: 3600, quantity: 20 },
            { amount: 5400, quantity: 30 },
            { amount: 9000, quantity: 50 },
            { amount: 99900, quantity: null },
          ],
          usd: [
            { amount: 200, quantity: 5 },
            { amount: 400, quantity: 10 },
            { amount: 600, quantity: 15 },
            { amount: 700, quantity: 20 },
            { amount: 1100, quantity: 30 },
            { amount: 1800, quantity: 50 },
            { amount: 99900, quantity: null },
          ],
        },
      },
      {
        type: 'year',
        currencies: {
          brl: [
            { amount: 9600, quantity: 5 },
            { amount: 18000, quantity: 10 },
            { amount: 27600, quantity: 15 },
            { amount: 36000, quantity: 20 },
            { amount: 54000, quantity: 30 },
            { amount: 90000, quantity: 50 },
            { amount: 999900, quantity: null },
          ],
          usd: [
            { amount: 1900, quantity: 5 },
            { amount: 3500, quantity: 10 },
            { amount: 5300, quantity: 15 },
            { amount: 6900, quantity: 20 },
            { amount: 10300, quantity: 30 },
            { amount: 17100, quantity: 50 },
            { amount: 999900, quantity: null },
          ],
        },
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    type: 'volume',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: [
            { amount: 0, quantity: 5 },
            { amount: 600, quantity: 10 },
            { amount: 1000, quantity: 20 },
            { amount: 1800, quantity: 50 },
            { amount: 2400, quantity: 100 },
            { amount: 3600, quantity: 200 },
            { amount: 6000, quantity: 500 },
            { amount: 99900, quantity: null },
          ],
          usd: [
            { amount: 0, quantity: 5 },
            { amount: 200, quantity: 10 },
            { amount: 300, quantity: 20 },
            { amount: 400, quantity: 50 },
            { amount: 500, quantity: 100 },
            { amount: 700, quantity: 200 },
            { amount: 1200, quantity: 500 },
            { amount: 99900, quantity: null },
          ],
        },
      },
      {
        type: 'year',
        currencies: {
          brl: [
            { amount: 0, quantity: 5 },
            { amount: 6000, quantity: 10 },
            { amount: 9600, quantity: 20 },
            { amount: 18000, quantity: 50 },
            { amount: 24000, quantity: 100 },
            { amount: 36000, quantity: 200 },
            { amount: 60000, quantity: 500 },
            { amount: 999900, quantity: null },
          ],
          usd: [
            { amount: 0, quantity: 5 },
            { amount: 1200, quantity: 10 },
            { amount: 1900, quantity: 20 },
            { amount: 3500, quantity: 50 },
            { amount: 4600, quantity: 100 },
            { amount: 6900, quantity: 200 },
            { amount: 11400, quantity: 500 },
            { amount: 999900, quantity: null },
          ],
        },
      },
    ],
  },
  {
    id: 'teachers',
    name: 'Teachers',
    type: 'volume',
    prices: [
      {
        type: 'month',
        currencies: {
          brl: [
            { amount: 0, quantity: 5 },
            { amount: 6000, quantity: 10 },
            { amount: 9600, quantity: 20 },
            { amount: 24000, quantity: 50 },
            { amount: 99900, quantity: null },
          ],
          usd: [
            { amount: 0, quantity: 5 },
            { amount: 1200, quantity: 10 },
            { amount: 1900, quantity: 20 },
            { amount: 4600, quantity: 50 },
            { amount: 99900, quantity: null },
          ],
        },
      },
      {
        type: 'year',
        currencies: {
          brl: [
            { amount: 0, quantity: 5 },
            { amount: 60000, quantity: 10 },
            { amount: 96000, quantity: 20 },
            { amount: 240000, quantity: 50 },
            { amount: 999900, quantity: null },
          ],
          usd: [
            { amount: 0, quantity: 5 },
            { amount: 11200, quantity: 10 },
            { amount: 18200, quantity: 20 },
            { amount: 45500, quantity: 50 },
            { amount: 999900, quantity: null },
          ],
        },
      },
    ],
  },
];