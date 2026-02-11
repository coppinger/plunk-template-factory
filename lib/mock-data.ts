import type {
  TemplateType,
  TemplateTypeInfo,
  SupabaseVariable,
  EmailTemplate,
  GlobalTemplate,
} from "./types";
import { BODY_PLACEHOLDER } from "./types";

export const templateTypes: TemplateTypeInfo[] = [
  {
    id: "confirm-signup",
    label: "Confirm Sign Up",
    description: "Sent when a new user signs up to confirm their email address",
    icon: "UserCheck",
    variables: [
      "{{ .ConfirmationURL }}",
      "{{ .Token }}",
      "{{ .TokenHash }}",
      "{{ .SiteURL }}",
      "{{ .Email }}",
    ],
  },
  {
    id: "invite-user",
    label: "Invite User",
    description: "Sent when an admin invites a new user to the platform",
    icon: "UserPlus",
    variables: [
      "{{ .ConfirmationURL }}",
      "{{ .Token }}",
      "{{ .TokenHash }}",
      "{{ .SiteURL }}",
      "{{ .Email }}",
    ],
  },
  {
    id: "magic-link",
    label: "Magic Link",
    description: "Sent when a user requests a passwordless login link",
    icon: "Sparkles",
    variables: [
      "{{ .ConfirmationURL }}",
      "{{ .Token }}",
      "{{ .TokenHash }}",
      "{{ .SiteURL }}",
      "{{ .Email }}",
    ],
  },
  {
    id: "change-email",
    label: "Change Email",
    description: "Sent when a user requests to change their email address",
    icon: "MailWarning",
    variables: [
      "{{ .ConfirmationURL }}",
      "{{ .Token }}",
      "{{ .TokenHash }}",
      "{{ .SiteURL }}",
      "{{ .Email }}",
      "{{ .NewEmail }}",
    ],
  },
  {
    id: "reset-password",
    label: "Reset Password",
    description: "Sent when a user requests a password reset",
    icon: "KeyRound",
    variables: [
      "{{ .ConfirmationURL }}",
      "{{ .Token }}",
      "{{ .TokenHash }}",
      "{{ .SiteURL }}",
      "{{ .Email }}",
    ],
  },
  {
    id: "reauthentication",
    label: "Reauthentication",
    description:
      "Sent when a user needs to re-verify their identity for a sensitive action",
    icon: "ShieldCheck",
    variables: [
      "{{ .Token }}",
      "{{ .TokenHash }}",
      "{{ .SiteURL }}",
      "{{ .Email }}",
    ],
  },
];

export const supabaseVariables: SupabaseVariable[] = [
  {
    name: "ConfirmationURL",
    syntax: "{{ .ConfirmationURL }}",
    description: "Full URL the user clicks to confirm the action",
    availableFor: [
      "confirm-signup",
      "invite-user",
      "magic-link",
      "change-email",
      "reset-password",
    ],
  },
  {
    name: "Token",
    syntax: "{{ .Token }}",
    description: "6-digit OTP code for verification",
    availableFor: [
      "confirm-signup",
      "invite-user",
      "magic-link",
      "change-email",
      "reset-password",
      "reauthentication",
    ],
  },
  {
    name: "TokenHash",
    syntax: "{{ .TokenHash }}",
    description: "Hashed version of the token for secure URL construction",
    availableFor: [
      "confirm-signup",
      "invite-user",
      "magic-link",
      "change-email",
      "reset-password",
      "reauthentication",
    ],
  },
  {
    name: "SiteURL",
    syntax: "{{ .SiteURL }}",
    description: "Base URL of your application (configured in Supabase)",
    availableFor: [
      "confirm-signup",
      "invite-user",
      "magic-link",
      "change-email",
      "reset-password",
      "reauthentication",
    ],
  },
  {
    name: "Email",
    syntax: "{{ .Email }}",
    description: "The user's email address",
    availableFor: [
      "confirm-signup",
      "invite-user",
      "magic-link",
      "change-email",
      "reset-password",
      "reauthentication",
    ],
  },
  {
    name: "NewEmail",
    syntax: "{{ .NewEmail }}",
    description: "The new email address the user is changing to",
    availableFor: ["change-email"],
  },
  {
    name: "RedirectTo",
    syntax: "{{ .RedirectTo }}",
    description: "URL to redirect to after the action is completed",
    availableFor: [
      "confirm-signup",
      "invite-user",
      "magic-link",
      "change-email",
      "reset-password",
    ],
  },
];

export const defaultGlobalTemplate: GlobalTemplate = {
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #e4e4e7;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">YourApp</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              ${BODY_PLACEHOLDER}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #a1a1aa; text-align: center;">
                This email was sent by <a href="{{ .SiteURL }}" style="color: #71717a; text-decoration: underline;">YourApp</a>.
                If you didn't request this, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

const confirmSignUpBody = `<h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                Confirm your email
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #52525b;">
                Thanks for signing up! Please confirm your email address to get started.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 8px; background-color: #18181b;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                Or use this OTP code: <strong style="color: #18181b; font-family: monospace; font-size: 16px; letter-spacing: 0.1em;">{{ .Token }}</strong>
              </p>`;

const inviteUserBody = `<h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                You've been invited
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #52525b;">
                You've been invited to join <strong style="color: #18181b;">YourApp</strong>. Click the button below to accept the invitation and set up your account.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 8px; background-color: #18181b;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                This invitation was sent to <strong>{{ .Email }}</strong>. If you weren't expecting this, you can ignore it.
              </p>`;

const magicLinkBody = `<h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                Your login link
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #52525b;">
                Click the button below to log in to your account. This link will expire in 10 minutes.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 8px; background-color: #18181b;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Log In to YourApp
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                Or use this OTP code: <strong style="color: #18181b; font-family: monospace; font-size: 16px; letter-spacing: 0.1em;">{{ .Token }}</strong>
              </p>`;

const changeEmailBody = `<h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                Confirm email change
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #52525b;">
                We received a request to change your email from <strong>{{ .Email }}</strong> to <strong>{{ .NewEmail }}</strong>. Please confirm this change by clicking the button below.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 8px; background-color: #18181b;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Confirm Email Change
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                If you didn't request this change, please secure your account immediately.
              </p>`;

const resetPasswordBody = `<h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                Reset your password
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #52525b;">
                We received a request to reset the password for your account. Click the button below to choose a new password.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 8px; background-color: #18181b;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                Or use this OTP code: <strong style="color: #18181b; font-family: monospace; font-size: 16px; letter-spacing: 0.1em;">{{ .Token }}</strong>
              </p>`;

const reauthenticationBody = `<h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                Verify your identity
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #52525b;">
                Enter the following verification code to confirm your identity. This code will expire in 5 minutes.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center" style="padding: 24px; background-color: #f4f4f5; border-radius: 8px;">
                    <span style="font-size: 32px; font-weight: 700; font-family: monospace; color: #18181b; letter-spacing: 0.2em;">{{ .Token }}</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                If you didn't request this code, someone may be trying to access your account. Please secure your account.
              </p>`;

// Variant: minimal confirm signup
const confirmSignUpMinimalBody = `<h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #18181b;">
                Confirm your email
              </h1>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 22px; color: #52525b;">
                Click below to verify <strong>{{ .Email }}</strong>.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 10px 24px; font-size: 13px; font-weight: 600; color: #ffffff; background-color: #18181b; text-decoration: none; border-radius: 6px;">
                Verify Email
              </a>`;

// Variant: branded confirm signup
const confirmSignUpBrandedBody = `<div style="text-align: center;">
                <div style="margin-bottom: 24px;">
                  <span style="display: inline-block; width: 48px; height: 48px; background-color: #8b5cf6; border-radius: 12px; line-height: 48px; text-align: center; font-size: 24px; color: #ffffff; font-weight: 700;">Y</span>
                </div>
                <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; letter-spacing: -0.02em;">
                  Welcome to YourApp!
                </h1>
                <p style="margin: 0 0 32px; font-size: 15px; line-height: 24px; color: #52525b;">
                  We're excited to have you on board. Confirm your email to unlock all features.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td style="border-radius: 8px; background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                      <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                        Get Started
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 32px 0 0; font-size: 13px; line-height: 20px; color: #a1a1aa;">
                  Your verification code: <strong style="color: #8b5cf6; font-family: monospace; font-size: 15px;">{{ .Token }}</strong>
                </p>
              </div>`;

export const emailTemplates: EmailTemplate[] = [
  {
    type: "confirm-signup",
    subject: "Confirm your email address",
    bodyHtml: confirmSignUpBody,
    variants: [
      {
        id: "default",
        name: "Default",
        subject: "Confirm your email address",
        bodyHtml: confirmSignUpBody,
      },
      {
        id: "minimal",
        name: "Minimal",
        subject: "Verify your email",
        bodyHtml: confirmSignUpMinimalBody,
      },
      {
        id: "branded",
        name: "Branded",
        subject: "Welcome to YourApp - Confirm your email",
        bodyHtml: confirmSignUpBrandedBody,
      },
    ],
  },
  {
    type: "invite-user",
    subject: "You've been invited to join YourApp",
    bodyHtml: inviteUserBody,
    variants: [
      {
        id: "default",
        name: "Default",
        subject: "You've been invited to join YourApp",
        bodyHtml: inviteUserBody,
      },
    ],
  },
  {
    type: "magic-link",
    subject: "Your login link for YourApp",
    bodyHtml: magicLinkBody,
    variants: [
      {
        id: "default",
        name: "Default",
        subject: "Your login link for YourApp",
        bodyHtml: magicLinkBody,
      },
    ],
  },
  {
    type: "change-email",
    subject: "Confirm your email change",
    bodyHtml: changeEmailBody,
    variants: [
      {
        id: "default",
        name: "Default",
        subject: "Confirm your email change",
        bodyHtml: changeEmailBody,
      },
    ],
  },
  {
    type: "reset-password",
    subject: "Reset your password",
    bodyHtml: resetPasswordBody,
    variants: [
      {
        id: "default",
        name: "Default",
        subject: "Reset your password",
        bodyHtml: resetPasswordBody,
      },
    ],
  },
  {
    type: "reauthentication",
    subject: "Your verification code",
    bodyHtml: reauthenticationBody,
    variants: [
      {
        id: "default",
        name: "Default",
        subject: "Your verification code",
        bodyHtml: reauthenticationBody,
      },
    ],
  },
];
