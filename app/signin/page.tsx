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

import { BACKEND_URI } from "../constants"

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [seePassword, setSeePassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const submitDetails = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await axios.get(`${BACKEND_URI}/signin`, {
        headers: {
          username: formData.username,
          password: formData.password,
        },
        withCredentials: true,
      })
      if (res.data.success) {
          router.push("/")
        } else {
          setError(`*${res.data.message}`)
      }
    } catch (_) {
      setError("*An error occurred. Please try again.")
      
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
              Sign In
            </motion.h1>
            <div className="space-y-4">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label htmlFor="username" className="text-sm font-medium mb-1 block">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border-gray-600 text-gray-100"
                />
              </motion.div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Label htmlFor="password" className="text-sm font-medium mb-1 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={seePassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border-gray-600 text-gray-100 pr-10"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                    onClick={() => setSeePassword(!seePassword)}
                  >
                    {seePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </div>
              </motion.div>
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
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                onClick={submitDetails}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center text-gray-400"
        >
          New user?{" "}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/signup")}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
          >
            Sign Up
          </motion.button>
        </motion.p>
      </div>
    </motion.div>
  )
}