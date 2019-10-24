import React from "react";

import { Content, Panel } from "react-bulma-components";

import lowerCase from "lodash/lowerCase";
import upperFirst from "lodash/upperFirst";

function displayType(t) {
  return upperFirst(lowerCase(t));
}

function displaySpec(s) {
  return upperFirst(lowerCase(s));
}

function displayColor(c) {
  return upperFirst(lowerCase(c));
}

function displayAbility(a) {
  return a.keyword || a.path;
}

function displayAbilities(entity) {
  return (entity.current.abilities || [])
    .map(a => displayAbility(a))
    .join(", ");
}

function displayOwner(entity) {
  return `(Owned by ${entity.owner})`;
}

export default function EntityCard(props) {
  const { entity, constructing } = props;
  if (!entity) {
    return null;
  }
  if (entity.constructing) {
    return <ConstructingBuildingCard building={entity.constructing} />;
  }
  const techText =
    entity.current.tech !== undefined && !entity.current.token
      ? `Tech ${entity.current.tech} `
      : "";
  const specText = entity.current.spec
    ? displaySpec(entity.current.spec) + " "
    : entity.current.color
    ? displayColor(entity.current.color) + " "
    : "";
  const supertypes = ["legendary", "token", "ongoing"].filter(
    t => entity.current[t]
  );
  const supertypeText =
    supertypes.length > 0 ? supertypes.map(upperFirst).join(" ") + " " : "";
  const subtypeText =
    entity.current.subtypes.length > 0
      ? " — " + entity.current.subtypes.join(" ")
      : "";
  const subtitle = `${techText}${supertypeText}${specText}${displayType(
    entity.current.type
  )}${subtypeText}`;
  const heading =
    entity.current.type == "HERO" ? (
      <>
        <div>
          {upperFirst(entity.current.name)}, {entity.current.title}
        </div>
        <div className="content is-small">{subtitle}</div>
      </>
    ) : (
      <>
        <div>{upperFirst(entity.current.name)}</div>
        <div className="content is-small">{subtitle}</div>
      </>
    );
  const showOwner = entity.owner != entity.current.controller;
  const body = (
    <>
      {showOwner ? (
        <div className="content is-small">{`${displayOwner(entity)}`}</div>
      ) : null}
      <div className="content is-small">{`${displayAbilities(entity)}`}</div>
    </>
  );
  const footerExtra =
    (entity.armor > 0 ? `, ${entity.armor} armor` : "") +
    (entity.damage > 0 ? `, ${entity.damage} damage` : "");
  const footer =
    entity.current.type == "SPELL" || entity.current.type == "UPGRADE"
      ? null
      : entity.current.type == "BUILDING"
      ? `${entity.current.hp}hp`
      : `${entity.current.attack}/${entity.current.hp}`;
  return (
    <Panel>
      <Panel.Block>
        <div>{heading}</div>
      </Panel.Block>
      <Panel.Block className="card-text">
        <div>{body}</div>
      </Panel.Block>
      {footer ? (
        <Panel.Block>
          {footer}
          {footerExtra}
        </Panel.Block>
      ) : null}
    </Panel>
  );
}

function ConstructingBuildingCard(props) {
  return (
    <Panel>
      <Panel.Block>
        <div>
          <div>{upperFirst(props.building)}</div>
          <div className="content is-small">Building</div>
        </div>
      </Panel.Block>
      <Panel.Block className="card-text" />
      <Panel.Block>
        <div className="content is-small">(Under construction)</div>
      </Panel.Block>
    </Panel>
  );
}
