import type { AppDispatch } from "../store";

export const useResetComponentMessage = (dispatch: AppDispatch) => {
  return (msgAction: any) => {
    setTimeout(() => {
      dispatch(msgAction());
    }, 2000);
  };
};