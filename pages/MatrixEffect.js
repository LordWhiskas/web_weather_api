import React, { useRef, useEffect } from "react";
import styles from '../Weather.module.css'; // Импортировать CSS файл

export default function MatrixEffect() {
    const canvasRef = React.useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789@$%&";
        const charactersArray = characters.split("");
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);


        const drops = [];
        const word = ["W", "E", "B", "-", "A", "P", "I"];
        const wordStart =
            Math.floor(columns / 2) - Math.floor(word.length / 2);
        const targetY = Math.floor(canvas.height / (2 * fontSize));

        const dropDelays = new Array(columns).fill(0);

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
            if (i >= wordStart && i < wordStart + word.length) {
                dropDelays[i] = (i - wordStart + 1) * 30; // Delay for each letter, adjust 30 for speed
            }
        }

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0F0"; // color of characters
            ctx.font = fontSize + "px arial";

            for (let i = 0; i < drops.length; i++) {
                let text;

                if (dropDelays[i] > 0) {
                    dropDelays[i]--;
                    continue;
                }

                if (
                    i >= wordStart &&
                    i < wordStart + word.length &&
                    drops[i] <= targetY
                ) {
                    text = word[i - wordStart];
                } else {
                    text =
                        charactersArray[
                            Math.floor(Math.random() * charactersArray.length)
                            ];
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                } else if (
                    !(
                        i >= wordStart &&
                        i < wordStart + word.length &&
                        drops[i] >= targetY
                    )
                ) {
                    drops[i]++;
                }
            }
        }

        const intervalId = setInterval(draw, 32);
        return () => clearInterval(intervalId); // Очистка на случай, если компонент будет размонтирован
    }, []);

    return (
        <div className={styles.canvasContainer}>
            <canvas id="canvas" ref={canvasRef} className={styles.canvas} />
        </div>
    );
}
