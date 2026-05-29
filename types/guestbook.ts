export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export type GuestbookList = {
  entries: GuestbookEntry[];
  total: number;
};
