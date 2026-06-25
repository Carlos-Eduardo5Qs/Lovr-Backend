exports.uploadCards = (req, res) => {
    const { user_id, message, position } = req.body;
    const imageBuffer = req.file.buffer
    const mimeType = req.file.mimetype;

    if (!user_id || !message || !position || !imageBuffer || !mimeType) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    console.log('');
    console.log('Os dados foram recebidos no backend');
    console.log('User ID:', user_id);
    console.log('Message:', message);
    console.log('Position:', position);
    console.log('Image Buffer:', imageBuffer);
    console.log('MIME Type:', mimeType);
    console.log('');

    return res.status(200).json({ message: 'Cards uploaded successfully'});
};
