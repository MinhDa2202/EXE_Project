import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { googleIcon } from "src/Assets/Images/Images";
import { DEFAULT_LOGIN_DATA } from "src/Data/globalVariables";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import { openSignWithGooglePopUp } from "../../SignUpWithGoogle/SignUpWithGooglePopup";
import s from "./SignUpButtons.module.scss";

const SignUpButtons = () => {
  const { t } = useTranslation();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  let isSignUpWithGooglePressed = false;

  function handleSignUpWithGoogle() {
    if (isSignUpWithGooglePressed) return;
    isSignUpWithGooglePressed = true;

    openSignWithGooglePopUp();
    setDefaultSignUpData();
    signInAlert();
  }

  function setDefaultSignUpData() {
    setTimeout(() => {
      navigateTo("/");
      isSignUpWithGooglePressed = false;

      setTimeout(() => dispatch(setLoginData(DEFAULT_LOGIN_DATA)), 500);
    }, 2500);
  }

  function signInAlert() {
    const alertText = t("toastAlert.signInSuccess");
    const alertState = "success";

    setTimeout(() => {
      dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
    }, 1500);
  }

  return (
    <div className={s.buttons}>
      <button type="submit" className={s.createAccBtn}>
        {t("buttons.createAccount")}
      </button>

      <button
        type="button"
        className={s.signUpBtn}
        onClick={handleSignUpWithGoogle}
      >
        <img src={googleIcon} alt="Colored Google icon" />
        <span>{t("buttons.signUpWithGoogle")}</span>
      </button>

      <p>
        <span>{t("loginSignUpPage.alreadyHaveAcc")}</span>
        <Link to="/login">{t("buttons.login")}</Link>
      </p>
    </div>
  );
};
export default SignUpButtons;