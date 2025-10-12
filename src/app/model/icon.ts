export type UiIconType = 'standard' | 'person' | 'club' | 'competition';

export interface UiIconDescriptor {
    type: UiIconType;
    content: string;
    color?: string;
    containerClasses?: string[];
}