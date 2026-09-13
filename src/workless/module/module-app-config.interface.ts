export type ModuleSubMenuConfig = {
  title: string;
  name: string;
  url: string;
  description?: string;
  icon?: string;
};

export type ModuleAppConfig = {
  title?: string;
  name: string;
  url?: string;
  icon: string;
  version: string;
  license: string;
  author: string;
  category: string;
  website: string;
  description: string;
  subMenu: ModuleSubMenuConfig[];
  installable: boolean;
  application: boolean;
};
