"use client";

import { useActionState } from "react";
import { register } from "@/app/lib/actions";

export default function RegisterForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined
  );

  return (
    <form className="space-y-3" action={formAction}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl font-bold text-center">Register</h1>
        <div className="w-full space-y-4">
          <div>
            <label
              className="block text-xs font-medium text-gray-900"
              htmlFor="firstname"
            >
              First Name
            </label>
            <input
              className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
              id="firstname"
              name="firstname"
              type="text"
              required
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium text-gray-900"
              htmlFor="lastname"
            >
              Last Name
            </label>
            <input
              className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
              id="lastname"
              name="lastname"
              type="text"
              required
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
              id="email"
              name="email"
              type="email"
              required
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-2">
              User Type
            </label>
            <div className="flex gap-4 mb-5">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="user_type"
                  value="user"
                  required
                  className="accent-black"
                  defaultChecked
                />
                User
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="user_type"
                  value="seller"
                  className="accent-black"
                />
                Seller
              </label>
            </div>
          </div>
        </div>

        <button
          className="mt-4 w-full bg-black text-white rounded-2xl py-2 cursor-pointer border-2 border-black hover:bg-white hover:text-black transition duration-1000"
          aria-disabled={isPending}
        >
          Register
        </button>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
      </div>
    </form>
  );
}
