import { useState } from "react";
import {
  AppBar as MuiAppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { NavigationMenu } from "./NavigationMenu.tsx";
import { useNavigationState } from "./navigation_state.tsx";
import { usePopPage } from "./navigation_hooks.ts";

export const AppBar: React.FC = () => {
  const navigationState = useNavigationState();
  const popPage = usePopPage();

  const [menuOpened, setMenuOpened] = useState(false);

  const closeMenu = () => {
    setMenuOpened(false);
  };

  const canGoBack = navigationState.pageStack.length > 1;

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setMenuOpened(true)}
        >
          <MenuIcon />
        </IconButton>

        {
          // 戻るボタン (ページスタックを戻れるときだけ表示)
          canGoBack && (
            <IconButton
              size="large"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2 }}
              onClick={popPage}
            >
              <ArrowBackIcon />
            </IconButton>
          )
        }

        <Typography variant="h4">Murack Web</Typography>

        <Drawer open={menuOpened} onClose={closeMenu}>
          <NavigationMenu onClose={closeMenu} />
        </Drawer>
      </Toolbar>
    </MuiAppBar>
  );
};
