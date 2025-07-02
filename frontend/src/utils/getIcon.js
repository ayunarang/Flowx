import LoginIcon from '@mui/icons-material/Login';
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CopyrightIcon from "@mui/icons-material/Copyright";
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CalculateIcon from "@mui/icons-material/Calculate";
import HttpIcon from "@mui/icons-material/Http";
import ShapeLineIcon from "@mui/icons-material/ShapeLine";

export const getIconForType = (type, size = 24, style) => {
  const iconProps = { style: { fontSize: size , color: style} };

  switch (type) {
    case "customInput":
      return <LoginIcon {...iconProps} />;
    case "text":
      return <TextFieldsIcon {...iconProps} />;
    case "operation":
      return <CalculateIcon {...iconProps} />;
    case "api":
      return <HttpIcon {...iconProps} />;
    case "customOutput":
      return <LogoutIcon {...iconProps} />;
    case "auth":
      return <SecurityIcon {...iconProps} />;
    case "llm":
      return <ShapeLineIcon {...iconProps} />;
    case "constant":
      return <CopyrightIcon {...iconProps} />;
    default:
      return <HelpOutlineIcon {...iconProps} />;
  }
};
