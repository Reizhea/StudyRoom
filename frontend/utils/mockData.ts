export interface Group {
  id: string;
  name: string;
  unreadCount: number;
  image: string; // Random online images for groups
}

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Study Group Alpha",
    unreadCount: 2,
    image: "https://i.pravatar.cc/100?img=1", // Random avatar
  },
  {
    id: "2",
    name: "Study Group Beta",
    unreadCount: 0,
    image: "https://i.pravatar.cc/100?img=2", // Random avatar
  },
  {
    id: "3",
    name: "Study Group Gamma",
    unreadCount: 5,
    image: "https://i.pravatar.cc/100?img=3", // Random avatar
  },
  {
    id: "4",
    name: "Study Group Delta",
    unreadCount: 1,
    image: "https://i.pravatar.cc/100?img=4", // Random avatar
  },
  {
    id: "5",
    name: "Study Group Epsilon",
    unreadCount: 0,
    image: "https://i.pravatar.cc/100?img=5", // Random avatar
  },
];
