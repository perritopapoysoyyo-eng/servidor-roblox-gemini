const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { mensaje, contextoJuego } = req.body;

        if (!mensaje) {
            return res.status(400).json({ error: "Falta el mensaje" });
        }

        const promptSistema = `
        Eres 'AxolBot', un asistente de inteligencia artificial integrado en un chat flotante dentro de Roblox.
        Tu misión es responder al jugador de manera amigable, clara y breve.
        IMPORTANTE: Responde SIEMPRE en idioma español.
        
        Información del jugador en Roblox: ${JSON.stringify(contextoJuego || {})}
        Mensaje recibido del usuario: ${mensaje}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptSistema,
        });

        res.json({ respuesta: response.text });
    } catch (error) {
        console.error("Error en la API de Gemini:", error);
        res.status(500).json({ error: "Error interno al comunicarse con Gemini." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
