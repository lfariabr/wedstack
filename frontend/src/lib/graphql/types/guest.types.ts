export interface Guest {
  id: string;
  name: string;
  phone: string;
  group: string;
  status: string;
  plusOnes: number;
}

export interface GuestInput {
  name: string;
  phone: string;
  group: string;
  status: string;
  plusOnes: number;
}

export interface GuestsData {
  guests: Guest[];
}

export interface GuestData {
  guest: Guest;
}

export interface GuestsByNameData {
  guestsByName: Guest[];
}

export interface GuestsByPhoneData {
  guestsByPhone: Guest[];
}

export interface GuestsByGroupData {
  guestsByGroup: Guest[];
}

export interface GuestsByStatusData {
  guestsByStatus: Guest[];
}

export interface GuestsByPlusOnesData {
  guestsByPlusOnes: Guest[];
}

export interface UpdateGuestStatusData {
  updateGuestStatus: Guest;
}

export interface UpdateGuestGroupData {
  updateGuestGroup: Guest;
}

export interface UpdateGuestPlusOnesData {
  updateGuestPlusOnes: Guest;
}
