export type UiIconType = 'standard' | 'player' | 'club' | 'competition';

export interface UiIconDescriptor {
    type: UiIconType;
    content: string;
    color?: string;
    containerClasses?: string[];
}