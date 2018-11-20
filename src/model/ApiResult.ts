import { Item } from './Item';
import { VideoResource } from './Resources';
import { Author } from './Author';

export interface VideoPrepareResult {
    item: Item;
    url: string;
    params: any;
    localUri?: string;
}

export interface BackgroundUploadResult {
    result: string;
    resource: VideoResource;
}

export interface UserItemsResult {
    author: Author;
    items: Item[];
    pages: number;
    criteria: any;
}

export interface AdvancedSearchResult {
    items: Item[];
    pages: number;
    criteria: any;
}