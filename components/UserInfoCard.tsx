import Image from "next/image";
import { useState } from "react";

interface UserInfoCardProps {
  userInfo: {
    id: number;
    username: string;
    avatar: string;
    email: string;
  } | null;
  onSave: (
    editedUsername: string,
    editedEmail: string,
    editedAvatar: string,
    editedPassword: string,
  ) => void;
  onClose: () => void;
}

const UserInfoCard = ({ onClose, userInfo, onSave }: UserInfoCardProps) => {
  const [editedUsername, setEditedUsername] = useState(
    userInfo?.username || "",
  );
  const [editedEmail, setEditedEmail] = useState(userInfo?.email || "");
  const [editedPassword, setEditedPassword] = useState("********");
  const [editedAvatar, setEditedAvatar] = useState(
    userInfo?.avatar || "/avatar/monkey1.jpg",
  );

  return (
    <div className="min-h-screen fixed inset-0 flex items-center justify-center bg-gray-900/50 bg-opacity-50 z-150">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-100 h-80">
        <div className="flex items-center gap-4">
          <Image
            src={editedAvatar}
            alt="用户头像"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="flex-col ml-2 mt-4 text-sm">
            <div className="flex items-center mb-2">
              <label htmlFor="user-name">用户</label>
              <input
                type="text"
                id="user-name"
                className="border w-50 border-gray-300 rounded px-2 py-1 ml-2 outline-blue-500"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-2">
              <label htmlFor="user-email">邮箱</label>
              <input
                type="text"
                id="user-email"
                className="border w-50 border-gray-300 rounded px-2 py-1 ml-2 outline-blue-500"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="user-password">密码</label>
              <input
                type="password"
                id="user-password"
                className="border w-50 border-gray-300 rounded px-2 py-1 ml-2 outline-blue-500"
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 border-t border-b border-gray-300 py-4">
          <Image
            src="/avatar/monkey1.jpg"
            alt="用户头像"
            title="更换为默认头像"
            width={60}
            height={60}
            className="rounded-full"
            onClick={() => setEditedAvatar("/avatar/monkey1.jpg")}
          />
          <Image
            src="/avatar/monkey2.jpg"
            alt="用户头像"
            title="更换为默认头像"
            width={60}
            height={60}
            className="rounded-full"
            onClick={() => setEditedAvatar("/avatar/monkey2.jpg")}
          />
          <Image
            src="/avatar/monkey3.jpg"
            alt="用户头像"
            title="更换为默认头像"
            width={60}
            height={60}
            className="rounded-full"
            onClick={() => setEditedAvatar("/avatar/monkey3.jpg")}
          />
          <Image
            src="/avatar/monkey4.jpg"
            alt="用户头像"
            title="更换为默认头像"
            width={60}
            height={60}
            className="rounded-full"
            onClick={() => setEditedAvatar("/avatar/monkey4.jpg")}
          />
          <Image
            src="/avatar/monkey5.jpg"
            alt="用户头像"
            title="更换为默认头像"
            width={60}
            height={60}
            className="rounded-full"
            onClick={() => setEditedAvatar("/avatar/monkey5.jpg")}
          />
        </div>
        <div className="flex items-center justify-center-safe text-sm">
          <button
            onClick={() =>
              onSave(editedUsername, editedEmail, editedAvatar, editedPassword)
            }
            className="mt-4 bg-blue-500 rounded-2xl text-white px-4 py-2  hover:bg-blue-600"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="mt-4 ml-4 bg-red-500 rounded-2xl text-white px-4 py-2  hover:bg-red-600"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
