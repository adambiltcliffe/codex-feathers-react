import React from "react";

import { Content, List } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

export default function Queue(props) {
  if (!props.state) {
    return null;
  }
  const { currentTrigger, newTriggers, queue } = props.state;
  const queueItems = [];
  if (currentTrigger) {
    queueItems.push(
      <List.Item key="current">
        <Content size="small">Currently resolving:</Content>
        {CodexGame.interface.describeQueueItem(currentTrigger)}
      </List.Item>
    );
  }
  queue.forEach((t, index) => {
    const content = CodexGame.interface.describeQueueItem(t);
    const key = `${index}${content}`;
    // We don't have anything better than this we can use as a key
    queueItems.push(<List.Item key={key}>{content}</List.Item>);
  });
  newTriggers.forEach((t, index) => {
    const content = CodexGame.interface.describeQueueItem(t);
    const key = `${index}${content}`;
    queueItems.push(
      <List.Item key={key}>
        <Content size="small">Newly triggered:</Content>
        {content}
      </List.Item>
    );
  });
  if (queueItems.length == 0) {
    return null;
  }
  return <List>{queueItems}</List>;
}
