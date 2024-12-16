import React, { useCallback } from "react";
import PropTypes from 'prop-types';
import Logo from "../../images/logo_white.JPG";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Colors from "../../utils/Colors.js";

const containerStyle = {
  marginBottom: 10,
  display: "flex",
  flexDirection: "row",
  justifyContent: 'center',
  alignItems: "center",
};

const backButtonStyle = {
  position: 'absolute',
  left: 10,
};

const logoStyle = {
  height: 60,
  width: 60,
  borderRadius: 100,
};

const headingStyle = {
  flex: 1,
  textAlign: 'center',
  marginLeft: -12,
};

const LogoHeader = ({ showLogo, backAction, heading }) => {
  const navigate = useNavigate();
  
  const handleBack = useCallback(() => {
    if (backAction) {
      backAction();
    } else {
      navigate(-1);
    }
  }, [backAction, navigate]);

  return (
    <div style={containerStyle}>
      <div style={backButtonStyle}>
        <IoIosArrowDropleftCircle
          onClick={handleBack}
          size={30}
          color={Colors.BLACK}
        />
      </div>
      {showLogo && (
        <img
          src={Logo}
          style={logoStyle}
          alt="Logo"
          loading="lazy"
        />
      )}
      {heading && (
        <div style={headingStyle}>{heading}</div>
      )}
    </div>
  );
};

LogoHeader.propTypes = {
  showLogo: PropTypes.bool,
  backAction: PropTypes.func,
  heading: PropTypes.string,
};

LogoHeader.defaultProps = {
  showLogo: false,
  backAction: null,
  heading: '',
};

export default React.memo(LogoHeader);