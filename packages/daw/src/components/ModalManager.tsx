import { useModalStore } from "../stores/useModalStore";

export function ModalManager() {
  const { modalQueue } = useModalStore();

  if (modalQueue.length === 0) {
    return null;
  }

  const modal = modalQueue.at(-1);

  return modal;
}
