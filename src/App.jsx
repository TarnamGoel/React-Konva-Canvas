import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import { FiMenu, FiX } from "react-icons/fi";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants";

export default function App() {
  const stageRef = useRef();
  const [action, setAction] = useState(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState("#ff0000");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [scribbles, setScribbles] = useState([]);

  const strokeColor = "#000";
  const isPaining = useRef();
  const currentShapeId = useRef();
  const transformerRef = useRef();

  const isDraggable = action === ACTIONS.SELECT;

  const [isOpen, setIsOpen] = useState(true);

  function onPointerDown() {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();

    currentShapeId.current = id;
    isPaining.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            id,
            x,
            y,
            height: 20,
            width: 20,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillColor,
          },
        ]);
        break;

      case ACTIONS.ARROW:
        setArrows((arrows) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
          },
        ]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillColor,
          },
        ]);
        break;
    }
  }
  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPaining.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
    }
  }

  function onPointerUp() {
    isPaining.current = false;
  }

  function handleExport() {
    const uri = stageRef.current.toDataURL();
    var link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onClick(e) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Controls */}
        <div className="absolute right-0 top-0 z-10 w-fit py-2 ">


          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-0 right-0 m-2 p-1 bg-violet-100 rounded hover:bg-violet-300 z-2"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          {isOpen && (
            <div className="flex flex-col mt-8 justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
              <button
                className={
                  (action === ACTIONS.SELECT
                    ? "bg-violet-300"
                    : "hover:bg-violet-100") + " p-1 rounded w-full"
                }
                onClick={() => setAction(ACTIONS.SELECT)}
              >
                <div className="flex items-center text-[22px]">
                  <GiArrowCursor size={"2rem"} />
                  <span>Select</span>
                </div>
              </button>
              <button
                className={
                  (action === ACTIONS.RECTANGLE
                    ? "bg-violet-300"
                    : "hover:bg-violet-100") + " p-1 rounded w-full"
                }
                onClick={() => setAction(ACTIONS.RECTANGLE)}
              >
                <div className="flex items-center text-[22px] gap-1">
                  <TbRectangle size={"2rem"} />
                  <span>Rectangle</span>
                </div>
              </button>
              <button
                className={
                  (action === ACTIONS.CIRCLE
                    ? "bg-violet-300"
                    : "hover:bg-violet-100") + " p-1 rounded w-full"
                }
                onClick={() => setAction(ACTIONS.CIRCLE)}
              >
                <div className="flex items-center text-[22px] w-full gap-1">
                  <FaRegCircle size={"1.5rem"} />
                  <span>Circle</span>
                </div>
              </button>
              <button
                className={
                  (action === ACTIONS.ARROW
                    ? "bg-violet-300"
                    : "hover:bg-violet-100") + " p-1 rounded w-full gap-1"
                }
                onClick={() => setAction(ACTIONS.ARROW)}
              >
                <div className="flex text-[22px] gap-1">
                  <FaLongArrowAltRight size={"2rem"} />
                  <span>Arrow</span>
                </div>
              </button>
              <button
                className={
                  (action === ACTIONS.SCRIBBLE
                    ? "bg-violet-300"
                    : "hover:bg-violet-100") + " p-1 rounded w-full gap-1"
                }
                onClick={() => setAction(ACTIONS.SCRIBBLE)}
              >
                <div className="flex items-center text-[22px] gap-1">
                  <LuPencil size={"1.5rem"} />
                  <span>Pen</span>
                </div>
              </button>

              <button className="w-full">
                <div className="flex items-center text-[22px] gap-1">
                  <input
                    className="w-6 h-6"
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                  />
                  <span>Color</span>
                </div>
              </button>

              <button onClick={handleExport} className="w-full">
                <div className="flex items-center text-[22px] gap-1">
                  <IoMdDownload size={"1.5rem"} />
                  <span>Download</span>
                </div>
              </button>
            </div>
          )}


        </div>
        {/* Canvas */}
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              height={window.innerHeight}
              width={window.innerWidth}
              fill="#ffffff"
              id="bg"
              onClick={() => {
                transformerRef.current.nodes([]);
              }}
            />

            {rectangles.map((rectangle) => (
              <Rect
                key={rectangle.id}
                x={rectangle.x}
                y={rectangle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            {circles.map((circle) => (
              <Circle
                key={circle.id}
                radius={circle.radius}
                x={circle.x}
                y={circle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={circle.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}
            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={arrow.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                lineCap="round"
                lineJoin="round"
                points={scribble.points}
                stroke={strokeColor}
                strokeWidth={2}
                fill={scribble.fillColor}
                draggable={isDraggable}
                onClick={onClick}
              />
            ))}

            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </>
  );
}
