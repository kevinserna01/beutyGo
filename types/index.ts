/**
 * Interfaces y tipos para BeautyGo
 */

/**
 * Usuario
 */
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: string;
  role: 'client' | 'professional' | 'admin';
  [key: string]: any; // Permitir campos adicionales del backend
}

/**
 * Profesional de belleza
 */
export interface Professional extends User {
  role: 'professional';
  services: Service[];
  location: Location;
  description: string;
  rating: number;
  reviewCount: number;
  availability: Availability[];
}

/**
 * Servicio
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutos
  category: ServiceCategory;
  images?: string[];
}

/**
 * Categoría de servicio
 */
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

/**
 * Localización
 */
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  zipCode?: string;
}

/**
 * Disponibilidad
 */
export interface Availability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // formato: "HH:MM"
  endTime: string; // formato: "HH:MM"
}

/**
 * Reserva
 */
export interface Booking {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string; // ISO date
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  location: Location;
  createdAt: string;
  price: number;
}

/**
 * Slide de onboarding
 */
export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos de registro
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: 'client' | 'professional';
}

/**
 * Configuración global para Google Maps
 */
export interface GoogleMapsConfig {
  apiKey: string;
  defaultCenter: {
    lat: number;
    lng: number;
  };
  defaultZoom: number;
  styles?: any[];
}

/**
 * Marcador de mapa personalizado
 */
export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title?: string;
  icon?: string;
  professional?: Professional;
  service?: Service;
}

/**
 * Respuesta de autenticación de la API
 */
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

/**
 * Dirección para profesionales
 */
export interface Address {
  calle: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;
}

/**
 * Usuario completo para perfil (extiende User básico)
 */
export interface UserProfile extends User {
  telefono?: string;
  fotoUrl?: string;
  direccion?: Address;
  descripcion?: string;
}

/**
 * Estados y ciudades para selects dependientes
 */
export interface Estado {
  id: string;
  nombre: string;
}

export interface Ciudad {
  id: string;
  nombre: string;
  estadoId: string;
}

/**
 * Datos del formulario de perfil
 */
export interface ProfileFormData {
  nombre: string;
  correo: string;
  telefono: string;
  fotoUrl?: string;
  foto?: File;
  // Campos específicos para profesionales
  direccion?: {
    calle: string;
    estado: string;
    ciudad: string;
    codigoPostal: string;
  };
  descripcion?: string;
}

/**
 * Estado de validación del formulario
 */
export interface ValidationState {
  nombre: { valid: boolean; message: string };
  correo: { valid: boolean; message: string };
  telefono: { valid: boolean; message: string };
  calle?: { valid: boolean; message: string };
  estado?: { valid: boolean; message: string };
  ciudad?: { valid: boolean; message: string };
  codigoPostal?: { valid: boolean; message: string };
  descripcion?: { valid: boolean; message: string };
}

/**
 * Modo del formulario de perfil
 */
export type ProfileMode = 'readonly' | 'editing';

/**
 * Respuesta de la API para perfil de usuario
 */
export interface UserProfileResponse {
  id: string;
  rol: 'professional' | 'client';
  nombre: string;
  correo: string;
  telefono: string;
  fotoUrl?: string;
  direccion?: Address;
  descripcion?: string;
} 