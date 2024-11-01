'use client'
import { useRef } from "react";
import { motion} from 'framer-motion';

const NUM_ROWS = 14;
const NUM_COLS = 30;
export default function StarGrid() {
  const containerRef = useRef(null)

  const getOrder = (rows: number, cols: number) => {
    const order = [];
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    for (let layer = 0; layer <= Math.max(centerRow, centerCol); layer++) {
      for (let i = -layer; i <= layer; i++) {
        for (let j = -layer; j <= layer; j++) {
          if (Math.abs(i) === layer || Math.abs(j) === layer) {
            const newRow = centerRow + i;
            const newCol = centerCol + j;
            // Ensure indices are within bounds
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              order.push([newRow, newCol]);
            }
          }
        }
      }
    }
    return order;
  };
  const order = getOrder(NUM_ROWS, NUM_COLS);
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotateZ: Math.floor(Math.random() * 361),
    },
    visible: (i) => ({
      opacity: [0.2, 1, 0.4],
      scale: [1, 2, 1],   // Move right and back
      rotateZ: 360,
      transition: {
        // delay: i * 0.005 - 0.3, // Adjust delay for staggering effect
        delay: i * 0.004 - 0.5,
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        rotateZ: {
          duration: 0.5,
          delay: i * 0.01 - 0.8,
        }
      },
    }),
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="blue"
      viewBox="0 0 935 425"
      className="absolute -top-16 -z-0"
      id="star-grid"
      ref={containerRef}
      opacity={1}
      style={{
        maskImage: "linear-gradient(black, transparent)",
      }}
    >
      <g className="star-grid-group">
        {order.map((coords, customIndex) => {
          const [i, j] = coords;
          return (
            <motion.path
              custom={customIndex}
              initial="hidden"
              animate="visible"
              variants={variants}
              key={`${i}-${j}`} // Ensure the key is unique
              fill="currentColor"
              opacity=".2"
              style={{
                transformOrigin: 'center',
                transform: `rotate(${Math.PI / 6})`
              }}
              className="star-grid-item"
              d={`M${j * 32},${i * 32 + 10}a0.14,0.14,0,0,1,0.26,0l0.14,0.36a2.132,2.132,0,0,0,1.27,1.27l0.37,0.14a0.14,0.14,0,0,1,0,0.26l-0.37,0.14a2.132,2.132,0,0,0,-1.27,1.27l-0.14,0.37a0.14,0.14,0,0,1,-0.26,0l-0.14,-0.37a2.132,2.132,0,0,0,-1.27,-1.27l-0.36,-0.14a0.14,0.14,0,0,1,0,-0.26l0.37,-0.14a2.132,2.132,0,0,0,1.26,-1.27l0.14,-0.36z`}
            />
          );
        })}
      </g>
    </svg>
  );
}