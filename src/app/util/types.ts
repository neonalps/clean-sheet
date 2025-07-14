export interface Flavoring<FlavorT> {
  _type?: FlavorT;
}

export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type OmitStrict<T, K extends keyof T> = Omit<T, K>;