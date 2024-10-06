export const getNameCurrencies = (item) => {
  let item_id = item?.itemID;
  let item_name = item?.itemName;
  const isRuby = item?.itemName.includes('Rubies') || item?.itemID.includes('Ruby');
  const isWebcoin = item?.itemName.includes('Web Coins') || item?.itemName.includes('WebCoin');
  const isPick = item?.itemName.includes('Pick') || item?.itemID.includes('Pick');
  if (isRuby) {
    item_id = 'web_currency_ruby';
    item_name = 'ruby';
  }
  if (isWebcoin) {
    item_id = 'web_currency_web_coin';
    item_name = 'web_coin';
  }
  if (isPick) {
    item_id = 'web_currency_pick';
    item_name = 'pick';
  }
  return [item_id, item_name];
};

export const getCurrencyFromStorage = (typeCurrency) => {
  return (typeCurrency && typeCurrency === 'webCoins') || typeCurrency === 'web-coin'
    ? 'web_coins'
    : typeCurrency === 'cashPacks'
    ? 'cash_packs'
    : typeCurrency;
};

export const isRewardOffer = (offer) =>
  offer &&
  offer.AlternativeCostAmount === 0 &&
  offer.OfferType === 'AlternativeCurrency' &&
  typeof offer.AlternativeCostAmount !== 'undefined' &&
  typeof offer.OfferType !== 'undefined';

export const isAlternativeOffer = (offer) =>
  offer && offer.AlternativeCostAmount && offer.OfferType === 'AlternativeCurrency';

export const getIsFreeClaimTournamentOffer = (offerType, data) =>
  offerType === 'tournament' &&
  !data?.AlternativeCostAmount &&
  data?.OfferType === 'AlternativeCurrency';

export const isWebcoinOffer = (offerData) => {
  return Boolean(offerData?.StoreItemName?.includes('Web Coins'));
};

export const isRubyOffer = (offerData) => {
  return Boolean(offerData?.StoreItemName?.includes('Rubies'));
};

export const isCashPack = (offerData) => {
  return Boolean(offerData?.StoreItemName?.includes('Pack'));
};
