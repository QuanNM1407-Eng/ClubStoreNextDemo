import { UnauthorizedError, APIError } from "../services/errorInterceptorV2";
import { useToast } from "@wwe-portal/ui/components";
// import { addDDError } from 'analytics';
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const isAPIError = (
  error: unknown,
  code?: number
): error is APIError => {
  return error instanceof APIError && (code == null || error.code === code);
};

export const useHandleCommonError = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  return useCallback(
    (error: unknown) => {
      if (error instanceof UnauthorizedError) {
        toast({
          content: t("your.session.has.expired"),
          variant: "error",
        });
        return;
      }
      if (isAPIError(error) && error.originError.response?.data["message"]) {
        toast({
          content: error.originError.response?.data["message"],
          variant: "error",
        });
        return;
      }

      // log unexpected error
      // addDDError(error);
      toast({
        content: t("something.went.wrong"),
        variant: "error",
      });
    },
    [toast, t]
  );
};
