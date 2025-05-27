import { format } from 'date-fns';

// Interface for reading data (matching API route)
interface Reading {
  type: string;
  notation: string;
}

// Mysteries arrays
const mystery_joyful = ['Annunciation', 'Visitation', 'Nativity', 'Presentation', 'Finding of Jesus at the Temple'];
const mystery_sorrowful = ['Agony in the Garden', 'Scourging at the Pillar', 'Crowning with Thorns', 'Carrying of the Cross', 'Crucifixion'];
const mystery_glorious = ['Resurrection', 'Ascension', 'Descent of the Holy Spirit upon the Apostles', 'Assumption of Our Lady', 'Coronation'];
const mystery_luminous = ['Baptism of Jesus at the River Jordan', 'Wedding at Cana', 'Proclamation of the Kingdom of God', 'Transfiguration', 'Institution of the Eucharist'];

// Function to determine Rosary Mysteries based on the day
function getRosaryMysteries(date: Date): { type: string; mysteries: string[] } {
  const day = date.getDay();
  switch (day) {
    case 1: // Monday
    case 6: // Saturday
      return { type: 'Joyful Mysteries', mysteries: mystery_joyful };
    case 2: // Tuesday
    case 5: // Friday
      return { type: 'Sorrowful Mysteries', mysteries: mystery_sorrowful };
    case 3: // Wednesday
    case 0: // Sunday
      return { type: 'Glorious Mysteries', mysteries: mystery_glorious };
    case 4: // Thursday
      return { type: 'Luminous Mysteries', mysteries: mystery_luminous };
    default:
      return { type: 'Joyful Mysteries', mysteries: mystery_joyful }; // Fallback
  }
}

// Main Server Component
export default async function Home() {
 // Dynamically construct the fetch URL using the environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/readings`, {
    cache: 'no-store',
  });

  // Handle fetch errors gracefully
  if (!res.ok) {
    throw new Error(`Failed to fetch readings: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const readings: Reading[] = data.readings || [];

  // Get current date and mysteries
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');
  const { type: mysteryType, mysteries } = getRosaryMysteries(today);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient">
      <div className="container mx-auto p-4">
        {/* Date Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          {formattedDate}
        </h1>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bible Readings Section */}
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Daily Bible Readings</h2>
            {readings.length > 0 ? (
              <ul className="space-y-4">
                {readings.map((reading, index) => (
                  <li key={index}>
                    <p className="text-gray-600">{reading.type}</p>
                    <p className="text-lg font-medium text-gray-700">{reading.notation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No readings available for today.</p>
            )}
          </div>

          {/* Rosary Mysteries Section */}
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{mysteryType}</h2>
            <ul className="list-disc list-inside space-y-2">
              {mysteries.map((mystery, index) => (
                <li key={index} className="text-gray-600">{mystery}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-4 py-1 rounded shadow text-xs text-gray-600'>
              Made with ❤️ by <a href="https://jonathanc.vercel.app" className="text-blue-500 hover:underline">Jonathan Correa</a>
        </div>
      </div>
    </div>
  );
}