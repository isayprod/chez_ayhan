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
    const deliveryMode =
      formData.deliveryMode === 'delivery'
        ? 'Livraison à domicile'
        : 'À emporter';

    // Construire l'URL de suivi de commande
    const orderNumber = formData.orderNumber || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const trackingUrl = `${baseUrl}/orders/${orderNumber}`;

    const emailContent = `
      <h2>Nouvelle Commande de Lahmacun</h2>
      ${orderNumber ? `<p><strong>Numéro de commande:</strong> ${orderNumber}</p>` : ''}
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
      ${
        orderNumber
          ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <h3 style="margin-top: 0;">Suivre cette commande</h3>
        <p>Vous pouvez suivre l'état de cette commande en visitant le lien suivant:</p>
        <a href="${trackingUrl}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #ff5722; color: white; text-decoration: none; border-radius: 4px;">Suivre ma commande</a>
      </div>
      `
          : ''
      }
    `;

    console.log(process.env.EMAIL_SERVER_HOST);
    console.log(process.env.EMAIL_SERVER_PORT);
    console.log(process.env.EMAIL_SERVER_SECURE);
    console.log(process.env.EMAIL_SERVER_USER);

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
      }
    });

    // Send the email
    const subject = orderNumber
      ? `Commande #${orderNumber} - Lahmacun - ${formData.name}`
      : `Nouvelle Commande de Lahmacun - ${formData.name}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject,
      html: emailContent
    });

    console.log('to', to);
    console.log('formData', formData);

    // Si un numéro de commande est disponible, envoyons également une confirmation au client
    if (formData.orderNumber && formData.email) {
      const clientEmailContent = `
        <h2>Confirmation de votre commande chez Chez Ayhan</h2>
        <p>Bonjour ${formData.name},</p>
        <p>Nous vous confirmons que votre commande a bien été reçue.</p>
        <p><strong>Numéro de commande:</strong> ${orderNumber}</p>
        <p><strong>Quantité:</strong> ${formData.quantity}</p>
        <p><strong>Mode de livraison:</strong> ${deliveryMode}</p>
        ${formData.deliveryMode === 'delivery' ? `<p><strong>Adresse de livraison:</strong> ${formData.address}</p>` : ''}
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <h3 style="margin-top: 0;">Suivre votre commande</h3>
          <p>Vous pouvez suivre l'état de votre commande en temps réel en cliquant sur le bouton ci-dessous:</p>
          <a href="${trackingUrl}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #ff5722; color: white; text-decoration: none; border-radius: 4px;">Suivre ma commande</a>
        </div>
        <p>Merci de votre confiance!</p>
        <p>L'équipe de Chez Ayhan</p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: formData.email,
        subject: `Confirmation de votre commande #${orderNumber} - Chez Ayhan`,
        html: clientEmailContent
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
