import { Category } from './Category';
import { Search } from './Search';
/**
 * Object to store settings for the local device.
 */
export interface UserSettings {
    //Remember the last page we were on.
    lastPageId?: number;
    //Remember the set category filter
    category: Category;
    //The last search the user has done.
    search?: Search;


    // ONBOARDING STUFF //
    //Have we agreed to the user agreement?
    userAgreement: boolean;
    //Have we shown the menu (on first load)?
    menuShown: boolean;
    //Has the user ever clicked the profile circle in the menu?
    profileClicked: boolean;
    //Has the user ever clicked the filter circle in the menu?
    filterClicked: boolean;
    //Has the user ever clicked the author pic on an item?
    authorBubbleClicked: boolean;
    //Have we seen the following thingymajic before?
    subsBannerShown: boolean;
}