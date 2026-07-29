const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generar-cuento', async (req, res) => {
    try {
        const { nombre, edad, tema, elementos } = req.body;
        const prompt = `Eres un experto escritor de cuentos infantiles. Crea un cuento corto para un niño llamado ${nombre} de ${edad} años. El tema principal debe ser: ${tema}. Debe incluir estos elementos: ${elementos}. IMPORTANTE: Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura: {"titulo": "Título", "historia": "Texto", "moraleja": "Moraleja"}`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const cuentoData = JSON.parse(cleanJsonString);

        res.status(200).json(cuentoData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Hubo un error al generar el cuento." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor de Cuentos IA corriendo en el puerto ${PORT}`));
