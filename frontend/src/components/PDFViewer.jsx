import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer = ({ url }) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const loadPDF = async () => {
			try {
				const loadingTask = pdfjsLib.getDocument(url);
				const pdf = await loadingTask.promise;
				const page = await pdf.getPage(1);
				const scale = 1.5;
				const viewport = page.getViewport({ scale });

				const canvas = canvasRef.current;
				const context = canvas.getContext("2d");
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				const renderContext = {
					canvasContext: context,
					viewport: viewport,
				};
				await page.render(renderContext);
			} catch (error) {
				console.error("Error loading PDF:", error);
			}
		};

		loadPDF();
	}, [url]);

	return <canvas ref={canvasRef} />;
};

export default PDFViewer;
