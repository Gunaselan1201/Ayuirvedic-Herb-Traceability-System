import type { RawBatch } from '../../../types';

export const MANUFACTURERS: Record<string, { name: string; theme: { primary: string; accent: string }; products: Record<string, Record<string, string[]>> }> = {
  MFG001: {
    name: 'Himalaya',
    theme: { primary: '#2F855A', accent: '#2B6CB0' },
    products: {
      // Shampoos
      Shampoos: {
        'Himalaya Anti-Hair Fall Shampoo': ['Butea frondosa', 'Bhringraj', 'Chickpea'],
        'Himalaya Gentle Daily Care Shampoo': ['Aloe Vera', 'Chickpea'],
        'Himalaya Anti-Dandruff Shampoo': ['Tea Tree Oil', 'Aloe Vera'],
        'Himalaya Protein Shampoo – Softness & Shine': ['Licorice', 'Chickpea'],
        'Himalaya Damage Repair Protein Shampoo': ['Aloe Vera', 'Yarrow'],
      },
      // Toothpaste (Paste)
      Paste: {
        'Himalaya Complete Care Toothpaste': ['Neem', 'Pomegranate', 'Miswak'],
        'Himalaya Sparkling White Toothpaste': ['Papaya', 'Pineapple'],
        'Himalaya Sensitive Toothpaste': ['Spinach', 'Almond'],
        'Himalaya Active Fresh Gel Toothpaste': ['Menthol', 'Miswak', 'Clove'],
        'Himalaya Stain Removal Toothpaste': ['Papaya', 'Pineapple'],
      },
      // Oils
      Oils: {
        'Himalaya Anti-Hair Fall Hair Oil': ['Bhringraj', 'Amalaki'],
        'Himalaya Baby Massage Oil': ['Olive Oil', 'Winter Cherry'],
        'Himalaya Natural Shine Hair Oil': ['Amla', 'Methi', 'Hibiscus'],
        'Himalaya Stress Relief Massage Oil': ['Ashwagandha', 'Country Mallow'],
        'Himalaya Nourishing Skin Oil': ['Almond Oil', 'Olive Oil'],
      },
      // Face Wash
      'Face Wash': {
        'Himalaya Purifying Neem Face Wash': ['Neem', 'Turmeric'],
        'Himalaya Oil Clear Lemon Face Wash': ['Lemon', 'Honey'],
        'Himalaya Moisturizing Aloe Vera Face Wash': ['Aloe Vera', 'Cucumber'],
        'Himalaya Men Natural Bright Face Wash': ['Licorice', 'White Pepper'],
        'Himalaya Tan Removal Orange Face Wash': ['Orange Peel', 'Honey'],
      },
      // Wellness / Supplements
      Supplements: {
        'Himalaya Liv.52 Tablets': ['Capparis spinosa', 'Cichorium intybus'],
        'Himalaya Septilin Syrup/Tablets': ['Tinospora cordifolia', 'Licorice'],
        'Himalaya Ashwagandha Tablets': ['Ashwagandha root extract'],
        'Himalaya Gokshura Tablets': ['Tribulus terrestris'],
        'Himalaya Neem Tablets': ['Neem leaf extract'],
      },
    },
  },
};

