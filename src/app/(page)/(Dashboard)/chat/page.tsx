import React from "react";
import ArticleNavbar from "@/components/global/navbar";
import RightSidebar from "@/components/global/sidebar/rightside";
import Chatbox from "@/components/global/chat";

const Chat = () => {
  return (
    <div className="flex h-screen">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ">
        {/* Fixed Navbar */}
        <div className="w-full top-0 left-64 right-80 bg-#ECF9F2 border-b border-gray-200 z-20">
          <ArticleNavbar />
        </div>

        {/* Chat Area */}
        <div className="flex-1 pt-14">
          <Chatbox />
        </div>
      </div>

      {/* Fixed Right Sidebar */}
      {/* <div className="fixed top-0 right-0 bottom-0 w-80 border-l border-gray-200 bg-white z-10">
        <div className="pt-14 h-full">
          <RightSidebar />
        </div>
      </div> */}
    </div>
  );
};

export default Chat;