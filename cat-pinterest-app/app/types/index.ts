export interface Cat {
  id: string;
  url: string;
}

export interface CatWithFavorite extends Cat {
  isFavorite: boolean;
}