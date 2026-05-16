export type PredefinedLocation = {
  id: string;
  label: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
};

export const PREDEFINED_LOCATIONS: PredefinedLocation[] = [
  {
    id: "hn-hoankiem",
    label: "Hoan Kiem · Hanoi",
    city: "Hanoi",
    district: "Hoan Kiem",
    latitude: 21.0285,
    longitude: 105.8542,
  },
  {
    id: "hn-caugiay",
    label: "Cau Giay · Hanoi",
    city: "Hanoi",
    district: "Cau Giay",
    latitude: 21.0358,
    longitude: 105.7958,
  },
  {
    id: "hn-badinh",
    label: "Ba Dinh · Hanoi",
    city: "Hanoi",
    district: "Ba Dinh",
    latitude: 21.0358,
    longitude: 105.8412,
  },
  {
    id: "hn-dongda",
    label: "Dong Da · Hanoi",
    city: "Hanoi",
    district: "Dong Da",
    latitude: 21.0245,
    longitude: 105.8412,
  },
  {
    id: "hcm-d1",
    label: "District 1 · Ho Chi Minh",
    city: "Ho Chi Minh",
    district: "District 1",
    latitude: 10.7769,
    longitude: 106.7009,
  },
  {
    id: "hcm-d3",
    label: "District 3 · Ho Chi Minh",
    city: "Ho Chi Minh",
    district: "District 3",
    latitude: 10.78,
    longitude: 106.6882,
  },
  {
    id: "hcm-binhthanh",
    label: "Binh Thanh · Ho Chi Minh",
    city: "Ho Chi Minh",
    district: "Binh Thanh",
    latitude: 10.8009,
    longitude: 106.7117,
  },
  {
    id: "dn-haichau",
    label: "Hai Chau · Da Nang",
    city: "Da Nang",
    district: "Hai Chau",
    latitude: 16.0544,
    longitude: 108.2022,
  },
  {
    id: "dn-sontra",
    label: "Son Tra · Da Nang",
    city: "Da Nang",
    district: "Son Tra",
    latitude: 16.0748,
    longitude: 108.2333,
  },
];
