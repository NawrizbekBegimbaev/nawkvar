import client from './client';

export interface ApartmentImage {
  id: number;
  image: string;
  created_at: string;
}

export interface Apartment {
  id: number;
  title: string;
  price: string;
  rooms: number;
  description: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'SOLD';
  owner_phone: string;
  owner_telegram: string;
  images: ApartmentImage[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getApartments = (page = 1) =>
  client.get<PaginatedResponse<Apartment>>(`/apartments/?page=${page}`);

export const getApartment = (id: number) =>
  client.get<Apartment>(`/apartments/${id}/`);

export const getMyApartments = (page = 1) =>
  client.get<PaginatedResponse<Apartment>>(`/apartments/my/?page=${page}`);

export const createApartment = (data: FormData) =>
  client.post<Apartment>('/apartments/create/', data);

export const updateApartment = (id: number, data: FormData) =>
  client.put<Apartment>(`/apartments/${id}/update/`, data);

export const updateApartmentStatus = (id: number, status: string) =>
  client.patch(`/apartments/${id}/status/`, { status });

export const deleteApartment = (id: number) =>
  client.delete(`/apartments/${id}/delete/`);
