import 'url-search-params-polyfill';

import React from 'react';

import { useHistory, useLocation } from '@docusaurus/router';

import { TagType, toggleListItem } from '../../../utils/showcase';

interface Props extends React.ComponentProps<"input"> {
  icon: React.ReactElement<React.ComponentProps<"svg">>;
  label: React.ReactNode;
  tag: TagType;
}

export function readSearchTags(search: string): TagType[] {
  return new URLSearchParams(search).getAll("tags") as TagType[];
}

function replaceSearchTags(search: string, newTags: TagType[]) {
  const searchParams = new URLSearchParams(search);
  searchParams.delete("tags");
  newTags.forEach((tag) => searchParams.append("tags", tag));
  return searchParams.toString();
}

export const TagSelect = React.forwardRef<HTMLLabelElement, Props>(
  ({ id, icon, label, tag, ...rest }, ref) => {
    const location = useLocation();
    const history = useHistory();
    const [selected, setSelected] = React.useState(false);
    React.useEffect(() => {
      const tags = readSearchTags(location.search);
      setSelected(tags.includes(tag));
    }, [tag, location]);
    const toggleTag = React.useCallback(() => {
      const tags = readSearchTags(location.search);
      const newTags = toggleListItem(tags, tag);
      const newSearch = replaceSearchTags(location.search, newTags);
      history.push({ ...location, search: newSearch });
    }, [tag, location, history]);
    return (
      <button
        style={{
          display: "flex",
          alignItems: "center",
        }}
        className={`button button--sm button--outline button--secondary ${
          selected ? "button--active" : ""
        }`}
        onClick={() => {
          toggleTag();
        }}
      >
        {label}
        {icon}
      </button>
    );
  }
);
