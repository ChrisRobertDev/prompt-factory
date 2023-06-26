export interface Creator {
  __v: number;
  _id: string;
  email: string;
  image: string;
}

export interface Prompt {
  __v: number;
  _id: string;
  creator: Creator;
  prompt: string;
  tag: string;
}
