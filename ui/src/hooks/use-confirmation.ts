import { createContext, useContext } from "react";

export type ConfirmationOptions = {
	title: string;
	description?: string;
	variant?: "default" | "destructive";
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => unknown;
	onCancel?: () => unknown;
};

export const ConfirmationContext = createContext<{
	showDialog: (options: ConfirmationOptions) => void;
	hideDialog: () => void;
}>({ showDialog: () => {}, hideDialog: () => {} });

export const useConfirmation = () => useContext(ConfirmationContext);
