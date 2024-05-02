

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/reducers/store';
import User from "../../models/user";

export interface SearchParamsState {
    activeSearch: boolean,
    query: string;
    languages: Array<number>;
    author: User;
    attemptsMin: string;
    attemptsMax: string;
    completionsMin: string;
    completionsMax: string;
    coffeeMin: string;
    coffeeMax: string;
    viewsMin: string;
    viewsMax: string;
    tags: Array<object>;
    challengeType: number;
    visibility: number;
    since: number;
    until: number;
    published: boolean;
    tier: number;
}

export interface SearchParamsStateUpdate {
    activeSearch: boolean | null;
    query: string | null;
    languages: Array<number> | null;
    author: User | null;
    attemptsMin: string | null;
    attemptsMax: string | null;
    completionsMin: string | null;
    completionsMax: string | null;
    coffeeMin: string | null;
    coffeeMax: string | null;
    viewsMin: string | null;
    viewsMax: string | null;
    tags: Array<object> | null;
    challengeType: number | null;
    visibility: number | null;
    since: number | null;
    until: number | null;
    published: boolean | null;
    tier: number | null;

}

export const initialSearchState: SearchParamsState = {
    activeSearch: false,
    query: "",
    languages: [],
    author: {} as User,
    attemptsMin: "",
    attemptsMax: "",
    completionsMin: "",
    completionsMax: "",
    coffeeMin: "",
    coffeeMax: "",
    viewsMin: "",
    viewsMax: "",
    tags: [],
    challengeType: -1,
    visibility: -1,
    since: 0,
    until: 0,
    published: false,
    tier: -1,
}

export const initialSearchStateUpdate: SearchParamsStateUpdate = {
    activeSearch: null,
    query: null,
    languages: null,
    author: null,
    attemptsMin: null,
    attemptsMax: null,
    completionsMin: null,
    completionsMax: null,
    coffeeMin: null,
    coffeeMax: null,
    viewsMin: null,
    viewsMax: null,
    tags: [],
    challengeType: null,
    visibility: null,
    since: null,
    until: null,
    published: null,
    tier: null,
}

export const searchParamsSlice = createSlice({
    name: 'searchParams',
    initialState: initialSearchState,
    reducers: {
        clearSearchParamsState: (state) => {
            state.activeSearch = false
            state.query = ""
            state.languages = []
            state.author = {} as User
            state.attemptsMin = ""
            state.attemptsMax = ""
            state.completionsMin = ""
            state.completionsMax = ""
            state.coffeeMin = ""
            state.coffeeMax = ""
            state.viewsMin = ""
            state.viewsMax = ""
            state.tags = []
            state.challengeType = -1
            state.visibility = -1
            state.since = 0
            state.until = 0
            //state.published =
            state.tier = -1
        },
        updateSearchParamsState: (state, update: PayloadAction<SearchParamsStateUpdate>) => {
            if (update.payload.activeSearch !== null) {
                state.activeSearch = update.payload.activeSearch
            }

            if (update.payload.query !== null) {
                state.query = update.payload.query
            }

            if (update.payload.languages !== null) {
                state.languages = update.payload.languages
            }

            if (update.payload.author !== null) {
                state.author = update.payload.author
            }

            if (update.payload.attemptsMin !== null) {
                state.attemptsMin = update.payload.attemptsMin
            }

            if (update.payload.attemptsMin !== null) {
                state.attemptsMin = update.payload.attemptsMin
            }

            if (update.payload.attemptsMax !== null) {
                state.attemptsMax = update.payload.attemptsMax
            }

            if (update.payload.completionsMin !== null) {
                state.completionsMin = update.payload.completionsMin
            }

            if (update.payload.completionsMax !== null) {
                state.completionsMax = update.payload.completionsMax
            }

            if (update.payload.coffeeMin !== null) {
                state.coffeeMin = update.payload.coffeeMin
            }

            if (update.payload.coffeeMax !== null) {
                state.coffeeMax = update.payload.coffeeMax
            }

            if (update.payload.viewsMin !== null) {
                state.viewsMin = update.payload.viewsMin
            }

            if (update.payload.viewsMax !== null) {
                state.viewsMax = update.payload.viewsMax
            }

            if (update.payload.tags !== null) {
                state.tags = update.payload.tags
            }

            if (update.payload.challengeType !== null) {
                state.challengeType = update.payload.challengeType
            }

            if (update.payload.since !== null) {
                state.since = update.payload.since
            }

            if (update.payload.until !== null) {
                state.until = update.payload.until
            }

            if (update.payload.published !== null) {
                state.published = update.payload.published
            }

            if (update.payload.tier !== null) {
                state.tier = update.payload.tier
            }
        },
    }
});

export const {updateSearchParamsState, clearSearchParamsState} = searchParamsSlice.actions;

export const selectSearch = (state: RootState) => state.searchParams || initialSearchState;
export const selectActiveSearch = (state: RootState) => state.searchParams ? state.searchParams.activeSearch : initialSearchState.activeSearch;
export const selectQuery = (state: RootState) => state.searchParams ? state.searchParams.query : initialSearchState.query;
export const selectLanguage = (state: RootState) => state.searchParams ? state.searchParams.languages : initialSearchState.languages
export const selectAuthor = (state: RootState) => state.searchParams ? state.searchParams.author : initialSearchState.author
export const selectAttemptsMin = (state: RootState) => state.searchParams ? state.searchParams.attemptsMin : initialSearchState.attemptsMin
export const selectAttemptsMax = (state: RootState) => state.searchParams ? state.searchParams.attemptsMax : initialSearchState.attemptsMax
export const selectCompletionsMin = (state: RootState) => state.searchParams ? state.searchParams.completionsMin : initialSearchState.completionsMin
export const selectCompletionsMax = (state: RootState) => state.searchParams ? state.searchParams.completionsMax : initialSearchState.completionsMax
export const selectCoffeeMin = (state: RootState) => state.searchParams ? state.searchParams.coffeeMin : initialSearchState.coffeeMin
export const selectCoffeeMax = (state: RootState) => state.searchParams ? state.searchParams.coffeeMax : initialSearchState.coffeeMax
export const selectViewsMin = (state: RootState) => state.searchParams ? state.searchParams.viewsMin : initialSearchState.viewsMin
export const selectViewsMax = (state: RootState) => state.searchParams ? state.searchParams.viewsMax : initialSearchState.viewsMax
export const selectSearchTags = (state: RootState) => state.searchParams ? state.searchParams.tags : initialSearchState.tags
export const selectSearchChallengeType = (state: RootState) => state.searchParams ? state.searchParams.challengeType : initialSearchState.challengeType
export const selectVisibility = (state: RootState) => state.searchParams ? state.searchParams.visibility : initialSearchState.visibility
export const selectSince = (state: RootState) => state.searchParams ? state.searchParams.since : initialSearchState.since
export const selectUntil = (state: RootState) => state.searchParams ? state.searchParams.until : initialSearchState.until
export const selectPublished = (state: RootState) => state.searchParams ? state.searchParams.published : initialSearchState.published
export const selectSearchTier = (state: RootState) => state.searchParams ? state.searchParams.tier : initialSearchState.tier

export default searchParamsSlice.reducer;

