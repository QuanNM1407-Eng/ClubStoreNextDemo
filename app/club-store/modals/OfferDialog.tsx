import { createPortableDialog, usePortableDialog } from '@wwe-portal/ui/components';
import { OfferDialogProps, OfferDialog as OfferDialogUI } from '@wwe-portal/ui/features/club-store';

export const MissionOfferDialog = createPortableDialog(
  (props: Omit<OfferDialogProps, 'open' | 'onClose'> & { type: number }) => {
    const modal = usePortableDialog();
    return (
      <OfferDialogUI
        open={modal.visible}
        onClose={modal.remove}
        {...props}
        data={{
          ...props.data,
          missionType: props.type,
        }}
      />
    );
  },
);
