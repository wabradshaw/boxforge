export interface JourneyStage {
    stageName: string;
    state: 'selected' | 'available' | 'disabled';
}