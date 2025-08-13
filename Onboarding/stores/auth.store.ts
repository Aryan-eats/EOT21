import { create } from 'zustand';

interface RiderData {
  name: string;
  phone: string;
  vehicleType: string;
  aadhar: string;
  accountNumber?: string;
  accountHolder?: string;
  ifsc?: string;
  gender?: string;
  panNumber?: string;
  workTime?: string;
  area?: string;
  distance?: string;
  joiningBonus?: string;
  weeklyEarnings?: string;
  workArea?: string;
  kitOrdered?: boolean;
}

interface AuthStore {
  riderData: RiderData | null;
  setRiderData: (data: Partial<RiderData>) => void;
  clearRiderData: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  riderData: null,
  setRiderData: (data) => set((state) => ({ 
    riderData: state.riderData ? { ...state.riderData, ...data } : data as RiderData 
  })),
  clearRiderData: () => set({ riderData: null }),
}));