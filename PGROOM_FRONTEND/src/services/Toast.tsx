import { toast } from 'react-toastify';
import { ToastProps } from '../interfaces/ToastTypes';

const successToast = ({ text, position = "top-right" }: ToastProps): void => {
    toast.success(text, { position });
};

const errorToast = ({ text, position = "top-right" }: ToastProps): void => {
    toast.error(text, { position });
};

const warnToast = ({ text, position = "top-right" }: ToastProps): void => {
    toast.warn(text, { position });
};

const infoToast = ({ text, position = "top-right" }: ToastProps): void => {
    toast.info(text, { position });
};

const Toast = {
    successToast,
    errorToast,
    warnToast,
    infoToast
};

export default Toast;
