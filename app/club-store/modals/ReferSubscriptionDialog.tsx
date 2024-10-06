import { ReferSubscriptionDialog as ReferSubscriptionDialogUI } from "@wwe-portal/ui/features";
import { useSubscriptionHistory } from "../helper/clubstoreHelper";
import {
  createPortableDialog,
  usePortableDialog,
} from "@wwe-portal/ui/components";

export const ReferSubscriptionDialog = createPortableDialog(
  ({ description }: { description: React.ReactNode }) => {
    const modal = usePortableDialog();
    const { goToSubscription } = useSubscriptionHistory();
    return (
      <ReferSubscriptionDialogUI
        open={modal.visible}
        onClose={modal.remove}
        description={description}
        onChange={() => {
          goToSubscription();
          modal.remove();
        }}
      />
    );
  }
);
