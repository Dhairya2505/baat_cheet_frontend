"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import axios from "axios"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IoSearchSharp } from "react-icons/io5"

import UserList from "@/components/UserList"
import CreateRoomModal from "@/components/CreateRoomModal"
import JoinRoomModal from "@/components/JoinRoomModal"
import { BACKEND_CHAT_SERVER, BACKEND_URI } from "@/app/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GroupList from "@/components/GroupList"

export default function Home() {
  const router = useRouter()
  const [users, setUsers] = useState({})
  const [groups, setGroups] = useState({})
  const [username, setUsername] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [pageLoader, setPageLoader] = useState(true);

  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/valid_token`,{
          withCredentials: true
        });

        if (!response.data.success) {
          router.push("/signin");
          return;
        }

        setPageLoader(false);

        setUsername(response.data.data);
        const newSocket = new WebSocket(BACKEND_CHAT_SERVER);

        newSocket.onopen = () => {
          const data = {
            event: "token",
            username: response.data.data
          }
          newSocket.send(JSON.stringify(data)); 
        };

        newSocket.onmessage = (message) => {
          const data = JSON.parse(message.data)
          switch (data.event) {
            case "users":
              setUsers(data.users)
              setGroups(data.groups)
              break;

            default:
              break;
          }
        };

        setSocket(newSocket);

        return () => {
          const data = {
            event: "close",
            username
          }
          newSocket.send(JSON.stringify(data));
          newSocket.close();
        };
      } catch (error) {
        
        // toast
      
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        const data = {
          event: "close",
          username
        }
        socket.send(JSON.stringify(data));
        socket.close();
      }
    };
  }, []);


  const createRoom = () => {
    setShowCreateModal(true)
  }

  const joinRoom = () => {
    setShowJoinModal(true)
  }

  return (
    pageLoader ? <div className="h-screen w-screen flex items-center justify-center">Please wait ...</div> :
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center min-h-screen bg-gray-900 text-white font-serif p-4"
      >
        <div className="fixed flex right-0 top-0 m-1 space-x-2">
          <Button onClick={createRoom}>Create</Button>
          <Button onClick={joinRoom}>Join</Button>
        </div>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl border border-gray-700 rounded-lg p-5 shadow-lg bg-gray-800"
        >
          {/* <div className="flex mb-4">
            <Input type="text" placeholder="Search users..." className="w-full bg-gray-700 text-white border-gray-600" />
            <Button variant="outline" size="icon">
              <IoSearchSharp className="h-4 w-4 text-black" />
            </Button>
          </div> */}
          <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Search users..."
                className="w-full bg-gray-700 text-white border-gray-600"
              />
              <Button variant="outline" size="icon">
                <IoSearchSharp className="h-4 w-4 text-white" />
              </Button>
            </div>
            <UserList
              users={users}
              currentUsername={username}
              onUserClick={(toUsername) => {
                router.push(`/chat?to=${toUsername}`)
              }}
            />
          </TabsContent>
          <TabsContent value="groups">
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Search groups..."
                className="w-full bg-gray-700 text-white border-gray-600"
              />
              <Button variant="outline" size="icon">
                <IoSearchSharp className="h-4 w-4 text-white" />
              </Button>
            </div>
            <GroupList
              groups={groups}
              onGroupClick={(groupId, groupName) => {
                router.push(`/room?id=${groupId}&room_name=${groupName}`)
              }}
            />
          </TabsContent>
        </Tabs>
        </motion.div>
        {showCreateModal && (
          <CreateRoomModal
            onClose={() => setShowCreateModal(false)}
            onCreateRoom={(roomName) => {
              const id = nanoid(20)
              router.push(`/room?id=${id}&room_name=${roomName}`)
            }}
          />
        )}
        {showJoinModal && (
          <JoinRoomModal
            onClose={() => setShowJoinModal(false)}
            onJoinRoom={(roomId, roomName) => {
              router.push(`/room?id=${roomId}&room_name=${roomName}`)
            }}
          />
        )}
      </motion.div>
  )
}

