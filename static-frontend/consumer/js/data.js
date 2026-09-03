// static-frontend/consumer/js/data.js
//
// Mock ledger data for the Consumer Portal static demo.
// Shape mirrors the real LedgerEvent structure documented in the repo README:
//   { id, batchId, stage: 'farmer' | 'lab' | 'manufacturer', data: {...}, addedBy, timestamp }
//
// In the real app this comes from GET /events/:batchId (App.tsx -> ledgerService / api.ts).
// Here we just keep a lookup table keyed by batchId.

window.HERB_LEDGER = {
  'SURTN1201NE': [
    {
      id: 'evt-surtn-1',
      batchId: 'SURTN1201NE',
      stage: 'farmer',
      addedBy: 'Suresh Kumar',
      timestamp: '2026-01-12T06:45:00Z',
      data: {
        productName: 'Neem',
        quantity: '250Kg',
        harvestedDate: '2026-01-12',
        coordinates: { latitude: '11.1271', longitude: '78.6569' },
        state: 'Tamil Nadu',
        district: 'Salem',
        villageTown: 'Attur'
      }
    },
    {
      id: 'evt-surtn-2',
      batchId: 'SURTN1201NE',
      stage: 'lab',
      addedBy: 'Dr. Anitha Rao',
      timestamp: '2026-01-15T09:20:00Z',
      data: {
        testedBy: 'Dr. Anitha Rao',
        testedAtISO: '2026-01-15T09:20:00Z',
        moisture: '8.2',
        pesticide: '0.01',
        quality: 'Grade A',
        pesticideResidues: 'Within limits (0.01 ppm)',
        microbialLoad: 'Pass (TAMC 1.2x10^3 cfu/g)',
        aflatoxins: 'Not Detected',
        moistureWaterActivity: '8.2% / Aw 0.52',
        heavyMetals: { Pb: '0.4 ppm', As: '0.1 ppm', Cd: '0.05 ppm', Hg: 'ND' },
        macroMicroIdentity: 'Conforms to API monograph',
        totalAsh: '6.8% / 1.1% (acid-insoluble)',
        extractiveValues: 'Alcohol-soluble 12.4%, Water-soluble 18.9%',
        foreignOrganicMatter: '0.3%',
        tlcHptlc: 'Matches reference standard (Nimbin band observed)',
        markerCompoundQuant: 'Nimbin 0.42% w/w',
        residualSolvents: 'Not Detected',
        pesticidePanelConfirmation: 'Confirmed clear (48-panel screen)',
        dnaBarcoding: 'Azadirachta indica - confirmed'
      }
    },
    {
      id: 'evt-surtn-3',
      batchId: 'SURTN1201NE',
      stage: 'manufacturer',
      addedBy: 'GreenLeaf Ayurveda Pvt Ltd',
      timestamp: '2026-01-22T11:10:00Z',
      data: {
        companyName: 'GreenLeaf Ayurveda Pvt Ltd',
        manufacturedBatchId: 'MFG-SURTN1201NE-01',
        productName: 'Neem',
        productType: 'Capsule',
        ingredients: 'Neem leaf extract (500mg), Vegetable capsule shell'
      }
    }
  ],

  'RAMKL1502TU': [
    {
      id: 'evt-ramkl-1',
      batchId: 'RAMKL1502TU',
      stage: 'farmer',
      addedBy: 'Ram Prasad',
      timestamp: '2026-02-15T07:05:00Z',
      data: {
        productName: 'Tulsi',
        quantity: '180Kg',
        harvestedDate: '2026-02-15',
        coordinates: { latitude: '10.8505', longitude: '76.2711' },
        state: 'Kerala',
        district: 'Palakkad',
        villageTown: 'Alathur'
      }
    },
    {
      id: 'evt-ramkl-2',
      batchId: 'RAMKL1502TU',
      stage: 'lab',
      addedBy: 'Dr. Meera Nair',
      timestamp: '2026-02-18T13:40:00Z',
      data: {
        testedBy: 'Dr. Meera Nair',
        testedAtISO: '2026-02-18T13:40:00Z',
        moisture: '7.6',
        pesticide: '0.00',
        quality: 'Grade A',
        pesticideResidues: 'Not Detected',
        microbialLoad: 'Pass (TAMC 8.5x10^2 cfu/g)',
        aflatoxins: 'Not Detected',
        moistureWaterActivity: '7.6% / Aw 0.48',
        heavyMetals: { Pb: '0.3 ppm', As: 'ND', Cd: '0.03 ppm', Hg: 'ND' },
        macroMicroIdentity: 'Conforms to API monograph',
        totalAsh: '9.1% / 1.4% (acid-insoluble)',
        extractiveValues: 'Alcohol-soluble 9.8%, Water-soluble 21.3%',
        foreignOrganicMatter: '0.2%',
        tlcHptlc: 'Matches reference standard (Eugenol band observed)',
        markerCompoundQuant: 'Eugenol 0.31% w/w',
        residualSolvents: 'Not Detected',
        pesticidePanelConfirmation: 'Confirmed clear (48-panel screen)',
        dnaBarcoding: 'Ocimum tenuiflorum - confirmed'
      }
    },
    {
      id: 'evt-ramkl-3',
      batchId: 'RAMKL1502TU',
      stage: 'manufacturer',
      addedBy: 'Kerala Herbals Co.',
      timestamp: '2026-02-25T10:30:00Z',
      data: {
        companyName: 'Kerala Herbals Co.',
        manufacturedBatchId: 'MFG-RAMKL1502TU-01',
        productName: 'Tulsi',
        productType: 'Powder',
        ingredients: 'Pure Tulsi leaf powder (100%)'
      }
    }
  ],

  'KIRKA2003AV': [
    {
      id: 'evt-kirka-1',
      batchId: 'KIRKA2003AV',
      stage: 'farmer',
      addedBy: 'Kiran Gowda',
      timestamp: '2026-03-20T06:15:00Z',
      data: {
        productName: 'Aloe Vera',
        quantity: '2Ton',
        harvestedDate: '2026-03-20',
        coordinates: { latitude: '12.9716', longitude: '77.5946' },
        state: 'Karnataka',
        district: 'Bengaluru Rural',
        villageTown: 'Devanahalli'
      }
    },
    {
      id: 'evt-kirka-2',
      batchId: 'KIRKA2003AV',
      stage: 'lab',
      addedBy: 'Dr. Suresh Babu',
      timestamp: '2026-03-24T15:00:00Z',
      data: {
        testedBy: 'Dr. Suresh Babu',
        testedAtISO: '2026-03-24T15:00:00Z',
        moisture: '92.5',
        pesticide: '0.00',
        quality: 'Grade B',
        pesticideResidues: 'Not Detected',
        microbialLoad: 'Pass (TAMC 5.0x10^2 cfu/g)',
        aflatoxins: 'Not Detected',
        moistureWaterActivity: '92.5% / Aw 0.91',
        heavyMetals: { Pb: '0.5 ppm', As: '0.2 ppm', Cd: 'ND', Hg: 'ND' },
        macroMicroIdentity: 'Conforms to API monograph',
        totalAsh: '2.1% / 0.4% (acid-insoluble)',
        extractiveValues: 'Water-soluble 96.2%',
        foreignOrganicMatter: '0.1%',
        tlcHptlc: 'Matches reference standard (Aloin band observed)',
        markerCompoundQuant: 'Aloin < 10 ppm (decolorized)',
        residualSolvents: 'Not Detected',
        pesticidePanelConfirmation: 'Confirmed clear (48-panel screen)',
        dnaBarcoding: 'Aloe barbadensis - confirmed'
      }
    },
    {
      id: 'evt-kirka-3',
      batchId: 'KIRKA2003AV',
      stage: 'manufacturer',
      addedBy: 'Karnataka Naturals Ltd',
      timestamp: '2026-04-02T09:45:00Z',
      data: {
        companyName: 'Karnataka Naturals Ltd',
        manufacturedBatchId: 'MFG-KIRKA2003AV-01',
        productName: 'Aloe Vera',
        productType: 'Oil',
        ingredients: 'Aloe Vera extract (40%), Coconut oil base, Vitamin E'
      }
    }
  ]
};

// Small descriptive metadata used to render the demo chips on the landing page.
window.HERB_EXAMPLES = [
  { batchId: 'SURTN1201NE', label: 'Neem from Tamil Nadu' },
  { batchId: 'RAMKL1502TU', label: 'Tulsi from Kerala' },
  { batchId: 'KIRKA2003AV', label: 'Aloe Vera from Karnataka' }
];
