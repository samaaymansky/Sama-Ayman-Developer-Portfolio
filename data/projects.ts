import type { GameProject } from '../types';

import hallwayImg from '../assets/images/solitude_hallway_1790602071726.jpg';
import tvBedroomImg from '../assets/images/solitude_tv_bedroom_1790602086641.jpg';
import kitchenImg from '../assets/images/solitude_kitchen_1790602098631.jpg';
import bathroomImg from '../assets/images/solitude_bathroom_1790602110324.jpg';
import logoImg from '../assets/images/LIMITS Studios(2).png';

import nullCoverImg from '../assets/images/null_roblox_psych_horror_1790602687899.jpg';
import nullTerminalImg from '../assets/images/null_terminal_glitch_1790602719625.jpg';

import sevenMinCoverImg from '../assets/images/seven_minutes_action_horror_1790602704262.jpg';
import sevenMinBunkerImg from '../assets/images/seven_min_bunker_1790602735735.jpg';

export {
  logoImg,
  hallwayImg,
  tvBedroomImg,
  kitchenImg,
  bathroomImg,
  nullCoverImg,
  nullTerminalImg,
  sevenMinCoverImg,
  sevenMinBunkerImg
};

export const WORK_ORDER = ['solitude', 'null', '7minutes'];

export const GAMES: Record<string, GameProject> = {
  solitude: {
    id: 'solitude',
    title: 'SOLITUDE',
    subgenre: 'Psychological Horror',
    status: 'live',
    statusLabel: 'Released',
    engine: 'Roblox',
    genre: 'Horror',
    tagline: 'Four nights in an empty house. Ordinary routines turn into quiet paranoia.',
    desc: 'A four-night psychological-horror experience about a house that slowly stops feeling familiar.',
    thumb: hallwayImg,
    banner: hallwayImg,
    meta: [
      { label: 'Device', value: 'All' },
      { label: 'Engine', value: 'Roblox' },
      { label: 'Genre', value: 'Horror' },
      { label: 'Release date', value: '09/01/2025' },
      { label: 'Trailer', value: 'Watch on YouTube', link: 'https://youtube.com' },
      { label: 'Game link', value: 'Play on Roblox', link: 'https://roblox.com' }
    ],
    overview: [
      'Four nights. One house. Every task is familiar, yet nothing feels as it should. Experience the quiet shift of reality as the house changes around you and entirely on your own.',
      'The game is focused on exploring four designed houses, each filled with tasks that seem ordinary at first but slowly twist into unsettling challenges. Players must complete these tasks in a specific order, uncovering subtle patterns and eerie details that hint at a deeper, psychological narrative. As the environment reacts to their choices, tension builds, and familiar spaces begin to feel unpredictable. Voiceovers and narrative cues guide the experience, creating an atmosphere of suspense that keeps players on edge while testing their perception, intuition, and decision-making.'
    ],
    mechanicsHighlights: [
      {
        title: 'Task Systems & Sequencing',
        description: 'Interactive chores around the house that ground the player before reality begins slipping.'
      },
      {
        title: 'Atmospheric Lighting & Audio',
        description: 'Evolving cold moonlight, subtle floorboard creaks, and long shadows that build tension without screamers.'
      },
      {
        title: 'Objective Checklist UI',
        description: 'A dynamic checklist that subtly guides exploration and reflects psychological shifts.'
      }
    ],
    features: [
      {
        title: 'Interaction Loop & Task Flow',
        text: 'The full interaction loop for the nights is fully integrated. All proximity-based tasks — brushing teeth, dusting, playing music, and washing dishes — are connected to the central task controller with dedicated timing, animations, and completion feedback. This sequence establishes deliberate pacing and atmosphere, transforming the project from isolated mechanics into a cohesive gameplay experience.',
        image: bathroomImg,
        caption: 'Night 1 — task: brush teeth'
      },
      {
        title: 'Lighting & Atmosphere Tuning',
        text: 'The atmosphere of the nights is defined through targeted lighting and environmental adjustments. Low-intensity lighting, precise shadow placement, and controlled color variation create a quiet sense of tension, giving the feeling of being watched without any explicit threat. These lighting passes shift the tone dramatically, making the house feel lived-in and subtly unsettling. Lighting now evolves as the player progresses, reinforcing psychological buildup without relying on jump scares.',
        image: tvBedroomImg,
        caption: 'Night 2 — living room'
      },
      {
        title: 'Objective Checklist System',
        text: 'The checklist UI guides players through tasks in the correct order. Tasks appear, update, and disappear dynamically, providing clear structure to the player\'s routine and subtle cues about progress. Even as a prototype, it improves clarity and pacing, supporting the first playable sequence while establishing a foundation for future visual polish and added personality.',
        image: hallwayImg,
        caption: 'Objective checklist UI'
      }
    ],
    gallery: [
      { image: tvBedroomImg, caption: 'Title sequence — bedroom television' },
      { image: hallwayImg, caption: 'Hallway — approaching the lit room' },
      { image: kitchenImg, caption: 'Kitchen, after dark' },
      { image: bathroomImg, caption: 'Night 1 — bathroom' },
      { image: tvBedroomImg, caption: 'Night 2 — living room' },
      { image: hallwayImg, caption: 'Objective checklist UI' }
    ]
  },
  'null': {
    id: 'null',
    title: 'NULL',
    subgenre: 'Psychological Horror',
    status: 'progress',
    statusLabel: 'Under development',
    engine: 'Roblox (Luau)',
    genre: 'Horror',
    tagline: 'Broken memory fragments and shifting corridors in an abandoned facility.',
    desc: 'An unannounced horror project currently in early development.',
    thumb: nullCoverImg,
    banner: nullTerminalImg,
    meta: [
      { label: 'Platform', value: 'Roblox' },
      { label: 'Genre', value: 'Horror' },
      { label: 'Status', value: 'Under development' }
    ],
    overview: [],
    mechanicsHighlights: [],
    features: [],
    gallery: []
  },
  '7minutes': {
    id: '7minutes',
    title: '7 minutes',
    subgenre: 'Action Horror',
    status: 'planned',
    statusLabel: 'Upcoming',
    engine: 'Unity',
    genre: 'Horror',
    tagline: '7 minutes before containment lockdown. Scavenge, fight, and breach the blast doors.',
    desc: 'A short-form horror concept planned for future development.',
    thumb: sevenMinCoverImg,
    banner: sevenMinBunkerImg,
    meta: [
      { label: 'Engine', value: 'Unity' },
      { label: 'Genre', value: 'Horror' },
      { label: 'Status', value: 'Upcoming' }
    ],
    overview: [],
    mechanicsHighlights: [],
    features: [],
    gallery: []
  }
};

export const SKILLS = [
  { name: 'Task systems & sequencing' },
  { name: 'Interactive environments' },
  { name: 'UI & player guidance' },
  { name: 'Lighting & atmosphere' },
  { name: 'Progression design' },
  { name: 'Prototyping & rapid iteration' },
  { name: 'Story & tone integration' }
];
