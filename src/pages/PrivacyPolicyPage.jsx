import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-sage pt-24 pb-32">
      <div className="container-workshift px-6">
        {/* Navigation / Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium tracking-tight">Wróć do strony głównej</span>
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <header className="mb-16 border-b border-black/10 pb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-display mb-6 leading-tight tracking-tight">
              Polityka Prywatności i Polityka Cookies
            </h1>
            <p className="text-black/60 text-lg italic">
              Ostatnia aktualizacja: Kwiecień 2026
            </p>
          </header>

          <article className="prose-workshift max-w-none">
            <h3>§1 POSTANOWIENIA OGÓLNE</h3>
            <p>
              Niniejsza Polityka Prywatności i Polityka Cookies określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników oraz plików Cookies, a także innych technologii pojawiających się na stronie internetowej <a href="https://workshift.pl/">https://workshift.pl/</a>.
            </p>
            <p>
              Administratorem strony i danych osobowych przekazywanych w jej ramach jest <strong>Jakub Bednarz Business Consulting</strong> z siedzibą w Warszawie, ul. Złota 7 lok. 28, 00-019 Warszawa, NIP: 6492314982.
            </p>
            <p>
              W razie jakichkolwiek wątpliwości w zakresie postanowień niniejszej Polityki Prywatności i Polityka Cookies proszę kontaktować się z Administratorem poprzez adres e-mail: <a href="mailto:kontakt@workshift.pl">kontakt@workshift.pl</a>.
            </p>
            <p>
              Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce prywatności, a każdego Użytkownika strony obowiązuje znajomość aktualnej Polityki prywatności. Przyczyną zmian mogą być rozwój technologii internetowej, zmiany w powszechnie obowiązującym prawie czy też rozwój Strony poprzez np. korzystanie z nowych narzędzi przez Administratora. Na dole strony znajduje się data publikacji aktualnej Polityki prywatności.
            </p>

            <h3>§2 DEFINICJE</h3>
            <ul>
              <li><strong>Administrator</strong> – Jakub Bednarz Business Consulting z siedzibą w Warszawie, ul. Złota 7 lok. 28, 00-019 Warszawa, NIP: 6492314982.</li>
              <li><strong>Użytkownik</strong> – każdy podmiot przebywający na stronie i korzystający z niej.</li>
              <li><strong>Strona</strong> – strona internetowa znajdująca się pod adresem <a href="https://workshift.pl/">https://workshift.pl/</a> i odpowiednich podstronach.</li>
              <li><strong>Formularz lub Formularze</strong> – miejsca na Stronie, które umożliwiają wprowadzenie danych osobowych przez Użytkownika, we wskazanych w nich celach np. w celu kontaktu z Administratorem.</li>
              <li><strong>Newsletter</strong> – oznacza bezpłatną usługę świadczoną drogą elektroniczną przez Administratora na rzecz Użytkownika poprzez przesyłanie listów elektronicznych, za pośrednictwem których Administrator informuje o wydarzeniach, usługach, produktach i innych elementach istotnych z punktu widzenia Administratora i/lub w celu realizacji prawnie uzasadnionego celu Administratora, którym jest marketing bezpośredni, w tym wysyłanie treści marketingowych i handlowych za zgodą Użytkownika.</li>
              <li><strong>RODO</strong> – oznacza Rozporządzenie Parlamentu Europejskiego i Rady EU 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (Ogólne Rozporządzenie o Ochronie Danych).</li>
              <li><strong>Ustawa o ochronie danych osobowych</strong> – ustawa z dnia 10 maja 2018 r. o ochronie danych osobowych (Dz. U. 2018, poz. 1000 z późn. zm.).</li>
              <li><strong>Ustawa o świadczeniu usług drogą elektroniczną</strong> – ustawa z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną (Dz. U. z 2020 r. poz. 344 z późn. zm.).</li>
              <li><strong>Ustawa Prawo Telekomunikacyjne</strong> – ustawa z dnia 16 lipca 2004 r. Prawo telekomunikacyjne (Dz. U. z 2021 r. poz. 576 z późn. zm.).</li>
            </ul>

            <h3>§3 DANE OSOBOWE I ZASADY ICH PRZETWARZANIA</h3>
            <h4>KTO JEST ADMINISTRATOREM DANYCH OSOBOWYCH UŻYTKOWNIKA?</h4>
            <p>Administratorem danych osobowych Użytkownika jest Jakub Bednarz Business Consulting z siedzibą w Warszawie, ul. Złota 7 lok. 28, 00-019 Warszawa, NIP: 6492314982.</p>
            
            <h4>CZY PODANIE DANYCH JEST DOBROWOLNE? CO JEST KONSEKWENCJĄ ICH NIEPODANIA?</h4>
            <p>Podanie danych jest dobrowolne, jednakże niepodanie pewnych informacji, co do zasady zaznaczonych na stronach Administratora jako obowiązkowe, wiązać się będzie z brakiem możliwości wykonania danej usługi i osiągnięcia określonego celu lub podjęcia określonych działań.</p>
            <p>Podanie przez Użytkownika danych, które nie są obowiązkowe lub nadmiaru danych, których Administrator nie potrzebuje przetwarzać następuje na podstawie decyzji samego Użytkownika i wówczas przetwarzanie odbywa się na podstawie przesłanki zawartej w art. 6 ust. 1 lit. a RODO (zgoda).</p>
            
            <h4>W JAKICH CELACH I NA JAKICH PODSTAWACH PRAWNYCH PRZETWARZAMY DANE OSOBOWE UŻYTKOWNIKA?</h4>
            <p>Dane osobowe Użytkownika na Stronie Administratora mogą być przetwarzane w następujących celach i na następujących podstawach prawnych:</p>
            <ul>
              <li>wykonania usługi lub wykonania zawartej umowy, przesłania oferty na prośbę Użytkownika - na podstawie art. 6 ust. 1 lit. b RODO;</li>
              <li>wystawienia faktury, rachunku i spełnienia innych obowiązków wynikających z przepisów prawa podatkowego - na podstawie art. 6 ust. 1 lit. c RODO;</li>
              <li>udzielenia rabatu lub informowania o promocjach i ciekawych ofertach Administratora - na podstawie art. 6 ust. 1 lit. a RODO;</li>
              <li>rozpatrzenia reklamacji czy roszczeń związanych z umową - na podstawie art. 6 ust. 1 lit. b RODO oraz art. 6 ust. 1 lit. c RODO;</li>
              <li>ustalenia, dochodzenia lub obrony przed roszczeniami - na podstawie art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes);</li>
              <li>kontaktu telefonicznego w sprawach związanych z realizacją usługi - na podstawie art. 6 ust. 1 lit. b RODO;</li>
              <li>kontaktu telefonicznego w celu przedstawienia oferty i marketingu bezpośredniego - na podstawie art. 6 ust. 1 lit. a RODO oraz lit. f RODO;</li>
              <li>tworzenia rejestrów związanych z RODO i innymi przepisami - na podstawie art. 6 ust. 1 lit. c RODO oraz lit. f RODO;</li>
              <li>archiwalnym i dowodowym, na potrzeby zabezpieczenia informacji - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>analitycznym, polegającym na analizie danych zbieranych automatycznie - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>wykorzystywania cookies na Stronie i jej podstronach - na podstawie art. 6 ust. 1 lit. a RODO;</li>
              <li>zarządzania Stroną internetową - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>badania satysfakcji z oferowanych usług - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>zamieszczenia przez Użytkownika opinii o usługach - na podstawie art. 6 ust. 1 lit. a RODO;</li>
              <li>w wewnętrznych celach administracyjnych związanych z zarządzaniem kontaktem - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>w celu wysyłania newslettera - na podstawie art. 6 ust. 1 lit. f RODO oraz ustawy o świadczeniu usług drogą elektroniczną;</li>
              <li>w celu dopasowania treści wyświetlanych na stronach Administratora - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>w celu marketingu bezpośredniego własnych produktów lub usług - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>w celu prowadzenia rekrutacji - na podstawie art. 6 ust. 1 lit. b RODO lub art. 6 ust. 1 lit. a RODO;</li>
              <li>w celu tworzenia własnych baz danych Użytkowników - na podstawie art. 6 ust. 1 lit. f RODO;</li>
              <li>w celu przechowywania komentarzy - na podstawie art. 6 ust. 1 lit. a RODO.</li>
            </ul>

            <h4>W JAKI SPOSÓB ZBIERANE SĄ DANE?</h4>
            <p>Zbierane i przetwarzane są tylko te dane, które Użytkownik sam poda (za wyjątkiem danych zbieranych automatycznie za pomocą plików cookies oraz danych logowania).</p>
            <p>Podczas wizyty na Stronie, automatycznie zbierane są dane dotyczące samej wizyty, np. adres IP Użytkownika, nazwa domeny, typ przeglądarki, typ systemu operacyjnego itp. Dane te przetwarzane są wyłącznie w celach administrowania stroną i zapewnienia sprawnej obsługi hostingowej i nie są kojarzone z danymi poszczególnych Użytkowników.</p>

            <h4>JAKIE SĄ UPRAWNIENIA UŻYTKOWNIKA?</h4>
            <p>Użytkownikowi przysługują w każdej chwili uprawnienia zawarte w art. 15–21 RODO tj.:</p>
            <ul>
              <li>prawo dostępu do treści jego danych,</li>
              <li>prawo do przenoszenia danych,</li>
              <li>prawo poprawiania i sprostowania danych,</li>
              <li>prawo usunięcia danych, jeśli brak jest podstaw do ich przetwarzania,</li>
              <li>prawo ograniczenia przetwarzania,</li>
              <li>prawo do wniesienia sprzeciwu wobec przetwarzania danych,</li>
              <li>prawo wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych,</li>
              <li>prawo do bycia zapomnianym.</li>
            </ul>
            <p>W celu realizacji swoich praw Użytkownik może zwrócić się do Administratora poprzez adres e-mail <a href="mailto:kontakt@workshift.pl">kontakt@workshift.pl</a>.</p>

            <h4>CZY UŻYTKOWNIK MOŻE COFNĄĆ WYRAŻONĄ ZGODĘ?</h4>
            <p>Jeżeli Użytkownik wyraził zgodę na określone działanie, zgoda taka może być w każdym czasie cofnięta, co skutkować będzie zaprzestaniem wskazanych działań. Cofnięcie zgody pozostaje bez wpływu na przetwarzanie danych, którego dokonano przed jej cofnięciem.</p>

            <h4>CZY ADMINISTRATOR PRZEKAZUJE DANE UŻYTKOWNIKA DO PAŃSTW TRZECICH?</h4>
            <p>Dane Użytkownika mogą być przekazywane poza obszar Unii Europejskiej – do państw trzecich (np. USA w związku z usługami Google, Microsoft itp.). Dostawcy ci stosują mechanizmy zgodności przewidziane przez RODO (np. standardowe klauzule umowne).</p>

            <h4>JAK DŁUGO ADMINISTRATOR PRZECHOWUJE DANE UŻYTKOWNIKA?</h4>
            <p>Dane będą przechowywane przez czas realizacji poszczególnych usług/osiągnięcia celów oraz przez okres przedawnienia roszczeń zgodnie z przepisami prawa (zazwyczaj do 3 lub 6 lat w zależności od celu przetwarzania).</p>

            <h3>§4 POLITYKA COOKIES</h3>
            <h4>CZYM SĄ PLIKI COOKIES?</h4>
            <p>Cookies to małe pliki tekstowe zapisywane na urządzeniu końcowym Użytkownika. Pliki te umożliwiają Stronie rozpoznanie urządzenia Użytkownika przy kolejnej wizycie oraz poprawne działanie funkcji Strony.</p>
            
            <h4>W JAKICH CELACH WYKORZYSTUJEMY COOKIES I JAKIE NARZĘDZIA STOSUJEMY?</h4>
            <p>Administrator wykorzystuje pliki cookies oraz podobne technologie w następujących celach:</p>
            <ul>
              <li><strong>Niezbędne</strong> — zapewnienie prawidłowego działania Strony (Vercel).</li>
              <li><strong>Statystyki</strong> — anonimowa analiza ruchu i zachowań Użytkowników na Stronie przy użyciu narzędzi: Vercel Analytics, Google Analytics 4 (Google LLC, USA), PostHog (PostHog Inc., USA). Narzędzia te pomagają zrozumieć, w jaki sposób Użytkownicy korzystają ze Strony, co pozwala nam ją ulepszać.</li>
              <li><strong>Nagrania sesji</strong> — anonimowe nagrania interakcji Użytkowników ze Stroną (heatmapy, odtworzenia sesji) przy użyciu narzędzi: Microsoft Clarity (Microsoft Corp., USA), PostHog (PostHog Inc., USA).</li>
            </ul>
            <p>Wszystkie wyżej wymienione narzędzia (poza Vercel Analytics, które działa bez plików cookies) są ładowane dopiero po wyrażeniu przez Użytkownika dobrowolnej zgody za pomocą bannera cookie. Użytkownik może w każdej chwili zmienić swoje preferencje klikając w link „Ustawienia cookies" w stopce Strony.</p>

            <h4>CZY UŻYTKOWNIK MOŻE ZARZĄDZAĆ PLIKAMI COOKIES?</h4>
            <p>Użytkownik może w każdej chwili samodzielnie zarządzać plikami cookies poprzez ustawienia swojej przeglądarki internetowej. Wyłączenie obsługi cookies może utrudnić lub uniemożliwić korzystanie ze Strony.</p>

            <h3>§5 POSTANOWIENIA KOŃCOWE</h3>
            <p>Niniejsza Polityka Prywatności i Polityka Cookies obowiązuje od dnia jej publikacji na stronie <a href="https://workshift.pl/">https://workshift.pl/</a>.</p>
            <p>W sprawach nieuregulowanych niniejszą Polityką stosuje się odpowiednie przepisy prawa polskiego, w szczególności RODO.</p>
            <p className="mt-12 text-black/40 text-sm">
              Data ostatniej aktualizacji: maj 2026
            </p>
          </article>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
