"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CreateRoomModalProps {
  onClose: () => void
  onCreateRoom: (roomName: string) => void
}

export default function CreateRoomModal({ onClose, onCreateRoom }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Create Room</h2>
        <Input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="mb-4"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} className="text-black">
            Cancel
          </Button>
          <Button onClick={() => onCreateRoom(roomName)} disabled={!roomName}>
            Create Room
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

