import { create } from "zustand";

interface ModalState {
  modalQueue: React.ReactElement[];
  pushModal: (modal: React.ReactElement) => void;
  popModal: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modalQueue: [],
  pushModal: (modal) => set((state) => ({ modalQueue: state.modalQueue.concat(modal) })),
  popModal: () => set((state) => ({ modalQueue: state.modalQueue.slice(0, -1) })),
}));
