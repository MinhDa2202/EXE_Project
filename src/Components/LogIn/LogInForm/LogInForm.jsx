import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { showAlert } from "src/Features/alertsSlice";
import { setLoginData } from "src/Features/userSlice";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import s from "./LogInForm.module.scss";
import LogInFormInputs from "./LogInFormInputs/LogInFormInputs";

const LogInForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWebsiteOnline = useOnlineStatus();
  const { emailOrPhone, password } = useSelector((state) => state.forms.login);

  async function login(e) {
    e.preventDefault();

    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }

    const inputs = e.target.querySelectorAll("input");
    const isFormValid = simpleValidationCheck(inputs);
    if (!isFormValid) return;

    const payload = {
      email: emailOrPhone.trim().toLowerCase(),
      password: password.trim(),
    };

    // console.log("Payload (matching Swagger):", payload);

    try {
      const response = await fetch("https://localhost:7235/api/Auth/login", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Login failed");
      }

      const data = await response.json();
      console.log("Login success:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);

        // Cập nhật Redux
        const loginState = {
          username: data.user.fullName,
          emailOrPhone: data.user.email,
          token: data.token,
          address: data.user.address || "",
          isSignIn: true,
        };
        dispatch(setLoginData(loginState));
        localStorage.setItem("userSliceData", JSON.stringify({
          loginInfo: loginState,
          signedUpUsers: [], // hoặc lấy signedUpUsers từ Redux nếu có
        }));

        dispatch(showAlert({
          alertText: t("toastAlert.loginSuccess"),
          alertState: "success",
          alertType: "alert",
        }));

        navigate("/"); // Chuyển trang sau login
      }
    } catch (err) {
      console.error("Login error:", err);
      dispatch(showAlert({
        alertText: t("toastAlert.loginFailed"),
        alertState: "error",
        alertType: "alert",
      }));
    }
  }

  return (
    <form className={s.form} onSubmit={login}>
      <h2>{t("loginSignUpPage.login")}</h2>
      <p>{t("loginSignUpPage.enterDetails")}</p>

      <LogInFormInputs />

      <div className={s.buttons}>
        <button type="submit" className={s.loginBtn}>
          {t("buttons.login")}
        </button>
        <a href="#">{t("loginSignUpPage.forgotPassword")}</a>
      </div>

      <p className={s.signUpMessage}>
        <span>{t("loginSignUpPage.dontHaveAcc")}</span>
        <Link to="/signup">{t("nav.signUp")}</Link>
      </p>
    </form>
  );
};

export default LogInForm;

function internetConnectionAlert(dispatch, t) {
  dispatch(showAlert({
    alertText: t("toastAlert.loginFailed"),
    alertState: "error",
    alertType: "alert",
  }));
}
