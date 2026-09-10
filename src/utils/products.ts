import { Game, FlashSaleItem } from '../types';
import { GAMES_DATA } from '../data/games';

const PRICE_OVERRIDE_KEY = 'stecutopup_price_overrides_v1';

export interface PriceOverride {
  price: number;
  originalPrice?: number;
}

export type PriceOverridesMap = Record<string, PriceOverride>;

export const getPriceKey = (gameId: string, denomId: string): string => `${gameId}:${denomId}`;

export const getPriceOverrides = (): PriceOverridesMap => {
  try {
    const raw = localStorage.getItem(PRICE_OVERRIDE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse price overrides', e);
    return {};
  }
};

export const savePriceOverrides = (overrides: PriceOverridesMap): void => {
  try {
    localStorage.setItem(PRICE_OVERRIDE_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent('stecutopup_products_updated', { detail: overrides }));
  } catch (e) {
    console.error('Failed to save price overrides', e);
  }
};

export const updateDenominationPrice = (
  gameId: string,
  denomId: string,
  newPrice: number,
  newOriginalPrice?: number
): void => {
  const overrides = getPriceOverrides();
  const key = getPriceKey(gameId, denomId);
  overrides[key] = {
    price: newPrice,
    originalPrice: newOriginalPrice,
  };
  savePriceOverrides(overrides);
};

export const resetDenominationPrices = (): void => {
  try {
    localStorage.removeItem(PRICE_OVERRIDE_KEY);
    window.dispatchEvent(new CustomEvent('stecutopup_products_updated', { detail: {} }));
  } catch (e) {
    console.error('Failed to reset price overrides', e);
  }
};

export const getCustomizedGames = (baseGames: Game[] = GAMES_DATA): Game[] => {
  const overrides = getPriceOverrides();
  if (Object.keys(overrides).length === 0) {
    return baseGames;
  }

  return baseGames.map((game) => {
    const updatedDenoms = game.denominations.map((denom) => {
      const key = getPriceKey(game.id, denom.id);
      if (overrides[key]) {
        return {
          ...denom,
          price: overrides[key].price,
          originalPrice: overrides[key].originalPrice !== undefined ? overrides[key].originalPrice : denom.originalPrice,
        };
      }
      return denom;
    });

    return {
      ...game,
      denominations: updatedDenoms,
    };
  });
};

export const getCustomizedFlashSales = (games: Game[]): FlashSaleItem[] => {
  const mlbb = games.find((g) => g.id === 'mlbb');
  const ff = games.find((g) => g.id === 'ff');
  const genshin = games.find((g) => g.id === 'genshin');
  const valorant = games.find((g) => g.id === 'valorant');

  const items: FlashSaleItem[] = [];

  if (mlbb) {
    const denom = mlbb.denominations.find((d) => d.id === 'ml_wdp') || mlbb.denominations[0];
    if (denom) {
      items.push({
        id: 'fs_1',
        gameId: mlbb.id,
        gameName: mlbb.name,
        gameLogo: mlbb.logo,
        item: denom,
        stockPercent: 88,
        soldCount: 1420,
        endTime: '2026-08-21T23:59:59',
      });
    }
  }

  if (ff) {
    const denom = ff.denominations.find((d) => d.id === 'ff_70') || ff.denominations[0];
    if (denom) {
      items.push({
        id: 'fs_2',
        gameId: ff.id,
        gameName: ff.name,
        gameLogo: ff.logo,
        item: denom,
        stockPercent: 92,
        soldCount: 980,
        endTime: '2026-08-21T23:59:59',
      });
    }
  }

  if (genshin) {
    const denom = genshin.denominations.find((d) => d.id === 'gi_blessing') || genshin.denominations[0];
    if (denom) {
      items.push({
        id: 'fs_3',
        gameId: genshin.id,
        gameName: genshin.name,
        gameLogo: genshin.logo,
        item: denom,
        stockPercent: 74,
        soldCount: 650,
        endTime: '2026-08-21T23:59:59',
      });
    }
  }

  if (valorant) {
    const denom = valorant.denominations.find((d) => d.id === 'val_1000') || valorant.denominations[0];
    if (denom) {
      items.push({
        id: 'fs_4',
        gameId: valorant.id,
        gameName: valorant.name,
        gameLogo: valorant.logo,
        item: denom,
        stockPercent: 81,
        soldCount: 520,
        endTime: '2026-08-21T23:59:59',
      });
    }
  }

  return items;
};
