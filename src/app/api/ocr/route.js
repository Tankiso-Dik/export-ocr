import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image'); // 'image' is the field name from the frontend

        if (!file) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        const ocrSpaceApiKey = 'K85751721288957'; // Your OCR.space API key
        const ocrSpaceUrl = 'https://api.ocr.space/parse/image';

        const ocrFormData = new FormData();
        ocrFormData.append('base64Image', `data:${file.type};base64,${base64Image}`);
        ocrFormData.append('language', 'eng'); // You can change the language
        ocrFormData.append('isOverlayRequired', 'true');
        ocrFormData.append('apikey', ocrSpaceApiKey);

        const ocrResponse = await fetch(ocrSpaceUrl, {
            method: 'POST',
            body: ocrFormData,
        });

        if (!ocrResponse.ok) {
            throw new Error(`OCR.space API error! status: ${ocrResponse.status}`);
        }

        const ocrData = await ocrResponse.json();

        if (ocrData.IsErroredOnProcessing) {
            console.error('OCR.space Error:', ocrData.ErrorMessage);
            return NextResponse.json({ error: ocrData.ErrorMessage.join(', ') }, { status: 500 });
        }

        const parsedText = ocrData.ParsedResults[0]?.ParsedText || 'No text found.';

        return NextResponse.json({ text: parsedText }, { status: 200 });
    } catch (error) {
        console.error('OCR API error:', error);
        return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
    }
}
