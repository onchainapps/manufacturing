import { createMuiTheme } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

export const lightTheme = createMuiTheme({
  props: {
    MuiAppBar: {
      position: "relative",
    },
    MuiCard: {
      elevation: 0,
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        background: "#006874 !important",
      },
    },
    MuiTable: {
      root: {
        background: "#006874 !important",
      },
    },
    MuiTypography: {
      root: {
        color: "#000000",
      },
    },
    MuiButton: {
      root: {
        color: "#191C1D",
        background: "#006874",
        "&$disabled": {
          "color": "#191C1D",
          "background": "#000000"
        }
      },
      textPrimary: {
        color: "#191C1D",
        background: "#006874"
      },
      textSecondary: {
        color: "#191C1D",
        background: "#4A6367"
      },
    },
  },
  palette: {
    background: {
      default: "#FBFDFD",
    },
  },
  
});

export const darkTheme = createMuiTheme({
  props: {
    MuiAppBar: {
      position: "relative",
    },
    MuiCard: {
      elevation: 0,
    },
  },
  palette: {
    type: "dark",
    background: {
      default: grey[900],
      paper: "#3F484A",
    },
    error: {
      main: "#930006",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        background: "#00363D !important",
      },
    },
    MuiTable: {
      root: {
        background: "#00363D !important",
      },
    },
    MuiTypography: {
      root: {
        color: "#ffffff",
      },
    },
    MuiButton: {
      root: {
        color: "#ffffff",
        background: "#006874",
        "&$disabled": {
          "color": "#FFFFFF",
          "background": "grey"
        }
      },
      textPrimary: {
        color: "#ffffff",
        background: "#4A6367"
      },
      textSecondary: {
        color: "#ffffff",
        background: "#BBC6EB"
      },
    },
  },
});

export default {
  darkTheme,
  lightTheme,
};
