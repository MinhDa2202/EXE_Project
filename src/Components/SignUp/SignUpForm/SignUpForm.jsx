import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlert } from "src/Features/alertsSlice";
import { newSignUp, setLoginData } from "src/Features/userSlice";
import { simpleValidationCheck } from "src/Functions/componentsFunctions";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus";
import SignUpButtons from "./SignUpButtons/SignUpButtons";
import s from "./SignUpForm.module.scss";
import SignUpFormInputs from "./SignUpFormInputs/SignUpFormInputs";

const SignUpForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWebsiteOnline = useOnlineStatus();
  const { username, emailOrPhone, password } = useSelector(
    (state) => state.forms.signUp
  );

  async function signUp(e) {
    e.preventDefault();
    console.log("SignUp function called");

    if (!isWebsiteOnline) {
      console.log("Website is offline");
      internetConnectionAlert(dispatch, t);
      return;
    }

    const inputs = e.target.querySelectorAll("input");
    const isFormValid = simpleValidationCheck(inputs);
    console.log("Form valid:", isFormValid);
    console.log("Form data:", { username, emailOrPhone, password });
    
    // Tạm thời bỏ qua validation để test API
    // if (!isFormValid) {
    //   console.log("Form validation failed");
    //   return;
    // }

    // Kiểm tra basic validation
    if (!username.trim() || !emailOrPhone.trim() || !password.trim()) {
      console.log("Basic validation failed - empty fields");
      dispatch(showAlert({
        alertText: "Please fill all fields",
        alertState: "error",
        alertType: "alert",
      }));
      return;
    }

    const payload = {
      fullName: username.trim(),
      email: emailOrPhone.trim().toLowerCase(),
      password: password.trim(),
    };

    // console.log("Payload (matching Swagger):", payload);

    try {
      const response = await fetch("https://localhost:7235/api/Auth/register", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(errorText || "Registration failed");
      }

      // Kiểm tra content type để xử lý response phù hợp
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Registration success (JSON):", data);
      } else {
        // Server trả về text
        const textResponse = await response.text();
        console.log("Registration success (Text):", textResponse);
        data = { message: textResponse };
      }

      // Nếu có token trong response thì xử lý, nếu không thì chỉ hiển thị thông báo thành công
      if (data.token) {
        localStorage.setItem("token", data.token);

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
          signedUpUsers: [],
        }));
      } else {
        // Nếu không có token, chỉ cập nhật thông tin cơ bản
        const loginState = {
          username: username,
          emailOrPhone: emailOrPhone,
          token: null,
          address: "",
          isSignIn: true,
        };
        dispatch(setLoginData(loginState));
      }

      dispatch(showAlert({
        alertText: t("toastAlert.signInSuccess"),
        alertState: "success",
        alertType: "alert",
      }));

      navigate("/"); // Chuyển trang sau đăng ký thành công
    } catch (err) {
      console.error("Registration error:", err);
      dispatch(showAlert({
        alertText: t("toastAlert.signUpFailed") || "Registration failed",
        alertState: "error",
        alertType: "alert",
      }));
    }
  }

  return (
    <form action="POST" className={s.form} onSubmit={signUp}>
      <h2>{t("loginSignUpPage.createAccount")}</h2>
      <p>{t("loginSignUpPage.enterDetails")}</p>

      <SignUpFormInputs />
      <SignUpButtons />
    </form>
  );
};

export default SignUpForm;

function internetConnectionAlert(dispatch, t) {
  dispatch(showAlert({
    alertText: t("toastAlert.loginFailed"),
    alertState: "error",
    alertType: "alert",
  }));
}