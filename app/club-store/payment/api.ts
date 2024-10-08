import { CreateCheckoutRequest } from "@scopely/web-sdk-payments";
import {
  expressApiClient,
  paymentAPiClient,
  // nestApiClient,
} from "../services/apiClient";

export const checkoutPayment = async (
  payload: CreateCheckoutRequest & {
    offerId: string;
  }
) => {
  return await paymentAPiClient.post<{
    data: {
      paymentId: string;
      provider: string;
      message: string;
      success: boolean;
    };
  }>("/v1/payments/checkout", payload);
};
export const cancelPayment = async ({ paymentId }: { paymentId: string }) => {
  return await paymentAPiClient.put<{
    data: { success: boolean };
  }>(`/v1/payments/cancel/${paymentId}`);
};

export const getPurchaseDailyByWebcoin = ({ offerId }: { offerId: string }) => {
  return expressApiClient.post("/offers/webcoin", {
    offerId,
  });
};

export const purchaseAvatarAsync = ({
  price,
  avatarId,
}: {
  price: number;
  avatarId: string;
}) => {
  return expressApiClient.post("/webshop/avatar", { price, avatarId });
};

export const purchaseFrameAsync = ({
  price,
  frameId,
}: {
  price: number;
  frameId: string;
}) => {
  return expressApiClient.post("/webshop/frame", { price, frameId });
};

export const purchaseEnergyPackAsync = ({ name }: { name: string }) => {
  return expressApiClient.post("/webshop/energy", { name });
};

export const claimPayment = ({ paymentId }: { paymentId: string }) => {
  return paymentAPiClient.put<
    unknown,
    {
      data: {
        data: {
          success;
        };
      };
    }
  >(`/v1/payments/claim/${paymentId}`);
};

export const checkStockBeforePurchase = ({ offerId }: { offerId: string }) => {
  return expressApiClient.post("/offers/check-offer", {
    offerId,
  });
};

export const getUnclaimedPayments = () => {
  return paymentAPiClient.get("/v1/payments/unclaimedPayments");
};

export const purchaseOfferByClubCoin = async ({
  offerId,
}: {
  offerId: string;
}) => {
  const data = new URLSearchParams();
  data.append("offerId", offerId);
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/offers/purchase",
    { method: "POST", credentials: "include", body: data }
  );
  return await response.json();
};

export const getXsollaToken = (payload: {
  sku?: string;
  offerId?: string;
  packageId?: string;
  redirectUri?: string;
  version?: string;
}) => {
  return expressApiClient.post<{ data: { token: string } }>(
    "/xsolla/token",
    payload
  );
};

export const claimReward = (offerId: string) => {
  return expressApiClient.post<{ data: { transactionId: string } }>(
    "/offers/purchase",
    {
      offerId,
    }
  );
};
