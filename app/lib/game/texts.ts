import type { ContentLanguage, GameContent } from "./types";
import type { CardObject, ColorId } from "./visual";

/**
 * Game-language strings that are load-bearing or shared by the whole team
 * (public prompts, rule wording, message bank, hints, fallback Game Master
 * content). They are NOT in messages/*.json because they must be identical
 * on every player's screen regardless of each player's own UI language.
 */

type Texts = {
  slotPrompt: (meeting: string) => string;
  snackPrompt: (snack: string) => string;
  wifiPrompt: (tool: string) => string;
  replyAllPrompt: string;
  callbackPrompt: (hourRound: number, noteHolder: string) => string;
  shelves: string[];
  snackDecoys: string[];
  rules: {
    firstLetter: (what: string) => string;
    lastLetter: (what: string) => string;
    letterAt: (n: number, what: string) => string;
    teamSize: string;
    letterCount: (what: string) => string;
  };
  ruleOrderHint: string;
  wifiWords: (snack: string, meeting: string, tool: string) => string;
  desksPrompt: (tool: string) => string;
  deskItems: (snack: string, tool: string) => [string, string, string, string];
  clues: { nextTo: string; leftOf: string; notAt: string; between: string; at: string; emptyAt: string };
  hints: { slot: string; morning: string; afternoon: string; snack: string; wifi: string; replyall: string; desks: string; callback: string };
  thread: (snack: string, meeting: string, tool: string) => string[];
  calendarOwner: (name: string) => string;
  stickyNote: (room: number) => string;
  hint: (firstChar: string) => string;
  facts: { hour: string; snackTotal: string; wifi: string; desks: string; lineup: string; note: string; memory: string };
  /** Added under every final-challenge prompt: the judge gives points for callbacks to the episode. */
  challengeBonus: string;
  /** Code round in a world whose "wifi password" has another name (from the episode skin). */
  codePrompt: (codeName: string) => string;
  /** Talk rounds (talk.ts). Everything a player sees in them is a picture; these are the instructions around it. */
  talk: {
    commonPrompt: string;
    lineupPrompt: string;
    blueprintPrompt: string;
    hints: { common: string; lineup: string; blueprint: string };
    colors: Record<ColorId, string>;
    cards: Record<CardObject, string>;
    emptyTile: string;
    cardName: (object: string, color: string) => string;
    faceNumber: (n: string) => string;
  };
  words: { snack: string; meeting: string; tool: string };
  intakeDefaults: Record<string, string>;
  fallback: GameContent;
};

const en: Texts = {
  slotPrompt: (meeting) =>
    `Everyone's calendar is different. Find the one hour today when all of you are free for "${meeting}". Enter the hour (24h, e.g. 14).`,
  snackPrompt: (snack) =>
    `Each of you can see one shelf. How many ${snack} are still fine to eat across all shelves? Only the solver knows today's date, so read out the best-before dates on your shelf.`,
  wifiPrompt: (tool) =>
    `The guest wifi password got changed again. Each of you holds one rule. Put the pieces together in rule order to get the password for "${tool}".`,
  replyAllPrompt:
    "A reply-all thread got scrambled and each of you holds a few messages. Put them in time order, then enter the minutes of the FIRST and the LAST message (e.g. 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Memory check. Add the free hour you found in round ${hourRound} to the number on the note ${noteHolder} saw earlier. Enter the sum.`,
  shelves: ["Kitchen", "Meeting room", "Desk drawer", "Reception", "The secret stash"],
  snackDecoys: ["oat biscuits", "rice cakes", "mystery yoghurt", "someone's lunch"],
  rules: {
    firstLetter: (what) => `The first letter of ${what}.`,
    lastLetter: (what) => `The last letter of ${what}.`,
    letterAt: (n, what) => `Letter number ${n} of ${what}.`,
    teamSize: "The number of players on your team.",
    letterCount: (what) => `How many letters ${what} has.`,
  },
  ruleOrderHint: "Rules are applied in order 1, 2, 3… Letters are uppercase. No spaces.",
  wifiWords: (s, m, t) => `Words in play: snack = "${s}", meeting = "${m}", tool = "${t}". Count letters only (ignore spaces and punctuation).`,
  desksPrompt: (tool) => `Five desks in a row, numbered 1 to 5 from the window. Four things live there, one desk is empty: the snack stash, "${tool}", the printer and the plant. Each of you holds one or two clues. Enter the desk numbers of the snack stash, "${tool}", the printer and the plant, in that order (e.g. 2413).`,
  deskItems: (snack, tool) => [`the snack stash`, `the tool nicknamed "${tool}"`, `the printer`, `the plant`],
  clues: {"nextTo": "{a} is right next to {b}.", "leftOf": "{a} is somewhere to the left of {b} (closer to the window).", "notAt": "{a} is not at desk {n}.", "between": "There is exactly one desk between {a} and {b}.", "at": "{a} is at desk {n}.", "emptyAt": "Desk {n} is empty."},
  hints: {"slot": "It's in the {part}.", "morning": "morning", "afternoon": "afternoon", "snack": "The total is between {lo} and {hi}.", "wifi": "The password starts with \"{c}\".", "replyall": "The first message was sent at {t}.", "desks": "The snack stash is at desk {n}.", "callback": "The sticky note's number started with {c}."},
  thread: (snack, meeting, tool) => [
    `Reminder: ${meeting} is moved to this afternoon. Again.`,
    `Who took the last of the ${snack}?`,
    `Please stop replying all.`,
    `Is ${tool} down for everyone or just me?`,
    `Replying all to say: please stop replying all.`,
    `Found the ${snack}. It was in the printer room. Don't ask.`,
    `Can we take this offline?`,
  ],
  calendarOwner: (name) => `${name}'s calendar`,
  stickyNote: (room) => `Sticky note on the monitor: "Projector remote is in room ${room}."`,
  hint: (firstChar) => `The answer starts with "${firstChar}".`,
  challengeBonus: "Bonus points for mentioning something from today's episode.",
  codePrompt: (codeName) =>
    `The code for "${codeName}" got changed again. Each of you holds one rule. Put the pieces together in rule order to rebuild it.`,
  talk: {
    commonPrompt: "Everyone except the solver holds six cards. Exactly one card is in every hand: same object, same colour. Compare your cards out loud. The solver finds that card on the board and taps it.",
    lineupPrompt: "Eight faces, one person to find. Each witness remembers a detail or two, but only as a picture. Describe it out loud. The solver taps the right face.",
    blueprintPrompt: "The solver has an empty grid. Each of you holds part of the pattern. Describe your tiles one by one, left to right. The solver rebuilds the whole grid and sends it.",
    hints: { common: "The shared card is {color}.", lineup: "It's not face {a}, and it's not face {b}.", blueprint: "Top-left tile: {tile}." },
    colors: { red: "red", blue: "blue", yellow: "yellow", black: "black" },
    cards: { key: "key", mug: "mug", plant: "plant", clock: "clock", umbrella: "umbrella", rocket: "rocket", bell: "bell", crown: "crown", bulb: "light bulb", envelope: "envelope", camera: "camera", gem: "gem" },
    emptyTile: "empty",
    cardName: (o, c) => `${c} ${o}`,
    faceNumber: (n) => `face ${n}`,
  },
  facts: { hour: "The free hour", snackTotal: "Snacks still edible", wifi: "Guest wifi password" , desks: "Desk order", lineup: "The face you picked", note: "The number on the note", memory: "The memory-check answer" },
  words: { snack: "your team's snack", meeting: "your pointless meeting", tool: "your tool's nickname" },
  intakeDefaults: {
    q1: "let's circle back",
    q2: "coffee",
    q3: "the Monday sync",
    q4: "the beast",
    q5: "the reply-all incident",
    q6: "a nap room",
  },
  fallback: {
    briefing:
      "Welcome to the office. It runs on your snack, it survives your meetings, and today it needs all of you to talk to each other. Nobody can solve a round alone, and that's the point.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `Round ${i + 1}`,
      setup: "Everyone holds a different piece. The solver enters the answer. Talk.",
      reactions: {
        fast: "Solved. Quick, too. Someone has been to meetings that could have been emails and learned from it.",
        slow: "Solved. It took a moment, but so does the coffee machine.",
        failed: "Not this time. The office carries on regardless; it always does.",
      },
      stuck: "Stuck is fine. Say out loud what you can see; someone is holding the bit you're missing.",
    })),
    challengePrompt:
      "Together, in three sentences: pitch the perk your office truly deserves, and explain how it will fix the pointless meeting once and for all. Mention the snack at least once.",
    keyIntro: "One last thing. The reward unlocks when every one of you enters the same key. Three facts you already found.",
    keyReveal: "Fine, here's a piece of it. We're generous on a Friday.",
    outro: "That's the game. Helping paid, solving paid, and nobody had to say 'can everyone see my screen'.",
  },
};

const sv: Texts = {
  slotPrompt: (meeting) =>
    `Alla har olika kalendrar. Hitta den enda timmen i dag när ni alla är lediga för "${meeting}". Ange timmen (24h, t.ex. 14).`,
  snackPrompt: (snack) =>
    `Var och en av er ser en hylla. Hur många ${snack} går fortfarande att äta, räknat över alla hyllor? Bara lösaren vet dagens datum, så läs upp bäst före-datumen på er hylla.`,
  wifiPrompt: (tool) =>
    `Gästnätverkets lösenord har ändrats igen. Var och en av er har en regel. Sätt ihop bitarna i regelordning för att få lösenordet till "${tool}".`,
  replyAllPrompt:
    "En svara-alla-tråd har blandats och var och en av er har några meddelanden. Lägg dem i tidsordning och ange minuterna för det FÖRSTA och det SISTA meddelandet (t.ex. 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Minnestest. Addera den lediga timmen ni hittade i runda ${hourRound} med numret på lappen som ${noteHolder} såg tidigare. Ange summan.`,
  shelves: ["Köket", "Mötesrummet", "Skrivbordslådan", "Receptionen", "Det hemliga förrådet"],
  snackDecoys: ["havrekex", "riskakor", "mystisk yoghurt", "någons matlåda"],
  rules: {
    firstLetter: (what) => `Första bokstaven i ${what}.`,
    lastLetter: (what) => `Sista bokstaven i ${what}.`,
    letterAt: (n, what) => `Bokstav nummer ${n} i ${what}.`,
    teamSize: "Antalet spelare i ert lag.",
    letterCount: (what) => `Hur många bokstäver ${what} har.`,
  },
  ruleOrderHint: "Reglerna tillämpas i ordning 1, 2, 3… Bokstäver skrivs med versaler. Inga mellanslag.",
  wifiWords: (s, m, t) => `Ord i spel: snacks = "${s}", möte = "${m}", verktyg = "${t}". Räkna bara bokstäver (hoppa över mellanslag och skiljetecken).`,
  desksPrompt: (tool) => `Fem skrivbord i rad, numrerade 1 till 5 från fönstret. Fyra saker finns där, ett bord är tomt: snacksförrådet, "${tool}", skrivaren och växten. Var och en av er har en eller två ledtrådar. Ange bordsnumren för snacksförrådet, "${tool}", skrivaren och växten, i den ordningen (t.ex. 2413).`,
  deskItems: (snack, tool) => [`snacksförrådet`, `verktyget "${tool}"`, `skrivaren`, `växten`],
  clues: {"nextTo": "{a} står precis bredvid {b}.", "leftOf": "{a} står någonstans till vänster om {b} (närmare fönstret).", "notAt": "{a} står inte vid bord {n}.", "between": "Det är exakt ett bord mellan {a} och {b}.", "at": "{a} står vid bord {n}.", "emptyAt": "Bord {n} är tomt."},
  hints: {"slot": "Det är på {part}.", "morning": "förmiddagen", "afternoon": "eftermiddagen", "snack": "Totalen är mellan {lo} och {hi}.", "wifi": "Lösenordet börjar med \"{c}\".", "replyall": "Det första meddelandet skickades {t}.", "desks": "Snacksförrådet står vid bord {n}.", "callback": "Post-it-lappens nummer började med {c}."},
  thread: (snack, meeting, tool) => [
    `Påminnelse: ${meeting} är flyttat till i eftermiddag. Igen.`,
    `Vem tog det sista av ${snack}?`,
    `Snälla sluta svara alla.`,
    `Ligger ${tool} nere för alla eller bara för mig?`,
    `Svarar alla för att säga: snälla sluta svara alla.`,
    `Hittade ${snack}. Det låg i skrivarrummet. Fråga inte.`,
    `Kan vi ta det här offline?`,
  ],
  calendarOwner: (name) => `${name}s kalender`,
  stickyNote: (room) => `Post-it på skärmen: "Projektorns fjärrkontroll finns i rum ${room}."`,
  hint: (firstChar) => `Svaret börjar med "${firstChar}".`,
  challengeBonus: "Bonuspoäng om ni nämner något från dagens avsnitt.",
  codePrompt: (codeName) =>
    `Koden till "${codeName}" har ändrats igen. Var och en av er har en regel. Sätt ihop bitarna i regelordning för att få fram den.`,
  talk: {
    commonPrompt: "Alla utom lösaren har sex kort. Exakt ett kort finns i allas händer: samma föremål, samma färg. Jämför era kort högt. Lösaren hittar kortet på tavlan och trycker på det.",
    lineupPrompt: "Åtta ansikten, en person att hitta. Varje vittne minns en eller två detaljer, men bara som en bild. Beskriv dem högt. Lösaren trycker på rätt ansikte.",
    blueprintPrompt: "Lösaren har ett tomt rutnät. Var och en av er har en del av mönstret. Beskriv era rutor en i taget, från vänster till höger. Lösaren bygger upp hela rutnätet och skickar det.",
    hints: { common: "Det gemensamma kortets färg: {color}.", lineup: "Det är inte ansikte {a}, och inte ansikte {b}.", blueprint: "Rutan längst upp till vänster: {tile}." },
    colors: { red: "röd", blue: "blå", yellow: "gul", black: "svart" },
    cards: { key: "nyckel", mug: "mugg", plant: "växt", clock: "klocka", umbrella: "paraply", rocket: "raket", bell: "ringklocka", crown: "krona", bulb: "glödlampa", envelope: "kuvert", camera: "kamera", gem: "ädelsten" },
    emptyTile: "tom",
    cardName: (o, c) => `${o} (${c})`,
    faceNumber: (n) => `ansikte ${n}`,
  },
  facts: { hour: "Den lediga timmen", snackTotal: "Ätbara snacks", wifi: "Gästnätverkets lösenord" , desks: "Bordsordning", lineup: "Ansiktet ni valde", note: "Numret på lappen", memory: "Svaret på minnestestet" },
  words: { snack: "ert lags snacks", meeting: "ert meningslösa möte", tool: "ert verktygs smeknamn" },
  intakeDefaults: {
    q1: "vi tar det sen",
    q2: "kaffe",
    q3: "måndagsavstämningen",
    q4: "monstret",
    q5: "svara-alla-incidenten",
    q6: "ett vilrum",
  },
  fallback: {
    briefing:
      "Välkomna till kontoret. Det drivs av ert snacks, det överlever era möten och i dag behöver det att ni pratar med varandra. Ingen kan lösa en runda ensam, och det är poängen.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `Runda ${i + 1}`,
      setup: "Alla har en egen bit. Lösaren skriver in svaret. Prata.",
      reactions: {
        fast: "Löst. Snabbt dessutom. Någon har suttit i möten som kunde ha varit mejl och lärt sig av det.",
        slow: "Löst. Det tog en stund, men det gör kaffemaskinen också.",
        failed: "Inte den här gången. Kontoret rullar på ändå, det gör det alltid.",
      },
      stuck: "Att fastna är okej. Säg högt vad du ser, någon sitter på biten du saknar.",
    })),
    challengePrompt:
      "Tillsammans, i tre meningar: pitcha förmånen ert kontor verkligen förtjänar, och förklara hur den en gång för alla fixar det meningslösa mötet. Nämn snackset minst en gång.",
    keyIntro: "En sista sak. Belöningen låses upp när alla skriver in samma nyckel. Tre fakta ni redan hittat.",
    keyReveal: "Okej, här är en bit av den. Vi är generösa på fredagar.",
    outro: "Det var spelet. Att hjälpa lönade sig, att lösa lönade sig, och ingen behövde säga 'ser alla min skärm?'.",
  },
};

const nl: Texts = {
  slotPrompt: (meeting) => `Iedereen heeft een andere agenda. Vind het ene uur vandaag waarop jullie allemaal vrij zijn voor "${meeting}". Voer het uur in (24u, bijv. 14).`,
  snackPrompt: (snack) =>
    `Ieder van jullie ziet één plank. Hoeveel ${snack} zijn nog goed om te eten, over alle planken samen? Alleen de oplosser kent de datum van vandaag, dus lees de houdbaarheidsdata op je plank voor.`,
  wifiPrompt: (tool) => `Het wachtwoord van de gastenwifi is wéér veranderd. Ieder van jullie heeft één regel. Zet de stukjes in regelvolgorde achter elkaar voor het wachtwoord van "${tool}".`,
  replyAllPrompt:
    "Een reply-all-thread is door elkaar geraakt en ieder van jullie heeft een paar berichten. Zet ze op tijdsvolgorde en voer de minuten van het EERSTE en het LAATSTE bericht in (bijv. 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Geheugentest. Tel het vrije uur uit ronde ${hourRound} op bij het nummer op het briefje dat ${noteHolder} eerder zag. Voer de som in.`,
  shelves: ["Keuken", "Vergaderruimte", "Bureaula", "Receptie", "De geheime voorraad"],
  snackDecoys: ["haverkoekjes", "rijstwafels", "mysterieuze yoghurt", "iemands lunch"],
  rules: {
    firstLetter: (what) => `De eerste letter van ${what}.`,
    lastLetter: (what) => `De laatste letter van ${what}.`,
    letterAt: (n, what) => `Letter nummer ${n} van ${what}.`,
    teamSize: "Het aantal spelers in je team.",
    letterCount: (what) => `Het aantal letters van ${what}.`,
  },
  ruleOrderHint: "Regels gelden in volgorde 1, 2, 3… Letters in hoofdletters. Geen spaties.",
  wifiWords: (s, m, t) => `Woorden in het spel: snack = "${s}", vergadering = "${m}", tool = "${t}". Tel alleen letters (spaties en leestekens tellen niet).`,
  desksPrompt: (tool) => `Vijf bureaus op een rij, genummerd 1 tot 5 vanaf het raam. Vier dingen staan er, één bureau is leeg: de snackvoorraad, "${tool}", de printer en de plant. Ieder van jullie heeft een of twee aanwijzingen. Voer de bureaunummers in van de snackvoorraad, "${tool}", de printer en de plant, in die volgorde (bijv. 2413).`,
  deskItems: (snack, tool) => [`de snackvoorraad`, `de tool "${tool}"`, `de printer`, `de plant`],
  clues: {"nextTo": "{a} staat direct naast {b}.", "leftOf": "{a} staat ergens links van {b} (dichter bij het raam).", "notAt": "{a} staat niet op bureau {n}.", "between": "Er staat precies één bureau tussen {a} en {b}.", "at": "{a} staat op bureau {n}.", "emptyAt": "Bureau {n} is leeg."},
  hints: {"slot": "Het is in de {part}.", "morning": "ochtend", "afternoon": "middag", "snack": "Het totaal ligt tussen {lo} en {hi}.", "wifi": "Het wachtwoord begint met \"{c}\".", "replyall": "Het eerste bericht is om {t} verstuurd.", "desks": "De snackvoorraad staat op bureau {n}.", "callback": "Het nummer op het plakbriefje begon met {c}."},
  thread: (snack, meeting, tool) => [
    `Herinnering: ${meeting} is verplaatst naar vanmiddag. Alweer.`,
    `Wie heeft de laatste ${snack} gepakt?`,
    `Stop alsjeblieft met reply-all.`,
    `Ligt ${tool} eruit voor iedereen of alleen voor mij?`,
    `Reply-all om te zeggen: stop alsjeblieft met reply-all.`,
    `${snack} gevonden. Lag in de printerruimte. Vraag niet verder.`,
    `Kunnen we dit offline bespreken?`,
  ],
  calendarOwner: (name) => `Agenda van ${name}`,
  stickyNote: (room) => `Plakbriefje op het scherm: "De afstandsbediening van de beamer ligt in kamer ${room}."`,
  hint: (firstChar) => `Het antwoord begint met "${firstChar}".`,
  challengeBonus: "Bonuspunten als jullie iets uit de aflevering van vandaag noemen.",
  codePrompt: (codeName) =>
    `De code van "${codeName}" is wéér veranderd. Ieder van jullie heeft één regel. Zet de stukjes in regelvolgorde achter elkaar om hem terug te vinden.`,
  talk: {
    commonPrompt: "Iedereen behalve de oplosser heeft zes kaarten. Precies één kaart zit in ieders hand: hetzelfde voorwerp, dezelfde kleur. Vergelijk je kaarten hardop. De oplosser zoekt die kaart op het bord en tikt erop.",
    lineupPrompt: "Acht gezichten, één persoon om te vinden. Elke getuige herinnert zich een of twee details, maar alleen als plaatje. Beschrijf ze hardop. De oplosser tikt op het juiste gezicht.",
    blueprintPrompt: "De oplosser heeft een leeg raster. Ieder van jullie heeft een deel van het patroon. Beschrijf je tegels één voor één, van links naar rechts. De oplosser bouwt het hele raster na en verstuurt het.",
    hints: { common: "Kleur van de gedeelde kaart: {color}.", lineup: "Het is niet gezicht {a} en ook niet gezicht {b}.", blueprint: "Tegel linksboven: {tile}." },
    colors: { red: "rood", blue: "blauw", yellow: "geel", black: "zwart" },
    cards: { key: "sleutel", mug: "mok", plant: "plant", clock: "klok", umbrella: "paraplu", rocket: "raket", bell: "bel", crown: "kroon", bulb: "gloeilamp", envelope: "envelop", camera: "camera", gem: "edelsteen" },
    emptyTile: "leeg",
    cardName: (o, c) => `${o} (${c})`,
    faceNumber: (n) => `gezicht ${n}`,
  },
  facts: { hour: "Het vrije uur", snackTotal: "Nog eetbare snacks", wifi: "Wachtwoord gastenwifi" , desks: "Bureauvolgorde", lineup: "Het gekozen gezicht", note: "Het nummer op het briefje", memory: "Het antwoord van de geheugentest" },
  words: { snack: "de snack van je team", meeting: "jullie zinloze vergadering", tool: "de bijnaam van jullie tool" },
  intakeDefaults: { q1: "even terugkoppelen", q2: "koffie", q3: "de maandag-sync", q4: "het beest", q5: "het reply-all-incident", q6: "een dutjeskamer" },
  fallback: {
    briefing: "Welkom op kantoor. Het draait op jullie snack, het overleeft jullie vergaderingen, en vandaag heeft het jullie allemaal nodig om met elkaar te praten. Niemand kan een ronde alleen oplossen, en dat is precies de bedoeling.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `Ronde ${i + 1}`,
      setup: "Iedereen heeft een ander stukje. De oplosser voert het antwoord in. Praat.",
      reactions: { fast: "Opgelost. En snel ook. Iemand heeft in vergaderingen gezeten die een e-mail hadden kunnen zijn en er iets van geleerd.", slow: "Opgelost. Het duurde even, maar dat geldt ook voor de koffiemachine.", failed: "Niet deze keer. Het kantoor draait gewoon door, zoals altijd." },
      stuck: "Vastzitten mag. Zeg hardop wat je ziet; iemand heeft het stukje dat je mist.",
    })),
    challengePrompt: "Samen, in drie zinnen: pitch de extra die jullie kantoor echt verdient, en leg uit hoe die de zinloze vergadering voorgoed oplost. Noem de snack minstens één keer.",
    keyIntro: "Nog één ding. De beloning gaat open als ieder van jullie dezelfde sleutel invoert. Drie feiten die jullie al gevonden hebben.",
    keyReveal: "Goed dan, hier is een stukje. We zijn gul op vrijdag.",
    outro: "Dat was het spel. Helpen loonde, oplossen loonde, en niemand hoefde te vragen of iedereen het scherm kon zien.",
  },
};

const de: Texts = {
  slotPrompt: (meeting) => `Alle haben einen anderen Kalender. Findet die eine Stunde heute, in der ihr alle frei seid für "${meeting}". Gebt die Stunde ein (24h, z. B. 14).`,
  snackPrompt: (snack) =>
    `Jede Person sieht ein Regal. Wie viele ${snack} sind über alle Regale hinweg noch essbar? Nur die lösende Person kennt das heutige Datum, also lest die Mindesthaltbarkeitsdaten in eurem Regal vor.`,
  wifiPrompt: (tool) => `Das Gäste-WLAN-Passwort wurde schon wieder geändert. Jede Person hält eine Regel. Setzt die Teile in Regelreihenfolge zusammen, um das Passwort für "${tool}" zu erhalten.`,
  replyAllPrompt:
    "Ein Allen-antworten-Thread ist durcheinandergeraten und jede Person hält ein paar Nachrichten. Bringt sie in zeitliche Reihenfolge und gebt die Minuten der ERSTEN und der LETZTEN Nachricht ein (z. B. 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Gedächtnistest. Addiert die freie Stunde aus Runde ${hourRound} zur Zahl auf dem Zettel, den ${noteHolder} vorhin gesehen hat. Gebt die Summe ein.`,
  shelves: ["Küche", "Besprechungsraum", "Schreibtischschublade", "Empfang", "Das geheime Lager"],
  snackDecoys: ["Haferkekse", "Reiswaffeln", "mysteriöser Joghurt", "jemandes Mittagessen"],
  rules: {
    firstLetter: (what) => `Der erste Buchstabe von ${what}.`,
    lastLetter: (what) => `Der letzte Buchstabe von ${what}.`,
    letterAt: (n, what) => `Buchstabe Nummer ${n} von ${what}.`,
    teamSize: "Die Anzahl der Spieler in eurem Team.",
    letterCount: (what) => `Die Anzahl der Buchstaben von ${what}.`,
  },
  ruleOrderHint: "Die Regeln gelten in der Reihenfolge 1, 2, 3… Buchstaben in Großschreibung. Keine Leerzeichen.",
  wifiWords: (s, m, t) => `Wörter im Spiel: Snack = "${s}", Meeting = "${m}", Tool = "${t}". Nur Buchstaben zählen (Leerzeichen und Satzzeichen ignorieren).`,
  desksPrompt: (tool) => `Fünf Schreibtische in einer Reihe, nummeriert 1 bis 5 vom Fenster aus. Vier Dinge stehen dort, ein Tisch ist leer: der Snackvorrat, "${tool}", der Drucker und die Pflanze. Jede Person hält ein oder zwei Hinweise. Gebt die Tischnummern von Snackvorrat, "${tool}", Drucker und Pflanze ein, in dieser Reihenfolge (z. B. 2413).`,
  deskItems: (snack, tool) => [`der Snackvorrat`, `das Tool "${tool}"`, `der Drucker`, `die Pflanze`],
  clues: {"nextTo": "{a} steht direkt neben {b}.", "leftOf": "{a} steht irgendwo links von {b} (näher am Fenster).", "notAt": "{a} steht nicht an Tisch {n}.", "between": "Zwischen {a} und {b} steht genau ein Tisch.", "at": "{a} steht an Tisch {n}.", "emptyAt": "Tisch {n} ist leer."},
  hints: {"slot": "Es ist am {part}.", "morning": "Vormittag", "afternoon": "Nachmittag", "snack": "Die Summe liegt zwischen {lo} und {hi}.", "wifi": "Das Passwort beginnt mit \"{c}\".", "replyall": "Die erste Nachricht wurde um {t} gesendet.", "desks": "Der Snackvorrat steht an Tisch {n}.", "callback": "Die Nummer auf dem Klebezettel begann mit {c}."},
  thread: (snack, meeting, tool) => [
    `Erinnerung: ${meeting} ist auf heute Nachmittag verschoben. Schon wieder.`,
    `Wer hat die letzten ${snack} genommen?`,
    `Bitte hört auf, allen zu antworten.`,
    `Ist ${tool} bei allen down oder nur bei mir?`,
    `Antworte allen, um zu sagen: bitte hört auf, allen zu antworten.`,
    `${snack} gefunden. Lagen im Druckerraum. Fragt nicht.`,
    `Können wir das offline klären?`,
  ],
  calendarOwner: (name) => `Kalender von ${name}`,
  stickyNote: (room) => `Klebezettel am Monitor: "Die Beamer-Fernbedienung ist in Raum ${room}."`,
  hint: (firstChar) => `Die Antwort beginnt mit "${firstChar}".`,
  challengeBonus: "Bonuspunkte, wenn ihr etwas aus der heutigen Folge erwähnt.",
  codePrompt: (codeName) =>
    `Der Code für "${codeName}" wurde schon wieder geändert. Jede Person hält eine Regel. Setzt die Teile in Regelreihenfolge zusammen, um ihn wiederherzustellen.`,
  talk: {
    commonPrompt: "Alle außer der lösenden Person haben sechs Karten. Genau eine Karte ist in allen Händen: gleicher Gegenstand, gleiche Farbe. Vergleicht eure Karten laut. Die lösende Person findet diese Karte auf der Tafel und tippt sie an.",
    lineupPrompt: "Acht Gesichter, eine Person, die gefunden werden muss. Jede Zeugin und jeder Zeuge erinnert sich an ein oder zwei Details, aber nur als Bild. Beschreibt sie laut. Die lösende Person tippt das richtige Gesicht an.",
    blueprintPrompt: "Die lösende Person hat ein leeres Raster. Alle anderen halten einen Teil des Musters. Beschreibt eure Felder einzeln, von links nach rechts. Die lösende Person baut das ganze Raster nach und schickt es ab.",
    hints: { common: "Farbe der gemeinsamen Karte: {color}.", lineup: "Es ist nicht Gesicht {a} und auch nicht Gesicht {b}.", blueprint: "Feld oben links: {tile}." },
    colors: { red: "rot", blue: "blau", yellow: "gelb", black: "schwarz" },
    cards: { key: "Schlüssel", mug: "Becher", plant: "Pflanze", clock: "Uhr", umbrella: "Regenschirm", rocket: "Rakete", bell: "Glocke", crown: "Krone", bulb: "Glühbirne", envelope: "Umschlag", camera: "Kamera", gem: "Edelstein" },
    emptyTile: "leer",
    cardName: (o, c) => `${o} (${c})`,
    faceNumber: (n) => `Gesicht ${n}`,
  },
  facts: { hour: "Die freie Stunde", snackTotal: "Noch essbare Snacks", wifi: "Gäste-WLAN-Passwort" , desks: "Tischreihenfolge", lineup: "Das gewählte Gesicht", note: "Die Zahl auf dem Zettel", memory: "Die Antwort im Gedächtnistest" },
  words: { snack: "dem Snack eures Teams", meeting: "eurem sinnlosen Meeting", tool: "dem Spitznamen eures Tools" },
  intakeDefaults: { q1: "lass uns das nochmal aufgreifen", q2: "Kaffee", q3: "der Montags-Sync", q4: "das Biest", q5: "der Allen-antworten-Vorfall", q6: "ein Nickerchenraum" },
  fallback: {
    briefing: "Willkommen im Büro. Es läuft mit eurem Snack, es überlebt eure Meetings, und heute braucht es euch alle, damit ihr miteinander redet. Niemand kann eine Runde allein lösen, und genau das ist der Punkt.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `Runde ${i + 1}`,
      setup: "Alle halten ein anderes Teil. Die lösende Person gibt die Antwort ein. Redet.",
      reactions: { fast: "Gelöst. Und schnell. Jemand hat in Meetings gesessen, die eine E-Mail hätten sein können, und daraus gelernt.", slow: "Gelöst. Es hat einen Moment gedauert, aber das tut die Kaffeemaschine auch.", failed: "Diesmal nicht. Das Büro läuft trotzdem weiter, das tut es immer." },
      stuck: "Feststecken ist okay. Sagt laut, was ihr seht; jemand hält das Teil, das euch fehlt.",
    })),
    challengePrompt: "Gemeinsam, in drei Sätzen: pitcht das Extra, das euer Büro wirklich verdient, und erklärt, wie es das sinnlose Meeting ein für alle Mal erledigt. Erwähnt den Snack mindestens einmal.",
    keyIntro: "Eine letzte Sache. Die Belohnung wird frei, wenn jede Person denselben Schlüssel eingibt. Drei Fakten, die ihr schon gefunden habt.",
    keyReveal: "Gut, hier ist ein Stück davon. Freitags sind wir großzügig.",
    outro: "Das war das Spiel. Helfen hat sich gelohnt, Lösen hat sich gelohnt, und niemand musste fragen, ob alle den Bildschirm sehen.",
  },
};

const fr: Texts = {
  slotPrompt: (meeting) => `Chacun a un agenda différent. Trouvez la seule heure aujourd’hui où vous êtes tous libres pour « ${meeting} ». Saisissez l’heure (24h, ex. 14).`,
  snackPrompt: (snack) =>
    `Chacun de vous voit une étagère. Combien de ${snack} sont encore bons à manger sur toutes les étagères ? Seule la personne qui résout connaît la date du jour : lisez à voix haute les dates de péremption de votre étagère.`,
  wifiPrompt: (tool) => `Le mot de passe du wifi invités a encore changé. Chacun de vous détient une règle. Assemblez les morceaux dans l’ordre des règles pour obtenir le mot de passe de « ${tool} ».`,
  replyAllPrompt:
    "Un fil « répondre à tous » s’est mélangé et chacun de vous détient quelques messages. Remettez-les dans l’ordre chronologique, puis saisissez les minutes du PREMIER et du DERNIER message (ex. 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Test de mémoire. Additionnez l’heure libre trouvée à la manche ${hourRound} et le nombre sur la note que ${noteHolder} a vue plus tôt. Saisissez la somme.`,
  shelves: ["Cuisine", "Salle de réunion", "Tiroir du bureau", "Accueil", "La réserve secrète"],
  snackDecoys: ["biscuits à l’avoine", "galettes de riz", "yaourt mystère", "le déjeuner de quelqu’un"],
  rules: {
    firstLetter: (what) => `La première lettre de ${what}.`,
    lastLetter: (what) => `La dernière lettre de ${what}.`,
    letterAt: (n, what) => `La lettre numéro ${n} de ${what}.`,
    teamSize: "Le nombre de joueurs dans votre équipe.",
    letterCount: (what) => `Le nombre de lettres de ${what}.`,
  },
  ruleOrderHint: "Les règles s’appliquent dans l’ordre 1, 2, 3… Lettres en majuscules. Sans espaces.",
  wifiWords: (s, m, t) => `Mots en jeu : en-cas = « ${s} », réunion = « ${m} », outil = « ${t} ». Ne comptez que les lettres (sans espaces ni ponctuation).`,
  desksPrompt: (tool) => `Cinq bureaux alignés, numérotés de 1 à 5 depuis la fenêtre. Quatre choses s’y trouvent, un bureau est vide : la réserve d’en-cas, « ${tool} », l’imprimante et la plante. Chacun de vous détient un ou deux indices. Saisissez les numéros de bureau de la réserve d’en-cas, de « ${tool} », de l’imprimante et de la plante, dans cet ordre (ex. 2413).`,
  deskItems: (snack, tool) => [`la réserve d’en-cas`, `l’outil « ${tool} »`, `l’imprimante`, `la plante`],
  clues: {"nextTo": "{a} est juste à côté de {b}.", "leftOf": "{a} est quelque part à gauche de {b} (plus près de la fenêtre).", "notAt": "{a} n’est pas au bureau {n}.", "between": "Il y a exactement un bureau entre {a} et {b}.", "at": "{a} est au bureau {n}.", "emptyAt": "Le bureau {n} est vide."},
  hints: {"slot": "C’est le {part}.", "morning": "matin", "afternoon": "après-midi", "snack": "Le total est entre {lo} et {hi}.", "wifi": "Le mot de passe commence par « {c} ».", "replyall": "Le premier message a été envoyé à {t}.", "desks": "La réserve d’en-cas est au bureau {n}.", "callback": "Le numéro du post-it commençait par {c}."},
  thread: (snack, meeting, tool) => [
    `Rappel : ${meeting} est déplacé à cet après-midi. Encore.`,
    `Qui a pris les derniers ${snack} ?`,
    `Merci d’arrêter de répondre à tous.`,
    `${tool} est en panne pour tout le monde ou juste pour moi ?`,
    `Je réponds à tous pour dire : merci d’arrêter de répondre à tous.`,
    `${snack} retrouvés. Dans la salle de l’imprimante. Ne demandez pas.`,
    `On peut voir ça hors ligne ?`,
  ],
  calendarOwner: (name) => `Agenda de ${name}`,
  stickyNote: (room) => `Post-it sur l’écran : « La télécommande du projecteur est en salle ${room}. »`,
  hint: (firstChar) => `La réponse commence par « ${firstChar} ».`,
  challengeBonus: "Points bonus si vous mentionnez quelque chose de l’épisode du jour.",
  codePrompt: (codeName) =>
    `Le code de « ${codeName} » a encore changé. Chacun de vous détient une règle. Assemblez les morceaux dans l’ordre des règles pour le reconstituer.`,
  talk: {
    commonPrompt: "Tout le monde sauf la personne qui résout a six cartes. Une seule carte se trouve dans toutes les mains : même objet, même couleur. Comparez vos cartes à voix haute. La personne qui résout trouve cette carte sur le tableau et la touche.",
    lineupPrompt: "Huit visages, une personne à retrouver. Chaque témoin se souvient d’un ou deux détails, mais seulement en image. Décrivez-les à voix haute. La personne qui résout touche le bon visage.",
    blueprintPrompt: "La personne qui résout a une grille vide. Chacun de vous détient une partie du motif. Décrivez vos cases une par une, de gauche à droite. La personne qui résout reconstruit toute la grille et l’envoie.",
    hints: { common: "Couleur de la carte commune : {color}.", lineup: "Ce n’est ni le visage {a} ni le visage {b}.", blueprint: "Case en haut à gauche : {tile}." },
    colors: { red: "rouge", blue: "bleu", yellow: "jaune", black: "noir" },
    cards: { key: "clé", mug: "tasse", plant: "plante", clock: "horloge", umbrella: "parapluie", rocket: "fusée", bell: "cloche", crown: "couronne", bulb: "ampoule", envelope: "enveloppe", camera: "appareil photo", gem: "pierre précieuse" },
    emptyTile: "vide",
    cardName: (o, c) => `${o} (${c})`,
    faceNumber: (n) => `visage ${n}`,
  },
  facts: { hour: "L’heure libre", snackTotal: "En-cas encore mangeables", wifi: "Mot de passe wifi invités" , desks: "Ordre des bureaux", lineup: "Le visage choisi", note: "Le nombre sur la note", memory: "La réponse du test de mémoire" },
  words: { snack: "l’en-cas de votre équipe", meeting: "votre réunion inutile", tool: "le surnom de votre outil" },
  intakeDefaults: { q1: "on en reparle", q2: "café", q3: "le point du lundi", q4: "la bête", q5: "l’incident répondre à tous", q6: "une salle de sieste" },
  fallback: {
    briefing: "Bienvenue au bureau. Il carbure à votre en-cas, il survit à vos réunions, et aujourd’hui il a besoin que vous vous parliez tous. Personne ne peut résoudre une manche seul, et c’est bien le but.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `Manche ${i + 1}`,
      setup: "Chacun détient une pièce différente. Celui qui résout saisit la réponse. Parlez.",
      reactions: { fast: "Résolu. Et vite. Quelqu’un a assisté à des réunions qui auraient pu être des e-mails et en a tiré une leçon.", slow: "Résolu. Ça a pris un moment, mais la machine à café aussi.", failed: "Pas cette fois. Le bureau continue quand même ; il continue toujours." },
      stuck: "Bloquer, c’est normal. Dites à voix haute ce que vous voyez ; quelqu’un détient le morceau qui vous manque.",
    })),
    challengePrompt: "Ensemble, en trois phrases : vendez l’avantage que votre bureau mérite vraiment, et expliquez comment il règle la réunion inutile une fois pour toutes. Mentionnez l’en-cas au moins une fois.",
    keyIntro: "Une dernière chose. La récompense se débloque quand chacun de vous saisit la même clé. Trois faits que vous avez déjà trouvés.",
    keyReveal: "Bon, en voici un morceau. On est généreux le vendredi.",
    outro: "C’était le jeu. Aider a payé, résoudre a payé, et personne n’a eu à demander si tout le monde voyait son écran.",
  },
};

const es: Texts = {
  slotPrompt: (meeting) => `Cada uno tiene una agenda distinta. Encontrad la única hora de hoy en la que todos estáis libres para "${meeting}". Introduce la hora (24h, p. ej. 14).`,
  snackPrompt: (snack) =>
    `Cada uno ve una balda. ¿Cuántos ${snack} siguen en buen estado contando todas las baldas? Solo quien resuelve sabe la fecha de hoy, así que leed en voz alta las fechas de consumo preferente de vuestra balda.`,
  wifiPrompt: (tool) => `Han vuelto a cambiar la contraseña del wifi de invitados. Cada uno tiene una regla. Juntad las piezas en orden de regla para obtener la contraseña de "${tool}".`,
  replyAllPrompt:
    "Un hilo de responder a todos se ha desordenado y cada uno tiene algunos mensajes. Ponedlos en orden de hora e introduce los minutos del PRIMER y del ÚLTIMO mensaje (p. ej. 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Prueba de memoria. Suma la hora libre de la ronda ${hourRound} al número de la nota que vio ${noteHolder}. Introduce la suma.`,
  shelves: ["Cocina", "Sala de reuniones", "Cajón del escritorio", "Recepción", "El alijo secreto"],
  snackDecoys: ["galletas de avena", "tortitas de arroz", "yogur misterioso", "la comida de alguien"],
  rules: {
    firstLetter: (what) => `La primera letra de ${what}.`,
    lastLetter: (what) => `La última letra de ${what}.`,
    letterAt: (n, what) => `La letra número ${n} de ${what}.`,
    teamSize: "El número de jugadores de tu equipo.",
    letterCount: (what) => `Cuántas letras tiene ${what}.`,
  },
  ruleOrderHint: "Las reglas se aplican en orden 1, 2, 3… Letras en mayúsculas. Sin espacios.",
  wifiWords: (s, m, t) => `Palabras en juego: snack = "${s}", reunión = "${m}", herramienta = "${t}". Cuenta solo letras (ignora espacios y signos).`,
  desksPrompt: (tool) => `Cinco mesas en fila, numeradas del 1 al 5 desde la ventana. Hay cuatro cosas, y una mesa está vacía: la reserva de snacks, "${tool}", la impresora y la planta. Cada uno tiene una o dos pistas. Introduce los números de mesa de la reserva de snacks, "${tool}", la impresora y la planta, en ese orden (p. ej. 2413).`,
  deskItems: (snack, tool) => [`la reserva de snacks`, `la herramienta "${tool}"`, `la impresora`, `la planta`],
  clues: {"nextTo": "{a} está justo al lado de {b}.", "leftOf": "{a} está en algún lugar a la izquierda de {b} (más cerca de la ventana).", "notAt": "{a} no está en la mesa {n}.", "between": "Hay exactamente una mesa entre {a} y {b}.", "at": "{a} está en la mesa {n}.", "emptyAt": "La mesa {n} está vacía."},
  hints: {"slot": "Es por la {part}.", "morning": "mañana", "afternoon": "tarde", "snack": "El total está entre {lo} y {hi}.", "wifi": "La contraseña empieza por \"{c}\".", "replyall": "El primer mensaje se envió a las {t}.", "desks": "La reserva de snacks está en la mesa {n}.", "callback": "El número de la nota adhesiva empezaba por {c}."},
  thread: (snack, meeting, tool) => [
    `Recordatorio: ${meeting} se mueve a esta tarde. Otra vez.`,
    `¿Quién se ha llevado los últimos ${snack}?`,
    `Por favor, dejad de responder a todos.`,
    `¿${tool} está caído para todos o solo para mí?`,
    `Respondo a todos para decir: por favor, dejad de responder a todos.`,
    `Encontrados los ${snack}. Estaban en la sala de la impresora. No preguntéis.`,
    `¿Podemos verlo fuera del hilo?`,
  ],
  calendarOwner: (name) => `Agenda de ${name}`,
  stickyNote: (room) => `Nota en la pantalla: "El mando del proyector está en la sala ${room}."`,
  hint: (firstChar) => `La respuesta empieza por "${firstChar}".`,
  challengeBonus: "Puntos extra si mencionáis algo del episodio de hoy.",
  codePrompt: (codeName) =>
    `Han vuelto a cambiar el código de "${codeName}". Cada uno tiene una regla. Juntad las piezas en orden de regla para reconstruirlo.`,
  talk: {
    commonPrompt: "Todos menos quien resuelve tienen seis cartas. Exactamente una carta está en todas las manos: mismo objeto, mismo color. Comparad vuestras cartas en voz alta. Quien resuelve encuentra esa carta en el tablero y la toca.",
    lineupPrompt: "Ocho caras, una persona que encontrar. Cada testigo recuerda uno o dos detalles, pero solo como imagen. Describidlos en voz alta. Quien resuelve toca la cara correcta.",
    blueprintPrompt: "Quien resuelve tiene una cuadrícula vacía. Cada uno tiene una parte del patrón. Describid vuestras casillas una a una, de izquierda a derecha. Quien resuelve reconstruye toda la cuadrícula y la envía.",
    hints: { common: "Color de la carta compartida: {color}.", lineup: "No es la cara {a} ni la cara {b}.", blueprint: "Casilla de arriba a la izquierda: {tile}." },
    colors: { red: "rojo", blue: "azul", yellow: "amarillo", black: "negro" },
    cards: { key: "llave", mug: "taza", plant: "planta", clock: "reloj", umbrella: "paraguas", rocket: "cohete", bell: "campana", crown: "corona", bulb: "bombilla", envelope: "sobre", camera: "cámara", gem: "gema" },
    emptyTile: "vacía",
    cardName: (o, c) => `${o} (${c})`,
    faceNumber: (n) => `cara ${n}`,
  },
  facts: { hour: "La hora libre", snackTotal: "Snacks aún comestibles", wifi: "Contraseña del wifi de invitados" , desks: "Orden de mesas", lineup: "La cara elegida", note: "El número de la nota", memory: "La respuesta de la prueba de memoria" },
  words: { snack: "el snack de tu equipo", meeting: "vuestra reunión inútil", tool: "el apodo de vuestra herramienta" },
  intakeDefaults: { q1: "lo retomamos luego", q2: "café", q3: "la sincro del lunes", q4: "la bestia", q5: "el incidente de responder a todos", q6: "una sala de siesta" },
  fallback: {
    briefing: "Bienvenidos a la oficina. Funciona con vuestro snack, sobrevive a vuestras reuniones y hoy os necesita a todos hablando entre vosotros. Nadie puede resolver una ronda solo, y de eso se trata.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `Ronda ${i + 1}`,
      setup: "Cada uno tiene una pieza distinta. Quien resuelve introduce la respuesta. Hablad.",
      reactions: { fast: "Resuelto. Y rápido. Alguien ha estado en reuniones que podrían haber sido un correo y ha aprendido de ello.", slow: "Resuelto. Ha tardado un poco, pero la máquina de café también.", failed: "Esta vez no. La oficina sigue igualmente; siempre lo hace." },
      stuck: "Atascarse está bien. Decid en voz alta lo que veis; alguien tiene la pieza que os falta.",
    })),
    challengePrompt: "Juntos, en tres frases: presentad la ventaja que vuestra oficina de verdad merece y explicad cómo arregla la reunión inútil de una vez por todas. Mencionad el snack al menos una vez.",
    keyIntro: "Una última cosa. La recompensa se desbloquea cuando todos introducís la misma llave. Tres datos que ya habéis encontrado.",
    keyReveal: "Vale, aquí va un trozo. Los viernes somos generosos.",
    outro: "Eso ha sido el juego. Ayudar ha contado, resolver ha contado, y nadie ha tenido que preguntar si todos veían su pantalla.",
  },
};

const it: Texts = {
  slotPrompt: (meeting) => `Ognuno ha un calendario diverso. Trovate l’unica ora di oggi in cui siete tutti liberi per "${meeting}". Inserisci l’ora (24h, es. 14).`,
  snackPrompt: (snack) =>
    `Ognuno di voi vede uno scaffale. Quanti ${snack} sono ancora buoni da mangiare su tutti gli scaffali? Solo chi risolve conosce la data di oggi, quindi leggete ad alta voce le date di scadenza del vostro scaffale.`,
  wifiPrompt: (tool) => `La password del wifi ospiti è cambiata di nuovo. Ognuno di voi ha una regola. Mettete insieme i pezzi in ordine di regola per ottenere la password di "${tool}".`,
  replyAllPrompt:
    "Un thread rispondi-a-tutti si è mescolato e ognuno di voi ha qualche messaggio. Rimetteteli in ordine di orario, poi inserisci i minuti del PRIMO e dell’ULTIMO messaggio (es. 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Prova di memoria. Somma l’ora libera trovata nel round ${hourRound} al numero sul biglietto che ${noteHolder} ha visto prima. Inserisci la somma.`,
  shelves: ["Cucina", "Sala riunioni", "Cassetto della scrivania", "Reception", "La scorta segreta"],
  snackDecoys: ["biscotti d’avena", "gallette di riso", "yogurt misterioso", "il pranzo di qualcuno"],
  rules: {
    firstLetter: (what) => `La prima lettera di ${what}.`,
    lastLetter: (what) => `L’ultima lettera di ${what}.`,
    letterAt: (n, what) => `La lettera numero ${n} di ${what}.`,
    teamSize: "Il numero di giocatori della tua squadra.",
    letterCount: (what) => `Quante lettere ha ${what}.`,
  },
  ruleOrderHint: "Le regole si applicano in ordine 1, 2, 3… Lettere maiuscole. Niente spazi.",
  wifiWords: (s, m, t) => `Parole in gioco: snack = "${s}", riunione = "${m}", strumento = "${t}". Conta solo le lettere (ignora spazi e punteggiatura).`,
  desksPrompt: (tool) => `Cinque scrivanie in fila, numerate da 1 a 5 partendo dalla finestra. Ci sono quattro cose, una scrivania è vuota: la scorta di snack, "${tool}", la stampante e la pianta. Ognuno di voi ha uno o due indizi. Inserisci i numeri di scrivania di scorta di snack, "${tool}", stampante e pianta, in quest’ordine (es. 2413).`,
  deskItems: (snack, tool) => [`la scorta di snack`, `lo strumento "${tool}"`, `la stampante`, `la pianta`],
  clues: {"nextTo": "{a} è proprio accanto a {b}.", "leftOf": "{a} è da qualche parte a sinistra di {b} (più vicino alla finestra).", "notAt": "{a} non è alla scrivania {n}.", "between": "C’è esattamente una scrivania tra {a} e {b}.", "at": "{a} è alla scrivania {n}.", "emptyAt": "La scrivania {n} è vuota."},
  hints: {"slot": "È di {part}.", "morning": "mattina", "afternoon": "pomeriggio", "snack": "Il totale è tra {lo} e {hi}.", "wifi": "La password inizia con \"{c}\".", "replyall": "Il primo messaggio è stato inviato alle {t}.", "desks": "La scorta di snack è alla scrivania {n}.", "callback": "Il numero sul post-it iniziava con {c}."},
  thread: (snack, meeting, tool) => [
    `Promemoria: ${meeting} è spostata a questo pomeriggio. Di nuovo.`,
    `Chi ha preso gli ultimi ${snack}?`,
    `Per favore, smettetela di rispondere a tutti.`,
    `${tool} è giù per tutti o solo per me?`,
    `Rispondo a tutti per dire: per favore, smettetela di rispondere a tutti.`,
    `Trovati i ${snack}. Erano nella stanza della stampante. Non chiedete.`,
    `Possiamo parlarne offline?`,
  ],
  calendarOwner: (name) => `Calendario di ${name}`,
  stickyNote: (room) => `Post-it sul monitor: "Il telecomando del proiettore è nella stanza ${room}."`,
  hint: (firstChar) => `La risposta inizia con "${firstChar}".`,
  challengeBonus: "Punti bonus se citate qualcosa dall’episodio di oggi.",
  codePrompt: (codeName) =>
    `Il codice di "${codeName}" è cambiato di nuovo. Ognuno di voi ha una regola. Mettete insieme i pezzi in ordine di regola per ricostruirlo.`,
  talk: {
    commonPrompt: "Tutti tranne chi risolve hanno sei carte. Esattamente una carta è in tutte le mani: stesso oggetto, stesso colore. Confrontate le carte ad alta voce. Chi risolve trova quella carta sul tabellone e la tocca.",
    lineupPrompt: "Otto volti, una persona da trovare. Ogni testimone ricorda uno o due dettagli, ma solo come immagine. Descriveteli ad alta voce. Chi risolve tocca il volto giusto.",
    blueprintPrompt: "Chi risolve ha una griglia vuota. Ognuno di voi ha una parte dello schema. Descrivete le vostre caselle una alla volta, da sinistra a destra. Chi risolve ricostruisce tutta la griglia e la invia.",
    hints: { common: "Colore della carta comune: {color}.", lineup: "Non è il volto {a} e non è il volto {b}.", blueprint: "Casella in alto a sinistra: {tile}." },
    colors: { red: "rosso", blue: "blu", yellow: "giallo", black: "nero" },
    cards: { key: "chiave", mug: "tazza", plant: "pianta", clock: "orologio", umbrella: "ombrello", rocket: "razzo", bell: "campanello", crown: "corona", bulb: "lampadina", envelope: "busta", camera: "macchina fotografica", gem: "gemma" },
    emptyTile: "vuota",
    cardName: (o, c) => `${o} (${c})`,
    faceNumber: (n) => `volto ${n}`,
  },
  facts: { hour: "L’ora libera", snackTotal: "Snack ancora commestibili", wifi: "Password wifi ospiti" , desks: "Ordine delle scrivanie", lineup: "Il volto scelto", note: "Il numero sul biglietto", memory: "La risposta della prova di memoria" },
  words: { snack: "lo snack della vostra squadra", meeting: "la vostra riunione inutile", tool: "il soprannome del vostro strumento" },
  intakeDefaults: { q1: "ne riparliamo", q2: "caffè", q3: "l’allineamento del lunedì", q4: "la bestia", q5: "l’incidente del rispondi a tutti", q6: "una stanza per il pisolino" },
  fallback: {
    briefing: "Benvenuti in ufficio. Va avanti con il vostro snack, sopravvive alle vostre riunioni e oggi ha bisogno che vi parliate tutti. Nessuno può risolvere un round da solo, ed è proprio questo il punto.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `Round ${i + 1}`,
      setup: "Ognuno ha un pezzo diverso. Chi risolve inserisce la risposta. Parlate.",
      reactions: { fast: "Risolto. E in fretta. Qualcuno ha partecipato a riunioni che potevano essere un’e-mail e ne ha tratto una lezione.", slow: "Risolto. Ci è voluto un momento, ma anche la macchina del caffè ci mette un po’.", failed: "Non stavolta. L’ufficio va avanti comunque; lo fa sempre." },
      stuck: "Bloccarsi va bene. Dite ad alta voce cosa vedete; qualcuno ha il pezzo che vi manca.",
    })),
    challengePrompt: "Insieme, in tre frasi: proponete il benefit che il vostro ufficio merita davvero e spiegate come risolve la riunione inutile una volta per tutte. Citate lo snack almeno una volta.",
    keyIntro: "Un’ultima cosa. La ricompensa si sblocca quando ognuno di voi inserisce la stessa chiave. Tre fatti che avete già trovato.",
    keyReveal: "Va bene, eccone un pezzo. Il venerdì siamo generosi.",
    outro: "Questo era il gioco. Aiutare ha pagato, risolvere ha pagato, e nessuno ha dovuto chiedere se tutti vedevano lo schermo.",
  },
};

const lt: Texts = {
  slotPrompt: (meeting) => `Visų kalendoriai skirtingi. Raskite vienintelę šios dienos valandą, kai visi esate laisvi dėl „${meeting}“. Įveskite valandą (24 val., pvz., 14).`,
  snackPrompt: (snack) =>
    `Kiekvienas iš jūsų mato vieną lentyną. Kiek ${snack} dar tinka valgyti visose lentynose kartu? Šiandienos datą žino tik sprendėjas, todėl garsiai perskaitykite tinkamumo datas savo lentynoje.`,
  wifiPrompt: (tool) => `Svečių wifi slaptažodis vėl pakeistas. Kiekvienas iš jūsų turi po vieną taisyklę. Sudėkite dalis taisyklių eilės tvarka ir gausite „${tool}“ slaptažodį.`,
  replyAllPrompt:
    "Laiškų gija „atsakyti visiems“ susimaišė, ir kiekvienas iš jūsų turi po kelias žinutes. Sudėliokite jas laiko tvarka ir įveskite PIRMOS ir PASKUTINĖS žinutės minutes (pvz., 09:12 … 10:04 → 1204).",
  callbackPrompt: (hourRound, noteHolder) =>
    `Atminties patikrinimas. Prie laisvos valandos, rastos ${hourRound} raunde, pridėkite skaičių iš lapelio, kurį anksčiau matė ${noteHolder}. Įveskite sumą.`,
  shelves: ["Virtuvė", "Posėdžių kambarys", "Stalo stalčius", "Registratūra", "Slaptos atsargos"],
  snackDecoys: ["avižiniai sausainiai", "ryžių paplotėliai", "paslaptingas jogurtas", "kažkieno pietūs"],
  rules: {
    firstLetter: (what) => `Pirmoji ${what} raidė.`,
    lastLetter: (what) => `Paskutinė ${what} raidė.`,
    letterAt: (n, what) => `${what} raidė numeris ${n}.`,
    teamSize: "Žaidėjų skaičius jūsų komandoje.",
    letterCount: (what) => `Kiek raidžių turi ${what}.`,
  },
  ruleOrderHint: "Taisyklės taikomos eilės tvarka 1, 2, 3… Raidės didžiosios. Be tarpų.",
  wifiWords: (s, m, t) => `Žodžiai žaidime: užkandis = „${s}“, susitikimas = „${m}“, įrankis = „${t}“. Skaičiuokite tik raides (tarpų ir skyrybos ženklų neskaičiuokite).`,
  desksPrompt: (tool) => `Penki stalai eilėje, sunumeruoti nuo 1 iki 5 nuo lango. Ant jų yra keturi dalykai, vienas stalas tuščias: užkandžių atsargos, „${tool}“, spausdintuvas ir augalas. Kiekvienas iš jūsų turi vieną ar dvi užuominas. Įveskite užkandžių atsargų, „${tool}“, spausdintuvo ir augalo stalų numerius šia tvarka (pvz., 2413).`,
  deskItems: (snack, tool) => [`užkandžių atsargos`, `įrankis „${tool}“`, `spausdintuvas`, `augalas`],
  clues: {"nextTo": "{a} yra visai šalia {b}.", "leftOf": "{a} yra kažkur kairiau nei {b} (arčiau lango).", "notAt": "{a} nėra prie {n} stalo.", "between": "Tarp {a} ir {b} yra lygiai vienas stalas.", "at": "{a} yra prie {n} stalo.", "emptyAt": "{n} stalas tuščias."},
  hints: {"slot": "Tai {part}.", "morning": "rytas", "afternoon": "popietė", "snack": "Suma yra tarp {lo} ir {hi}.", "wifi": "Slaptažodis prasideda „{c}“.", "replyall": "Pirma žinutė išsiųsta {t}.", "desks": "Užkandžių atsargos yra prie {n} stalo.", "callback": "Lipnaus lapelio numeris prasidėjo {c}."},
  thread: (snack, meeting, tool) => [
    `Priminimas: ${meeting} perkeltas į popietę. Vėl.`,
    `Kas paėmė paskutinius ${snack}?`,
    `Prašau, nustokite atsakinėti visiems.`,
    `${tool} neveikia visiems ar tik man?`,
    `Atsakau visiems, kad pasakyčiau: prašau, nustokite atsakinėti visiems.`,
    `Radau ${snack}. Buvo spausdintuvo kambaryje. Neklauskite.`,
    `Gal aptarkime tai atskirai?`,
  ],
  calendarOwner: (name) => `${name} kalendorius`,
  stickyNote: (room) => `Lipnus lapelis ant ekrano: „Projektoriaus pultelis yra ${room} kambaryje.“`,
  hint: (firstChar) => `Atsakymas prasideda „${firstChar}“.`,
  challengeBonus: "Papildomi taškai, jei paminėsite ką nors iš šiandienos serijos.",
  codePrompt: (codeName) =>
    `„${codeName}“ kodas vėl pakeistas. Kiekvienas iš jūsų turi po vieną taisyklę. Sudėkite dalis taisyklių eilės tvarka ir atkurkite jį.`,
  talk: {
    commonPrompt: "Visi, išskyrus sprendėją, turi po šešias korteles. Lygiai viena kortelė yra visų rankose: tas pats daiktas, ta pati spalva. Garsiai palyginkite savo korteles. Sprendėjas suranda tą kortelę lentoje ir ją paliečia.",
    lineupPrompt: "Aštuoni veidai, vienas žmogus, kurį reikia rasti. Kiekvienas liudininkas prisimena vieną ar dvi detales, bet tik kaip paveikslėlį. Apibūdinkite jas garsiai. Sprendėjas paliečia teisingą veidą.",
    blueprintPrompt: "Sprendėjas turi tuščią tinklelį. Kiekvienas iš jūsų turi dalį rašto. Apibūdinkite savo langelius po vieną, iš kairės į dešinę. Sprendėjas atkuria visą tinklelį ir jį išsiunčia.",
    hints: { common: "Bendros kortelės spalva: {color}.", lineup: "Tai ne veidas nr. {a} ir ne veidas nr. {b}.", blueprint: "Viršutinis kairysis langelis: {tile}." },
    colors: { red: "raudona", blue: "mėlyna", yellow: "geltona", black: "juoda" },
    cards: { key: "raktas", mug: "puodelis", plant: "augalas", clock: "laikrodis", umbrella: "skėtis", rocket: "raketa", bell: "varpelis", crown: "karūna", bulb: "lemputė", envelope: "vokas", camera: "kamera", gem: "brangakmenis" },
    emptyTile: "tuščias",
    cardName: (o, c) => `${o} (${c})`,
    faceNumber: (n) => `veidas nr. ${n}`,
  },
  facts: { hour: "Laisva valanda", snackTotal: "Dar valgomi užkandžiai", wifi: "Svečių wifi slaptažodis" , desks: "Stalų tvarka", lineup: "Pasirinktas veidas", note: "Skaičius ant lapelio", memory: "Atminties patikrinimo atsakymas" },
  words: { snack: "jūsų komandos užkandžio", meeting: "jūsų beprasmio susitikimo", tool: "jūsų įrankio pravardės" },
  intakeDefaults: { q1: "grįšime prie to", q2: "kava", q3: "pirmadienio sinchronizacija", q4: "pabaisa", q5: "atsakyti visiems incidentas", q6: "miego kambarys" },
  fallback: {
    briefing: "Sveiki atvykę į biurą. Jis gyvena jūsų užkandžiu, išgyvena jūsų susitikimus, o šiandien jam reikia, kad visi kalbėtumėtės. Niekas negali išspręsti raundo vienas – tokia ir esmė.",
    rounds: Array.from({ length: 10 }, (_, i) => ({
      title: `${i + 1} raundas`,
      setup: "Kiekvienas turi skirtingą dalį. Sprendėjas įveda atsakymą. Kalbėkitės.",
      reactions: { fast: "Išspręsta. Ir greitai. Kažkas sėdėjo susitikimuose, kurie galėjo būti el. laiškas, ir iš to pasimokė.", slow: "Išspręsta. Užtruko, bet kavos aparatas irgi užtrunka.", failed: "Šįkart ne. Biuras vis tiek gyvuoja – kaip visada." },
      stuck: "Įstrigti normalu. Pasakykite garsiai, ką matote; kažkas turi trūkstamą dalį.",
    })),
    challengePrompt: "Kartu, trimis sakiniais: pristatykite privilegiją, kurios jūsų biuras tikrai nusipelnė, ir paaiškinkite, kaip ji visiems laikams sutvarkys beprasmį susitikimą. Bent kartą paminėkite užkandį.",
    keyIntro: "Dar vienas dalykas. Atlygis atsirakina, kai visi įvedate tą patį raktą. Trys faktai, kuriuos jau radote.",
    keyReveal: "Gerai, štai jo dalis. Penktadieniais esame dosnūs.",
    outro: "Toks buvo žaidimas. Padėti apsimokėjo, spręsti apsimokėjo, ir niekam nereikėjo klausti, ar visi mato ekraną.",
  },
};

export const TEXTS: Record<ContentLanguage, Texts> = { en, sv, nl, de, fr, es, it, lt };
