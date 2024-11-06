import { Permissions } from "../model/permissions/Permissions";

export const determineRedirectURI = (url: string) => {
  if (url.includes('minifig-shop-hub-staging')) {
    return 'https://www.prblmtq.com/projects/minifig-shop-hub-staging';
  } else if (url.includes('minifig-shop-hub')) {
    return 'https://www.prblmtq.com/projects/minifig-shop-hub';
  } else {
    return 'http://localhost:3000';
  }
};

export const isAdmin = (permissions: string[]) => {
  return permissions.includes(Permissions.ADMIN);
}

export const hasAccessToLabelMaker = (permissions: string[]) => {
  return isAdmin(permissions) || permissions.includes(Permissions.LABEL_MAKER_READ);
}

export const hasAccessToPartCollector = (permissions: string[]) => {
  return isAdmin(permissions) || permissions.includes(Permissions.PART_COLLECTOR_READ)
    || permissions.includes(Permissions.PART_COLLECTOR_WRITE);
}

export const hasAccessToRolodex = (permissions: string[]) => {
  return isAdmin(permissions) || permissions.includes(Permissions.ROLODEX_READ)
    || permissions.includes(Permissions.ROLODEX_WRITE);
}