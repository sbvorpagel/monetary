import React from "react";
import { Select as MSelect, MenuItem } from "@material-ui/core/index";

interface Props {
  value: string;
  onChange: Function;
  name: string;
  selectDefault: string;
  items: Array<any>;
  itemKey?: string;
}

const Select: React.SFC<Props> = props => {
  const { value, onChange, name, selectDefault, items, itemKey } = props;
  return (
    <MSelect
      value={value}
      onChange={e => onChange(e.target.value)}
      displayEmpty
      fullWidth
      name={name}
      style={{
        marginTop: 16
      }}
    >
      <MenuItem value="">
        <em>{selectDefault}</em>
      </MenuItem>
      {items.map(item => (
        <MenuItem value={item.id}>{item[itemKey || "description"]}</MenuItem>
      ))}
    </MSelect>
  );
};

export default Select;
