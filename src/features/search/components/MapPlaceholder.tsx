import { Text, View } from 'react-native';

type Percent = `${number}%`;

const STREET_ROWS: Percent[] = ['14%', '30%', '46%', '62%', '78%', '90%'];
const STREET_COLUMNS: Percent[] = ['16%', '42%', '68%', '90%'];

const BLOCKS: { top: Percent; left: Percent; width: Percent; height: Percent }[] = [
  { top: '2%', left: '2%', width: '11%', height: '10%' },
  { top: '2%', left: '20%', width: '18%', height: '10%' },
  { top: '2%', left: '46%', width: '20%', height: '10%' },
  { top: '2%', left: '72%', width: '14%', height: '10%' },
  { top: '17%', left: '2%', width: '11%', height: '11%' },
  { top: '17%', left: '20%', width: '18%', height: '11%' },
  { top: '17%', left: '46%', width: '20%', height: '11%' },
  { top: '17%', left: '72%', width: '14%', height: '11%' },
  { top: '33%', left: '20%', width: '18%', height: '11%' },
  { top: '33%', left: '46%', width: '20%', height: '11%' },
  { top: '33%', left: '72%', width: '14%', height: '11%' },
  { top: '49%', left: '2%', width: '11%', height: '11%' },
  { top: '49%', left: '20%', width: '18%', height: '11%' },
  { top: '49%', left: '46%', width: '20%', height: '11%' },
  { top: '65%', left: '2%', width: '11%', height: '11%' },
  { top: '65%', left: '20%', width: '18%', height: '11%' },
  { top: '65%', left: '46%', width: '10%', height: '11%' },
  { top: '80%', left: '2%', width: '11%', height: '8%' },
  { top: '80%', left: '20%', width: '18%', height: '8%' },
  { top: '80%', left: '46%', width: '20%', height: '8%' },
];

// A flat, schematic map look — the same "streets + building blocks" idea the
// design canvas itself fakes with SVG rects/lines for its own static
// prototype — recreated with plain Views instead, no image asset or new
// dependency (react-native-svg isn't installed).
function MapBackdrop() {
  return (
    <View className="absolute inset-0 overflow-hidden bg-[#e9e4da]">
      {BLOCKS.map((block) => (
        <View key={`${block.top}-${block.left}`} className="absolute rounded-sm bg-[#ded7c9]" style={block} />
      ))}
      {STREET_ROWS.map((top) => (
        <View key={top} className="absolute left-0 right-0 h-1.5 bg-[#d4cdbe]" style={{ top }} />
      ))}
      {STREET_COLUMNS.map((left) => (
        <View key={left} className="absolute bottom-0 top-0 w-1.5 bg-[#d4cdbe]" style={{ left }} />
      ))}
    </View>
  );
}

type MapPlaceholderProps = {
  message: string;
};

/** Shared by both "no real map here" cases: web (react-native-maps has no
 * web renderer at all) and, for now, native Android too (crashes hard on
 * mount without a Google Maps API key — see SearchMapView.tsx). */
export function MapPlaceholder({ message }: MapPlaceholderProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <MapBackdrop />
      <View className="rounded-2xl bg-white/90 px-5 py-4 shadow-lg">
        <Text className="text-center text-sm font-bold text-muted">{message}</Text>
      </View>
    </View>
  );
}
