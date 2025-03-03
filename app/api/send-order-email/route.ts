import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, formData } = await req.json();

    if (!to || !formData) {
      return NextResponse.json(
        { error: 'Destinataire ou données du formulaire manquants' },
        { status: 400 }
      );
    }

    // Format the email content in French
    const deliveryMode = formData.deliveryMode === 'delivery' 
      ? 'Livraison à domicile' 
      : 'À emporter';

    const emailContent = `
      <h2>Nouvelle Commande de Lahmacun</h2>
      <p><strong>Nom:</strong> ${formData.name}</p>
      <p><strong>Téléphone:</strong> ${formData.phone}</p>
      <p><strong>Quantité:</strong> ${formData.quantity}</p>
      <p><strong>Mode de livraison:</strong> ${deliveryMode}</p>
      ${formData.deliveryMode === 'delivery' ? `<p><strong>Adresse:</strong> ${formData.address}</p>` : ''}
      ${formData.notes ? `<p><strong>Notes spéciales:</strong> ${formData.notes}</p>` : ''}
      <p><em>Commande reçue le ${new Date().toLocaleString('fr-FR', { 
        dateStyle: 'full', 
        timeStyle: 'medium' 
      })}</em></p>
    `;

  console.log(process.env.EMAIL_SERVER_HOST);
  console.log(process.env.EMAIL_SERVER_PORT);
  console.log(process.env.EMAIL_SERVER_SECURE);
  console.log(process.env.EMAIL_SERVER_USER);
  console.log(process.env.EMAIL_CLIENT_ID);
  console.log(process.env.EMAIL_CLIENT_SECRET);
  console.log(process.env.EMAIL_REFRESH_TOKEN);
  console.log(process.env.EMAIL_ACCESS_TOKEN);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: Boolean(process.env.EMAIL_SERVER_SECURE) || false,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_SERVER_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: process.env.EMAIL_ACCESS_TOKEN
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject: `Nouvelle Commande de Lahmacun - ${formData.name}`,
      html: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
} 