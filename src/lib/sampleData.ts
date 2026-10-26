/**
 * Demo data for "Load sample data". All people and companies are fictional.
 * Dates are generated relative to today so the dashboard charts always look
 * current, and every deal is created after its contact.
 */
import type { Contact, Deal, Stage } from '../types';

// [name, company, email domain, phone, notes, created N days ago]
type ContactSeed = [string, string, string, string, string, number];

const CONTACTS: ContactSeed[] = [
  ['Fatima Al Mansoori', 'Al Mansoori Property Group', 'almansooriproperty.ae', '+971 50 214 7781', 'Abu Dhabi. Manages 14 residential towers.', 78],
  ['Rajesh Menon', 'Creek Side Trading LLC', 'creeksidetrading.ae', '+971 55 381 0942', 'Wholesale FMCG, Deira. Decision maker on IT spend.', 74],
  ['Layla Haddad', 'Saffron & Sage Restaurants', 'saffronsage.ae', '+971 52 760 3318', '6 outlets across Dubai and Sharjah.', 70],
  ['James Whitfield', 'Gulf Horizon Shipping', 'gulfhorizonshipping.ae', '+971 4 339 8120', 'Jebel Ali. Prefers meetings on Tuesdays.', 66],
  ['Mariam Al Suwaidi', 'Sharjah Green Packaging', 'sharjahgreenpack.ae', '+971 6 557 2091', '', 61],
  ['Ahmed Khalil', 'Khalil Engineering Consultants', 'khalileng.ae', '+971 50 902 4415', 'Referred by Rajesh Menon.', 57],
  ['Sofia Reyes', 'Palm Crest Hotels & Resorts', 'palmcresthotels.ae', '+971 56 118 6604', 'Head of guest experience.', 53],
  ['Hamdan Al Ketbi', 'Al Ain Agritech', 'alainagritech.ae', '+971 3 761 5530', 'Hydroponic farms. Interested in IoT sensors.', 49],
  ['Neha Kapoor', 'Jumeirah Dental Clinics', 'jumeirahdental.ae', '+971 54 427 9087', '', 45],
  ['Youssef Benali', 'Atlas Freight Forwarding', 'atlasfreight.ae', '+971 55 640 2273', 'Met at Breakbulk Middle East.', 41],
  ['Sara Al Hashimi', 'Hashimi Interiors', 'hashimiinteriors.ae', '+971 50 735 1846', 'Fit-out projects, mostly DIFC offices.', 37],
  ["Daniel O'Connor", 'Emirates Fit Studios', 'emiratesfit.ae', '+971 58 203 6619', 'Opening 3 new gyms this year.', 33],
  ['Aisha Siddiqui', 'Bluewave Desalination Systems', 'bluewavedesal.ae', '+971 2 448 3075', '', 29],
  ['Khalid Al Nuaimi', 'Ajman Steel Works', 'ajmansteelworks.ae', '+971 6 742 9958', 'Wants a factory floor dashboard.', 25],
  ['Grace Tan', 'Marina Lights Events', 'marinalightsevents.ae', '+971 52 991 4402', 'Corporate events and weddings.', 21],
  ['Omar Farouk', 'Desert Rose Real Estate', 'desertrose-re.ae', '+971 56 380 7716', '', 17],
  ['Priyanka Iyer', 'Silicon Oasis Software House', 'sosoftwarehouse.ae', '+971 54 612 0839', 'Possible partner rather than client.', 13],
  ['Tariq Mahmoud', 'Ras Al Khaimah Tile Traders', 'rakttraders.ae', '+971 7 228 5146', '', 9],
  ['Noura Al Falasi', 'Falasi Luxury Abayas', 'falasiabayas.ae', '+971 50 477 3362', 'Moving from Instagram sales to her own store.', 5],
  ['Michael Fernandes', 'Deira Electronics Wholesale', 'deiraelectronics.ae', '+971 4 225 6091', 'Walk-in enquiry.', 2],
];

// [contact index, title, value in AED, stage, created N days after the contact]
type DealSeed = [number, string, number, Stage, number];

const DEALS: DealSeed[] = [
  // Lead
  [16, 'Custom CRM integration', 85000, 'Lead', 3],
  [19, 'Point-of-sale upgrade', 42000, 'Lead', 1],
  [18, 'E-commerce store build', 60000, 'Lead', 2],
  [13, 'Factory floor dashboard', 150000, 'Lead', 6],
  [14, 'Event ticketing platform', 35000, 'Lead', 4],
  [17, 'Showroom inventory system', 28000, 'Lead', 2],
  [11, 'Membership mobile app', 55000, 'Lead', 8],
  // Contacted
  [15, 'Property listing portal', 120000, 'Contacted', 5],
  [12, 'Remote sensor network', 210000, 'Contacted', 7],
  [10, 'Project management rollout', 38000, 'Contacted', 6],
  [8, 'Patient booking system', 65000, 'Contacted', 9],
  [6, 'Guest experience app', 180000, 'Contacted', 10],
  [9, 'Shipment tracking portal', 95000, 'Contacted', 8],
  // Proposal
  [0, 'Tenant management platform', 320000, 'Proposal', 14],
  [3, 'Fleet telematics rollout', 275000, 'Proposal', 12],
  [5, 'Document control system', 72000, 'Proposal', 15],
  [7, 'Greenhouse IoT pilot', 48000, 'Proposal', 10],
  [2, 'Loyalty programme', 36000, 'Proposal', 11],
  // Won
  [1, 'ERP implementation', 410000, 'Won', 20],
  [4, 'Warehouse barcode system', 88000, 'Won', 18],
  [6, 'Spa booking module', 24000, 'Won', 25],
  [0, 'Annual support contract', 60000, 'Won', 30],
  // Lost
  [3, 'Crew scheduling tool', 130000, 'Lost', 22],
  [5, 'BIM training package', 18000, 'Lost', 16],
  [9, 'Customs clearance integration', 75000, 'Lost', 19],
];

const DAY_MS = 24 * 60 * 60 * 1000;

export function generateSampleData(today = new Date()): { contacts: Contact[]; deals: Deal[] } {
  const now = today.getTime();
  // Spread times across the working day so records don't share a timestamp.
  const at = (daysAgo: number, i: number) =>
    new Date(Math.min(now, now - daysAgo * DAY_MS + ((i * 37) % 480) * 60 * 1000)).toISOString();

  const contacts: Contact[] = CONTACTS.map(([name, company, domain, phone, notes, daysAgo], i) => ({
    id: `sample-contact-${i + 1}`,
    name,
    company,
    email: `${name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}@${domain}`,
    phone,
    notes,
    createdAt: at(daysAgo, i),
  }));

  const deals: Deal[] = DEALS.map(([contactIndex, title, value, stage, daysAfter], i) => {
    const contactDaysAgo = CONTACTS[contactIndex][5];
    const createdDaysAgo = Math.max(0, contactDaysAgo - daysAfter);
    const updatedDaysAgo = stage === 'Lead' ? createdDaysAgo : Math.max(0, createdDaysAgo - 5);
    return {
      id: `sample-deal-${i + 1}`,
      contactId: contacts[contactIndex].id,
      title,
      value,
      stage,
      createdAt: at(createdDaysAgo, i + 3),
      updatedAt: at(updatedDaysAgo, i + 5),
    };
  });

  return { contacts, deals };
}
