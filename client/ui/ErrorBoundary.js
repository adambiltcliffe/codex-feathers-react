import React from "react";
import { Notification } from "react-bulma-components";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }
  render() {
    if (this.state.error) {
      if (process.NODE_ENV == "production") {
        return (
          <Notification color="danger">Something went wrong.</Notification>
        );
      }
      return (
        <Notification color="danger">
          <div>Error: {this.state.error.message}</div>
          <code>{this.state.error.stack}</code>
        </Notification>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
