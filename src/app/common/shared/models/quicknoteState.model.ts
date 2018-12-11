import { Quicknotes, GlobalProfile } from './quicknotes.model';

export interface QuicknoteState {
    readonly quicknotes: Quicknotes;
}

export interface GlobalProfileState {
    readonly globalprofile: GlobalProfile;
}
