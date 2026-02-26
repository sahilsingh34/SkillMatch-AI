import React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Heading,
    Hr,
    Preview,
    Tailwind
} from '@react-email/components';

interface StatusUpdateEmailProps {
    jobTitle: string;
    companyName: string;
    newStatus: string;
    seekerName: string;
}

const statusColors: Record<string, string> = {
    'APPLIED': 'text-blue-500',
    'SCREENING': 'text-purple-500',
    'INTERVIEW': 'text-amber-500',
    'OFFERED': 'text-emerald-500',
    'REJECTED': 'text-rose-500',
};

const statusMessages: Record<string, string> = {
    'APPLIED': 'Your application has been received and is currently in the initial applied state.',
    'SCREENING': 'Great news! Your application has moved to the screening phase. The recruiting team is currently reviewing your profile.',
    'INTERVIEW': 'Congratulations! You have been selected for an interview. The recruiting team will reach out with details soon.',
    'OFFERED': 'Incredible news! An offer has been extended for this position. Please check your external communications for the official offer packet.',
    'REJECTED': 'Thank you for applying. Unfortunately, the team has decided not to move forward with your application at this time.',
};

export default function StatusUpdateEmail({
    jobTitle = "Software Engineer",
    companyName = "Acme Corp",
    newStatus = "INTERVIEW",
    seekerName = "Applicant"
}: StatusUpdateEmailProps) {

    const colorClass = statusColors[newStatus.toUpperCase()] || 'text-gray-500';
    const message = statusMessages[newStatus.toUpperCase()] || 'Your application status has been updated.';

    return (
        <Html>
            <Head />
            <Preview>Update: Your application for {jobTitle}</Preview>
            <Tailwind>
                <Body className="bg-gray-50 font-sans">
                    <Container className="mx-auto py-10 px-4 max-w-xl">
                        <Section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-slate-950 p-6 text-center">
                                <Heading className="text-white m-0 text-2xl font-bold tracking-tight">
                                    SkillMatch AI
                                </Heading>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <Text className="text-gray-700 text-lg mb-6">
                                    Hi {seekerName},
                                </Text>

                                <Text className="text-gray-600 mb-2">
                                    There has been an update regarding your application for the <strong>{jobTitle}</strong> role at <strong>{companyName}</strong>.
                                </Text>

                                <div className="bg-slate-50 border border-slate-100 rounded-md p-6 text-center my-8">
                                    <Text className="text-sm font-semibold text-gray-400 tracking-wider uppercase m-0 mb-2">
                                        Current ATS Status
                                    </Text>
                                    <Heading className={`m-0 text-3xl font-black tracking-tight ${colorClass.replace('text-', 'text-')}`}>
                                        {newStatus.toUpperCase()}
                                    </Heading>
                                </div>

                                <Text className="text-gray-700 leading-relaxed text-base mb-8">
                                    {message}
                                </Text>

                                <Hr className="border-gray-200 mt-8 mb-6" />

                                <Text className="text-xs text-gray-400 text-center leading-relaxed">
                                    This is an automated message triggered by the recruiter via the SkillMatch AI platform. You can track all your active applications in real-time on your Job Seeker Dashboard.
                                </Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
