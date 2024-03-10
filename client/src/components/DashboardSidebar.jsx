import { Sidebar } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { signOutFailure, signOutSuccess } from "../redux/user/userSlice";

export default function DashboardSidebar() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const tabFromUrl = urlParam.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/v1/users/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.status == 200) {
        dispatch(signOutSuccess());
      } else {
        dispatch(signOutFailure(data.message));
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Sidebar.Item
            href="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.isAdmin ? "Admin":"User"}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          {currentUser.isAdmin && (
            <Sidebar.Item
              href="/dashboard?tab=posts"
              active={tab === "posts"}
              icon={HiDocumentText}
            >
              Posts
            </Sidebar.Item>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
