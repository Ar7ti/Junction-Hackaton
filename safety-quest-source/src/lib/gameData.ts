// Safety Quest — game content modelled on the "Become a Risk Detective" concept.

export type Mechanic = "spot" | "sort" | "chain" | "action" | "story";

export interface SpotItem {
  emoji: string;
  label: string;
  x: number; // percent
  y: number; // percent
  hazard: boolean;
  praise?: string; // shown when a hazard is found
  fix?: string; // what to do about it
}

export interface SortCard {
  emoji: string;
  text: string;
  safe: boolean;
  why: string;
}

export interface ActionStep {
  situation: string;
  emoji: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

export interface StoryStep {
  text: string;
  speaker?: string;
  choices: { text: string; correct: boolean; feedback: string }[];
}

export interface Scenario {
  id: string;
  levelId: number;
  title: string;
  emoji: string;
  mechanic: Mechanic;
  mechanicLabel: string;
  intro: string;
  objective: string;
  talkAboutIt: string[];
  // mechanic payloads
  sceneLabel?: string;
  spotItems?: SpotItem[];
  sortCards?: SortCard[];
  chain?: string[]; // correct order of cause cards
  chainHint?: string;
  actionSteps?: ActionStep[];
  storySteps?: StoryStep[];
}

export interface Level {
  id: number;
  name: string;
  ages: string;
  tagline: string;
  skill: string;
  emoji: string;
  color: "sky" | "grass" | "berry";
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Little Safety Explorers",
    ages: "Ages 5–7",
    tagline: "Explore SafeTown and spot the hazards!",
    skill: "I can spot something dangerous.",
    emoji: "🧭",
    color: "sky",
  },
  {
    id: 2,
    name: "Safety Detectives",
    ages: "Ages 8–11",
    tagline: "Investigate Northstar and find what caused it.",
    skill: "I understand why something is dangerous and how to prevent it.",
    emoji: "🔎",
    color: "grass",
  },
  {
    id: 3,
    name: "Safety Leaders",
    ages: "Ages 12–15",
    tagline: "Analyse situations and prevent accidents before they happen.",
    skill: "I can analyse a situation, identify multiple risks and decide how to prevent them.",
    emoji: "🛡️",
    color: "berry",
  },
];

export const SCENARIOS: Scenario[] = [
  // ---------- LEVEL 1 ----------
  {
    id: "safe-home",
    levelId: 1,
    title: "The Safe Home",
    emoji: "🏠",
    mechanic: "spot",
    mechanicLabel: "Spot the Risk",
    intro:
      "The family is about to leave for the day — but little hazards are hiding around the house! Tap everything that could be dangerous.",
    objective: "Recognise hazards instead of memorising rules.",
    sceneLabel: "The family living room",
    spotItems: [
      { emoji: "🧸", label: "Toy on the stairs", x: 18, y: 72, hazard: true, praise: "Good spotting! Someone could trip on the stairs.", fix: "Put the toy back in the toy box." },
      { emoji: "☕", label: "Hot drink near the edge", x: 62, y: 30, hazard: true, praise: "Well done! A hot drink near the edge could spill and burn someone.", fix: "Move it to the middle of the table." },
      { emoji: "💧", label: "Wet floor", x: 45, y: 82, hazard: true, praise: "Great eyes! A wet floor is slippery.", fix: "Wipe it up or put out a warning sign." },
      { emoji: "🔋", label: "Small battery within reach", x: 80, y: 68, hazard: true, praise: "Clever detective! Small objects are dangerous for little children.", fix: "Move it somewhere high up." },
      { emoji: "🕯️", label: "Candle burning alone", x: 88, y: 22, hazard: true, praise: "Super spotting! A candle should never burn unattended.", fix: "Ask an adult to blow it out." },
      { emoji: "🛋️", label: "Sofa", x: 30, y: 40, hazard: false },
      { emoji: "🪴", label: "Plant", x: 8, y: 25, hazard: false },
      { emoji: "📺", label: "TV", x: 50, y: 12, hazard: false },
      { emoji: "🐱", label: "Cat", x: 68, y: 85, hazard: false },
    ],
    talkAboutIt: [
      "You spotted trip hazards and burn risks!",
      "Look around your home together: can you find three things someone could trip over?",
      "Where do hot drinks belong in your kitchen?",
    ],
  },
  {
    id: "bike-adventure",
    levelId: 1,
    title: "Bike Adventure",
    emoji: "🚲",
    mechanic: "action",
    mechanicLabel: "Choose the Action",
    intro:
      "Your character is cycling to a friend's house. Help them get ready and make safe choices on the way!",
    objective: "Build basic road and cycling safety habits.",
    actionSteps: [
      {
        situation: "Before leaving, what does your character put on first?",
        emoji: "🚲",
        options: [
          { text: "A helmet 🪖", correct: true, feedback: "Yes! A helmet protects your head on every ride." },
          { text: "Headphones 🎧", correct: false, feedback: "Headphones block traffic sounds — save the music for later." },
          { text: "Nothing, just go!", correct: false, feedback: "Always gear up first: helmet, bright clothes, working lights." },
        ],
      },
      {
        situation: "You reach a crossing with a red light for bikes. What do you do?",
        emoji: "🚦",
        options: [
          { text: "Stop and wait for green", correct: true, feedback: "Exactly right — traffic lights keep everyone safe." },
          { text: "Go quickly before cars come", correct: false, feedback: "Never cross on red. Drivers might not see you in time." },
          { text: "Close your eyes and pedal", correct: false, feedback: "Always watch the road — eyes open, attention up!" },
        ],
      },
      {
        situation: "A friend calls your name from across the street while you ride. What now?",
        emoji: "📣",
        options: [
          { text: "Stop safely first, then wave", correct: true, feedback: "Perfect — stop before you look away from the road." },
          { text: "Wave while riding fast", correct: false, feedback: "Waving while riding means one hand off and eyes off the road." },
          { text: "Shout back and keep riding", correct: false, feedback: "Distractions cause accidents. Stop first, chat second." },
        ],
      },
      {
        situation: "It's getting dark on the way home. What helps drivers see you?",
        emoji: "🌙",
        options: [
          { text: "Lights and reflectors ✨", correct: true, feedback: "Bright idea! Lights and reflectors make you visible in the dark." },
          { text: "Dark clothes", correct: false, feedback: "Dark clothes make you nearly invisible at night." },
          { text: "Riding faster", correct: false, feedback: "Speed doesn't help drivers see you — visibility does." },
        ],
      },
    ],
    talkAboutIt: [
      "You prepared for a safe ride!",
      "Together: check your family's bikes — do the lights and brakes work?",
      "Where is your helmet right now? Does it still fit?",
    ],
  },
  {
    id: "beach-water",
    levelId: 1,
    title: "Beach & Water Adventure",
    emoji: "🌊",
    mechanic: "sort",
    mechanicLabel: "Safe or Risky?",
    intro:
      "It's a sunny day by the water! Sort each situation: is it 🟢 SAFE or 🔴 RISKY?",
    objective: "Learn water safety — and always know when to get an adult.",
    sortCards: [
      { emoji: "🧑‍🤝‍🧑", text: "Swimming near a supervising adult", safe: true, why: "An adult can help straight away if something goes wrong." },
      { emoji: "🌊", text: "Going into unknown water alone", safe: false, why: "You can't see how deep it is or if there are currents." },
      { emoji: "🛟", text: "Wearing a life jacket in a boat", safe: true, why: "A life jacket keeps you floating even if you fall in." },
      { emoji: "🏊", text: "Swimming far out to a buoy alone", safe: false, why: "Even good swimmers get tired. Stay near shore and near adults." },
      { emoji: "📢", text: "Telling an adult if someone is in trouble", safe: true, why: "Getting help fast is the bravest and smartest thing to do." },
      { emoji: "🤿", text: "Jumping in to rescue a friend alone", safe: false, why: "Never jump in after someone — call an adult or emergency number instead." },
      { emoji: "🧴", text: "Putting on sunscreen before playing", safe: true, why: "Sunburn is a risk too — sunscreen protects your skin." },
      { emoji: "🍦", text: "Running on wet, slippery pool tiles", safe: false, why: "Wet tiles are super slippery — walk, don't run." },
    ],
    talkAboutIt: [
      "You sorted safe and risky water situations!",
      "Talk together: who watches the children when your family swims?",
      "Practise: what would you shout or do if a friend was in trouble in water?",
    ],
  },
  // ---------- LEVEL 2 ----------
  {
    id: "playground-mystery",
    levelId: 2,
    title: "The Playground Mystery",
    emoji: "🛝",
    mechanic: "chain",
    mechanicLabel: "Build the Risk Chain",
    intro:
      "A child fell at the Northstar playground. Don't just find the accident — find what caused it! Tap the clues in the order they happened to build the risk chain.",
    objective: "See how several small risks combine into an accident.",
    chainHint: "It rained this morning, and the playground was busy…",
    chain: [
      "🌧️ Rain made the surface wet",
      "👟 Worn shoes with smooth soles",
      "🏃 Running fast between equipment",
      "😬 Slipped on the wet surface",
      "🤕 The fall happened",
    ],
    talkAboutIt: [
      "You found the whole risk chain — not just the fall!",
      "Risk Detective Challenge: what is one accident that could happen in our home, and what could we change to reduce the risk?",
      "Next time at a playground, check the surface before running.",
    ],
  },
  {
    id: "winter-radar",
    levelId: 2,
    title: "Winter Challenge",
    emoji: "❄️",
    mechanic: "spot",
    mechanicLabel: "Risk Radar",
    intro:
      "It's a dark Finnish winter afternoon and you're walking home. Your Risk Radar is pinging — tap every hazard hiding in the snowy street!",
    objective: "Identify changing risks in winter conditions.",
    sceneLabel: "A snowy street at dusk",
    spotItems: [
      { emoji: "🧊", label: "Icy patch on the pavement", x: 35, y: 80, hazard: true, praise: "Radar locked on! Ice means: slow down or choose a safer route.", fix: "Walk slowly or go around it." },
      { emoji: "🌑", label: "Dark, unlit stretch of road", x: 75, y: 20, hazard: true, praise: "Good catch! Poor visibility means drivers can't see you.", fix: "Wear reflectors and stay on lit paths." },
      { emoji: "❄️", label: "Snow pile blocking the view at a crossing", x: 60, y: 55, hazard: true, praise: "Sharp eyes! A blocked view at a crossing is dangerous.", fix: "Stop and move to a spot where you can see and be seen." },
      { emoji: "🧥", label: "Walker in all-dark clothing", x: 15, y: 45, hazard: true, praise: "Yes! Dark clothes in the dark = nearly invisible.", fix: "A reflector or bright jacket makes you visible." },
      { emoji: "🎧", label: "Headphones blocking traffic sounds", x: 88, y: 70, hazard: true, praise: "Exactly! You need to hear cars and bikes in winter.", fix: "Keep one ear free or lower the volume." },
      { emoji: "🚗", label: "Parked car", x: 25, y: 15, hazard: false },
      { emoji: "🌲", label: "Spruce tree", x: 92, y: 40, hazard: false },
      { emoji: "🏠", label: "House", x: 48, y: 25, hazard: false },
    ],
    talkAboutIt: [
      "Your Risk Radar found the winter hazards!",
      "Together: count how many reflectors your family owns. Where are they?",
      "Plan the safest, best-lit walking route home from school or hobbies.",
    ],
  },
  {
    id: "digital-distraction",
    levelId: 2,
    title: "Digital Distraction",
    emoji: "📱",
    mechanic: "story",
    mechanicLabel: "Focus Mode",
    intro:
      "Aleksi is walking to football practice and his phone keeps buzzing. Decide when it's time to switch to Focus Mode!",
    objective: "Learn that distraction can turn an ordinary situation dangerous.",
    storySteps: [
      {
        text: "Aleksi is walking on the pavement. A funny video message arrives from a friend.",
        speaker: "📱 Buzz!",
        choices: [
          { text: "Watch it while walking", correct: false, feedback: "Even on the pavement, watching a screen means missing curbs, bikes and other people." },
          { text: "Pocket the phone and watch it at practice", correct: true, feedback: "Smart! The video will still be funny in ten minutes." },
        ],
      },
      {
        text: "He reaches a busy road crossing. His phone buzzes again — this time it's mum calling.",
        speaker: "🚦",
        choices: [
          { text: "Answer while crossing", correct: false, feedback: "A crossing needs 100% attention — even a call from mum can wait 20 seconds." },
          { text: "Cross first, then call mum back from the other side", correct: true, feedback: "Exactly right. Cross with full attention, then talk safely." },
        ],
      },
      {
        text: "On the bike path, Aleksi wants to reply to a message while cycling slowly.",
        speaker: "🚲",
        choices: [
          { text: "Type a quick reply — he's going slowly anyway", correct: false, feedback: "Typing while cycling means no hands ready to brake and no eyes on the path." },
          { text: "Stop at the side, then reply", correct: true, feedback: "Perfect Focus Mode: stop fully, then use the phone." },
        ],
      },
    ],
    talkAboutIt: [
      "You helped Aleksi stay focused!",
      "Family challenge: agree on phone-free moments (crossings, cycling, stairs).",
      "What could you say to a friend who texts while cycling?",
    ],
  },
  {
    id: "emergency-decision",
    levelId: 2,
    title: "Emergency Decision",
    emoji: "🚨",
    mechanic: "action",
    mechanicLabel: "Choose the Action",
    intro:
      "At the skate park, another child has fallen and isn't getting up. Choose the right response — remember: helping never means putting yourself in danger.",
    objective: "Practise seeking appropriate help safely.",
    actionSteps: [
      {
        situation: "You see the fall happen. What is the very first thing to do?",
        emoji: "🛹",
        options: [
          { text: "Stay calm and look at the situation", correct: true, feedback: "Yes — a calm head makes the best decisions." },
          { text: "Run away, it's scary", correct: false, feedback: "It's okay to feel scared, but someone needs help. Stay calm and get an adult." },
          { text: "Shake them to wake them up", correct: false, feedback: "Never move or shake an injured person — that can make injuries worse." },
        ],
      },
      {
        situation: "The child is lying near a ramp where others are still skating. What next?",
        emoji: "⚠️",
        options: [
          { text: "Shout to the skaters to stop and keep the area clear", correct: true, feedback: "Good thinking — preventing more danger comes first." },
          { text: "Drag the child away from the ramp", correct: false, feedback: "Don't move an injured person. Make the area safe instead." },
          { text: "Start filming it", correct: false, feedback: "Someone needs help — filming helps no one. Get an adult." },
        ],
      },
      {
        situation: "The child isn't responding. There is no adult nearby. What do you do?",
        emoji: "📞",
        options: [
          { text: "Call 112 (emergency number) and explain what happened", correct: true, feedback: "Exactly right. 112 operators will guide you step by step." },
          { text: "Wait and see if they wake up", correct: false, feedback: "An unresponsive person needs help immediately — call 112." },
          { text: "Try to give them water", correct: false, feedback: "Never give food or drink to an injured or unresponsive person." },
        ],
      },
      {
        situation: "The ambulance is on its way. What is the best thing you can do now?",
        emoji: "🚑",
        options: [
          { text: "Stay nearby, talk calmly to them, and wave down the ambulance", correct: true, feedback: "Perfect — you helped without ever putting yourself in danger." },
          { text: "Leave, your job is done", correct: false, feedback: "Staying until help arrives means you can guide the paramedics to the spot." },
          { text: "Try first aid you saw in a movie", correct: false, feedback: "Only do what the 112 operator tells you. Movie first aid can cause harm." },
        ],
      },
    ],
    talkAboutIt: [
      "You handled an emergency the safe way!",
      "Together: does everyone in the family know the emergency number 112?",
      "Role-play: practise what you would say to a 112 operator.",
    ],
  },
  // ---------- LEVEL 3 ----------
  {
    id: "event-safety",
    levelId: 3,
    title: "Event Safety",
    emoji: "🎪",
    mechanic: "spot",
    mechanicLabel: "Risk Assessment",
    intro:
      "You're a Safety Leader for the big community festival. Before the gates open, walk the site and flag every risk — some are obvious, some aren't.",
    objective: "Identify multiple risks and think about prevention before something happens.",
    sceneLabel: "The festival site, one hour before opening",
    spotItems: [
      { emoji: "🔌", label: "Extension cable across a walkway", x: 40, y: 78, hazard: true, praise: "Flagged! Trip hazard plus electrical risk — a double problem.", fix: "Reroute or cover the cable and mark it clearly." },
      { emoji: "🌩️", label: "Storm forecast for the afternoon", x: 80, y: 10, hazard: true, praise: "Good risk thinking — weather changes the whole safety picture.", fix: "Brief the team and prepare a shelter/evacuation plan." },
      { emoji: "🚪", label: "Emergency exit blocked by crates", x: 10, y: 30, hazard: true, praise: "Critical find! Exits must stay clear at all times.", fix: "Clear it now and check again during the event." },
      { emoji: "💡", label: "Unlit path to the toilets", x: 65, y: 60, hazard: true, praise: "Nice catch — poor lighting causes trips after dark.", fix: "Add temporary lights before evening." },
      { emoji: "🔥", label: "Food stall grill near the queue", x: 25, y: 55, hazard: true, praise: "Sharp! Fire risk right next to a crowd.", fix: "Move the grill or barrier off the cooking area." },
      { emoji: "👥", label: "Single narrow entrance for the whole crowd", x: 90, y: 82, hazard: true, praise: "Crowd-flow thinking — that's real safety leadership.", fix: "Open a second gate and add queue barriers." },
      { emoji: "🎪", label: "Main stage tent", x: 50, y: 25, hazard: false },
      { emoji: "🚻", label: "Toilet signs", x: 72, y: 45, hazard: false },
      { emoji: "🎈", label: "Balloon stand", x: 15, y: 70, hazard: false },
    ],
    talkAboutIt: [
      "You assessed the festival like a real safety professional.",
      "Risk Detective Challenge: pick one event or place you know — what are its three biggest risks?",
      "For each risk you found: how likely is it, how serious could it be, and who should be told?",
    ],
  },
  {
    id: "sports-challenge",
    levelId: 3,
    title: "The Sports Challenge",
    emoji: "🏃",
    mechanic: "story",
    mechanicLabel: "Decision Story",
    intro:
      "Your teammate Venla twisted her ankle but wants to keep playing — the final is in ten minutes and everyone is counting on her. Navigate the social pressure and choose your words.",
    objective: "See how peer pressure affects safety decisions — and practise speaking up.",
    storySteps: [
      {
        text: "Venla is limping but says: 'It's nothing. I'm playing. Don't tell anyone.'",
        speaker: "Venla",
        choices: [
          { text: "'Okay, your call.' — drop it", correct: false, feedback: "Playing on an injured ankle can turn a small sprain into months of recovery." },
          { text: "'Are you okay? That limp looks real. Let's get it checked.'", correct: true, feedback: "Good — you showed care without backing down." },
          { text: "'You're being selfish, sit out!'", correct: false, feedback: "Attacking her makes her dig in. Care works better than blame." },
        ],
      },
      {
        text: "Venla insists: 'If I sit out, we lose. The team needs me.' Other teammates are listening.",
        speaker: "Venla",
        choices: [
          { text: "'Maybe you should tell the coach. Let the coach decide.'", correct: true, feedback: "Exactly — moving the decision to a responsible adult takes the pressure off both of you." },
          { text: "'Fine, but don't blame me if it gets worse.'", correct: false, feedback: "That still leaves an injured player on the field — the risk hasn't changed." },
          { text: "Say nothing and let her play", correct: false, feedback: "Silence under peer pressure is how small injuries become big ones." },
        ],
      },
      {
        text: "Venla gets angry: 'You just don't want us to win!' How do you respond?",
        speaker: "Venla",
        choices: [
          { text: "'I want you to be able to play next season too. Let's get an adult to check it.'", correct: true, feedback: "Perfect — you kept the friendship and the safety line at the same time." },
          { text: "'Whatever, do what you want.'", correct: false, feedback: "Walking away ends the conflict but not the risk." },
          { text: "Shout at her in front of everyone", correct: false, feedback: "Public pressure escalates. Calm, private, persistent wins." },
        ],
      },
    ],
    talkAboutIt: [
      "You handled real social pressure and kept someone safe.",
      "Talk together: why is it hard to speak up to friends? What makes it easier?",
      "Who are the adults you'd go to at your own hobbies if something felt wrong?",
    ],
  },
  {
    id: "home-emergency",
    levelId: 3,
    title: "Home Emergency",
    emoji: "🔥",
    mechanic: "action",
    mechanicLabel: "Choose the Action",
    intro:
      "You're home alone and smell something burning. There's a faint haze near the kitchen outlet. Make the right calls — in the right order.",
    objective: "Recognise warning signs and act without creating additional danger.",
    actionSteps: [
      {
        situation: "You smell burning and see a wisp of smoke near an electrical outlet. First move?",
        emoji: "💨",
        options: [
          { text: "Alert anyone else at home and move toward the exit", correct: true, feedback: "Right — people first, and never deeper into the danger zone." },
          { text: "Open the outlet to look inside", correct: false, feedback: "Never touch suspect electrical equipment — that's how shocks and burns happen." },
          { text: "Throw water on the outlet", correct: false, feedback: "Water and electricity are a deadly mix. Never use water on electrical fires." },
        ],
      },
      {
        situation: "The haze is growing. You're near the front door. What now?",
        emoji: "🚪",
        options: [
          { text: "Leave the flat, close the door behind you, and call 112 from outside", correct: true, feedback: "Textbook response — out, door closed (slows the fire), then call." },
          { text: "Grab your valuables first", correct: false, feedback: "Things can be replaced. Seconds matter — get out first." },
          { text: "Try to smother it with a blanket", correct: false, feedback: "Never fight a fire yourself. Leave, close the door, call 112." },
        ],
      },
      {
        situation: "You're safely outside and have called 112. Anything else useful?",
        emoji: "📞",
        options: [
          { text: "Warn neighbours and wait outside to guide the fire crew", correct: true, feedback: "Exactly — you helped others without ever going back inside." },
          { text: "Go back in to check if it's out", correct: false, feedback: "Never re-enter a building with a fire risk — smoke can knock you out in seconds." },
          { text: "Post about it online", correct: false, feedback: "Warn real people nearby first — social media can wait." },
        ],
      },
    ],
    talkAboutIt: [
      "You responded to a home emergency without ever creating extra danger.",
      "Together: walk your home's escape routes. Where does the family meet outside?",
      "Check together: do the smoke detectors work? Test one today.",
    ],
  },
  {
    id: "risk-investigator",
    levelId: 3,
    title: "The Risk Investigator",
    emoji: "🔎",
    mechanic: "chain",
    mechanicLabel: "Build the Risk Chain",
    intro:
      "Final mission: a cyclist was hit by a car at a junction — luckily with only bruises. You have the evidence: witness statements, photos, weather data. Reconstruct the chain of preventable factors. The goal is not blame — it's prevention.",
    objective: "Analyse an accident to find preventable factors, not someone to blame.",
    chainHint: "It was a dark November evening, and the street light at the junction had been broken for a week…",
    chain: [
      "💡 Broken street light reported but not repaired",
      "🌧️ Rain and darkness reduced visibility",
      "🚲 Cyclist in dark clothing, no reflectors",
      "🚗 Driver didn't see the cyclist until the last moment",
      "💥 The collision happened",
    ],
    talkAboutIt: [
      "You found the preventable factors — every link in that chain could have been broken.",
      "Discuss: which link was the easiest to fix? Who could have fixed it?",
      "Notice how nobody 'deserved' the accident — prevention is everyone's job, including the town's.",
    ],
  },
];

export const BADGES = [
  { id: "first-find", emoji: "⭐", name: "First Find", desc: "Found your first hazard" },
  { id: "level1", emoji: "🧭", name: "Safety Explorer", desc: "Completed all Level 1 scenarios" },
  { id: "level2", emoji: "🔎", name: "Safety Detective", desc: "Completed all Level 2 scenarios" },
  { id: "level3", emoji: "🛡️", name: "Safety Leader", desc: "Completed all Level 3 scenarios" },
  { id: "all", emoji: "🏆", name: "Risk Detective Master", desc: "Completed every scenario in Safety Quest" },
];

export function scenariosForLevel(levelId: number): Scenario[] {
  return SCENARIOS.filter((s) => s.levelId === levelId);
}
