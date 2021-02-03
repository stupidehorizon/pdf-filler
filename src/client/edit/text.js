import React, { useRef } from "react";

const Text = ({ config, setActiveItem, updateConfig }) => {
  const isMoving = useRef(false);
  const mouseDiffTextTop = useRef(0);
  const mouseDiffTextLeft = useRef(0);

  const ref = useRef();

  const onDragStart = (e) => {
    const target = e.target;
    const mouseTop = e.clientY;
    const mouseLeft = e.clientX;
    const inputTop = target.offsetTop;
    const inputLeft = target.offsetLeft;
    mouseDiffTextTop.current = mouseTop - inputTop;
    mouseDiffTextLeft.current = mouseLeft - inputLeft;
    isMoving.current = true;
    console.log(config);
    setActiveItem(config);
  };

  // input drag
  const onDrag = (e) => {
    if (isMoving.current) {
      const mouseTop = e.clientY;
      const mouseLeft = e.clientX;
      config.top = mouseTop - mouseDiffTextTop.current;
      config.left = mouseLeft - mouseDiffTextLeft.current;
      updateConfig(config);
    }
  };

  // input move
  const onDragEnd = (e) => {
    isMoving.current = false;
  };

  const onFieldChange = (e) => {
    updateConfig({
      ...config,
      field: e.target.value
    });
  };

  const { top, left, fontSize, fontColor, field } = config;
  return (
    <input
      style={{
        top: `${top}px`,
        left: `${left}px`,
        fontSize: `${fontSize}px`,
        color: `${fontColor}`,
      }}
      ref={ref}
      className="text-item"
      onMouseDown={onDragStart}
      onMouseMove={onDrag}
      onMouseUp={onDragEnd}
      onChange={onFieldChange}
      value={field}
    ></input>
  );
};

export default Text;
