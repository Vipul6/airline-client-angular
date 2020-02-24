export interface Flight {
  id: number;
  ancilliaryServices: string[];
  meals: string[];
  shoppingItems: string[];
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  source: string;
  destination: string;
  seatsDetail: SeatDetail[];
  passengersDetail: PassengerDetail[];
}

export interface SeatDetail {
  id: number;
  isOccupied: boolean;
  passengerId: number;
  number: string;
}

export interface PassengerDetail {
  id: number;
  name: string;
  dateOfBirth: string;
  seatNumber: string;
  isCheckedIn: boolean;
  hasInfant: boolean;
  isWheelChairRequired: boolean;
  ancilliaryServices: string[];
  meals: string[];
  passportNumber: string;
  address: string;
  shoppingItems: string[];
}
