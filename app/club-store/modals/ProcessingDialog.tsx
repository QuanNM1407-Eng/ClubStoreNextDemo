import { createPortableDialog, usePortableDialog } from '@wwe-portal/ui/components';

import { ProcessingDialog as ProcessingDialogUI } from '@wwe-portal/ui/features';

interface BaseDialogState {
  title: string;
  description: string;
}

interface PaymentProcessingDialogState extends BaseDialogState {
  duration: number;
}

interface ProcessingDialogProps {
  status: 'progress' | 'success';
  paymentProgressState?: PaymentProcessingDialogState;
  successState?: BaseDialogState;
  onClose?: () => void;
}

export const ProcessingDialog = createPortableDialog(
  ({ status, paymentProgressState, successState, onClose }: ProcessingDialogProps) => {
    const modal = usePortableDialog();

    const handleClose = () => {
      onClose?.();
      modal.remove();
    };

    return (
      <ProcessingDialogUI
        open={modal.visible}
        status={status}
        paymentProgressState={paymentProgressState}
        successState={successState}
        onClose={handleClose}
      />
    );
  },
);

export const useProcessingDialog = ({
  progressData,
  successData,
  onClose,
}: {
  progressData: PaymentProcessingDialogState;
  successData?: BaseDialogState;
  onClose?: () => void;
}) => {
  const modal = usePortableDialog(ProcessingDialog);
  return {
    showProcess: () =>
      modal.show({
        status: 'progress',
        paymentProgressState: progressData,
      }),

    showSuccess: (currentSuccessData?: BaseDialogState, onCloseSuccess?: () => void) => {
      modal.show({
        status: 'success',
        successState: currentSuccessData ?? successData,
        onClose: () => {
          onCloseSuccess?.();
          onClose?.();
        },
      });
    },
    modal,
  };
};
