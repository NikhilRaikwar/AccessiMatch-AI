import { useMemo, useState, useEffect } from "react";
import {
  Accessibility,
  AudioLines,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Eye,
  FileText,
  GraduationCap,
  Home,
  Info,
  Library,
  Link,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Volume2,
} from "lucide-react";

type ModeId = "blind" | "beginner" | "cognitive" | "child" | "tactical";

type MatchMoment = {
  id: string;
  minute: string;
  title: string;
  detail: string;
  type: "goal" | "foul" | "hydration" | "momentum" | "substitution" | "start" | "end";
};

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  time: string;
  stadium: string;
  timeline: MatchMoment[];
};

const modes: Array<{
  id: ModeId;
  label: string;
  icon: typeof Volume2;
  description: string;
}> = [
  {
    id: "blind",
    label: "Blind audio",
    icon: Volume2,
    description: "Spatial, audio-first explanation with no visual assumptions.",
  },
  {
    id: "beginner",
    label: "Beginner",
    icon: GraduationCap,
    description: "Plain soccer language for first-time viewers.",
  },
  {
    id: "cognitive",
    label: "Low cognitive load",
    icon: Brain,
    description: "Short sentences, one idea at a time, low mental effort.",
  },
  {
    id: "child",
    label: "Child-friendly",
    icon: CircleHelp,
    description: "Warm, simple, age-appropriate explanation.",
  },
  {
    id: "tactical",
    label: "Tactical",
    icon: SlidersHorizontal,
    description: "More detail for coaches, analysts, and serious fans.",
  },
];

const moments: MatchMoment[] = [
  {
    id: "kickoff",
    minute: "0'",
    title: "Kick-off",
    detail: "Match begins",
    type: "start",
  },
  {
    id: "goal-spain",
    minute: "22'",
    title: "Goal - Spain",
    detail: "Pedri scores",
    type: "goal",
  },
  {
    id: "foul-brazil",
    minute: "34'",
    title: "Foul - Brazil",
    detail: "Yellow card for Rodri",
    type: "foul",
  },
  {
    id: "hydration",
    minute: "45+1'",
    title: "Hydration break",
    detail: "First half break",
    type: "hydration",
  },
  {
    id: "momentum",
    minute: "61'",
    title: "Momentum swing",
    detail: "Pressing drop-off",
    type: "momentum",
  },
  {
    id: "sub-brazil",
    minute: "72'",
    title: "Substitution - Brazil",
    detail: "Paqueta off, Andreas in",
    type: "substitution",
  },
  {
    id: "goal-late",
    minute: "83'",
    title: "Goal - Spain",
    detail: "Morata scores",
    type: "goal",
  },
  {
    id: "fulltime",
    minute: "90+4'",
    title: "Full-time",
    detail: "Spain 2 - 0 Brazil",
    type: "end",
  },
];

const defaultMatches: Match[] = [
  {
    id: "spain-brazil",
    homeTeam: "Spain",
    awayTeam: "Brazil",
    homeFlag: "spain",
    awayFlag: "brazil",
    date: "Jun 21, 2026",
    time: "15:00",
    stadium: "Hard Rock Stadium, Miami",
    timeline: moments
  },
  {
    id: "argentina-france",
    homeTeam: "Argentina",
    awayTeam: "France",
    homeFlag: "argentina",
    awayFlag: "france",
    date: "Jun 22, 2026",
    time: "18:00",
    stadium: "MetLife Stadium, New Jersey",
    timeline: [
      { id: "arg-kickoff", minute: "0'", title: "Kick-off", detail: "Match begins", type: "start" },
      { id: "goal-arg", minute: "23'", title: "Goal - Argentina", detail: "Messi penalty scores", type: "goal" },
      { id: "foul-france", minute: "55'", title: "Foul - France", detail: "Yellow card for Upamecano", type: "foul" },
      { id: "sub-france", minute: "71'", title: "Substitution - France", detail: "Giroud off, Thuram in", type: "substitution" },
      { id: "goal-fr", minute: "80'", title: "Goal - France", detail: "Mbappé penalty scores", type: "goal" },
      { id: "momentum", minute: "84'", title: "Momentum swing", detail: "France dominance", type: "momentum" },
      { id: "arg-fulltime", minute: "90+5'", title: "Full-time", detail: "Argentina 1 - 1 France", type: "end" }
    ]
  },
  {
    id: "germany-japan",
    homeTeam: "Germany",
    awayTeam: "Japan",
    homeFlag: "germany",
    awayFlag: "japan",
    date: "Jun 23, 2026",
    time: "14:00",
    stadium: "SoFi Stadium, Los Angeles",
    timeline: [
      { id: "ger-kickoff", minute: "0'", title: "Kick-off", detail: "Match begins", type: "start" },
      { id: "goal-ger", minute: "33'", title: "Goal - Germany", detail: "Musiala scores", type: "goal" },
      { id: "hydration", minute: "45+2'", title: "Hydration break", detail: "Halftime break", type: "hydration" },
      { id: "sub-japan", minute: "60'", title: "Substitution - Japan", detail: "Mitoma in", type: "substitution" },
      { id: "momentum", minute: "75'", title: "Tactical shift", detail: "Japan counter press", type: "momentum" },
      { id: "goal-japan", minute: "81'", title: "Goal - Japan", detail: "Asano scores", type: "goal" },
      { id: "ger-fulltime", minute: "90+4'", title: "Full-time", detail: "Germany 1 - 1 Japan", type: "end" }
    ]
  }
];

const explanationsEn: Record<ModeId, { happened: string; matters: string; watch: string }> = {
  blind: {
    happened:
      "Around the 61st minute, Brazil stopped chasing Spain high up the field. The action moved closer to Brazil's goal, and Spain had more time to pass from side to side.",
    matters:
      "For a listener, the key change is space. Spain gained calmer possession, while Brazil protected the center instead of pressing every pass.",
    watch:
      "Listen for longer Spain passing sequences, fewer Brazil tackles near midfield, and Brazil defenders clearing the ball instead of building attacks.",
  },
  beginner: {
    happened:
      "Brazil's high press slowed down near the 61st minute. Spain started keeping the ball more easily and building longer attacks.",
    matters:
      "Pressing takes energy. When a team cannot press, the other team gets more space, more time, and more chances to control the game.",
    watch:
      "Watch whether Spain keeps moving the ball side to side. Watch whether Brazil makes substitutions to add fresh energy.",
  },
  cognitive: {
    happened:
      "Brazil pressed less. Spain had more time. The ball stayed with Spain longer.",
    matters:
      "Less pressure means easier passing. Easier passing can change momentum.",
    watch:
      "Watch Spain's next passes. Watch Brazil's substitutions. Watch the space behind Brazil's midfield.",
  },
  child: {
    happened:
      "Brazil got tired from running after the ball. Spain used that moment to slow down and keep the ball.",
    matters:
      "When one team gets tired, the other team can think faster and choose better passes.",
    watch:
      "Look for Spain passing calmly. Look for Brazil bringing on fresh players.",
  },
  tactical: {
    happened:
      "Brazil's first pressing line stopped closing Spain's center backs aggressively around 61'. Spain used the wider passing lanes to progress through midfield.",
    matters:
      "The pressing drop changed the game state from transition-heavy to possession-controlled. Spain could pin Brazil deeper and attack second-phase spaces.",
    watch:
      "Track Brazil's distance between forward and midfield lines, Spain's switch frequency, and whether Brazil replaces a wide forward or central midfielder.",
  },
};

const explanationsEs: Record<ModeId, { happened: string; matters: string; watch: string }> = {
  blind: {
    happened:
      "Alrededor del minuto 61, Brasil dejó de presionar a España arriba. El juego se trasladó cerca del área de Brasil, y España tuvo más tiempo para tocar de lado a lado.",
    matters:
      "Para el oyente, el cambio clave es el espacio. España ganó tranquilidad en la posesión, mientras que Brasil protegió el centro en vez de presionar.",
    watch:
      "Escuche secuencias de pases más largas de España y menos entradas de Brasil cerca del mediocampo.",
  },
  beginner: {
    happened:
      "La presión alta de Brasil disminuyó cerca del minuto 61. España comenzó a mantener el balón con mayor facilidad y a construir ataques más largos.",
    matters:
      "Presionar consume energía. Cuando un equipo no presiona, el otro obtiene más tiempo y oportunidades de controlar el juego.",
    watch:
      "Observe si España sigue moviendo el balón de lado a lado. Observe si Brasil realiza sustituciones para aportar energía.",
  },
  cognitive: {
    happened:
      "Brasil presionó menos. España tuvo más tiempo. El balón se mantuvo más con España.",
    matters:
      "Menos presión significa pases más fáciles. Los pases fáciles cambian el ritmo de juego.",
    watch:
      "Observe los siguientes pases de España y los cambios de Brasil.",
  },
  child: {
    happened:
      "Brasil se cansó de correr tras el balón. España aprovechó ese momento para calmar el juego y mantener la pelota.",
    matters:
      "Cuando un equipo se cansa, el otro puede pensar más rápido y elegir mejores pases.",
    watch:
      "Busque a España tocando con calma y a Brasil metiendo jugadores frescos.",
  },
  tactical: {
    happened:
      "La primera línea de presión de Brasil dejó de cerrar a los centrales de España al minuto 61. España aprovechó los carriles para progresar por el mediocampo.",
    matters:
      "La caída de presión cambió el juego de transiciones rápidas a posesión controlada, permitiendo a España hundir a Brasil.",
    watch:
      "Siga la distancia entre líneas de Brasil, la frecuencia de cambios de frente de España y los cambios tácticos.",
  },
};

const matchExplanations: Record<string, Record<ModeId, { happened: string; matters: string; watch: string }>> = {
  "spain-brazil": explanationsEn,
  "argentina-france": {
    blind: {
      happened: "Around the 84th minute, France took total control of the central field. Argentina's midfield dropped deep, and France made quick passes forward to Mbappé.",
      matters: "For an audio listener, play speed increased. France won possession higher up the pitch, meaning their attacks started closer to Argentina's penalty box.",
      watch: "Listen for frequent France passes near the penalty box, urgent clearances by Argentina's defenders, and rising crowd noise as France shoots."
    },
    beginner: {
      happened: "France gained momentum after scoring the penalty. They started running faster, passing forward aggressively, and keeping the ball near Argentina's goal.",
      matters: "When a team scores, they get a confidence boost. The other team gets nervous and plays defensively, giving up control.",
      watch: "Watch if Argentina can keep the ball for more than three passes to slow the game down. Watch if France takes more long shots."
    },
    cognitive: {
      happened: "France attacked hard. Argentina defended deep. France kept the ball.",
      matters: "Scoring gave France confidence. Argentina lost their shape.",
      watch: "Watch France's forwards. Watch Argentina's next pass."
    },
    child: {
      happened: "After scoring a goal, France got super excited and started running like lightning! Argentina had to form a big defensive shield to block them.",
      matters: "Confidence is like magic energy! It makes players feel like they can't be stopped.",
      watch: "Look at how fast France runs forward. Look at Argentina's goalie getting ready."
    },
    tactical: {
      happened: "Following the equalizer, France shifted to an aggressive vertical transition. Argentina's double-pivot failed to track runs between the lines, allowing France to exploit second-phase rebounds.",
      matters: "The psychological swing broke Argentina's low block spacing. France's high line pushed Argentina's ball-carriers into deep turnovers.",
      watch: "Track the distance between Argentina's back four and midfield, France's recovery times, and whether Argentina introduces a third center back."
    }
  },
  "germany-japan": {
    blind: {
      happened: "In the 75th minute, Japan shifted their players wide and pushed high up the pitch. They began intercepting Germany's passes directly in midfield.",
      matters: "Japan widened the pitch. Germany was forced to pass backwards or clear the ball blindly towards the sidelines.",
      watch: "Listen for rapid whistle blows, Japan intercepting German passes, and quick wide crosses into the penalty area."
    },
    beginner: {
      happened: "Japan changed their strategy to play wider and press Germany's defenders. This forced Germany to make mistakes and give the ball away.",
      matters: "A tactical change is like changing your plan in a game of chess. By widening the field, Japan created empty spaces to run into.",
      watch: "Watch if Germany changes their formations. Watch if Japan's wide players get the ball near the box."
    },
    cognitive: {
      happened: "Japan changed their shape. They pressed Germany's defense. Germany made errors.",
      matters: "Japan made the field wider. Germany had no space to pass.",
      watch: "Watch Japan's wingers. Watch Germany's defensive errors."
    },
    child: {
      happened: "Japan's coach told them to spread out wide like a giant fan! This surprised Germany and let Japan steal the ball easily.",
      matters: "Spreading out makes it hard for the defenders to guard everyone at once.",
      watch: "Look at how far apart Japan's players stand. Look for Germany trying to chase them."
    },
    tactical: {
      happened: "Japan transitioned from a 4-2-3-1 to a 3-4-3 wingback system at 75'. Their wingbacks pinned Germany's fullbacks, allowing Japan's front three to press Germany's build-up directly.",
      matters: "This tactical overload neutralized Germany's central overload and created +1 scenarios in wide areas for Japan's transition.",
      watch: "Track Germany's center back passing angles, Japan's wingback tracking distance, and whether Germany reverts to direct long balls."
    }
  }
};

const matchExplanationsEs: Record<string, Record<ModeId, { happened: string; matters: string; watch: string }>> = {
  "spain-brazil": explanationsEs,
  "argentina-france": {
    blind: {
      happened: "Alrededor del minuto 84, Francia tomó el control total del mediocampo. Argentina se replegó y Francia filtró pases rápidos para Mbappé.",
      matters: "Para el oyente, la velocidad de juego aumentó. Francia recuperó el balón en campo contrario, comenzando sus ataques cerca del área argentina.",
      watch: "Escuche secuencias de pases de Francia cerca del área, despejes urgentes de Argentina y el aumento en el ruido de la grada."
    },
    beginner: {
      happened: "Francia ganó fuerza tras anotar el penal. Empezaron a correr más rápido, atacando agresivamente y manteniendo el balón cerca de la meta argentina.",
      matters: "Cuando un equipo anota, gana energía y confianza. El otro equipo se pone nervioso y juega replegado.",
      watch: "Observe si Argentina logra hilar pases para calmar el partido, o si Francia busca tiros lejanos."
    },
    cognitive: {
      happened: "Francia atacó con todo. Argentina defendió atrás. Francia controló el balón.",
      matters: "El penal dio confianza a Francia. Argentina perdió su orden.",
      watch: "Observe a los delanteros de Francia y los pases de Argentina."
    },
    child: {
      happened: "¡Tras meter el gol, Francia se emocionó y corrió como un rayo! Argentina tuvo que armar un escudo defensivo muy grande.",
      matters: "¡La confianza es como una energía mágica que te hace sentir imparable!",
      watch: "Mire qué rápido corre Francia hacia adelante. Observe al portero de Argentina prepararse."
    },
    tactical: {
      happened: "Luego del empate, Francia jugó pases más verticales. El pivote defensivo de Argentina no siguió los desmarques entre líneas.",
      matters: "La caída en el orden defensivo de Argentina permitió a Francia explotar las transiciones rápidas.",
      watch: "Observe el espacio entre defensa y mediocampo de Argentina, y si meten un tercer central."
    }
  },
  "germany-japan": {
    blind: {
      happened: "Japón abrió su formación y adelantó líneas al minuto 75. Empezaron a cortar los pases de Alemania desde el centro.",
      matters: "Japón ensanchó la cancha. Alemania tuvo que jugar hacia atrás o despejar el balón hacia las bandas.",
      watch: "Escuche los silbatazos frecuentes, intercepciones rápidas y centros amplios al área."
    },
    beginner: {
      happened: "Japón cambió de estrategia para presionar más arriba. Esto obligó a los defensas de Alemania a cometer errores.",
      matters: "Un cambio táctico es como mover piezas de ajedrez. Al jugar más abiertos, Japón generó espacios libres.",
      watch: "Observe si Alemania cambia su formación. Observe si los extremos de Japón reciben el balón con espacio."
    },
    cognitive: {
      happened: "Japón cambió su esquema. Presionaron a Alemania. Alemania cometió errores.",
      matters: "Japón hizo el campo más ancho. Alemania no tuvo espacios para pasar.",
      watch: "Observe los extremos de Japón y los errores de Alemania."
    },
    child: {
      happened: "¡El entrenador de Japón les pidió abrirse como un abanico gigante! Esto sorprendió a Alemania y ayudó a Japón a robar la pelota.",
      matters: "Estar separados hace que sea más difícil para el rival defender a todos.",
      watch: "Mire lo separados que juegan los futbolistas de Japón. Observe a Alemania intentar seguirlos."
    },
    tactical: {
      happened: "Japón cambió de un 4-2-3-1 a un sistema 3-4-3 en el 75'. Sus carrileros fijaron a los laterales alemanes para presionar la salida.",
      matters: "Esta superioridad numérica por fuera anuló el juego interior de Alemania y facilitó la presión tras pérdida.",
      watch: "Siga la dirección de pases de Alemania y el recorrido defensivo de los extremos de Japón."
    }
  }
};

const modeLabels: Record<ModeId, string> = {
  blind: "Blind audio",
  beginner: "Beginner",
  cognitive: "Low cognitive load",
  child: "Child-friendly",
  tactical: "Tactical",
};

const modeLabelsEs: Record<ModeId, string> = {
  blind: "Audio descriptivo",
  beginner: "Principiante",
  cognitive: "Carga cognitiva baja",
  child: "Infantil",
  tactical: "Táctico",
};

function getMomentExplanation(moment: MatchMoment, mode: ModeId, matchId: string, language: 'en' | 'es') {
  const dictionary = language === 'es' ? matchExplanationsEs : matchExplanations;
  const currentMatchDict = dictionary[matchId] || dictionary["spain-brazil"];
  
  if (moment.id === "momentum") return currentMatchDict[mode];

  const modePrefix: Record<ModeId, string> = language === 'es' ? {
    blind: "Enfoque de audio:",
    beginner: "Vista simple:",
    cognitive: "Versión corta:",
    child: "Para niños:",
    tactical: "Vista táctica:",
  } : {
    blind: "Audio focus:",
    beginner: "Simple view:",
    cognitive: "Short version:",
    child: "Kid-friendly:",
    tactical: "Tactical view:",
  };

  const base: Record<MatchMoment["type"], { happened: string; matters: string; watch: string }> = language === 'es' ? {
    start: {
      happened: `${modePrefix[mode]} el partido ha comenzado, ambos equipos se posicionan antes de la primera jugada de peligro.`,
      matters: "Los primeros minutos revelan qué equipo quiere proponer y dónde podrían abrirse espacios más adelante.",
      watch: "Observe el parado del mediocampo, la intensidad de presión y cómo atacan tras recuperar el balón.",
    },
    end: {
      happened: `${modePrefix[mode]} el partido ha terminado. El marcador final refleja cómo las decisiones y la fatiga cambiaron el juego.`,
      matters: "El pitazo final une las decisiones previas, los cambios y los giros de ritmo en una sola historia.",
      watch: "Revise el momento de mayor cambio, la sustitución más influyente y dónde se perdió el control.",
    },
    goal: {
      happened: `${modePrefix[mode]} gol de ${moment.title} al minuto ${moment.minute}. La jugada terminó en gol porque la defensa no cerró el espacio a tiempo.`,
      matters: "Los goles cambian el ánimo y la estrategia. El equipo que va ganando maneja el riesgo; el otro debe arriesgar más.",
      watch: "Observe si el equipo que anotó baja el ritmo y si el rival adelanta sus líneas.",
    },
    foul: {
      happened: `${modePrefix[mode]} una falta detuvo el juego al minuto ${moment.minute}. El árbitro intervino debido a un contacto indebido.`,
      matters: "Las faltas cortan el ritmo de juego, protegen la defensa y pueden generar jugadas a balón parado muy peligrosas.",
      watch: "Observe la barrera, el riesgo de tarjetas y si vuelven a atacar por la misma zona.",
    },
    hydration: {
      happened: `${modePrefix[mode]} pausa de hidratación. Los jugadores aprovechan para refrescarse y escuchar indicaciones breves.`,
      matters: "Las pausas pueden romper el ritmo. El equipo presionado toma un respiro, mientras que el dominante puede perder inercia.",
      watch: "Siga los primeros dos minutos tras reanudar; suele mostrar cuál entrenador aprovechó mejor la pausa.",
    },
    momentum: currentMatchDict[mode],
    substitution: {
      happened: `${modePrefix[mode]} cambio al minuto ${moment.minute}. Entra un jugador fresco con instrucciones específicas del técnico.`,
      matters: "Los cambios resuelven el cansancio, cambian la táctica o protegen a jugadores con tarjetas.",
      watch: "Observe dónde se posiciona el nuevo jugador y si cargan el ataque por su banda.",
    },
  } : {
    start: {
      happened: `${modePrefix[mode]} the match has started, and both teams are arranging their shape before the first major pressure moment.`,
      matters: "The first few minutes show which team wants the ball, which team waits deeper, and where space may open later.",
      watch: "Watch the midfield spacing, the first pressing trigger, and whether either team attacks quickly after winning the ball.",
    },
    end: {
      happened: `${modePrefix[mode]} the match has ended, so the final score is less important here than understanding the moments that changed control.`,
      matters: "Full-time is where fans can connect earlier decisions, fatigue, substitutions, and momentum shifts into one clear story.",
      watch: "Review the biggest swing, the most important substitution, and the moment where one team lost control.",
    },
    goal: {
      happened: `${modePrefix[mode]} ${moment.title} happened at ${moment.minute}. A scoring chance became a goal because the defending team could not close the key space in time.`,
      matters: "Goals change emotion and tactics. The leading team can manage risk, while the trailing team usually has to attack with more urgency.",
      watch: "Watch whether the scoring team slows the tempo, and whether the other team commits more players forward.",
    },
    foul: {
      happened: `${modePrefix[mode]} a foul stopped play at ${moment.minute}. The referee paused the match because contact or positioning broke the rules of play.`,
      matters: "A foul can break rhythm, protect a defense, or create a dangerous restart. It also changes how aggressively a player can defend afterward.",
      watch: "Watch the free-kick setup, the card risk, and whether the fouled team attacks the same area again.",
    },
    hydration: {
      happened: `${modePrefix[mode]} the match paused for hydration. Players used the break to drink, cool down, and receive short instructions.`,
      matters: "Breaks can reset momentum. A team under pressure gets time to breathe, while a team in control may lose rhythm.",
      watch: "Watch the first two minutes after the restart. That often shows which coach used the break better.",
    },
    momentum: currentMatchDict[mode],
    substitution: {
      happened: `${modePrefix[mode]} substitution at ${moment.minute}. A player left the match and a fresh player entered with a new job.`,
      matters: "Substitutions can solve fatigue, change tactics, or protect a player. They are one of the clearest signs that the coach sees a problem.",
      watch: "Watch where the new player stands, who presses less, and whether the team attacks through a different side.",
    },
  };

  return base[moment.type];
}

async function fetchLiveMatches(apiType: 'football-data' | 'rapidapi', key: string): Promise<Match[]> {
  if (apiType === 'football-data') {
    const res = await fetch("https://api.football-data.org/v4/matches", {
      headers: { "X-Auth-Token": key }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.matches || []).slice(0, 5).map((m: any) => ({
      id: String(m.id),
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      homeFlag: 'spain',
      awayFlag: 'brazil',
      date: new Date(m.utcDate).toLocaleDateString(),
      time: new Date(m.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stadium: m.venue || 'FIFA Stadium',
      timeline: [
        { id: "kickoff", minute: "0'", title: "Kick-off", detail: "Match started", type: "start" },
        { id: "moment-1", minute: "45'", title: "Halftime", detail: `Halftime score: ${m.score.halfTime.home ?? 0} - ${m.score.halfTime.away ?? 0}`, type: "hydration" },
        { id: "momentum", minute: "72'", title: "Tactical Pressure", detail: "Increased central attacks", type: "momentum" },
        { id: "fulltime", minute: "90'", title: "Full-time", detail: `Full-time: ${m.score.fullTime.home ?? 0} - ${m.score.fullTime.away ?? 0}`, type: "end" }
      ]
    }));
  } else {
    const res = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: {
        "x-rapidapi-key": key,
        "x-rapidapi-host": "v3.football.api-sports.io"
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.response || []).slice(0, 5).map((r: any) => ({
      id: String(r.fixture.id),
      homeTeam: r.teams.home.name,
      awayTeam: r.teams.away.name,
      homeFlag: 'germany',
      awayFlag: 'japan',
      date: new Date(r.fixture.date).toLocaleDateString(),
      time: r.fixture.status.short === 'NS' ? 'Upcoming' : `${r.fixture.status.elapsed}' Live`,
      stadium: r.fixture.venue.name || 'FIFA Arena',
      timeline: [
        { id: "kickoff", minute: "0'", title: "Kick-off", detail: "Match started", type: "start" },
        { id: "momentum", minute: `${r.fixture.status.elapsed || 70}'`, title: "Match Momentum", detail: "Active pressure swing", type: "momentum" },
        { id: "fulltime", minute: "90'", title: "Fixture Status", detail: r.fixture.status.long, type: "end" }
      ]
    }));
  }
}

function Logo() {
  return (
    <div className="logo" aria-hidden="true">
      <Accessibility size={24} />
    </div>
  );
}

function FieldPreview() {
  return (
    <svg className="field-preview" viewBox="0 0 300 178" role="img" aria-label="Simple pitch diagram showing Spain pressing Brazil">
      <defs>
        <linearGradient id="grass" x1="0" x2="1">
          <stop offset="0%" stopColor="#73b94b" />
          <stop offset="100%" stopColor="#9bd060" />
        </linearGradient>
      </defs>
      <rect width="300" height="178" rx="8" fill="url(#grass)" />
      <g stroke="#eaffdf" strokeWidth="2" fill="none" opacity="0.9">
        <rect x="16" y="18" width="268" height="142" />
        <line x1="150" y1="18" x2="150" y2="160" />
        <circle cx="150" cy="89" r="28" />
        <rect x="16" y="55" width="38" height="68" />
        <rect x="246" y="55" width="38" height="68" />
      </g>
      {[54, 92, 130, 172, 218].map((x, index) => (
        <g key={`blue-${x}`}>
          <circle cx={x} cy={48 + (index % 2) * 18} r="8" fill="#1458d4" stroke="#fff" strokeWidth="2" />
          <path d={`M${x} ${78 + (index % 2) * 8}v38`} stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrow)" />
        </g>
      ))}
      {[70, 110, 150, 190, 232].map((x, index) => (
        <circle key={`gold-${x}`} cx={x} cy={130 - (index % 2) * 12} r="8" fill="#ffcc35" stroke="#fff" strokeWidth="2" />
      ))}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill="#fff" />
        </marker>
      </defs>
    </svg>
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 92 }, (_, index) => ({
        id: index,
        height: 12 + ((index * 17) % 38),
        muted: index % 9 === 0,
      })),
    [],
  );

  return (
    <div className={`waveform ${active ? "active" : ""}`} aria-hidden="true">
      {bars.map((bar) => (
        <i key={bar.id} style={{ height: bar.height }} className={bar.muted ? "muted" : ""} />
      ))}
    </div>
  );
}

function MomentIcon({ type }: { type: MatchMoment["type"] }) {
  if (type === "goal") return <Trophy size={19} />;
  if (type === "foul") return <FileText size={19} />;
  if (type === "hydration") return <Volume2 size={19} />;
  if (type === "momentum") return <AudioLines size={19} />;
  if (type === "substitution") return <RefreshCw size={19} />;
  return <Clock3 size={19} />;
}

/* Tabs subcomponents */

function MatchExplorerTab({ matches, selectedMatchId, onSelectMatch, onFetchLive, activeMatch, language }: any) {
  const isEs = language === 'es';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', padding: '10px 0' }}>
      <div>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={20} /> {isEs ? "Partidos del Torneo" : "Tournament Fixtures"}
        </h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {matches.map((m: any) => (
            <div
              key={m.id}
              onClick={() => onSelectMatch(m.id)}
              style={{
                border: `2px solid ${selectedMatchId === m.id ? 'var(--blue)' : 'var(--line)'}`,
                background: selectedMatchId === m.id ? '#edf4ff' : '#fff',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                <span className={`flag ${m.homeFlag}`} />
                {m.homeTeam}
              </div>
              <div style={{ padding: '6px 12px', background: 'var(--lavender)', borderRadius: '12px', fontWeight: 900, fontSize: '0.85rem', margin: '0 16px' }}>
                {m.time}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                {m.awayTeam}
                <span className={`flag ${m.awayFlag}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>{isEs ? "Transmisión en Vivo" : "Live Match Feed"}</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          {isEs 
            ? "AccessiMatch AI funciona actualmente con simulaciones del Mundial de alta fidelidad. Configure sus claves API en Configuración para conectarse a marcadores en tiempo real."
            : "AccessiMatch AI matches are currently powered by high-fidelity World Cup mock fixtures. Connect to live feeds by configuring API keys in the Settings tab."
          }
        </p>
        <div style={{ padding: '12px', background: 'var(--lavender)', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.6' }}>
          <strong>{isEs ? "Partido Activo:" : "Active Match:"}</strong> {activeMatch.homeTeam} vs {activeMatch.awayTeam}<br/>
          <strong>{isEs ? "Estadio:" : "Stadium:"}</strong> {activeMatch.stadium}<br/>
          <strong>{isEs ? "Línea de Tiempo:" : "Timeline Moments:"}</strong> {activeMatch.timeline.length} {isEs ? "momentos detectados" : "moments detected"}
        </div>
        <button
          className="primary-cta"
          onClick={onFetchLive}
          style={{ marginTop: 'auto' }}
        >
          <RefreshCw size={17} /> {isEs ? "Sincronizar Marcador" : "Fetch Live Matches"}
        </button>
      </div>
    </div>
  );
}

function LearnExploreTab({ language }: { language: 'en' | 'es' }) {
  const isEs = language === 'es';
  const glossary = isEs ? [
    {
      term: "Fuera de Juego (Offside)",
      beginner: "Un atacante no puede estar más cerca de la línea de meta rival que el balón y el penúltimo rival al recibir el pase.",
      tactical: "Herramienta de restricción espacial vertical que obliga a las líneas defensivas a achicar espacios u ordenar bloques bajos.",
      kid: "¡No puedes quedarte detrás de la última defensa rival esperando el balón como si jugaras a las escondidas! Debes estar en la misma línea."
    },
    {
      term: "VAR (Árbitro Asistente de Video)",
      beginner: "Un grupo de árbitros que revisan jugadas importantes en video como goles, tarjetas rojas o penaltis.",
      tactical: "Protocolo de arbitraje externo que corrige errores manifiestos en eventos críticos de juego.",
      kid: "Un árbitro viendo pantallas de televisión que ayuda a tomar la decisión correcta cuando una jugada fue muy rápida."
    },
    {
      term: "Presión Alta (High Press)",
      beginner: "Cuando los delanteros corren de inmediato para incomodar a los defensas que intentan salir jugando.",
      tactical: "Estructura defensiva alta para tapar líneas de pase en salida de balón, buscando forzar errores en zona de finalización.",
      kid: "¡Correr muy rápido a marcar a tus contrincantes para quitarles el balón antes de que den un pase!"
    }
  ] : [
    {
      term: "Offside",
      beginner: "A player cannot be closer to the opponent's goal line than both the ball and the second-last opponent when the pass is kicked.",
      tactical: "A defensive vertical restriction tool that forces backlines to coordinate high lines or drop blocks to compress play space.",
      kid: "You can't wait behind the other team's last line of defense like a sneaky hide-and-seek player! You must stay level with them."
    },
    {
      term: "VAR (Video Assistant Referee)",
      beginner: "A team of referees who review video replays of major decisions like goals, red cards, or penalties.",
      tactical: "An off-field review protocol designed to override clear and obvious errors in game-critical match events.",
      kid: "A referee watching on TV screens who can pause the game to help make sure the calls are fair and correct."
    },
    {
      term: "High Press",
      beginner: "Defending players running forward to immediately close down defenders who are passing the ball from the back.",
      tactical: "Coordinated defensive block positioning designed to disrupt opponent buildup, close wide passing lanes, and trigger high-turnovers.",
      kid: "Running up to your opponent as fast as you can to tag them and steal the ball before they can pass it!"
    }
  ];

  return (
    <div style={{ display: 'grid', gap: '20px', padding: '10px 0' }}>
      <h2><GraduationCap size={20} /> {isEs ? "Glosario de Reglas y Tácticas" : "Soccer Rules & Tactical Explainer"}</h2>
      <p style={{ color: 'var(--muted)', marginTop: '-12px' }}>
        {isEs ? "Conceptos clave adaptados a diferentes niveles de comprensión." : "Learn soccer terminology translated into different accessibility levels."}
      </p>
      <div style={{ display: 'grid', gap: '16px' }}>
        {glossary.map((item) => (
          <div key={item.term} className="panel" style={{ padding: '18px' }}>
            <h3 style={{ borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--blue)' }}>{item.term}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '12px' }}>
              <div>
                <strong>🎓 {isEs ? "Principiante" : "Beginner Description"}</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>{item.beginner}</p>
              </div>
              <div>
                <strong>⚙️ {isEs ? "Análisis Táctico" : "Tactical Explanation"}</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>{item.tactical}</p>
              </div>
              <div>
                <strong>🧸 {isEs ? "Analogía Infantil" : "Kid-Friendly Analogy"}</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>{item.kid}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyLibraryTab({ library, onDelete, onSpeak, language }: any) {
  const isEs = language === 'es';
  if (library.length === 0) {
    return (
      <div className="panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
        <Library size={48} style={{ marginBottom: '12px' }} />
        <h3>{isEs ? "Tu biblioteca está vacía" : "Your library is empty"}</h3>
        <p>{isEs ? "Ve a la pestaña Explicar y pulsa Guardar en biblioteca para guardar análisis." : "Go to the Accessible Explain tab and click Save to Library to save explanations here."}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px', padding: '10px 0' }}>
      <h2><Library size={20} /> {isEs ? "Mi Biblioteca de Guardados" : "My Saved Explanations"} ({library.length})</h2>
      <div style={{ display: 'grid', gap: '16px' }}>
        {library.map((item: any) => (
          <div key={item.id} className="panel" style={{ padding: '18px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
              <div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--blue)' }}>{item.matchName}</strong>
                <span style={{ marginLeft: '12px', background: 'var(--lavender)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>
                  {item.momentMinute} {item.momentTitle}
                </span>
                <span style={{ marginLeft: '8px', background: '#e8fbf2', color: '#0a6d45', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>
                  {item.modeLabel}
                </span>
              </div>
              <small style={{ color: 'var(--muted)' }}>{isEs ? "Guardado:" : "Saved:"} {item.savedAt}</small>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
              <div>
                <strong>{isEs ? "Qué pasó:" : "What happened:"}</strong>
                <p style={{ marginTop: '4px' }}>{item.explanation.happened}</p>
              </div>
              <div>
                <strong>{isEs ? "Por qué importa:" : "Why it matters:"}</strong>
                <p style={{ marginTop: '4px' }}>{item.explanation.matters}</p>
              </div>
              <div>
                <strong>{isEs ? "Qué observar después:" : "What to watch next:"}</strong>
                <p style={{ marginTop: '4px' }}>{item.explanation.watch}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
              <button
                onClick={() => onSpeak(item.explanation)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  background: '#fff',
                  fontWeight: 800
                }}
              >
                <Volume2 size={16} /> {isEs ? "Escuchar" : "Speak"}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '1px solid #ffd0d0',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  background: '#ffebeb',
                  color: '#d32f2f',
                  fontWeight: 800
                }}
              >
                {isEs ? "Eliminar" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({
  apiKey, setApiKey,
  fdKey, setFdKey,
  rapidKey, setRapidKey,
  highContrast, setHighContrast,
  dyslexicTypography, setDyslexicTypography,
  reduceMotion, setReduceMotion,
  largeText, setLargeText,
  language, setLanguage,
  showToast
}: any) {
  const isEs = language === 'es';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '10px 0' }}>
      <div className="panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>🔑 {isEs ? "Claves de API (Seguras)" : "API Credentials (Local storage)"}</h2>
        
        <div className="control-group">
          <label>{isEs ? "Clave OpenAI API (Para gpt-4o-mini)" : "OpenAI API Key (For dynamic gpt-4o-mini generation)"}</label>
          <input
            type="password"
            placeholder="sk-proj-..."
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem("accessimatch_openai_key", e.target.value);
            }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
          />
        </div>

        <div className="control-group">
          <label>{isEs ? "Token Football-Data.org (Opcional)" : "Football-Data.org API Token (Optional)"}</label>
          <input
            type="password"
            placeholder="Token..."
            value={fdKey}
            onChange={(e) => {
              setFdKey(e.target.value);
              localStorage.setItem("accessimatch_fd_key", e.target.value);
            }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
          />
        </div>

        <div className="control-group">
          <label>{isEs ? "Clave RapidAPI API-Football (Opcional)" : "RapidAPI API-Football Key (Optional)"}</label>
          <input
            type="password"
            placeholder="RapidAPI Key..."
            value={rapidKey}
            onChange={(e) => {
              setRapidKey(e.target.value);
              localStorage.setItem("accessimatch_rapidapi_key", e.target.value);
            }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }}
          />
        </div>
        
        <button
          className="primary-cta"
          onClick={() => showToast(isEs ? "¡Configuraciones de API guardadas!" : "API Settings saved successfully!")}
          style={{ marginTop: 'auto' }}
        >
          {isEs ? "Guardar Ajustes" : "Save API Settings"}
        </button>
      </div>

      <div className="panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2>♿ {isEs ? "Preferencias de Accesibilidad" : "Accessibility & Theme Preferences"}</h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
            {isEs ? "Modo Alto Contraste (WCAG AAA)" : "High Contrast Theme (WCAG AAA)"}
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={dyslexicTypography}
              onChange={(e) => setDyslexicTypography(e.target.checked)}
            />
            {isEs ? "Tipografía para Dislexia" : "Dyslexic Friendly Typography"}
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
            />
            {isEs ? "Reducir Animaciones del Sistema" : "Reduce Interface Motion"}
          </label>
        </div>

        <div className="control-group" style={{ marginTop: '12px' }}>
          <label>{isEs ? "Escala de tamaño de letra" : "Text size scale"}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="1"
            value={largeText ? 1 : 0}
            onChange={(e) => setLargeText(e.target.value === "1")}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <span>{isEs ? "Estándar" : "Standard"}</span>
            <span>{isEs ? "Grande (Accesible)" : "Large (Accessible)"}</span>
          </div>
        </div>

        <div className="control-group">
          <label>{isEs ? "Idioma principal" : "Primary Language"}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', fontWeight: 800 }}
          >
            <option value="en">English (US/UK)</option>
            <option value="es">Español (Castellano)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* Main Component */

export default function App() {
  const [selectedMoment, setSelectedMoment] = useState("momentum");
  const [mode, setMode] = useState<ModeId>("blind");
  const [generated, setGenerated] = useState(false);
  const [readingLevel, setReadingLevel] = useState(2);
  const [largeText, setLargeText] = useState(false);

  /* New State Variables */
  const [activeTab, setActiveTab] = useState<"explorer" | "explain" | "learn" | "library" | "settings">("explain");
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicTypography, setDyslexicTypography] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>("en");
  const [toast, setToast] = useState<string | null>(null);
  const [showKeyMomentsOnly, setShowKeyMomentsOnly] = useState(true);

  /* Audio player state variables */
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  /* API Credentials */
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("accessimatch_openai_key") || (import.meta as any).env?.VITE_OPENAI_API_KEY || "";
  });
  const [fdKey, setFdKey] = useState(() => localStorage.getItem("accessimatch_fd_key") || "");
  const [rapidKey, setRapidKey] = useState(() => localStorage.getItem("accessimatch_rapidapi_key") || "");

  /* UI Logic & Helpers */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dynamicExplanation, setDynamicExplanation] = useState<{ happened: string; matters: string; watch: string } | null>(null);
  const [matches, setMatches] = useState<Match[]>(defaultMatches);
  const [selectedMatchId, setSelectedMatchId] = useState("spain-brazil");
  
  /* Library */
  const [library, setLibrary] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem("accessimatch_library") || "[]");
  });

  const activeMatch = useMemo(() => {
    return matches.find((m) => m.id === selectedMatchId) || matches[0];
  }, [matches, selectedMatchId]);

  const timeline = activeMatch.timeline;

  const filteredTimeline = useMemo(() => {
    if (!showKeyMomentsOnly) return timeline;
    return timeline.filter(m => m.type === "goal" || m.type === "foul" || m.type === "substitution" || m.type === "momentum");
  }, [timeline, showKeyMomentsOnly]);

  const selected = useMemo(() => {
    return timeline.find((moment) => moment.id === selectedMoment) || timeline[0] || moments[4];
  }, [timeline, selectedMoment]);

  const explanation = useMemo(() => {
    return getMomentExplanation(selected, mode, selectedMatchId, language);
  }, [selected, mode, selectedMatchId, language]);

  const displayedExplanation = dynamicExplanation || explanation;

  /* Speech length audio timer calculation */
  const estimatedDuration = useMemo(() => {
    const textLength = displayedExplanation.happened.length + displayedExplanation.matters.length + displayedExplanation.watch.length;
    return Math.max(8, Math.round(textLength / 16));
  }, [displayedExplanation]);

  /* Speech synthesis progress simulation */
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= estimatedDuration) {
            setIsPlaying(false);
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, estimatedDuration]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  async function handleGenerate() {
    if (!apiKey.trim()) {
      setGenerated(true);
      setDynamicExplanation(null);
      setError(null);
      showToast(language === 'es' ? "Mostrando plantilla local..." : "Showing offline local template...");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const modeObj = modes.find((m) => m.id === mode) || modes[0];
      const selectedLabels = language === 'es' ? modeLabelsEs : modeLabels;
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are AccessiMatch AI, an expert soccer tactical analyst and accessibility coordinator for the FIFA World Cup 2026. Your job is to explain a specific match moment according to the requested accessibility profile. Return the explanation in JSON format with three fields: 'happened', 'matters', and 'watch'. Ensure the language matches the requested language perfectly.`,
            },
            {
              role: "user",
              content: `Match: ${activeMatch.homeTeam} vs ${activeMatch.awayTeam}
Moment: ${selected.minute} ${selected.title} (${selected.detail})
Profile: ${selectedLabels[mode]} - ${modeObj.description}
Reading Level: Level ${readingLevel}/5
Language: ${language === 'es' ? 'Spanish (Español)' : 'English'}

Generate:
1. 'happened': What happened in this moment.
2. 'matters': Why this moment matters in the context of the match.
3. 'watch': What the viewer should watch for next.

Ensure JSON format:
{
  "happened": "...",
  "matters": "...",
  "watch": "..."
}`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      if (content.happened && content.matters && content.watch) {
        setDynamicExplanation(content);
        setGenerated(true);
        showToast(language === 'es' ? "Explicación dinámica generada." : "Dynamic explanation generated successfully.");
      } else {
        throw new Error("Invalid response format received from AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate explanation. Please check your API key and connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleSpeak() {
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setAudioProgress(0);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(
        `${displayedExplanation.happened}. ${displayedExplanation.matters}. ${displayedExplanation.watch}`,
      );
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = mode === "cognitive" ? 0.82 : 0.92;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };

      window.speechSynthesis.cancel();
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast("Speech synthesis not supported in this browser.");
    }
  }

  function handleSave() {
    const isEs = language === 'es';
    const activeLabels = isEs ? modeLabelsEs : modeLabels;
    const newItem = {
      id: `${selectedMatchId}-${selected.id}-${mode}-${Date.now()}`,
      matchName: `${activeMatch.homeTeam} vs ${activeMatch.awayTeam}`,
      momentTitle: selected.title,
      momentMinute: selected.minute,
      modeLabel: activeLabels[mode],
      explanation: displayedExplanation,
      savedAt: new Date().toLocaleString()
    };
    const updated = [newItem, ...library];
    setLibrary(updated);
    localStorage.setItem("accessimatch_library", JSON.stringify(updated));
    showToast(isEs ? "¡Análisis guardado en biblioteca!" : "Saved analysis to Library!");
  }

  function handleShare() {
    const isEs = language === 'es';
    const activeLabels = isEs ? modeLabelsEs : modeLabels;
    const text = `AccessiMatch AI - ${activeMatch.homeTeam} vs ${activeMatch.awayTeam} (${selected.minute} ${selected.title})\n\nMode: ${activeLabels[mode]}\n\n1. ${isEs ? 'Qué pasó' : 'What Happened'}: ${displayedExplanation.happened}\n2. ${isEs ? 'Por qué importa' : 'Why It Matters'}: ${displayedExplanation.matters}\n3. ${isEs ? 'Qué observar' : 'What to Watch'}: ${displayedExplanation.watch}`;
    
    navigator.clipboard.writeText(text).then(() => {
      showToast(isEs ? "¡Copiado al portapapeles!" : "Copied shareable explanation to clipboard!");
    }).catch(() => {
      showToast("Clipboard error.");
    });
  }

  function handleDeleteLibrary(id: string) {
    const updated = library.filter(item => item.id !== id);
    setLibrary(updated);
    localStorage.setItem("accessimatch_library", JSON.stringify(updated));
    showToast(language === 'es' ? "Análisis eliminado." : "Deleted explanation from Library.");
  }

  function handleSpeakLibrary(exp: { happened: string; matters: string; watch: string }) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`${exp.happened}. ${exp.matters}. ${exp.watch}`);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      showToast(language === 'es' ? "Reproduciendo audio..." : "Speaking explanation...");
    }
  }

  async function handleFetchLive() {
    if (!fdKey && !rapidKey) {
      showToast(language === 'es' ? "Introduzca una clave en Configuración para usar la API en vivo." : "Please set a Football API key in the Settings tab to sync live data.");
      return;
    }
    
    showToast(language === 'es' ? "Sincronizando marcadores..." : "Syncing tournament matches...");
    try {
      let fetchedMatches: Match[];
      if (fdKey) {
        fetchedMatches = await fetchLiveMatches('football-data', fdKey);
      } else {
        fetchedMatches = await fetchLiveMatches('rapidapi', rapidKey);
      }
      
      if (fetchedMatches && fetchedMatches.length > 0) {
        setMatches(fetchedMatches);
        setSelectedMatchId(fetchedMatches[0].id);
        setSelectedMoment(fetchedMatches[0].timeline[0].id);
        showToast(language === 'es' ? `Cargados ${fetchedMatches.length} partidos de la API.` : `Loaded ${fetchedMatches.length} matches from football API!`);
      } else {
        showToast(language === 'es' ? "No hay marcadores activos en la API. Usando locales." : "No matches active in the API. Using high-fidelity offline mode.");
      }
    } catch (e: any) {
      console.error(e);
      showToast(language === 'es' ? `Error de red: ${e.message}. Usando locales.` : `API Network error: ${e.message}. Using offline mode.`);
    }
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const textScaleValue = largeText ? 1.25 : 1.0;
  const isEs = language === 'es';

  return (
    <main
      style={{ "--text-scale": textScaleValue } as React.CSSProperties}
      className={`app ${highContrast ? "high-contrast-mode" : ""} ${dyslexicTypography ? "dyslexic-text" : ""} ${reduceMotion ? "reduce-motion" : ""} ${largeText ? "large-text" : ""}`}
    >
      <header className="topbar">
        <div className="brand">
          <Logo />
          <strong>AccessiMatch <span>AI</span></strong>
        </div>
        <nav aria-label="Primary navigation">
          <button className={activeTab === "explorer" ? "active" : ""} onClick={() => setActiveTab("explorer")}><Home size={17} /> {isEs ? "Partidos" : "Match Explorer"}</button>
          <button className={activeTab === "explain" ? "active" : ""} onClick={() => setActiveTab("explain")}><MessageSquareText size={17} /> {isEs ? "Explicar" : "Accessible Explain"}</button>
          <button className={activeTab === "learn" ? "active" : ""} onClick={() => setActiveTab("learn")}><GraduationCap size={17} /> {isEs ? "Aprender" : "Learn & Explore"}</button>
          <button className={activeTab === "library" ? "active" : ""} onClick={() => setActiveTab("library")}><Library size={17} /> {isEs ? "Mi Biblioteca" : "My Library"}</button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}><Settings size={17} /> {isEs ? "Ajustes" : "Settings"}</button>
        </nav>
        <div className="top-actions">
          <strong>FIFA WORLD CUP 2026™</strong>
          <label className="switch-label">
            {isEs ? "Alto Contraste" : "High Contrast"}
            <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
          </label>
          <button aria-label="Help" onClick={() => setActiveTab("settings")}><CircleHelp size={22} /></button>
        </div>
      </header>

      {activeTab === "explain" ? (
        <section className="workspace">
          <aside className="panel moment-panel">
            <h1>{isEs ? "Elige un momento" : "Choose a match moment"}</h1>
            <label className="field-label" style={{ marginTop: '14px' }}>
              {isEs ? "Seleccionar partido" : "Select match"}
              <div className="match-selectors">
                <button onClick={() => setActiveTab("explorer")}>
                  <span className={`flag ${activeMatch.homeFlag}`} /> {activeMatch.homeTeam}
                </button>
                <span>vs</span>
                <button onClick={() => setActiveTab("explorer")}>
                  {activeMatch.awayTeam} <span className={`flag ${activeMatch.awayFlag}`} />
                </button>
              </div>
            </label>
            <div className="match-meta" style={{ marginTop: '10px' }}>
              <span><CalendarDays size={17} /> {activeMatch.date}</span>
              <span><Clock3 size={17} /> {activeMatch.time}</span>
              <span><MapPin size={17} /> {activeMatch.stadium}</span>
            </div>

            <div className="timeline-head">
              <h2>{isEs ? "Línea de tiempo" : "Event timeline"}</h2>
              <label style={{ cursor: 'pointer' }}>
                {isEs ? "Solo momentos clave" : "Show key moments"}
                <input
                  type="checkbox"
                  checked={showKeyMomentsOnly}
                  onChange={(e) => setShowKeyMomentsOnly(e.target.checked)}
                />
              </label>
            </div>
            <div className="timeline-list">
              {filteredTimeline.map((moment) => (
                <button
                  key={moment.id}
                  onClick={() => {
                    setSelectedMoment(moment.id);
                    setDynamicExplanation(null);
                    setGenerated(false);
                    setError(null);
                  }}
                  className={moment.id === selectedMoment ? "selected" : ""}
                >
                  <time>{moment.minute}</time>
                  <span className={`event-dot ${moment.type}`}>
                    <MomentIcon type={moment.type} />
                  </span>
                  <span>
                    <strong>{moment.title}</strong>
                    <small>{moment.detail}</small>
                  </span>
                </button>
              ))}
            </div>

            <button className="primary-cta" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {loading ? (isEs ? "Generando..." : "Generating...") : (isEs ? "Generar explicación" : "Generate explanation")}
            </button>
          </aside>

          <section className="panel explanation-panel">
            <div className="panel-title">
              <h1>{isEs ? "Explicación accesible" : "Accessible explanation"}</h1>
              <span>
                {loading
                  ? (isEs ? "Generando con GPT-4o-mini..." : "Generating with GPT-4o-mini...")
                  : generated
                  ? dynamicExplanation
                    ? "Generated by GPT-4o-mini"
                    : (isEs ? "Generada por IBM Granite (Local)" : "Generated by IBM Granite (Local)")
                  : (isEs ? "Listo para generar" : "Ready to generate")}
              </span>
            </div>
            <div className="mode-tabs" role="tablist" aria-label="Explanation modes">
              {modes.map((item) => {
                const Icon = item.icon;
                const activeLabels = isEs ? modeLabelsEs : modeLabels;
                return (
                  <button
                    key={item.id}
                    className={mode === item.id ? "active" : ""}
                    onClick={() => {
                      setMode(item.id);
                      setDynamicExplanation(null);
                      setGenerated(false);
                      setError(null);
                    }}
                    role="tab"
                    aria-selected={mode === item.id}
                  >
                    <Icon size={23} />
                    {activeLabels[item.id]}
                  </button>
                );
              })}
            </div>

            {error && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#ffebeb',
                border: '1px solid #ffd0d0',
                color: '#d32f2f',
                fontSize: '0.88rem',
                fontWeight: 800,
                marginTop: '12px'
              }}>
                ⚠️ {isEs ? "Error:" : "Error:"} {error}
              </div>
            )}

            <div className="explaining-strip">
              {isEs ? "Explicando:" : "Explaining:"} {selected.minute} {selected.title} - {selected.detail}
            </div>

            <article className="explain-card happened">
              <div className="card-icon"><Volume2 size={25} /></div>
              <div>
                <h2>{isEs ? "Qué pasó" : "What happened"}</h2>
                <p>{displayedExplanation.happened}</p>
              </div>
              <FieldPreview />
            </article>

            <article className="explain-card matters">
              <div className="card-icon"><Sparkles size={25} /></div>
              <div>
                <h2>{isEs ? "Por qué importa" : "Why it matters"}</h2>
                <p>{displayedExplanation.matters}</p>
              </div>
            </article>

            <article className="explain-card watch">
              <div className="card-icon"><Eye size={25} /></div>
              <div>
                <h2>{isEs ? "Qué observar después" : "What to watch next"}</h2>
                <p>{displayedExplanation.watch}</p>
              </div>
            </article>

            <div className="audio-player">
              <button onClick={handleSpeak} aria-label="Play audio explanation">
                <Volume2 size={26} />
              </button>
              <strong>{isPlaying ? (isEs ? "Pausar audio" : "Pause audio") : (isEs ? "Escuchar audio" : "Play audio")}</strong>
              <Waveform active={isPlaying} />
              <span>{formatTime(audioProgress)} / {formatTime(estimatedDuration)}</span>
            </div>

            <footer className="explanation-footer">
              <span><Info size={17} /> {isEs ? "Esta explicación es asistida por IA y basada en datos tácticos del torneo." : "This explanation is AI-assisted and grounded in tournament tactical documents."}</span>
              <div>
                <button onClick={handleSave}>
                  <Library size={17} />
                  {isEs ? "Guardar" : "Save"}
                </button>
                <button onClick={handleGenerate} disabled={loading}>
                  <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                  {isEs ? "Regenerar" : "Regenerate"}
                </button>
                <button onClick={handleShare}><Share2 size={17} /> {isEs ? "Compartir" : "Share"}</button>
              </div>
            </footer>
          </section>

          <aside className="panel controls-panel">
            <h1>{isEs ? "Controles de lectura" : "Understanding controls"}</h1>
            <div className="control-group">
              <label>{isEs ? "Nivel de lectura" : "Reading level"} <Info size={15} /></label>
              <strong>
                {isEs ? `Nivel ${readingLevel} - ${readingLevel <= 2 ? "Fácil de comprender" : "Más terminología"}` : `Level ${readingLevel} - ${readingLevel <= 2 ? "Easy to read" : "More detail"}`}
              </strong>
              <input
                type="range"
                min="1"
                max="5"
                value={readingLevel}
                onChange={(event) => setReadingLevel(Number(event.target.value))}
              />
              <div className="range-labels">
                <span>Nivel 1</span><span>Nivel 2</span><span>Nivel 3</span><span>Nivel 4</span><span>Nivel 5</span>
              </div>
            </div>

            <div className="control-group">
              <label>{isEs ? "Idioma" : "Language"}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  color: 'var(--text)',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}
              >
                <option value="en">English (UK/US)</option>
                <option value="es">Español (Castellano)</option>
              </select>
            </div>

            <div className="control-group text-size">
              <label>{isEs ? "Tamaño de letra" : "Text size"} <Info size={15} /></label>
              <div>
                <span>A</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  value={largeText ? 1 : 0}
                  onChange={(event) => setLargeText(event.target.value === "1")}
                />
                <strong>A</strong>
              </div>
            </div>
            
            <div className="segmented">
              <label>{isEs ? "Modo contraste" : "Contrast mode"} <Info size={15} /></label>
              <div>
                <button className={!highContrast ? "active" : ""} onClick={() => setHighContrast(false)}>{isEs ? "Estándar" : "Standard"}</button>
                <button className={highContrast ? "active" : ""} onClick={() => setHighContrast(true)}>{isEs ? "Alto contraste" : "High contrast"}</button>
              </div>
            </div>

            <div className="segmented">
              <label>{isEs ? "Reducir movimiento" : "Reduce motion"} <Info size={15} /></label>
              <div>
                <button className={reduceMotion ? "active" : ""} onClick={() => setReduceMotion(true)}>{isEs ? "Activado" : "On"}</button>
                <button className={!reduceMotion ? "active" : ""} onClick={() => setReduceMotion(false)}>{isEs ? "Desactivado" : "Off"}</button>
              </div>
            </div>

            <div className="segmented">
              <label>{isEs ? "Estilo de texto" : "Caption style"} <Info size={15} /></label>
              <div>
                <button className={!dyslexicTypography ? "active" : ""} onClick={() => setDyslexicTypography(false)}>{isEs ? "Por defecto" : "Default"}</button>
                <button className={dyslexicTypography ? "active" : ""} onClick={() => setDyslexicTypography(true)}>{isEs ? "Dislexia" : "Dyslexic friendly"}</button>
              </div>
            </div>

            <section className="sources">
              <h2>{isEs ? "Fuentes bibliográficas" : "Sources"}</h2>
              {["FIFA Technical Report 2022", "Opta Event Data", "Accessibility Guidelines"].map((source) => (
                <a href="#" key={source} onClick={(e) => { e.preventDefault(); showToast(`Opening source: ${source}`); }}><FileText size={16} /> {source} <Link size={15} /></a>
              ))}
            </section>
          </aside>
        </section>
      ) : (
        <section className="panel" style={{ marginTop: '14px', padding: '18px', minHeight: '520px' }}>
          {activeTab === "explorer" && (
            <MatchExplorerTab
              matches={matches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={(id: string) => {
                setSelectedMatchId(id);
                setDynamicExplanation(null);
                setGenerated(false);
                setError(null);
                const activeM = matches.find(m => m.id === id) || matches[0];
                if (activeM && activeM.timeline.length > 0) {
                  setSelectedMoment(activeM.timeline[0].id);
                }
                setActiveTab("explain");
                showToast(isEs ? "¡Partido y eventos cargados!" : "Loaded match data and timeline!");
              }}
              onFetchLive={handleFetchLive}
              activeMatch={activeMatch}
              language={language}
            />
          )}
          {activeTab === "learn" && <LearnExploreTab language={language} />}
          {activeTab === "library" && (
            <MyLibraryTab
              library={library}
              onDelete={handleDeleteLibrary}
              onSpeak={handleSpeakLibrary}
              language={language}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              apiKey={apiKey} setApiKey={setApiKey}
              fdKey={fdKey} setFdKey={setFdKey}
              rapidKey={rapidKey} setRapidKey={setRapidKey}
              highContrast={highContrast} setHighContrast={setHighContrast}
              dyslexicTypography={dyslexicTypography} setDyslexicTypography={setDyslexicTypography}
              reduceMotion={reduceMotion} setReduceMotion={setReduceMotion}
              largeText={largeText} setLargeText={setLargeText}
              language={language} setLanguage={setLanguage}
              showToast={showToast}
            />
          )}
        </section>
      )}

      <section className="bottom-band">
        <div className="panel pipeline">
          <h2>{isEs ? "Flujo de explicación con IA" : "AI explanation pipeline"} <Info size={16} /></h2>
          <div className="pipeline-steps">
            <article><strong>IBM Granite</strong><span>{isEs ? "Entendimiento y síntesis" : "Understand & summarize"}</span></article>
            <i />
            <article><strong>Docling</strong><span>{isEs ? "Extracción de reportes" : "Extract match data"}</span></article>
            <i />
            <article><strong>LangChain</strong><span>{isEs ? "Orquestación y promts" : "Orchestrate & generate"}</span></article>
            <i />
            <article><strong>Accessibility layer</strong><span>{isEs ? "Adaptación e interfaz" : "Adapt for all users"}</span></article>
          </div>
        </div>
        <div className="panel score-panel">
          <div className="score-ring"><strong>96%</strong></div>
          <div>
            <h2>{isEs ? "Puntaje de accesibilidad" : "Accessibility score"} <Info size={16} /></h2>
            <ul style={{ paddingLeft: 0 }}>
              {[
                isEs ? "Lectores de pantalla" : "Screen reader friendly",
                isEs ? "Lenguaje claro" : "Plain language used",
                isEs ? "Carga cognitiva baja" : "Low cognitive load",
                isEs ? "Alto contraste" : "High contrast ready",
                isEs ? "Subtítulos legibles" : "Captions available",
                isEs ? "Navegación por teclado" : "Keyboard navigable",
              ].map((item) => (
                <li key={item}><Check size={16} /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--blue)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontWeight: 800,
          animation: 'slideUp 0.3s ease-out'
        }}>
          ✨ {toast}
        </div>
      )}
    </main>
  );
}
