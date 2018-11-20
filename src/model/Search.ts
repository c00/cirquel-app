export interface Search {
  name: string;
  category: string;
  venue?: string;
  venueId?: number;
  skillLevel?: number;
  strengthLevel?: number;
  flexiLevel?: number;
  page?: number,
  excludeItemIds?: number[];
}