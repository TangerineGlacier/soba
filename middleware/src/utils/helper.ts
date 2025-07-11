export interface FilterAPI {
  filterKey: string;
  filterValue: string;
}

export const generateURLString = ({
  fields,
  populate,
  dataFilter,
  relationFilter,
  additional,
}: {
  fields?: string[];
  populate?: string[];
  dataFilter?: FilterAPI[];
  relationFilter?: FilterAPI[];
  additional?: string;
}) => {
  let fieldsstr = "";
  let filterstr = "";
  if ((fields && fields.length > 0) || (populate && populate.length > 0)) {
    if(fields && fields.length > 0){
        for(let i = 0 ; i< fields.length ;i++){
            fieldsstr = fieldsstr + `&fields[${i}]=${fields[i]}`
        }
    }
    if(populate && populate.length > 0){
        for(let i = 0 ; i< populate.length ;i++){
            fieldsstr = fieldsstr + `&populate[${i}]=${populate[i]}`
        }
    }
  } else {
    fieldsstr = "&populate=*"
  }
  if(dataFilter){
    for(let i=0 ; i< dataFilter.length ; i++){
        filterstr = filterstr + `&filters[${dataFilter[i].filterKey}][$eq]=${dataFilter[i].filterValue}`
    }
  }
  if(relationFilter){
    for(let i=0 ; i< relationFilter.length ; i++){
        filterstr = filterstr + `&filters[${relationFilter[i].filterKey}][documentId][$eq]=${relationFilter[i].filterValue}`
    }
  }
  return `${fieldsstr}${filterstr}&${additional ?? ""}`;
};


export function removePostIdsFromConfig(
  config: any,
  postIds: string[],
  spaceRoute: string
): any {
  // Helper function to filter IDs for the specified spaceRoute
  const filterIds = (array: any[]) =>
    array.map(item =>
      item.spaceRoute === spaceRoute
        ? { ...item, ids: item.ids.filter((id: string) => !postIds.includes(id)) }
        : item
    );

  // Create a new object with updated `upvotes`, `downvotes`, and `bookmarks`
  return {
    upvotes: filterIds(config.upvotes || []),
    downvotes: filterIds(config.downvotes || []),
    bookmarks: filterIds(config.bookmarks || []),
  };
}

export const convertKeysToLowercase = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {} as Record<string, any>);
};