import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "./navbar.css";
import Profile from "../profile/profile";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiHomeOutline,
  mdiFileDocumentOutline,
  mdiFilePlusOutline,
  mdiCalendarRemoveOutline,
  mdiClipboardCheckOutline,
  mdiLogout,
  mdiAccountCircleOutline,
  mdiAccountCardOutline,
} from "@mdi/js";

const { TabPane } = Tabs;

export default function Navbar() {
  const pathes = {
    worker: ["/main", "/tasks", "/timeTracking"],
    head: [
      "/main",
      "/createContract",
      "/absenceNotice",
      "/contracts",
      "/chartsPage",
      "/tasks",
      "/timeTracking",
    ],
    director: ["/contracts", "/createContract", "/tasks", "/timeTracking"],
  };
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser"))
  );
  const navigation = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const pathesList = pathes[loggedUser.position];
    if (!pathesList.includes(location.pathname)) {
      navigation("/");
    }
  }, [loggedUser.position, navigation]);

  const handleTabClick = (key) => {
    if (key === "logout") {
      navigation("/");
    } else if (key === "profile") {
      setIsProfileOpen(true);
    } else {
      navigation(key);
    }
  };

  return (
    <>
      <Tabs defaultActiveKey={location.pathname} onTabClick={handleTabClick} className="navbar">
        <TabPane
          icon={<Icon path={mdiAccountCircleOutline} size={1} />}
          tab={
            <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
              Profile
            </span>
          }
          key="profile"
        />
        {loggedUser.position === "director" && (
          <>
            <TabPane
              icon={<Icon path={mdiFileDocumentOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Contracts
                </span>
              }
              key="/contracts"
            />
            <TabPane
              icon={<Icon path={mdiFilePlusOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  New Contract
                </span>
              }
              key="/createContract"
            />
            <TabPane
              icon={<Icon path={mdiClipboardCheckOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Tasks
                </span>
              }
              key="/tasks"
            />
          </>
        )}
        {loggedUser.position === "head" && (
          <>
            <TabPane
              icon={<Icon path={mdiAccountCardOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Pay sheets
                </span>
              }
              key="/main"
            />
            <TabPane
              icon={<Icon path={mdiFilePlusOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  New Contract
                </span>
              }
              key="/createContract"
            />
            <TabPane
              icon={<Icon path={mdiCalendarRemoveOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Notices
                </span>
              }
              key="/absenceNotice"
            />
            <TabPane
              icon={<Icon path={mdiFileDocumentOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Contracts
                </span>
              }
              key="/contracts"
            />
            <TabPane
              icon={<Icon path={mdiClipboardCheckOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Tasks
                </span>
              }
              key="/tasks"
            />
          </>
        )}
        {loggedUser.position === "worker" && (
          <>
            <TabPane
              icon={<Icon path={mdiAccountCardOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Pay sheets
                </span>
              }
              key="/main"
            />
            <TabPane
              icon={<Icon path={mdiClipboardCheckOutline} size={1} />}
              tab={
                <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
                  Tasks
                </span>
              }
              key="/tasks"
            />
          </>
        )}
        <TabPane
          icon={<Icon path={mdiLogout} size={1} />}
          tab={
            <span style={{ height: "100%", textAlign: 'center', alignItems: 'center' }}>
              Logout
            </span>
          }
          key="logout"
        />
      </Tabs>
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
