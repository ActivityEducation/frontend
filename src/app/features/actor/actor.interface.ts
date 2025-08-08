export interface Actor {
  id: string;
  type: 'Person';
  preferredUsername: string;
  name: string;
  summary: string;
  inbox: string;
  outbox: string;
  followers: string;
  following: string;
  liked: string;
  url: string;
}
