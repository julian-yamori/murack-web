import { Divider, ListItemText, MenuItem, MenuList } from "@mui/material";

/// AppBar から呼び出す、最上位の各種ページに遷移するメニュー
export const NavigationMenu: React.FC = () => {
  return (
    <MenuList>
      <PageItem text="アーティスト" onClick={() => {}} />
      <Divider />

      <PageItem text="タググループリスト（仮）" onClick={() => {}} />
    </MenuList>
  );
};

/** ページを開くメニュー項目 */
const PageItem: React.FC<
  { text: string; onClick: (e: React.MouseEvent) => unknown }
> = ({ text, onClick }) => {
  return (
    <MenuItem onClick={onClick}>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
};
