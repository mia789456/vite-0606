import React, { useRef } from "react";
import "./CuteLogin.css";

export default function CuteLogin() {
  const passwordRef = useRef<HTMLInputElement>(null);

  // 控制状态用 class
  const handleFocus = () => {
    document.getElementById("cute-man")?.classList.add("cover");
  };
  const handleBlur = () => {
    document.getElementById("cute-man")?.classList.remove("cover");
  };

  return (
    <div className="cute-login-container">
      <svg
        id="cute-man"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="cute-man"
      >
        {/* 头部 */}
        <ellipse cx="60" cy="50" rx="40" ry="40" fill="#ffe0b2" />
        {/* 眼睛（睁开） */}
        <g className="eyes eyes-open">
          <ellipse cx="45" cy="50" rx="6" ry="4" fill="#333" />
          <ellipse cx="75" cy="50" rx="6" ry="4" fill="#333" />
        </g>
        {/* 眼睛（闭上） */}
        <g className="eyes eyes-closed">
          <rect x="39" y="50" width="12" height="2" rx="1" fill="#333" />
          <rect x="69" y="50" width="12" height="2" rx="1" fill="#333" />
        </g>
        {/* 手臂 */}
        <g className="hands">
          {/* 左手 */}
          <rect
            className="hand hand-left"
            x="10"
            y="80"
            width="16"
            height="40"
            rx="8"
            fill="#ffe0b2"
          />
          {/* 右手 */}
          <rect
            className="hand hand-right"
            x="94"
            y="80"
            width="16"
            height="40"
            rx="8"
            fill="#ffe0b2"
          />
        </g>
      </svg>
      <form className="cute-login-form" autoComplete="off">
        <input type="text" placeholder="用户名" autoComplete="off" />
        <input
          type="password"
          placeholder="密码"
          ref={passwordRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        <button type="submit">登录</button>
      </form>
    </div>
  );
} 