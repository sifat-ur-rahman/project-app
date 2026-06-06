import React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      actions={
        <>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? "destructive" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        {isDangerous && (
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        )}
        <p className="text-sm text-foreground">{message}</p>
      </div>
    </Modal>
  );
}
