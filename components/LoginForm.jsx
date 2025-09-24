"use client";

import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res.error) {
        setFieldError("general", "Invalid email or password");
      } else {
        const session = await getSession();
      if (session) {
        sessionStorage.setItem(
          "auth",
          JSON.stringify({
            user: session.user,
            token: session.accessToken,
            expires:session.expires,
          })
        );
      }

        router.replace("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setFieldError("general", "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg border-t-4 border-green-400 p-10 md:p-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">
          Login
        </h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="flex flex-col gap-6">
              <div className="flex flex-col">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex flex-col">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {errors.general && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-md text-center">
                  {errors.general}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
