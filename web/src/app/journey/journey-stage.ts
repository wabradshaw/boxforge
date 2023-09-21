export interface JourneyStage {
    name: string;
    state: 'selected' | 'available' | 'disabled';
}