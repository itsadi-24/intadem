import { useEffect, useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerIcon from './MarkerIcon';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PinDialog } from './PinDialog';
import { Loader2, MapPin } from 'lucide-react';
import { Trash2 } from 'lucide-react'; // Add this import
import { Button } from '@/components/ui/button';
interface Pin {
  id: number;
  position: [number, number];
  remark: string;
  address: string;
}

function MapEvents({
  onMapClick,
}: {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

export function MapComponent() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [newPin, setNewPin] = useState<Omit<Pin, 'id' | 'remark'> | null>(null);
  const [remark, setRemark] = useState('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  useEffect(() => {
    const savedPins = localStorage.getItem('pins');
    if (savedPins) {
      setPins(JSON.parse(savedPins));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pins', JSON.stringify(pins));
  }, [pins]);

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    setIsLoading(true);
    const { lat, lng } = e.latlng;
    let address = '';

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'PinDropApp/1.0',
          },
        }
      );
      address = response.data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      address = 'Address not found';
    }

    setNewPin({
      position: [lat, lng],
      address,
    });
    setDialogOpen(true);
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (newPin) {
      const pin: Pin = {
        ...newPin,
        remark,
        id: Date.now(),
      };
      setPins([...pins, pin]);
      setNewPin(null);
      setRemark('');
      setDialogOpen(false);
    }
  };
  console.log(selectedPin);

  const handlePinClick = (pin: Pin) => {
    if (map) {
      map.setView(pin.position, 15);
      setSelectedPin(pin);
    }
  };
  const handleDeletePin = (pinId: number) => {
    setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
  };
  const defaultCenter: [number, number] = useMemo(() => [51.505, -0.09], []);

  return (
    <div className='flex h-screen'>
      <Card className='w-96 p-4 m-4 h-[calc(100vh-2rem)]'>
        <div className='flex items-center mb-4'>
          <MapPin className='w-6 h-6 mr-2' />
          <h2 className='text-xl font-bold'>Saved Pins</h2>
        </div>
        <ScrollArea className='h-[calc(100vh-8rem)]'>
          <div className='pr-4 space-y-2'>
            {pins.length === 0 ? (
              <p className='text-center text-gray-500'>No pins saved yet</p>
            ) : (
              pins.map((pin) => (
                <Card
                  key={pin.id}
                  className='p-4 transition-all hover:bg-slate-50'
                >
                  <div className='flex items-start justify-between'>
                    <div
                      className='flex-1 cursor-pointer'
                      onClick={() => handlePinClick(pin)}
                    >
                      <h3 className='font-semibold'>
                        {pin.remark || 'Unnamed Location'}
                      </h3>
                      <p className='mt-1 text-sm text-gray-500'>
                        {pin.address}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-red-500 hover:text-red-700 hover:bg-red-50'
                      onClick={() => handleDeletePin(pin.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      <div className='relative flex-1 m-4'>
        <Card className='h-full'>
          <MapContainer
            center={defaultCenter}
            zoom={13}
            className='w-full h-full rounded-lg'
            whenReady={() => setMap(map)}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents onMapClick={handleMapClick} />

            {pins.map((pin) => (
              <Marker
                key={pin.id}
                position={pin.position}
                icon={MarkerIcon}
                eventHandlers={{
                  click: () => setSelectedPin(pin),
                }}
              >
                <Popup>
                  <div className='p-2'>
                    <h3 className='font-semibold'>
                      {pin.remark || 'Unnamed Location'}
                    </h3>
                    <p className='text-sm text-gray-500'>{pin.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {newPin && (
              <Marker position={newPin.position} icon={MarkerIcon}>
                <Popup>
                  <div className='p-2'>
                    <p className='text-sm'>{newPin.address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Card>

        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/20'>
            <div className='flex items-center p-4 bg-white rounded-lg shadow-lg'>
              <Loader2 className='w-6 h-6 mr-2 animate-spin' />
              <p>Fetching address...</p>
            </div>
          </div>
        )}
      </div>

      <PinDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        remark={remark}
        onRemarkChange={setRemark}
        onSave={handleSubmit}
        address={newPin?.address ?? ''}
      />
    </div>
  );
}
