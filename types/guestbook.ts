export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  canDelete?: boolean;
};

export type GuestbookList = {
  entries: GuestbookEntry[];
  total: number;
};
