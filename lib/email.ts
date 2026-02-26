import { Resend } from 'resend';
import StatusUpdateEmail from '@/components/emails/StatusUpdateEmail';

// Safely initialize Resend only if the key exists (prevents crashes in dev environments missing the key)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendApplicationStatusEmail(
    toEmail: string,
    jobTitle: string,
    companyName: string,
    newStatus: string,
    seekerName: string
) {
    if (!resend) {
        console.warn('RESEND_API_KEY is not set. Mocking email send to:', toEmail, 'Status:', newStatus);
        return { success: true, mocked: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'SkillMatch AI ATS <notifications@resend.dev>', // resend.dev is the default testing domain
            to: [toEmail],
            subject: `Update on your application for ${jobTitle} at ${companyName}`,
            react: StatusUpdateEmail({
                jobTitle,
                companyName,
                newStatus,
                seekerName,
            }) as React.ReactElement,
        });

        if (error) {
            console.error('Error sending Resend email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Exception during email send:', err);
        return { success: false, error: err };
    }
}
