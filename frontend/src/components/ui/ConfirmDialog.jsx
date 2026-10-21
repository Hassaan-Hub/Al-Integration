import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={loading ? undefined : onClose}
    title={title}
    description={description}
    size="sm"
    closeOnBackdrop={!loading}
    footer={
      <>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm leading-6 text-slate-600">
      This action cannot be undone. The task will be permanently removed from the server.
    </p>
  </Modal>
);
