import isEqual from "lodash/isEqual";
import { useEffect, useRef } from "react";

export function useWhyDidYouUpdate(name, props) {
  const latestProps = useRef(props);

  useEffect(() => {
    if (process.env.NODE_ENV == "production") return;

    const allKeys = Object.keys({ ...latestProps.current, ...props });

    const changesObj = {};
    allKeys.forEach(key => {
      if (latestProps.current[key] !== props[key]) {
        changesObj[key] = {
          from: latestProps.current[key],
          to: props[key],
          isDeepEqual: isEqual(latestProps.current[key], props[key])
        };
      }
    });

    if (Object.keys(changesObj).length) {
      console.log("[why-did-you-update]", name, changesObj);
    } else {
      console.log("[why-did-you-update]", name, "no props changed");
    }

    latestProps.current = props;
  });
}
