import type { ContentLanguage } from "./types";
import type { CardObject } from "./visual";

/**
 * Worlds: the "series" a game episode is set in. A world is authored once and
 * reviewed (name, tagline, art, the brief the Game Master writes from); the
 * episode inside it (title, cold open, round scenes, reactions, the in-world
 * names of shelves, codes and messages) is generated at game time.
 *
 * The puzzle mechanics never change per world: they are code, validated, and
 * the only input to the money split. A world only reframes them.
 *
 * Adding a world: add an entry here, a scene in PlayArt.tsx (WorldScene), and
 * a tint in globals.css (.world-<id>). Nothing else needs to change.
 */

export const WORLD_IDS = ["office", "station", "heist", "studio"] as const;
export type WorldId = (typeof WORLD_IDS)[number];

export function isWorldId(v: unknown): v is WorldId {
  return typeof v === "string" && (WORLD_IDS as readonly string[]).includes(v);
}

export type World = {
  id: WorldId;
  /** Shown on the vote card and the episode title card, in the game/UI language. */
  label: Record<ContentLanguage, { name: string; tagline: string }>;
  /** For the Game Master only (English; the model writes in the game language). */
  brief: string;
  /** How the team's own answers live in this world. */
  mapping: string;
  /** One is chosen per episode; a team never gets the same premise twice in a world. */
  premises: string[];
  /** The eight card objects used in this world's "common ground" rounds. */
  deck: CardObject[];
};

export const WORLDS: Record<WorldId, World> = {
  office: {
    id: "office",
    label: {
      en: { name: "The Office", tagline: "Where it all started. Calendars, snacks and the printer." },
      sv: { name: "Kontoret", tagline: "Där allt började. Kalendrar, snacks och skrivaren." },
      nl: { name: "Het Kantoor", tagline: "Waar het allemaal begon. Agenda's, snacks en de printer." },
      de: { name: "Das Büro", tagline: "Wo alles anfing. Kalender, Snacks und der Drucker." },
      fr: { name: "Le Bureau", tagline: "Là où tout a commencé. Agendas, snacks et l'imprimante." },
      es: { name: "La Oficina", tagline: "Donde empezó todo. Agendas, snacks y la impresora." },
      it: { name: "L'Ufficio", tagline: "Dove tutto è cominciato. Calendari, snack e la stampante." },
      lt: { name: "Biuras", tagline: "Kur viskas prasidėjo. Kalendoriai, užkandžiai ir spausdintuvas." },
    },
    brief:
      "The team's own office, exactly as they know it: desks, a kitchen, a meeting room that is always booked, a printer with opinions. The classic episode. Recognition humour about ordinary office life.",
    mapping:
      "Their snack is what the kitchen runs on; their pointless meeting is the recurring meeting it is; their tool nickname is the tool or room it already is.",
    premises: [
      "An ordinary Tuesday that keeps getting less ordinary.",
      "Head office is visiting this afternoon and everything has to look effortless.",
      "The building's systems were 'upgraded' overnight and nothing works the way it did yesterday.",
      "Somebody booked the big meeting room for an all-day workshop that nobody remembers agreeing to.",
    ],
    deck: ["mug", "plant", "clock", "umbrella", "bulb", "envelope", "key", "bell"],
  },

  station: {
    id: "station",
    label: {
      en: { name: "Halcyon Station", tagline: "A research station in low orbit. The coffee machine is load-bearing." },
      sv: { name: "Station Halcyon", tagline: "En forskningsstation i omloppsbana. Kaffemaskinen är bärande." },
      nl: { name: "Station Halcyon", tagline: "Een onderzoeksstation in een lage baan. Het koffieapparaat is dragend." },
      de: { name: "Station Halcyon", tagline: "Eine Forschungsstation im Orbit. Die Kaffeemaschine ist tragend." },
      fr: { name: "Station Halcyon", tagline: "Une station de recherche en orbite basse. La machine à café est porteuse." },
      es: { name: "Estación Halcyon", tagline: "Una estación de investigación en órbita baja. La cafetera es estructural." },
      it: { name: "Stazione Halcyon", tagline: "Una stazione di ricerca in orbita bassa. La macchinetta del caffè è portante." },
      lt: { name: "Stotis „Halcyon“", tagline: "Tyrimų stotis žemoje orbitoje. Kavos aparatas – laikanti konstrukcija." },
    },
    brief:
      "Halcyon, a small, slightly shabby research station in low orbit. The same team with the same habits, just with airlocks, a docking bay and a station computer that thinks it is helping. Humour comes from office behaviour surviving in space: reply-all over the intercom, a booked meeting module, someone's mug floating past.",
    mapping:
      "Their snack is the most valuable ration on board; their pointless meeting is the mandatory briefing in the docking bay; their tool nickname is what the crew calls the station computer.",
    premises: [
      "A supply shuttle is arriving early and the station is nowhere near ready.",
      "The station computer has started rescheduling everyone's day on its own.",
      "Mission control wants a live video call very soon, and nobody has tidied the module.",
      "A solar storm keeps the whole crew in the same module for the evening.",
    ],
    deck: ["rocket", "bulb", "clock", "key", "gem", "camera", "envelope", "plant"],
  },

  heist: {
    id: "heist",
    label: {
      en: { name: "The Vault Job", tagline: "One vault, one night, and a crew that has never agreed on lunch." },
      sv: { name: "Valvjobbet", tagline: "Ett valv, en natt och ett gäng som aldrig kommit överens om lunch." },
      nl: { name: "De Kluisklus", tagline: "Eén kluis, één nacht, en een ploeg die het nooit eens werd over de lunch." },
      de: { name: "Der Tresorjob", tagline: "Ein Tresor, eine Nacht und eine Crew, die sich nie aufs Mittagessen einigen konnte." },
      fr: { name: "Le Coup du coffre", tagline: "Un coffre, une nuit, et une équipe qui n'a jamais été d'accord sur le déjeuner." },
      es: { name: "El golpe de la cámara", tagline: "Una cámara acorazada, una noche y un equipo que nunca se puso de acuerdo con la comida." },
      it: { name: "Il colpo al caveau", tagline: "Un caveau, una notte e una squadra che non si è mai messa d'accordo sul pranzo." },
      lt: { name: "Seifo darbas", tagline: "Vienas seifas, viena naktis ir komanda, kuri niekada nesutarė dėl pietų." },
    },
    brief:
      "A polite, entirely harmless caper: the team is a crew getting their own things back out of the building's basement vault after hours. Nobody is hurt, nothing is stolen from anyone, no real crime is glorified; it is a story about logistics, timing and a facilities department with too much power. Think planning boards, a keypad, a guard who loves rules.",
    mapping:
      "Their snack is the getaway snack; their pointless meeting is the planning session that always overruns; their tool nickname is the crew's codename for the vault's security system.",
    premises: [
      "Facilities confiscated the team's coffee machine and locked it in the basement vault.",
      "The crew has to return a borrowed trophy to the vault before anyone notices it was gone.",
      "The vault's yearly inspection is tonight and the crew's paperwork is everywhere.",
      "The crew's only key card is in the vault, and so is the spare.",
    ],
    deck: ["key", "gem", "crown", "camera", "envelope", "clock", "bell", "umbrella"],
  },

  studio: {
    id: "studio",
    label: {
      en: { name: "Take Seven", tagline: "A film set running late. Everyone is on set; nobody has the call sheet." },
      sv: { name: "Tagning sju", tagline: "En filminspelning som ligger efter. Alla är på plats, ingen har schemat." },
      nl: { name: "Opname zeven", tagline: "Een filmset die uitloopt. Iedereen is er, niemand heeft het draaiboek." },
      de: { name: "Klappe, die Siebte", tagline: "Ein Filmset im Verzug. Alle sind da, niemand hat den Drehplan." },
      fr: { name: "Prise sept", tagline: "Un tournage en retard. Tout le monde est là, personne n'a la feuille de service." },
      es: { name: "Toma siete", tagline: "Un rodaje que va con retraso. Todos están, nadie tiene la hoja de rodaje." },
      it: { name: "Ciak sette", tagline: "Un set in ritardo. Ci sono tutti, nessuno ha l'ordine del giorno." },
      lt: { name: "Septintas dublis", tagline: "Filmavimas vėluoja. Visi vietoje, niekas neturi grafiko." },
    },
    brief:
      "A small film set running behind schedule. The team are the crew of a low-budget workplace drama, which happens to be about an office suspiciously like theirs. Lights, a temperamental camera, takes that go wrong, a director who says 'one more' a lot. Humour from film-set routine colliding with office routine.",
    mapping:
      "Their snack is what craft services keeps running out of; their pointless meeting is the morning production meeting; their tool nickname is what everyone calls the temperamental camera.",
    premises: [
      "The lead actor is stuck in traffic and the crew has to shoot around the gap.",
      "Rain is forecast for sunset and the outdoor scene has to be done before it.",
      "The director wants one more take of a scene nobody remembers shooting.",
      "The studio booked another production into the same stage by mistake.",
    ],
    deck: ["camera", "bulb", "crown", "umbrella", "mug", "bell", "gem", "envelope"],
  },
};

export function worldLabel(id: WorldId, language: ContentLanguage) {
  return WORLDS[id].label[language] ?? WORLDS[id].label.en;
}
