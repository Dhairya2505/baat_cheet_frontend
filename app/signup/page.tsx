"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { passwordStrength } from "check-password-strength"

import { BACKEND_URI } from "@/app/constants"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
  })
  const [seePassword, setSeePassword] = useState(false)
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const submitDetails = async () => {
    setError("")
    setLoading(true)

    if (!formData.username) {
      setError("*Username required")
    } else if (!formData.email) {
      setError("*Email required")
    } else if (!formData.password) {
      setError("*Password required")
    } else if (formData.password !== formData.confirmpassword) {
      setError("*Passwords do not match")
    } else if (!passwordStrength(formData.password).id || passwordStrength(formData.password).id === 1) {
      setError("*Weak password")
    } else {
      try {
        const res = await axios.post(
          `${BACKEND_URI}/signup`,
          {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          },
        )
        if (res.data.statusCode === 200) {
            router.push("/")
        } else {
            setError(`*${res.data.message}`)
        }
      } catch (_) {
        setError("*An error occurred. Please try again.")
      }
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans"
    >
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center flex-grow">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold mb-6 text-center text-purple-400"
            >
              Sign Up
            </motion.h1>
            <div className="space-y-4">
              {["email", "username", "password", "confirmpassword"].map((field: string, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Label htmlFor={field} className="text-sm font-medium mb-1 block">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace("Password", " Password")}
                  </Label>
                  <div className="relative">
                    <Input
                      type={
                        field.includes("password") ? field === "password"
                            ? seePassword
                              ? "text"
                              : "password"
                            : seeConfirmPassword
                              ? "text"
                              : "password"
                          : field === "email"
                            ? "email"
                            : "text"
                      }
                      id={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border-gray-600 text-gray-100 pr-10"
                    />
                    {field.includes("password") && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                        onClick={() =>
                          field === "password"
                            ? setSeePassword(!seePassword)
                            : setSeeConfirmPassword(!seeConfirmPassword)
                        }
                      >
                        {(field === "password" ? seePassword : seeConfirmPassword) ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-red-400 text-sm mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                onClick={submitDetails}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 text-center text-gray-400"
        >
          Already a user?{" "}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/signin")}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
          >
            Sign In
          </motion.button>
        </motion.p>
      </div>
    </motion.div>
  )
}