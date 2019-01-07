export interface Search {
  name?: string;
  category?: string;
  venue?: string;
  venueId?: number;
  skillLevel?: number;
  strengthLevel?: number;
  flexiLevel?: number;
  subsOnly?: boolean;
  page?: number,
  excludeItemIds?: number[];
}