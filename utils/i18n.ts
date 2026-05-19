export type Language = 'da' | 'en';

export const LANG_STORAGE_KEY = 'bread-board-lang';

interface Translations {
  // App loading
  loading: string;
  // LoginView
  appTitle: string;
  loginSubtitle: string;
  groupKeyLabel: string;
  groupKeyPlaceholder: string;
  loginButton: string;
  loginFooter: string;
  // Dashboard header
  syncBadge: string;
  logout: string;
  // Team section
  teamHeader: string;
  addPlaceholder: string;
  addButton: string;
  attendanceHint: string;
  emptyTeam: string;
  dragHint: string;
  // Plan section
  planHeader: string;
  noAttendees: string;
  thisFriday: string;
  upcoming: string;
  emptySlot: string;
  // Functions (interpolation)
  attendeeSummary: (count: number, rolls: number) => string;
  buyRolls: (count: number) => string;
  deleteConfirm: (name: string) => string;
  removeLabel: (name: string) => string;
  // Aria / titles
  oneRoll: string;
  twoRolls: string;
  comingLabel: string;
  notComingLabel: string;
}

const da: Translations = {
  loading: 'Henter frisk morgenbrød...',
  appTitle: 'Brødtavlen',
  loginSubtitle: 'Indtast jeres hemmelige nøgle for at styre fredagsrotationen.',
  groupKeyLabel: 'Gruppe-nøgle',
  groupKeyPlaceholder: 'f.eks. marketing-team-123',
  loginButton: 'Gå til oversigten',
  loginFooter: 'Del nøglen med dine kolleger, så alle kan se, hvem der er næste.',
  syncBadge: 'Synkroniseret i skyen',
  logout: 'Log ud',
  teamHeader: 'Morgenmadsholdet',
  addPlaceholder: 'Tilføj kollega...',
  addButton: 'Tilføj',
  attendanceHint: 'Marker om du kommer i listen',
  emptyTeam: 'Tilføj nogle kolleger for at starte rotationen.',
  dragHint: 'Træk navnene for at bytte uger',
  planHeader: 'Morgenmadsplan',
  noAttendees: 'Ingen har tilmeldt sig endnu',
  thisFriday: 'Denne fredag',
  upcoming: 'Kommende',
  emptySlot: 'Tom plads',
  attendeeSummary: (count, rolls) =>
    `${count} ${count === 1 ? 'person' : 'personer'} kommer · ${rolls} ${rolls === 1 ? 'rundstykke' : 'rundstykker'}`,
  buyRolls: (count) => `Køb ${count} ${count === 1 ? 'rundstykke' : 'rundstykker'}`,
  deleteConfirm: (name) => `Vil du fjerne ${name} fra morgenmadsrotationen? Dette kan ikke fortrydes.`,
  removeLabel: (name) => `Fjern ${name}`,
  oneRoll: '1 rundstykke',
  twoRolls: '2 rundstykker',
  comingLabel: 'Kommer',
  notComingLabel: 'Kommer ikke',
};

const en: Translations = {
  loading: 'Fetching fresh morning bread...',
  appTitle: 'The Bread Board',
  loginSubtitle: 'Enter your secret key to manage the Friday rotation.',
  groupKeyLabel: 'Group key',
  groupKeyPlaceholder: 'e.g. marketing-team-123',
  loginButton: 'Go to overview',
  loginFooter: 'Share the key with your colleagues so everyone can see who is next.',
  syncBadge: 'Synced to cloud',
  logout: 'Log out',
  teamHeader: 'The breakfast team',
  addPlaceholder: 'Add colleague...',
  addButton: 'Add',
  attendanceHint: 'Mark if you are coming in the list',
  emptyTeam: 'Add some colleagues to start the rotation.',
  dragHint: 'Drag names to swap weeks',
  planHeader: 'Breakfast plan',
  noAttendees: 'Nobody has signed up yet',
  thisFriday: 'This Friday',
  upcoming: 'Upcoming',
  emptySlot: 'Empty slot',
  attendeeSummary: (count, rolls) =>
    `${count} ${count === 1 ? 'person' : 'people'} coming · ${rolls} ${rolls === 1 ? 'roll' : 'rolls'}`,
  buyRolls: (count) => `Buy ${count} ${count === 1 ? 'roll' : 'rolls'}`,
  deleteConfirm: (name) => `Remove ${name} from the breakfast rotation? This cannot be undone.`,
  removeLabel: (name) => `Remove ${name}`,
  oneRoll: '1 roll',
  twoRolls: '2 rolls',
  comingLabel: 'Coming',
  notComingLabel: 'Not coming',
};

const translations: Record<Language, Translations> = { da, en };

export function getT(lang: Language): Translations {
  return translations[lang];
}
