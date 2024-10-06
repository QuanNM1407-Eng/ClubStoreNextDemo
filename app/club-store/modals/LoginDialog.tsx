import {
  createPortableDialog,
  usePortableDialog,
} from "@wwe-portal/ui/components";
import {
  LoginDialog as LoginDialogUI,
  LoginDialogProps,
} from "@wwe-portal/ui/features";
import { useEffect } from "react";
import useIsAuthenticated from "../hooks/global/useIsAuthenticated";

export const LoginDialog = createPortableDialog(
  (props: Omit<LoginDialogProps, "open" | "onClose">) => {
    const modal = usePortableDialog();
    const { isAuthenticated } = useIsAuthenticated();

    useEffect(() => {
      if (isAuthenticated && modal.visible) modal.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
    return (
      <LoginDialogUI open={modal.visible} onClose={modal.remove} {...props} />
    );
  }
);
