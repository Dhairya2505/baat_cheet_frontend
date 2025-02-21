"use client"

import { motion } from "framer-motion"

type group = { [key: string]: {[key: string]: string} }

interface GroupListProps {
  groups: group
  onGroupClick: (groupId: string, groupName: string) => void
}

export default function GroupList({ groups, onGroupClick }: GroupListProps) {
  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      {
        Object.entries(groups).map(([room_id, room], index) => {
          return <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center text-white border-b border-gray-700 p-4 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => onGroupClick(room_id, Object.keys(room)[0])}
          >
            <div className="w-full">
              <div className="text-lg font-semibold">{Object.keys(room)[0]}</div>
              <div className="text-sm text-gray-400">Click to join the group chat</div>
            </div>
          </motion.div>
        })
      }
    </div>
  )
}