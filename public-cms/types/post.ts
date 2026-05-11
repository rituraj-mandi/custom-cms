export type EditorBlock = {
  id?: string;

  type: string;

  data: any;
};

export type EditorContent = {
  time?: number;

  blocks: EditorBlock[];

  version?: string;
};

export type Post = {
  id: string;

  title: string;

  slug: string;

  category: string;

  subcategory: string;

  content: EditorContent;

  created_at: string;
};