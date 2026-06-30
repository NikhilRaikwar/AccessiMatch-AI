import { useMemo, useState } from "react";
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

const explanations: Record<ModeId, { happened: string; matters: string; watch: string }> = {
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

const modeLabels: Record<ModeId, string> = {
  blind: "Blind audio",
  beginner: "Beginner",
  cognitive: "Low cognitive load",
  child: "Child-friendly",
  tactical: "Tactical",
};

function getMomentExplanation(moment: MatchMoment, mode: ModeId) {
  if (moment.id === "momentum") return explanations[mode];

  const modePrefix: Record<ModeId, string> = {
    blind: "Audio focus:",
    beginner: "Simple view:",
    cognitive: "Short version:",
    child: "Kid-friendly:",
    tactical: "Tactical view:",
  };

  const base: Record<MatchMoment["type"], { happened: string; matters: string; watch: string }> = {
    start: {
      happened: `${modePrefix[mode]} the match has started, and both teams are arranging their shape before the first major pressure moment.`,
      matters:
        "The first few minutes show which team wants the ball, which team waits deeper, and where space may open later.",
      watch:
        "Watch the midfield spacing, the first pressing trigger, and whether either team attacks quickly after winning the ball.",
    },
    end: {
      happened: `${modePrefix[mode]} the match has ended, so the final score is less important here than understanding the moments that changed control.`,
      matters:
        "Full-time is where fans can connect earlier decisions, fatigue, substitutions, and momentum shifts into one clear story.",
      watch:
        "Review the biggest swing, the most important substitution, and the moment where one team lost control.",
    },
    goal: {
      happened: `${modePrefix[mode]} ${moment.title} happened at ${moment.minute}. A scoring chance became a goal because the defending team could not close the key space in time.`,
      matters:
        "Goals change emotion and tactics. The leading team can manage risk, while the trailing team usually has to attack with more urgency.",
      watch:
        "Watch whether the scoring team slows the tempo, and whether the other team commits more players forward.",
    },
    foul: {
      happened: `${modePrefix[mode]} a foul stopped play at ${moment.minute}. The referee paused the match because contact or positioning broke the rules of play.`,
      matters:
        "A foul can break rhythm, protect a defense, or create a dangerous restart. It also changes how aggressively a player can defend afterward.",
      watch:
        "Watch the free-kick setup, the card risk, and whether the fouled team attacks the same area again.",
    },
    hydration: {
      happened: `${modePrefix[mode]} the match paused for hydration. Players used the break to drink, cool down, and receive short instructions.`,
      matters:
        "Breaks can reset momentum. A team under pressure gets time to breathe, while a team in control may lose rhythm.",
      watch:
        "Watch the first two minutes after the restart. That often shows which coach used the break better.",
    },
    momentum: explanations[mode],
    substitution: {
      happened: `${modePrefix[mode]} Brazil made a substitution at ${moment.minute}. A player left the match and a fresh player entered with a new job.`,
      matters:
        "Substitutions can solve fatigue, change tactics, or protect a player. They are one of the clearest signs that the coach sees a problem.",
      watch:
        "Watch where the new player stands, who presses less, and whether the team attacks through a different side.",
    },
  };

  return base[moment.type];
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

function Waveform() {
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
    <div className="waveform" aria-hidden="true">
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

export default function App() {
  const [selectedMoment, setSelectedMoment] = useState("momentum");
  const [mode, setMode] = useState<ModeId>("blind");
  const [generated, setGenerated] = useState(false);
  const [readingLevel, setReadingLevel] = useState(2);
  const [largeText, setLargeText] = useState(false);
  const selected = moments.find((moment) => moment.id === selectedMoment) ?? moments[4];
  const explanation = getMomentExplanation(selected, mode);

  function handleGenerate() {
    setGenerated(true);
  }

  function handleSpeak() {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${explanation.happened}. ${explanation.matters}. ${explanation.watch}`,
      );
      utterance.rate = mode === "cognitive" ? 0.85 : 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <main className={`app ${largeText ? "large-text" : ""}`}>
      <header className="topbar">
        <div className="brand">
          <Logo />
          <strong>AccessiMatch <span>AI</span></strong>
        </div>
        <nav aria-label="Primary navigation">
          <button><Home size={17} /> Match Explorer</button>
          <button className="active"><MessageSquareText size={17} /> Accessible Explain</button>
          <button><CircleHelp size={17} /> Learn & Explore</button>
          <button><Library size={17} /> My Library</button>
          <button><Settings size={17} /> Settings</button>
        </nav>
        <div className="top-actions">
          <strong>FIFA WORLD CUP 2026™</strong>
          <label className="switch-label">
            High Contrast
            <input type="checkbox" defaultChecked />
          </label>
          <button aria-label="Help"><CircleHelp size={22} /></button>
        </div>
      </header>

      <section className="workspace">
        <aside className="panel moment-panel">
          <h1>Choose a match moment</h1>
          <label className="field-label">
            Select match
            <div className="match-selectors">
              <button><span className="flag spain" /> Spain <ChevronDown size={15} /></button>
              <span>vs</span>
              <button><span className="flag brazil" /> Brazil <ChevronDown size={15} /></button>
            </div>
          </label>
          <div className="match-meta">
            <span><CalendarDays size={17} /> Jun 21, 2026</span>
            <span><Clock3 size={17} /> 15:00</span>
            <span><MapPin size={17} /> Hard Rock Stadium, Miami</span>
          </div>

          <div className="timeline-head">
            <h2>Event timeline</h2>
            <label>
              Show key moments
              <input type="checkbox" defaultChecked />
            </label>
          </div>
          <div className="timeline-list">
            {moments.map((moment) => (
              <button
                key={moment.id}
                onClick={() => {
                  setSelectedMoment(moment.id);
                  setGenerated(false);
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

          <button className="primary-cta" onClick={handleGenerate}>
            <Sparkles size={18} />
            Generate explanation
          </button>
        </aside>

        <section className="panel explanation-panel">
          <div className="panel-title">
            <h1>Accessible explanation</h1>
            <span>{generated ? "Generated by IBM Granite" : "Ready to generate"}</span>
          </div>
          <div className="mode-tabs" role="tablist" aria-label="Explanation modes">
            {modes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={mode === item.id ? "active" : ""}
                  onClick={() => setMode(item.id)}
                  role="tab"
                  aria-selected={mode === item.id}
                >
                  <Icon size={23} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="explaining-strip">
            Explaining: {selected.minute} {selected.title} - {selected.detail}
          </div>

          <article className="explain-card happened">
            <div className="card-icon"><Volume2 size={25} /></div>
            <div>
              <h2>What happened</h2>
              <p>{explanation.happened}</p>
            </div>
            <FieldPreview />
          </article>

          <article className="explain-card matters">
            <div className="card-icon"><Sparkles size={25} /></div>
            <div>
              <h2>Why it matters</h2>
              <p>{explanation.matters}</p>
            </div>
          </article>

          <article className="explain-card watch">
            <div className="card-icon"><Eye size={25} /></div>
            <div>
              <h2>What to watch next</h2>
              <p>{explanation.watch}</p>
            </div>
          </article>

          <div className="audio-player">
            <button onClick={handleSpeak} aria-label="Play audio explanation">
              <Volume2 size={26} />
            </button>
            <strong>Play audio</strong>
            <Waveform />
            <span>00:00 / 00:43</span>
          </div>

          <footer className="explanation-footer">
            <span><Info size={17} /> This explanation is generated by AI and grounded in source material.</span>
            <div>
              <button><RefreshCw size={17} /> Regenerate</button>
              <button><Share2 size={17} /> Share</button>
            </div>
          </footer>
        </section>

        <aside className="panel controls-panel">
          <h1>Understanding controls</h1>
          <div className="control-group">
            <label>Reading level <Info size={15} /></label>
            <strong>Level {readingLevel} - {readingLevel <= 2 ? "Easy to read" : "More detail"}</strong>
            <input
              type="range"
              min="1"
              max="5"
              value={readingLevel}
              onChange={(event) => setReadingLevel(Number(event.target.value))}
            />
            <div className="range-labels">
              <span>Level 1</span><span>Level 2</span><span>Level 3</span><span>Level 4</span><span>Level 5</span>
            </div>
          </div>
          <label className="field-label">
            Language
            <button className="select-button">English <ChevronDown size={16} /></button>
          </label>
          <div className="control-group text-size">
            <label>Text size <Info size={15} /></label>
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
            <label>Contrast mode <Info size={15} /></label>
            <div><button>Standard</button><button className="active">High contrast</button></div>
          </div>
          <div className="segmented">
            <label>Reduce motion <Info size={15} /></label>
            <div><button className="active">On</button><button>Off</button></div>
          </div>
          <div className="segmented">
            <label>Caption style <Info size={15} /></label>
            <div><button className="active">Default</button><button>Large text</button><button>Dyslexic friendly</button></div>
          </div>
          <section className="sources">
            <h2>Sources</h2>
            {["FIFA Technical Report 2022", "Opta Event Data", "Accessibility Guidelines"].map((source) => (
              <a href="#" key={source}><FileText size={16} /> {source} <Link size={15} /></a>
            ))}
          </section>
        </aside>
      </section>

      <section className="bottom-band">
        <div className="panel pipeline">
          <h2>AI explanation pipeline <Info size={16} /></h2>
          <div className="pipeline-steps">
            <article><strong>IBM Granite</strong><span>Understand & summarize</span></article>
            <i />
            <article><strong>Docling</strong><span>Extract match data</span></article>
            <i />
            <article><strong>LangChain</strong><span>Orchestrate & generate</span></article>
            <i />
            <article><strong>Accessibility layer</strong><span>Adapt for all users</span></article>
          </div>
        </div>
        <div className="panel score-panel">
          <div className="score-ring"><strong>96%</strong></div>
          <div>
            <h2>Accessibility score <Info size={16} /></h2>
            <ul>
              {[
                "Screen reader friendly",
                "Plain language used",
                "Low cognitive load",
                "High contrast ready",
                "Captions available",
                "Keyboard navigable",
              ].map((item) => (
                <li key={item}><Check size={16} /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
