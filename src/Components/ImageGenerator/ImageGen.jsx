import React, { useRef, useState } from 'react'
import default_image from "../assets/default_image.svg"

const ImageGen = () => {
    const [image_url, setimage_url] = useState("/");
    const [isLoading, setIsLoading] = useState(false);
    let inputRef = useRef(null);
    const generateImage = async () => {
        if (inputRef.current.value === "") return;

        setIsLoading(true);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: inputRef.current.value }
                            ]
                        }
                    ],
                    generationConfig: {
                        response_modalities: ["IMAGE", "TEXT"]
                    }
                })
            });

            const data = await response.json();
            console.log(data);

            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                for (const part of data.candidates[0].content.parts) {
                    if (part.text) {
                        console.log("Text response:", part.text);
                    } else if (part.inlineData) {
                        const imageData = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType || "image/png";
                        setimage_url(`data:${mimeType};base64,${imageData}`);
                        console.log("Image generated successfully");
                    }
                }
            }
        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div
            className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
            <h1 className='font-bold text-zinc-50 text-3xl'>
                AI Image
                <span className='text-purple-950'>Generator</span>
            </h1>            <div className="relative">
                <img src={image_url === "/" ? default_image : image_url} alt=""
                    className='w-96 h-96 mt-10 rounded-xl shadow-xl shadow-purple-950/50'
                />

                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 mt-10 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            {/* Spinner */}
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                            <p className="text-white font-semibold">Generating image...</p>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex flex-row items-center justify-center mt-10'>
                <input type="text"
                    ref={inputRef}
                    className='w-96 h-12 rounded-s-xl shadow-xl shadow-purple-950/50 p-4 text-zinc-900 text-lg'
                />                <button
                    className={`w-36 h-12 rounded-r-xl text-zinc-50 font-bold text-md shadow-xl shadow-purple-950/50 transition-colors ${isLoading
                            ? 'bg-purple-700 cursor-not-allowed'
                            : 'bg-purple-950 hover:bg-purple-800'
                        }`}
                    onClick={generateImage}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Loading...
                        </div>
                    ) : (
                        'Generate Image'
                    )}
                </button>
            </div>

        </div>
    )
}

export default ImageGen
