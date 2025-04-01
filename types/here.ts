// types.ts
export interface HereSuggestion {
  label: string;
  address: {
    houseNumber?: string;
    street?: string;
    district?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  locationId: string;
}

export interface HereLocation {
  Address: {
    HouseNumber: string;
    Street: string;
    District: string;
    City: string;
    PostalCode: string;
    Country: string;
  };
  NavigationPosition: {
    Latitude: number;
    Longitude: number;
  }[];
}

export interface AddressSuggestion {
  label: string;
  value: string;
}