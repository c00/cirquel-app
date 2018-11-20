export abstract class PageState {
    //Loading data
    static LOADING = 'loading';
    //Can't load data
    static ERROR = 'error';
    //Showing data
    static SHOWING = 'showing';
    //Showing last page of data
    static SHOWING_LAST = 'last';
    //No data to show
    static EMPTY = 'empty';
    //Waiting for life to happen.
    static WAITING = 'waiting';
}

export abstract class SearchState {
    static NO_SEARCH = 'no-search';
    static NO_RESULTS = 'no-results';
    static SEARCHING = 'searching';
    static HAS_RESULTS = 'has-results';
    static ERROR = 'error';

    //These are the different reasons the search-Value modal is opened.
    // We either open the modal for searching something, or naming something
    static FOR_SEARCHING = 'search';
    static FOR_NAMING = 'name'
}