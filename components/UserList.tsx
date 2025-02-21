"use client"

import { motion } from "framer-motion"

type user = { [key: string]: WebSocket }

interface UserListProps {
  users: user
  currentUsername: string
  onUserClick: (username: string) => void
}

export default function UserList({ users, currentUsername, onUserClick }: UserListProps) {
  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      {Object.entries(users).map(
        (userObject, index) =>
          userObject[0] !== currentUsername && (
            <motion.div
              key={userObject[0]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center text-white border-b border-gray-700 p-4 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => onUserClick(userObject[0])}
            >
              <div className="w-4/5">
                <div className="text-lg font-semibold">{userObject[0]}</div>
                <div className="text-sm text-gray-400">Click to start chatting</div>
              </div>
            </motion.div>
          )
      )}
    </div>
  )
}

