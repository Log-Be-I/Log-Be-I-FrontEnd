import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (
      error.message?.includes("client_secret is missing") ||
      error.toString().includes("client_secret is missing")
    ) {
      console.log("🚫 ErrorBoundary: 무시된 자동 token 요청 에러");
      return { hasError: false }; // 화면 오류 막음
    }

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("📛 ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // fallback UI는 따로 없음
    }

    return this.props.children;
  }
}
