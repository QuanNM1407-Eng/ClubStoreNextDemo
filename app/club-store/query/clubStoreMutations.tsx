import { useMutation } from "@tanstack/react-query";

import { useTranslation } from "react-i18next";
import { claimAllMissions, recruitRoster, updateRoster } from "../query/api";
import { VERIFY_DURATION_MS } from "../constants/offers.constants";
import {
  RecruitRosterRequest,
  UpdateRosterResponse,
  UpgradeRosterRequest,
} from "../types/type.subscription";
import { AxiosResponse } from "axios";
import {
  useInvalidateClaimAllStatus,
  useInvalidateRosterItems,
} from "./clubStoreQueries";
import { isAPIError, useHandleCommonError } from "../utils/error.util";
import { errorCodes } from "../constants/errorCode.constants";

import { NotEnoughClubCoinDialog } from "../modals/NotEnoughClubCoinDialog";
import { useProcessingDialog } from "../modals/ProcessingDialog";
import { useInvalidateBalance } from "../lib/useCurrency";
import { createPortableDialog, toast } from "@wwe-portal/ui/components";

const wait = (ms: number) =>
  new Promise((r) => setTimeout(() => r(undefined), ms));

export const useMutateClaimAll = () => {
  const { t } = useTranslation();
  const onError = useHandleCommonError();
  const { showProcess, showSuccess, modal } = useProcessingDialog({
    progressData: {
      title: t("claimAll.title.load"),
      description: t("claimAll.description.load"),
      duration: 5000,
    },
    successData: {
      title: t("claimAll.title.successful"),
      description: t("claimAll.description.successful"),
    },
  });
  const invalidateClaimAllStatus = useInvalidateClaimAllStatus();
  const invalidateBalance = useInvalidateBalance();
  const { mutate, isLoading } = useMutation(
    () => {
      showProcess();
      return Promise.all([claimAllMissions(), wait(5000)]);
    },
    {
      onSuccess: (data) => {
        if (!data[0].data.data.success) {
          toast({
            content: data[0].data.data.message,
            variant: "error",
          });
          modal.remove();
        } else {
          showSuccess();
        }
        invalidateClaimAllStatus();
        invalidateBalance();
      },
      onError,
    }
  );
  return {
    mutate,
    isLoading,
  };
};

interface MutationCallback<V> {
  onSuccess?: (
    data: AxiosResponse<{ data: UpdateRosterResponse }>,
    variables: V
  ) => void;
  onError?: (error: unknown) => void;
  onCloseSuccessDialog?: () => void;
}

interface DialogContent {
  progressTitle: string;
  progressDecription: string;
  successTitle: string;
  successDescription: string;
}
const useMutationTemplate = <V,>(
  callback: MutationCallback<V>,
  content: DialogContent
) => {
  const invalidate = useInvalidateRosterItems();
  const handleCommonError = useHandleCommonError();
  const { t } = useTranslation();
  const invalidateBalance = useInvalidateBalance();
  const { showProcess, showSuccess, modal } = useProcessingDialog({
    progressData: {
      title: t(content.progressTitle),
      description: t(content.progressDecription),
      duration: VERIFY_DURATION_MS,
    },
    successData: {
      title: t(content.successTitle),
      description: t(content.successDescription),
    },
    onClose: callback.onCloseSuccessDialog,
  });

  const showProgressingDialog = async () => {
    showProcess();
    await wait(VERIFY_DURATION_MS);
    invalidate();
    showSuccess();
  };

  const onSuccess: MutationCallback<V>["onSuccess"] = (data, variables) => {
    if (!data.data.data.success) {
      throw Error(data.data.data.message);
    }

    showProgressingDialog();
    invalidateBalance();
    return callback.onSuccess?.(data, variables);
  };
  const onError = (error: unknown) => {
    modal.remove();
    if (isAPIError(error, errorCodes.NOT_ENOUGH_CLUBCOIN)) {
      createPortableDialog(NotEnoughClubCoinDialog);
    } else {
      handleCommonError(error);
    }
    callback.onError?.(error);
  };

  return {
    onSuccess,
    onError,
  };
};

export const useMutateFuseUp = (
  callback: MutationCallback<UpgradeRosterRequest>
) => {
  const { onError, onSuccess } = useMutationTemplate(callback, {
    progressTitle: "fuseUp.progress.title",
    progressDecription: "fuseUp.progress.description",
    successTitle: "fuseUp.success.title",
    successDescription: "fuseUp.success.description",
  });

  return useMutation({
    mutationFn: (data: UpgradeRosterRequest) => {
      return updateRoster(data);
    },
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
    onError,
  });
};

export const useMutateRecruit = (
  callback: MutationCallback<RecruitRosterRequest>
) => {
  const { onError, onSuccess } = useMutationTemplate(callback, {
    progressTitle: "recruitment.progress.title",
    progressDecription: "recruitment.progress.description",
    successTitle: "recruitment.success.title",
    successDescription: "recruitment.success.description",
  });

  return useMutation({
    mutationFn: async (data: RecruitRosterRequest) => {
      return await recruitRoster(data);
    },
    onSuccess: (data, variables) => onSuccess(data, variables),
    onError,
  });
};
