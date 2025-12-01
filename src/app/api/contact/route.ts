import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // TODO: Integrate with a real email service (e.g., Resend, SendGrid, Nodemailer)
        // For now, we'll log it to the console to simulate sending.
        console.log("--------------------------------------------------");
        console.log("📧 NEW CONTACT FORM SUBMISSION");
        console.log(`From: ${name} <${email}>`);
        console.log(`Message: ${message}`);
        console.log("--------------------------------------------------");

        return NextResponse.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
