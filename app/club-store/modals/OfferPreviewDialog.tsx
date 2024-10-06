import { OfferReviewDialog, OfferReviewProps } from "@wwe-portal/ui/features";
import { formatQuantity, getEndDate } from "../hooks/useOfferReviewDialog";
import { OfferData } from "@wwe-portal/data/offers";
import {
  createPortableDialog,
  usePortableDialog,
} from "@wwe-portal/ui/components";

export const parseOfferPreview = (
  offer: Partial<OfferData>,
  actionBtn: React.ReactNode
) => {
  const result: OfferReviewProps = {
    title: offer?.StoreItemName ?? "",
    items:
      offer?.offerItems?.map((item, index) => ({
        dynamicImageUrl: item.url ?? "",
        id: item.itemID,
        itemId: item.itemID,
        text: formatQuantity(item.quantity),
        description: `${item.quantity}x ${item.itemName}`,
      })) ?? [],
    endDate: getEndDate(offer.EndDate),
    id: offer?.OffersID ?? "",
    vipPoints: offer.VipPoint,
    disabled: false,
    storeItemDescription: offer.StoreItemDescription,
    actionBtn,
  };
  return result;
};

export const OfferPreviewDialog = createPortableDialog(
  (props: { data: OfferData; actionBtn: React.ReactNode }) => {
    const modal = usePortableDialog();

    return (
      <OfferReviewDialog
        open={modal.visible}
        onClose={modal.remove}
        {...props}
        data={{
          ...parseOfferPreview(props.data, props.actionBtn),
        }}
      />
    );
  }
);

export default OfferPreviewDialog;
