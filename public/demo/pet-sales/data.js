/* Dane przykładowe do makiety PET Sales. Wszystkie firmy, osoby, kwoty i numery są fikcyjne
   (poza nazwami publicznymi: Enea Operator jako inwestor, KONČAR jako grupa). */
window.DATA = (() => {
  const users = {
    dyrektor: { id: 'dyrektor', name: 'Anna Wiśniewska', role: 'Dyrektor sprzedaży', ini: 'AW', fin: true, admin: true },
    sprzedaz: { id: 'sprzedaz', name: 'Marek Zieliński', role: 'Specjalista ds. sprzedaży', ini: 'MZ', fin: true, admin: false },
    pm: { id: 'pm', name: 'Piotr Nowicki', role: 'Project manager', ini: 'PN', fin: true, admin: false },
    wsparcie: { id: 'wsparcie', name: 'Ewa Kowal', role: 'Specjalista ds. wsparcia sprzedaży', ini: 'EK', fin: false, admin: false },
    aftersales: { id: 'aftersales', name: 'Tomasz Baran', role: 'Inżynier after-sales', ini: 'TB', fin: false, admin: false },
  };

  const dict = {
    status_zapytania: ['nowe', 'u inżyniera', 'w ofertowaniu', 'zaofertowane', 'zamknięte'],
    zrodlo: ['przetarg publiczny', 'zlecenie z Grupy', 'klient bezpośredni', 'mail ogólny', 'targi / polecenie'],
    typ: ['nowy transformator', 'modernizacja', 'części zamienne', 'serwis'],
    priorytet: ['niski', 'normalny', 'wysoki', 'krytyczny'],
    sektor: ['Dystrybucja', 'EPC', 'Przemysł', 'Eksport bezpośredni', 'Koncar'],
    miejsce: ['Dystrybucja GPZ', 'OZE GPO', 'Data Center', 'Przemysł', 'Kopalnia', 'Huta', 'Elektrownie i elektrociepłownie'],
    waluta: ['PLN', 'EUR', 'USD'],
    incoterms: ['EXW', 'FCA', 'DAP', 'DDP', 'CIP'],
    etapy: ['projektowanie elektryczne', 'projektowanie mechaniczne', 'nawijalnia', 'montaż części aktywnej', 'suszenie', 'montaż końcowy', 'FAT', 'po FAT', 'gotowy do wysyłki', 'w transporcie', 'dostarczony', 'SAT', 'zakończony'],
  };

  const customers = [
    { id: 'enea', name: 'Enea Operator sp. z o.o.', nip: '782-23-77-481', country: 'PL', city: 'Poznań', sector: 'Dystrybucja', prio: 'wysoki', owner: 'sprzedaz', lastContact: '2026-05-14',
      desc: 'Operator systemu dystrybucyjnego, zachodnia Polska. Program modernizacji GPZ 110/15 kV do 2030. Decyzje zakupowe w Departamencie Majątku Sieciowego, przetargi zgodnie z PZP.',
      contacts: [
        { n: 'Krzysztof Adamski', p: 'Kierownik Wydziału Inwestycji', m: 'k.adamski@example.com', t: '+48 61 000 00 01' },
        { n: 'Joanna Lis', p: 'Specjalista ds. zamówień', m: 'j.lis@example.com', t: '+48 61 000 00 02' },
      ],
      projects: [
        { n: 'GPZ Kobylnica 110/15 kV', inv: 'Enea Operator', place: 'Kobylnica, gm. Swarzędz', d: 'Rozbudowa stacji o drugą jednostkę 40 MVA, wymiana istniejącej 25 MVA.' },
        { n: 'GPZ Czerwonak', inv: 'Enea Operator', place: 'Czerwonak', d: 'Modernizacja, 2027.' },
      ] },
    { id: 'greenvolt', name: 'GreenVolt Engineering sp. z o.o.', nip: '525-31-00-772', country: 'PL', city: 'Warszawa', sector: 'EPC', prio: 'wysoki', owner: 'sprzedaz', lastContact: '2026-09-15',
      desc: 'Generalny wykonawca stacji i przyłączy OZE. Kupuje transformatory do projektów dla OSD i deweloperów PV/wiatr. Płatności etapowe, wymaga DAP na plac budowy.',
      contacts: [{ n: 'Michał Grabowski', p: 'Dyrektor ds. zakupów', m: 'm.grabowski@example.com', t: '+48 22 000 00 10' }, { n: 'Karolina Mazur', p: 'Inżynier projektu', m: 'k.mazur@example.com', t: '+48 22 000 00 11' }],
      projects: [{ n: 'GPZ Kobylnica 110/15 kV (dla Enea Operator)', inv: 'Enea Operator', place: 'Kobylnica', d: 'EPC dla stacji, 2 x 40 MVA.' }, { n: 'GPO Farma PV Kobylnica', inv: 'SunField Polska', place: 'Kobylnica', d: 'Stacja przyłączeniowa 110/30 kV, 63 MVA.' }] },
    { id: 'huta', name: 'Huta Północ S.A.', nip: '586-01-22-390', country: 'PL', city: 'Gdańsk', sector: 'Przemysł', prio: 'normalny', owner: 'sprzedaz', lastContact: '2026-03-02',
      desc: 'Huta stali, piece łukowe. Dwie jednostki PET z 2023 w eksploatacji (nr fabr. PET-2023-0148, 0149). Kontakt głównie serwisowy.',
      contacts: [{ n: 'Robert Sadowski', p: 'Główny energetyk', m: 'r.sadowski@example.com', t: '+48 58 000 00 20' }],
      projects: [{ n: 'Piec łukowy nr 2', inv: 'Huta Północ', place: 'Gdańsk', d: 'Transformator piecowy 80 MVA, dostarczony 2023.' }] },
    { id: 'datapark', name: 'DataPark Poznań sp. z o.o.', nip: '779-25-61-118', country: 'PL', city: 'Poznań', sector: 'Przemysł', prio: 'wysoki', owner: 'wsparcie', lastContact: '2026-09-02',
      desc: 'Operator centrum danych, kampus 60 MW w budowie. Wymaga niskiego poziomu hałasu i redundancji N+1.',
      contacts: [{ n: 'Agnieszka Wróbel', p: 'Head of Infrastructure', m: 'a.wrobel@example.com', t: '+48 61 000 00 30' }],
      projects: [{ n: 'Kampus DC Poznań, etap 2', inv: 'DataPark Poznań', place: 'Poznań', d: '3 x 40 MVA 110/20 kV, wymagania akustyczne.' }] },
    { id: 'koncar', name: 'KONČAR D&ST d.d.', nip: 'HR-99999999999', country: 'HR', city: 'Zagrzeb', sector: 'Koncar', prio: 'normalny', owner: 'dyrektor', lastContact: '2026-09-10',
      desc: 'Spółka matka. Zlecenia z Grupy przy braku mocy produkcyjnych w Zagrzebiu. Rozliczenia wewnątrzgrupowe.',
      contacts: [{ n: 'Ivan Horvat', p: 'Sales Director Export', m: 'i.horvat@example.com', t: '+385 1 000 0000' }],
      projects: [{ n: 'HEP Sisak 110/35 kV', inv: 'HEP ODS', place: 'Sisak, HR', d: '2 x 20 MVA, zlecenie z Grupy.' }] },
    { id: 'nordwind', name: 'Nordwind Energie GmbH', nip: 'DE812345678', country: 'DE', city: 'Hamburg', sector: 'Eksport bezpośredni', prio: 'normalny', owner: 'sprzedaz', lastContact: '2026-08-20',
      desc: 'Deweloper farm wiatrowych, północne Niemcy. Pierwszy kontakt na targach Hannover Messe 2026.',
      contacts: [{ n: 'Lena Fischer', p: 'Procurement Lead', m: 'l.fischer@example.com', t: '+49 40 000 0000' }],
      projects: [{ n: 'WP Dithmarschen Süd', inv: 'Nordwind Energie', place: 'Szlezwik-Holsztyn', d: 'Stacja 110/33 kV, 63 MVA.' }] },
    { id: 'baltic', name: 'Baltic Grid AB', nip: 'SE556000000001', country: 'SE', city: 'Malmö', sector: 'Eksport bezpośredni', prio: 'niski', owner: 'dyrektor', lastContact: '2026-01-19',
      desc: 'Operator regionalny. Jedno zapytanie w 2025, przegrane ceną.',
      contacts: [{ n: 'Erik Lund', p: 'Asset Manager', m: 'e.lund@example.com', t: '+46 40 000 000' }],
      projects: [] },
    { id: 'kwk', name: 'KWK Jaworzyna S.A.', nip: '648-00-11-223', country: 'PL', city: 'Jaworzyna', sector: 'Przemysł', prio: 'normalny', owner: 'pm', lastContact: '2026-07-11',
      desc: 'Kopalnia węgla kamiennego. Modernizacja rozdzielni głównej, transformatory 110/6 kV.',
      contacts: [{ n: 'Stanisław Kubica', p: 'Kierownik Działu Energomechanicznego', m: 's.kubica@example.com', t: '+48 32 000 00 40' }],
      projects: [{ n: 'Rozdzielnia główna 110/6 kV', inv: 'KWK Jaworzyna', place: 'Jaworzyna', d: 'Wymiana 2 x 31,5 MVA.' }] },
  ];

  const inquiries = [
    { id: 'ZAP/2026/0087', date: '2026-09-15', customer: 'greenvolt', investor: 'Enea Operator', project: 'GPZ Kobylnica 110/15 kV', owner: 'sprzedaz', contact: 'Michał Grabowski',
      source: 'klient bezpośredni', country: 'PL', sector: 'EPC', place: 'Dystrybucja GPZ', type: 'nowy transformator', deadline: '2026-10-06', techDeadline: '2026-09-24', prio: 'wysoki', status: 'w ofertowaniu',
      items: [{ power: '40 MVA', hv: '110 kV', mv: '15 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAN/ONAF', qty: 2 }],
      files: [{ n: 'RFQ_GPZ_Kobylnica_v2.pdf', s: '1,8 MB', d: '2026-09-15' }, { n: 'Specyfikacja_techniczna_110-15kV.pdf', s: '4,2 MB', d: '2026-09-15' }, { n: 'Plan_sytuacyjny_stacji.dwg', s: '11,6 MB', d: '2026-09-16' }],
      teams: { channel: 'ZAP-2026-0087 GPZ Kobylnica', team: 'Sprawy 2026', created: '2026-09-15 14:22' },
      comment: 'Klient prosi o wariant z przełącznikiem zaczepów pod obciążeniem (OLTC) i o cenę opcji monitoringu on-line.',
      history: [
        { d: '2026-09-15 14:20', who: 'Marek Zieliński', t: 'Zarejestrował zapytanie z RFQ (asystent RFQ, 11 pól zaakceptowanych, 2 poprawione).' },
        { d: '2026-09-15 14:22', who: 'PET Sales', t: 'Założono kanał Teams "ZAP-2026-0087 GPZ Kobylnica". Wysłano mail z załącznikami do działu projektowania elektrycznego, termin 24.09.' },
        { d: '2026-09-22 09:40', who: 'Marek Zieliński', t: 'Odnotował odpowiedź techniczną z kanału: wykonalne, straty jałowe 22 kW, masa 68 t.' },
        { d: '2026-09-22 09:41', who: 'PET Sales', t: 'Status: u inżyniera -> w ofertowaniu. Utworzono ofertę OF/2026/0042.' },
      ] },
    { id: 'ZAP/2026/0086', date: '2026-09-12', customer: 'datapark', investor: 'DataPark Poznań', project: 'Kampus DC Poznań, etap 2', owner: 'wsparcie', contact: 'Agnieszka Wróbel', source: 'klient bezpośredni', country: 'PL', sector: 'Przemysł', place: 'Data Center', type: 'nowy transformator', deadline: '2026-10-15', techDeadline: '2026-09-26', prio: 'wysoki', status: 'u inżyniera', items: [{ power: '40 MVA', hv: '110 kV', mv: '20 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAN/ONAF', qty: 3 }], files: [{ n: 'RFP_DC_Poznan_E2.pdf', s: '3,1 MB', d: '2026-09-12' }], teams: { channel: 'ZAP-2026-0086 DC Poznań E2', team: 'Sprawy 2026', created: '2026-09-12 11:05' }, history: [] },
    { id: 'ZAP/2026/0085', date: '2026-09-10', customer: 'koncar', investor: 'HEP ODS', project: 'HEP Sisak 110/35 kV', owner: 'dyrektor', contact: 'Ivan Horvat', source: 'zlecenie z Grupy', country: 'HR', sector: 'Koncar', place: 'Dystrybucja GPZ', type: 'nowy transformator', deadline: '2026-09-30', techDeadline: '2026-09-19', prio: 'normalny', status: 'zaofertowane', items: [{ power: '20 MVA', hv: '110 kV', mv: '35 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAN', qty: 2 }], files: [], teams: { channel: 'ZAP-2026-0085 HEP Sisak', team: 'Sprawy 2026', created: '2026-09-10 09:00' }, history: [] },
    { id: 'ZAP/2026/0084', date: '2026-09-08', customer: 'nordwind', investor: 'Nordwind Energie', project: 'WP Dithmarschen Süd', owner: 'sprzedaz', contact: 'Lena Fischer', source: 'targi / polecenie', country: 'DE', sector: 'Eksport bezpośredni', place: 'OZE GPO', type: 'nowy transformator', deadline: '2026-10-20', techDeadline: '2026-09-29', prio: 'normalny', status: 'nowe', items: [{ power: '63 MVA', hv: '110 kV', mv: '33 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAF', qty: 1 }], files: [{ n: 'Anfrage_Dithmarschen.pdf', s: '2,4 MB', d: '2026-09-08' }], teams: null, history: [] },
    { id: 'ZAP/2026/0083', date: '2026-09-03', customer: 'kwk', investor: 'KWK Jaworzyna', project: 'Rozdzielnia główna 110/6 kV', owner: 'pm', contact: 'Stanisław Kubica', source: 'przetarg publiczny', country: 'PL', sector: 'Przemysł', place: 'Kopalnia', type: 'modernizacja', deadline: '2026-09-25', techDeadline: '2026-09-15', prio: 'normalny', status: 'zaofertowane', items: [{ power: '31,5 MVA', hv: '110 kV', mv: '6 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAN', qty: 2 }], files: [], teams: { channel: 'ZAP-2026-0083 KWK Jaworzyna', team: 'Sprawy 2026', created: '2026-09-03 10:15' }, history: [] },
    { id: 'ZAP/2026/0082', date: '2026-08-28', customer: 'enea', investor: 'Enea Operator', project: 'GPZ Czerwonak', owner: 'sprzedaz', contact: 'Krzysztof Adamski', source: 'przetarg publiczny', country: 'PL', sector: 'Dystrybucja', place: 'Dystrybucja GPZ', type: 'nowy transformator', deadline: '2026-09-19', techDeadline: '2026-09-08', prio: 'wysoki', status: 'zaofertowane', items: [{ power: '25 MVA', hv: '110 kV', mv: '15 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAN/ONAF', qty: 1 }], files: [], teams: { channel: 'ZAP-2026-0082 GPZ Czerwonak', team: 'Sprawy 2026', created: '2026-08-28 08:50' }, history: [] },
    { id: 'ZAP/2026/0081', date: '2026-08-21', customer: 'huta', investor: 'Huta Północ', project: 'Piec łukowy nr 2', owner: 'aftersales', contact: 'Robert Sadowski', source: 'klient bezpośredni', country: 'PL', sector: 'Przemysł', place: 'Huta', type: 'części zamienne', deadline: '2026-09-05', techDeadline: '2026-08-28', prio: 'krytyczny', status: 'zamknięte', items: [], files: [], teams: null, history: [] },
    { id: 'ZAP/2026/0080', date: '2026-08-18', customer: 'greenvolt', investor: 'SunField Polska', project: 'GPO Farma PV Kobylnica', owner: 'sprzedaz', contact: 'Karolina Mazur', source: 'klient bezpośredni', country: 'PL', sector: 'EPC', place: 'OZE GPO', type: 'nowy transformator', deadline: '2026-09-12', techDeadline: '2026-08-29', prio: 'normalny', status: 'zaofertowane', items: [{ power: '63 MVA', hv: '110 kV', mv: '30 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAF', qty: 1 }], files: [], teams: { channel: 'ZAP-2026-0080 GPO Kobylnica', team: 'Sprawy 2026', created: '2026-08-18 13:00' }, history: [] },
    { id: 'ZAP/2026/0079', date: '2026-08-11', customer: 'baltic', investor: 'Baltic Grid', project: 'Station Lund N', owner: 'dyrektor', contact: 'Erik Lund', source: 'przetarg publiczny', country: 'SE', sector: 'Eksport bezpośredni', place: 'Dystrybucja GPZ', type: 'nowy transformator', deadline: '2026-09-01', techDeadline: '2026-08-22', prio: 'niski', status: 'zamknięte', items: [{ power: '40 MVA', hv: '130 kV', mv: '10 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAN', qty: 1 }], files: [], teams: null, history: [] },
    { id: 'ZAP/2026/0078', date: '2026-08-04', customer: 'datapark', investor: 'DataPark Poznań', project: 'Kampus DC Poznań, etap 1', owner: 'wsparcie', contact: 'Agnieszka Wróbel', source: 'klient bezpośredni', country: 'PL', sector: 'Przemysł', place: 'Data Center', type: 'nowy transformator', deadline: '2026-08-29', techDeadline: '2026-08-14', prio: 'wysoki', status: 'zamknięte', items: [{ power: '40 MVA', hv: '110 kV', mv: '20 kV', lv: '-', wind: 2, freq: '50 Hz', cool: 'ONAN/ONAF', qty: 2 }], files: [], teams: null, history: [] },
  ];

  const offers = [
    { id: 'OF/2026/0042', inquiry: 'ZAP/2026/0087', customer: 'greenvolt', project: 'GPZ Kobylnica 110/15 kV', owner: 'sprzedaz', currency: 'EUR', result: 'otwarta', substate: 'negocjacje', probability: 65, competitors: 'Konkurent A (DE), Konkurent B (TR)',
      revisions: [
        { r: 'R0', status: 'robocza', prepared: '2026-09-22', sent: null, price: 1720000, cost: 1290000, service: 62000, hours: 5400, delivery: '2027-08-31', valid: '2026-11-30', payment: '30/60/10', incoterms: 'DAP', reason: 'Wersja startowa z kalkulacji technicznej.' },
        { r: 'R1', status: 'wysłana', prepared: '2026-09-23', sent: '2026-09-23', price: 1720000, cost: 1290000, service: 62000, hours: 5400, delivery: '2027-08-31', valid: '2026-11-30', payment: '30/60/10', incoterms: 'DAP', reason: 'Pierwsza wersja do klienta.' },
        { r: 'R2', status: 'wysłana', prepared: '2026-09-29', sent: '2026-09-30', price: 1690000, cost: 1290000, service: 62000, hours: 5400, delivery: '2027-08-31', valid: '2026-12-15', payment: '30/60/10', incoterms: 'DAP', reason: 'Po spotkaniu 29.09: rabat 30 tys. za rezygnację z monitoringu on-line, przedłużona ważność.' },
        { r: 'R3', status: 'robocza', prepared: '2026-10-02', sent: null, price: 1655000, cost: 1275000, service: 58000, hours: 5300, delivery: '2027-09-30', valid: '2026-12-15', payment: '20/70/10', incoterms: 'FCA', reason: 'Klient przejmuje transport (FCA), termin przesunięty o miesiąc na życzenie inwestora, płatność 20/70/10.' },
      ],
      files: [{ n: 'OF-2026-0042-R2.pdf', s: '640 kB', d: '2026-09-30' }, { n: 'Kalkulacja_R3.xlsx', s: '212 kB', d: '2026-10-02' }] },
    { id: 'OF/2026/0041', inquiry: 'ZAP/2026/0085', customer: 'koncar', project: 'HEP Sisak 110/35 kV', owner: 'dyrektor', currency: 'EUR', result: 'otwarta', substate: null, probability: 80, competitors: '-', revisions: [{ r: 'R0', status: 'wysłana', prepared: '2026-09-18', sent: '2026-09-19', price: 860000, cost: 690000, service: 30000, hours: 2900, delivery: '2027-06-30', valid: '2026-11-15', payment: '30/70', incoterms: 'FCA', reason: 'Wersja startowa.' }], files: [] },
    { id: 'OF/2026/0040', inquiry: 'ZAP/2026/0083', customer: 'kwk', project: 'Rozdzielnia główna 110/6 kV', owner: 'pm', currency: 'PLN', result: 'otwarta', substate: 'negocjacje', probability: 45, competitors: 'Konkurent C (PL)', revisions: [{ r: 'R0', status: 'wysłana', prepared: '2026-09-15', sent: '2026-09-16', price: 6900000, cost: 5200000, service: 240000, hours: 5100, delivery: '2027-07-15', valid: '2026-11-30', payment: '10/80/10', incoterms: 'DDP', reason: 'Wersja startowa.' }, { r: 'R1', status: 'wysłana', prepared: '2026-09-20', sent: '2026-09-20', price: 6750000, cost: 5200000, service: 240000, hours: 5100, delivery: '2027-07-15', valid: '2026-11-30', payment: '10/80/10', incoterms: 'DDP', reason: 'Korekta po otwarciu ofert.' }], files: [] },
    { id: 'OF/2026/0039', inquiry: 'ZAP/2026/0082', customer: 'enea', project: 'GPZ Czerwonak', owner: 'sprzedaz', currency: 'PLN', result: 'otwarta', substate: null, probability: 55, competitors: 'Konkurent A (DE), Konkurent D (PL)', revisions: [{ r: 'R0', status: 'wysłana', prepared: '2026-09-12', sent: '2026-09-15', price: 4150000, cost: 3120000, service: 160000, hours: 3200, delivery: '2027-06-30', valid: '2026-12-31', payment: '10/80/10', incoterms: 'DDP', reason: 'Wersja startowa.' }], files: [] },
    { id: 'OF/2026/0038', inquiry: 'ZAP/2026/0080', customer: 'greenvolt', project: 'GPO Farma PV Kobylnica', owner: 'sprzedaz', currency: 'EUR', result: 'wygrana', substate: null, probability: 100, competitors: 'Konkurent B (TR)', contract: 'UM/2026/019', revisions: [{ r: 'R0', status: 'wysłana', prepared: '2026-08-25', sent: '2026-08-26', price: 1240000, cost: 930000, service: 44000, hours: 3800, delivery: '2027-05-31', valid: '2026-10-31', payment: '30/60/10', incoterms: 'DAP', reason: 'Wersja startowa.' }, { r: 'R1', status: 'wysłana', prepared: '2026-09-04', sent: '2026-09-05', price: 1215000, cost: 930000, service: 44000, hours: 3800, delivery: '2027-05-31', valid: '2026-10-31', payment: '30/60/10', incoterms: 'DAP', reason: 'Rabat za zamówienie łączone z GPZ.' }], files: [] },
    { id: 'OF/2026/0037', inquiry: 'ZAP/2026/0079', customer: 'baltic', project: 'Station Lund N', owner: 'dyrektor', currency: 'EUR', result: 'przegrana', substate: null, probability: 0, competitors: 'Konkurent E (SE)', lostReason: 'cena, ok. 8% powyżej zwycięzcy', revisions: [{ r: 'R0', status: 'wysłana', prepared: '2026-08-26', sent: '2026-08-27', price: 1580000, cost: 1210000, service: 70000, hours: 5200, delivery: '2027-09-30', valid: '2026-10-31', payment: '30/70', incoterms: 'DAP', reason: 'Wersja startowa.' }], files: [] },
    { id: 'OF/2026/0036', inquiry: 'ZAP/2026/0078', customer: 'datapark', project: 'Kampus DC Poznań, etap 1', owner: 'wsparcie', currency: 'EUR', result: 'wygrana', substate: null, probability: 100, competitors: 'Konkurent A (DE)', contract: 'UM/2026/017', revisions: [{ r: 'R0', status: 'wysłana', prepared: '2026-08-20', sent: '2026-08-21', price: 3380000, cost: 2540000, service: 120000, hours: 10600, delivery: '2027-04-30', valid: '2026-09-30', payment: '30/60/10', incoterms: 'DAP', reason: 'Wersja startowa.' }], files: [] },
    { id: 'OF/2026/0031', inquiry: 'ZAP/2026/0071', customer: 'huta', project: 'Piec łukowy nr 3', owner: 'sprzedaz', currency: 'PLN', result: 'przegrana', substate: null, probability: 0, competitors: 'Konkurent C (PL)', lostReason: 'termin dostawy, klient wymagał 9 miesięcy', revisions: [{ r: 'R0', status: 'wysłana', prepared: '2026-06-10', sent: '2026-06-11', price: 9800000, cost: 7400000, service: 300000, hours: 7900, delivery: '2027-08-31', valid: '2026-08-31', payment: '10/80/10', incoterms: 'DDP', reason: 'Wersja startowa.' }], files: [] },
  ];

  const orders = [
    { id: 'ZL/2026/0007', offer: 'OF/2026/0038', rev: 'R1', customer: 'greenvolt', project: 'GPO Farma PV Kobylnica', received: '2026-09-08', contract: 'UM/2026/019', signed: '2026-09-08', value: 1215000, currency: 'EUR', delivery: '2027-05-31', pm: 'pm', status: 'w realizacji',
      fat: 'Próby wyrobu wg IEC 60076-1, pomiar strat, próba napięciowa indukowana, pomiar poziomu hałasu.', sat: 'Sprawdzenie po transporcie, pomiar DGA oleju, próba izolacji, uruchomienie pod napięciem.',
      units: [{ sn: 'PET-2026-0311', fat: '2027-04-12', sat: '2027-06-15', delivered: '2027-05-28', warranty: '2029-06-15' }],
      files: [{ n: 'Zamowienie_GreenVolt_GPO.pdf', s: '420 kB', d: '2026-09-08' }, { n: 'Umowa_UM-2026-019.pdf', s: '2,1 MB', d: '2026-09-08' }],
      stages: [
        { plan: '2026-09-30', real: '2026-09-26', st: 'done', who: 'Dział projektowania elektrycznego' },
        { plan: '2026-10-21', real: '2026-10-19', st: 'done', who: 'Dział projektowania mechanicznego' },
        { plan: '2026-12-12', real: '2026-12-15', st: 'done', who: 'Nawijalnia' },
        { plan: '2027-01-23', real: '2027-01-22', st: 'done', who: 'Montaż' },
        { plan: '2027-02-10', real: null, st: 'risk', who: 'Suszarnia', risk: 'Awaria pieca VPD nr 1, przesunięcie o ok. 8 dni. Ryzyko dla terminu FAT.' },
        { plan: '2027-03-15', real: null, st: 'todo', who: 'Montaż końcowy' },
        { plan: '2027-04-12', real: null, st: 'todo', who: 'Stacja prób' },
        { plan: '2027-04-20', real: null, st: 'todo', who: 'PM' },
        { plan: '2027-05-10', real: null, st: 'todo', who: 'Logistyka' },
        { plan: '2027-05-24', real: null, st: 'todo', who: 'Logistyka' },
        { plan: '2027-05-28', real: null, st: 'todo', who: 'PM' },
        { plan: '2027-06-15', real: null, st: 'todo', who: 'Serwis' },
        { plan: '2027-06-30', real: null, st: 'todo', who: 'PM' },
      ] },
    { id: 'ZL/2026/0006', offer: 'OF/2026/0036', rev: 'R0', customer: 'datapark', project: 'Kampus DC Poznań, etap 1', received: '2026-09-01', contract: 'UM/2026/017', signed: '2026-09-01', value: 3380000, currency: 'EUR', delivery: '2027-04-30', pm: 'pm', status: 'w realizacji',
      fat: 'IEC 60076, pomiar hałasu wg wymagań inwestora (max 62 dB).', sat: 'Standard PET.',
      units: [{ sn: 'PET-2026-0309', fat: '2027-03-10', sat: '2027-05-12', delivered: '2027-04-28', warranty: '2029-05-12' }, { sn: 'PET-2026-0310', fat: '2027-03-17', sat: '2027-05-12', delivered: '2027-04-28', warranty: '2029-05-12' }],
      files: [], stages: [{ plan: '2026-09-25', real: '2026-09-24', st: 'done', who: 'Projektowanie el.' }, { plan: '2026-10-16', real: '2026-10-16', st: 'done', who: 'Projektowanie mech.' }, { plan: '2026-12-01', real: null, st: 'prog', who: 'Nawijalnia' }, { plan: '2027-01-10', real: null, st: 'todo', who: 'Montaż' }, { plan: '2027-01-30', real: null, st: 'todo', who: 'Suszarnia' }, { plan: '2027-02-28', real: null, st: 'todo', who: 'Montaż końcowy' }, { plan: '2027-03-17', real: null, st: 'todo', who: 'Stacja prób' }, { plan: '2027-03-24', real: null, st: 'todo', who: 'PM' }, { plan: '2027-04-10', real: null, st: 'todo', who: 'Logistyka' }, { plan: '2027-04-24', real: null, st: 'todo', who: 'Logistyka' }, { plan: '2027-04-28', real: null, st: 'todo', who: 'PM' }, { plan: '2027-05-12', real: null, st: 'todo', who: 'Serwis' }, { plan: '2027-05-31', real: null, st: 'todo', who: 'PM' }] },
    { id: 'ZL/2025/0061', offer: 'OF/2025/0210', rev: 'R2', customer: 'enea', project: 'GPZ Swarzędz', received: '2025-11-14', contract: 'UM/2025/088', signed: '2025-11-14', value: 4020000, currency: 'PLN', delivery: '2026-10-30', pm: 'pm', status: 'w realizacji',
      fat: 'Standard PET.', sat: 'Standard PET.',
      units: [{ sn: 'PET-2026-0298', fat: '2026-09-18', sat: '2026-11-20', delivered: '2026-10-27', warranty: '2028-11-20' }],
      files: [], stages: dict.etapy.map((_, i) => ({ plan: '2026-' + String(Math.min(12, i + 1)).padStart(2, '0') + '-15', real: i < 8 ? '2026-' + String(i + 1).padStart(2, '0') + '-14' : null, st: i < 8 ? 'done' : (i === 8 ? 'prog' : 'todo'), who: i < 2 ? 'Projektowanie' : i < 6 ? 'Produkcja' : i < 8 ? 'Stacja prób' : i < 11 ? 'Logistyka' : 'Serwis' })) },
    { id: 'ZL/2025/0058', offer: 'OF/2025/0197', rev: 'R0', customer: 'kwk', project: 'Rozdzielnia 110/6 kV, etap 1', received: '2025-10-02', contract: 'UM/2025/081', signed: '2025-10-02', value: 3450000, currency: 'PLN', delivery: '2026-08-31', pm: 'pm', status: 'zakończone',
      fat: 'Standard PET.', sat: 'Standard PET.', units: [{ sn: 'PET-2026-0290', fat: '2026-07-02', sat: '2026-09-10', delivered: '2026-08-27', warranty: '2028-09-10' }], files: [], stages: dict.etapy.map(() => ({ plan: '2026-08-01', real: '2026-08-01', st: 'done', who: 'PET' })) },
  ];

  const service = [
    { id: 'SER/2026/0003', sn: 'PET-2023-0148', customer: 'huta', unitDelivered: '2023-06-14', date: '2026-09-04', desc: 'Wyciek oleju na uszczelnieniu przepustu 110 kV fazy B. Poziom oleju w konserwatorze spadł o 6 cm w 3 tygodnie.', prio: 'wysoki', owner: 'aftersales', respondBy: '2026-09-06', closeBy: '2026-10-15', status: 'w toku', cost: 38500, currency: 'PLN', cause: 'Starzenie uszczelki NBR, przekroczona temperatura pracy przy piecu łukowym.', actions: 'Wymiana uszczelnienia na FKM, uzupełnienie oleju, badanie DGA po 4 tygodniach.', photos: 6, report: 'RS-2026-0003-v1.pdf', conclusions: 'Rekomendacja: przegląd uszczelnień drugiej jednostki PET-2023-0149 przy najbliższym postoju.' },
    { id: 'SER/2026/0002', sn: 'PET-2024-0201', customer: 'enea', unitDelivered: '2024-11-20', date: '2026-07-22', desc: 'Sygnalizacja wysokiej temperatury oleju przy obciążeniu 85%.', prio: 'normalny', owner: 'aftersales', respondBy: '2026-07-24', closeBy: '2026-08-30', status: 'zakończone', cost: 4200, currency: 'PLN', cause: 'Błędna nastawa czujnika, wentylatory ONAF nieaktywne.', actions: 'Korekta nastaw, test wentylatorów.', photos: 2, report: 'RS-2026-0002.pdf', conclusions: 'Bez wad wyrobu.' },
    { id: 'SER/2026/0001', sn: 'PET-2022-0117', customer: 'kwk', unitDelivered: '2022-09-30', date: '2026-02-10', desc: 'Uszkodzenie wskaźnika poziomu oleju.', prio: 'niski', owner: 'aftersales', respondBy: '2026-02-12', closeBy: '2026-03-15', status: 'zakończone', cost: 1900, currency: 'PLN', cause: 'Uszkodzenie mechaniczne przy pracach na stacji.', actions: 'Wymiana wskaźnika.', photos: 3, report: 'RS-2026-0001.pdf', conclusions: 'Poza gwarancją, fakturowane.' },
  ];

  const alerts = [
    { type: 'bad', when: 'jutro', title: 'Termin oferty mija: ZAP/2026/0083 KWK Jaworzyna', sub: 'Termin złożenia oferty 25.09. Oferta OF/2026/0040 R1 wysłana, czeka na decyzję.', link: '#/zapytania/ZAP-2026-0083' },
    { type: 'warn', when: '2 dni', title: 'Odpowiedź techniczna: ZAP/2026/0086 DC Poznań E2', sub: 'Termin dla działu projektowania 26.09. Brak odpowiedzi w kanale Teams.', link: '#/zapytania/ZAP-2026-0086' },
    { type: 'warn', when: '5 dni', title: 'Ważność oferty: OF/2026/0036 DataPark, etap 1', sub: 'Oferta wygrana, ważność 30.09 do zamknięcia formalnego.', link: '#/oferty/OF-2026-0036' },
    { type: 'bad', when: 'etap', title: 'Ryzyko etapu: ZL/2026/0007, suszenie', sub: 'Awaria pieca VPD nr 1, przesunięcie ok. 8 dni. PM: Piotr Nowicki.', link: '#/zlecenia/ZL-2026-0007' },
    { type: 'info', when: '132 dni', title: 'Brak kontaktu: Enea Operator (priorytet wysoki)', sub: 'Ostatnie spotkanie 14.05.2026. Próg 120 dni.', link: '#/klienci/enea' },
    { type: 'info', when: '12 dni', title: 'Termin oferty: ZAP/2026/0087 GPZ Kobylnica', sub: 'Termin złożenia 06.10. Rewizja R3 w przygotowaniu.', link: '#/zapytania/ZAP-2026-0087' },
  ];

  const sales = { quarters: ['Q4 25', 'Q1 26', 'Q2 26', 'Q3 26'], values: [9.4, 11.2, 8.7, 12.6] };

  // Dashboard: plan vs realizacja 2026 (mln EUR, narastająco), sprzedaż per handlowiec, sprzedaż per kraj (YTD)
  const plan2026 = { months: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
    plan: [3.2, 6.4, 9.6, 12.8, 16.0, 19.2, 22.4, 25.6, 28.8, 32.0, 35.2, 38.4],
    real: [2.9, 5.1, 9.4, 11.2, 13.9, 17.1, 21.8, 26.3, 31.0, null, null, null] };
  const reps = [
    { id: 'sprzedaz', value: 14.8, plan: 15.0, units: 9, won: 5, lost: 2 },
    { id: 'dyrektor', value: 9.6, plan: 8.0, units: 5, won: 3, lost: 1 },
    { id: 'pm', value: 4.1, plan: 6.0, units: 3, won: 2, lost: 1 },
    { id: 'wsparcie', value: 2.5, plan: 3.0, units: 2, won: 1, lost: 0 },
  ];
  const countries = { PL: { v: 21.4, units: 14, won: 9, lost: 3 }, DE: { v: 4.2, units: 3, won: 2, lost: 1 }, HR: { v: 2.6, units: 2, won: 2, lost: 0 }, NL: { v: 1.4, units: 1, won: 1, lost: 0 }, CZ: { v: 0.9, units: 1, won: 1, lost: 1 }, LT: { v: 0.5, units: 1, won: 1, lost: 0 }, SE: { v: 0, units: 0, won: 0, lost: 1 }, RO: { v: 0, units: 0, won: 0, lost: 1 }, UA: { v: 0, units: 0, won: 0, lost: 1 } };

  return { users, dict, customers, inquiries, offers, orders, service, alerts, sales, plan2026, reps, countries };
})();
