import type { GameProject, SkillItem } from '../types';
import {
  solitudeOfficialBanner,
  solitudeBanner1,
  solitudeBanner2,
  solitudeBanner3,
  solitudeNight1ToothBrushing,
  solitudeNight2LivingRoom,
  solitudeObjectiveChecklist,
  nullOfficialBanner,
  nullBanner,
  nullScene6,
  nullScene7,
  nullScene8,
  nullScene9,
  nullScene10,
  nullThumbnail1,
  nullThumbnail2,
  nullThumbnail3,
  nullThumbnail4,
  nullThumbnail5,
  nullThumbnail6,
  nullFeatureCloseup,
  nullFeatureCollectingSeashells,
  nullFeatureChoices,
  nullFeatureEndEntity,
  sevenMinutesCover,
  sevenMinutesBunker
} from './images';

export const GAMES: Record<string, GameProject> = {
  solitude: {
    id: 'solitude',
    title: 'SOLITUDE',
    subgenre: 'Psychological Horror',
    status: 'live',
    statusLabel: 'Released',
    engine: 'Roblox (Luau)',
    genre: 'Psychological Horror',
    tagline: 'Four nights in an empty house. Ordinary routines turn into quiet paranoia.',
    desc: 'You spend four nights alone in a suburban house. Everyday chores feel normal at first, but reality starts subtly slipping and the environment shifts around you.',
    thumb: solitudeOfficialBanner,
    banner: solitudeOfficialBanner,
    meta: [
      { label: 'Platform', value: 'Roblox' },
      { label: 'Engine', value: 'Luau' },
      { label: 'Subgenre', value: 'Psychological Horror' },
      { label: 'Release', value: 'Available Now' },
      { label: 'Game Link', value: 'Play on Roblox', link: 'https://roblox.com' },
      { label: 'Trailer', value: 'Watch Trailer', link: 'https://youtube.com' }
    ],
    overview: [
      'Four nights. One house. Every routine feels familiar, yet nothing stays normal. Solitude puts you alone inside a quiet suburban home where the tension builds through sound, shadows, and subtle anomalies rather than jumpscares.',
      'As you complete everyday tasks, from brushing teeth to cleaning dishes and checking windows, the house slowly reacts. Lights flicker, rooms feel slightly different each night, and the feeling of being watched grows steadily. Voiceovers and environmental clues guide the story as you try to make it through to morning.'
    ],
    mechanicsHighlights: [
      {
        title: 'Routine-Based Task Flow',
        description: 'Interactive chores around the house that ground the player before things start going wrong.'
      },
      {
        title: 'Evolving Night Lighting',
        description: 'Cold blue moonlight and deep shadows that creep further into the rooms with every passing night.'
      },
      {
        title: 'Diegetic Objective List',
        description: 'An in-game checklist that updates as you explore, giving structure while keeping tension high.'
      }
    ],
    features: [
      {
        title: 'Night 1: Task Interaction Loop',
        text: 'The full interaction loop for the nights is fully integrated. All proximity-based tasks, brushing teeth, dusting, playing music, and washing dishes, are connected to the central task controller with dedicated timing, animations, and completion feedback. This sequence establishes deliberate pacing and atmosphere, transforming the project from isolated mechanics into a cohesive gameplay experience.',
        image: solitudeNight1ToothBrushing,
        caption: 'Night 1, task brush teeth',
        imageFit: 'contain'
      },
      {
        title: 'Night 2: Living Room Lighting',
        text: 'The atmosphere of the nights is defined through targeted lighting and environmental adjustments. Low-intensity lighting, precise shadow placement, and controlled color variation create a quiet sense of tension, giving the feeling of being watched without any explicit threat. These lighting passes shift the tone dramatically, making the house feel lived-in and subtly unsettling. Lighting now evolves as the player progresses, reinforcing psychological buildup without relying on jump scares.',
        image: solitudeNight2LivingRoom,
        caption: 'Night 2, living room',
        imageFit: 'contain'
      },
      {
        title: 'Objective Checklist UI',
        text: 'The checklist UI guides players through tasks in the correct order. Tasks appear, update, and disappear dynamically, providing clear structure to the player’s routine and subtle cues about progress. Even as a prototype, it improves clarity and pacing, supporting the first playable sequence while establishing a foundation for future visual polish and added personality.',
        image: solitudeObjectiveChecklist,
        caption: 'Objective checklist UI',
        imageFit: 'contain'
      }
    ],
    gallery: [
      { image: solitudeBanner1, caption: 'Living room television static in the dark' },
      { image: solitudeBanner2, caption: 'Kitchen after dark' },
      { image: solitudeBanner3, caption: 'Night 2, master bedroom' }
    ]
  },
  null_game: {
    id: 'null_game',
    title: 'NULL',
    subgenre: 'Psychological Horror',
    status: 'live',
    statusLabel: 'Released',
    engine: 'Roblox (Luau)',
    genre: 'Psychological Horror',
    tagline: 'Broken memory fragments and shifting corridors in an abandoned facility.',
    desc: 'Our second psychological horror game on Roblox. NULL puts you into a glitching digital facility where rooms change behind your back and audio cues are your only real guide.',
    thumb: nullOfficialBanner,
    banner: nullOfficialBanner,
    meta: [
      { label: 'Platform', value: 'Roblox' },
      { label: 'Engine', value: 'Luau' },
      { label: 'Subgenre', value: 'Psychological Horror' },
      { label: 'Release', value: 'Available Now' },
      { label: 'Game Link', value: 'Play on Roblox', link: 'https://www.roblox.com/games/103669032372020/NULL' },
      { label: 'Trailer', value: 'Watch on YouTube', link: 'https://youtube.com' }
    ],
    overview: [
      "NULL is a psychological horror game centered on manipulation, control, and the illusion of free will. Through environmental storytelling, atmospheric sound design, and carefully paced exploration, the game gradually challenges the player's perception of safety and autonomy.",
      'The project focuses on creating psychological tension through atmosphere, narrative progression, and environmental cues rather than relying primarily on conventional horror elements.'
    ],
    mechanicsHighlights: [
      {
        title: 'Character Interactions',
        description: 'Character interactions that gradually reveal the underlying narrative.'
      },
      {
        title: 'Branching Dialogue',
        description: "Branching dialogue choices that shape the player's interactions with the NPC."
      },
      {
        title: 'Trigger-Based Events',
        description: 'Trigger-based events that activate narrative sequences and environmental interactions.'
      },
      {
        title: 'Sequential Objectives',
        description: 'Sequential objective progression that guides the player through the experience.'
      }
    ],
    features: [
      {
        title: 'Shoreline Conversation',
        text: 'A close-up during the shoreline conversation, highlighting the character and the uneasy atmosphere around the encounter.',
        image: nullFeatureCloseup,
        caption: 'A close-up during the shoreline conversation'
      },
      {
        title: 'Collecting Seashells',
        text: 'The player collects seashells along the shore as part of the objective.',
        image: nullFeatureCollectingSeashells,
        caption: 'Collecting seashells on the shoreline'
      },
      {
        title: 'Dialogue Choices',
        text: 'The conversation presents the player with choices that shape how they respond.',
        image: nullFeatureChoices,
        caption: 'Choosing a response during the conversation'
      },
      {
        title: 'The End Entity',
        text: 'The entity appears at the end of the experience, bringing the shoreline encounter to a close.',
        image: nullFeatureEndEntity,
        caption: 'The entity at the end of the experience'
      }
    ],
    gallery: [
      { image: nullThumbnail1, caption: 'Kitchen view' },
      { image: nullThumbnail2, caption: 'Upstairs hallway' },
      { image: nullThumbnail3, caption: 'Outside house view' },
      { image: nullThumbnail4, caption: 'Upfront house view' },
      { image: nullThumbnail5, caption: 'Shoreline view' },
      { image: nullThumbnail6, caption: 'Shoreline house view' }
    ]
  },
  seven_minutes: {
    id: 'seven_minutes',
    title: '7 MINUTES',
    subgenre: 'Action Horror',
    status: 'planned',
    statusLabel: 'Upcoming Unity Project',
    engine: 'Unity (C#)',
    genre: 'Action Horror',
    tagline: '7 minutes before containment lockdown. Scavenge, fight, and breach the blast doors.',
    desc: '7 MINUTES explores the 7-minute brain theory through different points of view in the same place.',
    thumb: sevenMinutesCover,
    banner: sevenMinutesBunker,
    meta: [
      { label: 'Platform', value: 'PC (Unity)' },
      { label: 'Engine', value: 'Unity 6 (C#)' },
      { label: 'Subgenre', value: 'Action Horror' },
      { label: 'Core Mechanic', value: 'Real-Time 7-Minute Escape Timer' },
      { label: 'Status', value: 'Design & Prototyping' }
    ],
    overview: [
      '7 MINUTES is our third title and our transition into Unity. While our first two games focused on quiet psychological dread, 7 MINUTES is built around fast, heart-pounding action horror.',
      'Trapped in a subterranean bunker after a catastrophic breach, an automated containment timer gives you 7 minutes before the entire facility incinerates. You must scavenge tools, weld doors shut, and fight off relentless creatures in tight corridors where every missed shot and wasted second brings you closer to zero.'
    ],
    mechanicsHighlights: [
      {
        title: 'Real-Time 7-Minute Clock',
        description: 'A physical countdown on your wrist device. Every puzzle, reload, and locked door burns precious time.'
      },
      {
        title: 'Tactical Door Barricading',
        description: 'Weld emergency blast doors to buy time while rerouting backup generator power.'
      },
      {
        title: 'Kinetic Combat & Stagger',
        description: 'Close-quarters gunplay and heavy melee hits that knock back enemies in tight bunker hallways.'
      }
    ],
    features: [
      {
        title: 'Ticking Clock Pressure',
        text: 'The 7-minute limit forces immediate decisions: do you take the long detour to find extra ammo, or sprint through an unlit service tunnel to save 40 seconds?',
        image: sevenMinutesCover,
        caption: 'Wrist countdown timer glowing in the subterranean gloom'
      },
      {
        title: 'Industrial Bunker Atmosphere',
        text: 'Built in Unity with heavy volumetric steam, flashing blue emergency lights, and echoey metallic sound effects that make every encounter tense and claustrophobic.',
        image: sevenMinutesBunker,
        caption: 'Corridor breach with active emergency beacon and steam leak'
      }
    ],
    gallery: [
      { image: sevenMinutesCover, caption: 'Subterranean facility countdown' },
      { image: sevenMinutesBunker, caption: 'Emergency beacon and steam hazard' },
      { image: sevenMinutesCover, caption: 'Close-up on player equipment' }
    ]
  }
};

export const SKILLS: SkillItem[] = [
  {
    id: 'game-mechanics',
    name: 'Game Mechanics & Feel',
    description: 'Designing responsive controls, interactive objects, and core loops that feel tactile and satisfying to play.',
    iconName: 'Gamepad2'
  },
  {
    id: 'horror-pacing',
    name: 'Horror Pacing & Tension',
    description: 'Balancing calm routine with creeping dread, building suspense through sound, environment, and timing rather than jumpscares.',
    iconName: 'Brain'
  },
  {
    id: 'roblox-luau',
    name: 'Roblox & Luau Development',
    description: 'Full-stack development on Roblox, building task systems, custom cameras, UI checklists, and audio management in Luau.',
    iconName: 'FileCode2'
  },
  {
    id: 'unity-csharp',
    name: 'Unity & C# Programming',
    description: 'Prototyping action mechanics, enemy pathfinding, inventory systems, and physics-based interactions in Unity.',
    iconName: 'Layers'
  },
  {
    id: 'lighting-atmosphere',
    name: 'Lighting & Atmosphere',
    description: 'Using moonlight, long shadows, and color grading to make spaces feel lived-in, lonely, and unsettling.',
    iconName: 'Lightbulb'
  },
  {
    id: 'spatial-audio',
    name: 'Audio Direction & Sound FX',
    description: 'Placing directional audio cues, ambient hums, and subtle sound triggers that make players hesitate at every corner.',
    iconName: 'Volume2'
  },
  {
    id: 'level-design',
    name: 'Level & Environmental Design',
    description: 'Designing natural layouts — from domestic homes to bunker corridors — with clear sightlines and memorable framing.',
    iconName: 'Box'
  },
  {
    id: 'playtesting-iteration',
    name: 'Rapid Prototyping & Playtesting',
    description: 'Building quick playable greyboxes to test mechanics, gathering player feedback, and tuning difficulty curves.',
    iconName: 'TrendingUp'
  }
];
