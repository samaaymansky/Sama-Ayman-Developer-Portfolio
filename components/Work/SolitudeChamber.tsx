import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { 
  hallwayImg, 
  tvBedroomImg, 
  kitchenImg, 
  bathroomImg 
} from '../../data/projects';
import { CheckSquare, Square, Volume2, ShieldAlert, Sparkles, Eye, Radio, Lock } from 'lucide-react';

interface SolitudeChamberProps {
  onOpenDetails: () => void;
}

export const SolitudeChamber: React.FC<SolitudeChamberProps> = ({ onOpenDetails }) => {
  const [activeRoom, setActiveRoom] = useState<'hallway' | 'living' | 'kitchen' | 'bathroom'>('hallway');
  const [lightsOff, setLightsOff] = useState<boolean>(false);
  const [anomaliesFound, setAnomaliesFound] = useState<Record<string, boolean>>({
    doors: false,
    radio: false,
    mirror: false,
    lights: false,
  });
  const [statusMessage, setStatusMessage] = useState<string>(
    'Night 1: The suburban house is quiet. Complete your evening chores before sleeping.'
  );

  const rooms = {
    hallway: {
      name: 'Second Floor Hallway',
      desc: 'Moonlight streams through the high window. The silence is heavy.',
      image: hallwayImg,
    },
    living: {
      name: 'Living Room TV',
      desc: 'The old television flickers with faint grey static in the dark corner.',
      image: tvBedroomImg,
    },
    kitchen: {
      name: 'Kitchen & Locks',
      desc: 'Cold tile floors. The back door lock rattles softly in the midnight draft.',
      image: kitchenImg,
    },
    bathroom: {
      name: 'Upstairs Bathroom',
      desc: 'The mirror reflects the open doorway behind you. Do not look too long.',
      image: bathroomImg,
    },
  };

  const handleRoomChange = (room: 'hallway' | 'living' | 'kitchen' | 'bathroom') => {
    sounds.playClick(500);
    setActiveRoom(room);
    if (room === 'living') {
      setStatusMessage('Living Room: The TV static hums quietly in the midnight dark.');
    } else if (room === 'kitchen') {
      setStatusMessage('Kitchen: The stainless steel counters reflect faint streetlights.');
    } else if (room === 'bathroom') {
      setStatusMessage('Bathroom: Remember the golden rule: keep routine, do not stare at the glass.');
    } else {
      setStatusMessage('Hallway: Cold floorboards creak underfoot.');
    }
  };

  const toggleTask = (key: string) => {
    const isChecked = !anomaliesFound[key];
    setAnomaliesFound(prev => ({ ...prev, [key]: isChecked }));

    if (key === 'doors') {
      sounds.playDoorLock();
      setStatusMessage(isChecked ? 'Back deadbolt latched tightly. Did you hear something outside?' : 'Door unlocked.');
    } else if (key === 'radio') {
      sounds.playStaticBurst();
      setStatusMessage(isChecked ? 'Radio dialed: muffled broadcast whispers through static frequencies.' : 'Radio turned off.');
    } else if (key === 'lights') {
      sounds.playClick(320);
      setLightsOff(!lightsOff);
      setStatusMessage(lightsOff ? 'Hallway lamp flickered on.' : 'Hallway lamp clicked off. Darkness deepens.');
    } else if (key === 'mirror') {
      sounds.playAnomalyChime();
      setStatusMessage(isChecked ? 'You looked into the mirror. The shadow behind you lingered for a second.' : 'You stepped away from the mirror.');
    }
  };

  return (
    <div className="mt-6 border border-slate-800 bg-[#07090e] p-5 sm:p-7">
      
      {/* Interactive Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="uppercase tracking-wider">Interactive Routine Chamber</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Domestic Dread Simulation</span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Test the core gameplay loop of SOLITUDE: domestic chores that slowly trigger psychological paranoia.
          </p>
        </div>

        {/* Room Switcher Tabs */}
        <div className="flex items-center gap-1 bg-black/60 p-1 border border-slate-800 shrink-0">
          {(['hallway', 'living', 'kitchen', 'bathroom'] as const).map(room => (
            <button
              key={room}
              type="button"
              onClick={() => handleRoomChange(room)}
              className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeRoom === room 
                  ? 'bg-slate-800 text-cyan-300 font-medium' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Viewport */}
        <div className="lg:col-span-7 relative overflow-hidden border border-slate-800 bg-black min-h-[260px] sm:min-h-[320px] flex items-center justify-center">
          <img
            src={rooms[activeRoom].image}
            alt={rooms[activeRoom].name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              lightsOff ? 'brightness-50 contrast-125' : 'brightness-90'
            }`}
          />

          {/* Vignette Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Overlay Status Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300 pointer-events-none">
            <div className="bg-black/75 backdrop-blur-sm px-2.5 py-1 border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{rooms[activeRoom].name}</span>
            </div>
            {lightsOff && (
              <span className="bg-red-950/80 text-red-300 px-2 py-0.5 border border-red-800/50 text-[10px]">
                LIGHTS: OFF
              </span>
            )}
          </div>

          {/* Room Ambient Description */}
          <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 bg-black/80 backdrop-blur-sm p-2.5 border border-white/10">
            <p className="font-sans leading-relaxed">{rooms[activeRoom].desc}</p>
          </div>
        </div>

        {/* Diegetic Night Routine Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Evening Routine Tasks</span>
            <span className="text-slate-500">Night 1 / 4</span>
          </div>

          <div className="space-y-2">
            
            {/* Task: Lock Doors */}
            <button
              type="button"
              onClick={() => toggleTask('doors')}
              className={`w-full text-left p-3 border transition-colors flex items-start gap-3 cursor-pointer ${
                anomaliesFound.doors 
                  ? 'border-cyan-500/40 bg-cyan-950/20 text-slate-200' 
                  : 'border-slate-800 bg-[#0d0f17] hover:border-slate-700 text-slate-300'
              }`}
            >
              {anomaliesFound.doors ? (
                <CheckSquare className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div className="text-xs font-mono">
                <div className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Double-check back kitchen deadbolt</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-sans">
                  The house settles quietly. Ensure no doors were left unlatched.
                </div>
              </div>
            </button>

            {/* Task: Tune Radio */}
            <button
              type="button"
              onClick={() => toggleTask('radio')}
              className={`w-full text-left p-3 border transition-colors flex items-start gap-3 cursor-pointer ${
                anomaliesFound.radio 
                  ? 'border-cyan-500/40 bg-cyan-950/20 text-slate-200' 
                  : 'border-slate-800 bg-[#0d0f17] hover:border-slate-700 text-slate-300'
              }`}
            >
              {anomaliesFound.radio ? (
                <CheckSquare className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div className="text-xs font-mono">
                <div className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tune analog radio to weather station</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-sans">
                  Background audio masks the creaking wood.
                </div>
              </div>
            </button>

            {/* Task: Turn off lamp */}
            <button
              type="button"
              onClick={() => toggleTask('lights')}
              className={`w-full text-left p-3 border transition-colors flex items-start gap-3 cursor-pointer ${
                lightsOff 
                  ? 'border-cyan-500/40 bg-cyan-950/20 text-slate-200' 
                  : 'border-slate-800 bg-[#0d0f17] hover:border-slate-700 text-slate-300'
              }`}
            >
              {lightsOff ? (
                <CheckSquare className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div className="text-xs font-mono">
                <div className="font-medium text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                  <span>Extinguish hallway night lamp</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-sans">
                  Toggles the room lighting into deep moonlight shadow.
                </div>
              </div>
            </button>

            {/* Task: Mirror check */}
            <button
              type="button"
              onClick={() => toggleTask('mirror')}
              className={`w-full text-left p-3 border transition-colors flex items-start gap-3 cursor-pointer ${
                anomaliesFound.mirror 
                  ? 'border-red-900/60 bg-red-950/20 text-red-200' 
                  : 'border-slate-800 bg-[#0d0f17] hover:border-slate-700 text-slate-300'
              }`}
            >
              {anomaliesFound.mirror ? (
                <CheckSquare className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div className="text-xs font-mono">
                <div className="font-medium text-slate-200 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-red-400/80" />
                  <span>Inspect upstairs bathroom mirror</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-sans">
                  The reflection looks ordinary... at first glance.
                </div>
              </div>
            </button>

          </div>

          {/* Interactive Log Output */}
          <div className="p-3 bg-black border border-slate-800 text-[11px] font-mono text-cyan-300 min-h-[46px] flex items-center">
            <span>&gt; {statusMessage}</span>
          </div>

          {/* Action Link */}
          <div className="pt-1 flex items-center justify-between">
            <a
              href="https://roblox.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick(600)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <span>Play SOLITUDE on Roblox →</span>
            </a>

            <button
              type="button"
              onClick={() => {
                sounds.playClick(600);
                onOpenDetails();
              }}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              <span>Read Game Dossier</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
