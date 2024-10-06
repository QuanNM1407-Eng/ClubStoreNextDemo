import {
  Button,
  createPortableDialog,
  usePortableDialog,
} from "@wwe-portal/ui/components";
import { OutStockClubCoinDialog } from "@wwe-portal/ui/features";
import { useRouter } from "next/navigation";
import { FAQ_KEYS } from "../query/subscriptionQueries";

export const NotEnoughClubCoinDialog = createPortableDialog(() => {
  const modal = usePortableDialog();
  const router = useRouter();
  return (
    <OutStockClubCoinDialog
      open={modal.visible}
      onClose={modal.remove}
      data={{
        actionElement: (
          <div className="wwe-flex wwe-justify-center wwe-w-full">
            <Button
              className="wwe-max-w-[178px] wwe-w-full wwe-font-semibold wwe-text-xs wwe-truncate"
              variant="orange"
              onClick={() => {
                router.push(
                  `/subscription?faq-item=${FAQ_KEYS.HOW_TO_EARN_CLUB_COINS}`
                );
                modal.remove();
              }}
            >
              GO TO FAQ
            </Button>
          </div>
        ),
      }}
    />
  );
});
