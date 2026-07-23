import { useGoogleLogin } from "@react-oauth/google";
import { getGoogleUser } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    scope:
      "openid profile email https://www.googleapis.com/auth/drive.readonly",

    onSuccess: async (tokenResponse) => {
      try {
        const googleUser = await getGoogleUser(tokenResponse.access_token);

        login({
          id: googleUser.sub,
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          accessToken: tokenResponse.access_token,
          expiresAt:
            Date.now() + (tokenResponse.expires_in ?? 3600) * 1000 - 60_000,
        });

        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },

    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-10 text-center">
        <h1 className="mb-3 text-5xl font-bold text-red-600">
          DriveFlix
        </h1>

        <p className="mb-10 text-zinc-400">
          Watch your Google Drive movies.
        </p>

        <button
          type="button"
          onClick={() => googleLogin()}
          data-tv-focus-key="login-google"
          data-tv-autofocus
          className="min-h-16 w-full rounded-xl bg-red-600 px-8 py-4 text-xl font-semibold text-white transition hover:bg-red-700"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
