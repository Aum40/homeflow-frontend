'use client';

import dynamic from 'next/dynamic';

const LocationMapPicker = dynamic(
  () => import('./LocationMapPicker'),
  { ssr: false }
);

export default function ProjectLocationMap({
  latitude,
  longitude
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <LocationMapPicker latitude={latitude} longitude={longitude} readOnly />
  );
}
