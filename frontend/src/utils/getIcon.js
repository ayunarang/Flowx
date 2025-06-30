import LoginIcon from '@mui/icons-material/Login';
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CopyrightIcon from "@mui/icons-material/Copyright";
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CalculateIcon from "@mui/icons-material/Calculate";
import HttpIcon from "@mui/icons-material/Http";
import ShapeLineIcon from "@mui/icons-material/ShapeLine";

export const getIconForType = (type) => {
  switch (type) {
    case "customInput":
      return <LoginIcon  />;
    case "text":
      return <TextFieldsIcon />;
    case "operation":
      return <CalculateIcon  />;
    case "api":
      return <HttpIcon />;
    case "customOutput":
      return <LogoutIcon  />;
    case "auth":
      return <SecurityIcon/>;
    case "llm":
      return <ShapeLineIcon />;
    case "constant":
      return <CopyrightIcon />;
    default:
      return <HelpOutlineIcon/>;
  }
};
