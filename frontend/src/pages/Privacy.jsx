// ============================================
// FILE: src/pages/Privacy.jsx - NEW
// ============================================
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Shield, Eye, Lock, Users, Mail, Phone, MapPin, Calendar, FileText, AlertTriangle } from "lucide-react";

const Privacy = () => {
  const lastUpdated = "December 5, 2024";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 mr-4" />
              <h1 className="text-4xl md:text-5xl font-heading font-bold">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-4">
              Your privacy matters to us. Learn how we collect, use, and protect your personal information.
            </p>
            <Badge variant="secondary" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: {lastUpdated}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                TechAge Africa ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services,
                or interact with our platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share
                your information with anyone except as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <p className="text-muted-foreground mb-3">
                  We may collect personally identifiable information that you provide directly to us:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Name and Contact Information:</strong> Full name, email address, phone number</li>
                  <li><strong>Account Information:</strong> Username, password, profile picture</li>
                  <li><strong>Educational Information:</strong> Course enrollments, progress, certificates earned</li>
                  <li><strong>Payment Information:</strong> Payment method details, billing address, transaction history</li>
                  <li><strong>Communication Data:</strong> Messages, feedback, support requests</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-3">
                  We automatically collect certain information when you use our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, course interaction data</li>
                  <li><strong>Location Data:</strong> General location based on IP address</li>
                  <li><strong>Cookies and Tracking:</strong> See our Cookie Policy section below</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use the collected information for various purposes:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Service Delivery</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Provide and maintain our educational platform</li>
                    <li>Process course enrollments and payments</li>
                    <li>Deliver certificates and track progress</li>
                    <li>Send important service notifications</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Communication</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Respond to your inquiries and support requests</li>
                    <li>Send newsletters and educational updates</li>
                    <li>Provide customer service assistance</li>
                    <li>Send marketing communications (with consent)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Platform Improvement</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Analyze usage patterns and improve services</li>
                    <li>Develop new features and courses</li>
                    <li>Conduct research and analytics</li>
                    <li>Monitor platform performance and security</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Legal Compliance</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Comply with legal obligations</li>
                    <li>Prevent fraud and ensure security</li>
                    <li>Enforce our Terms of Service</li>
                    <li>Protect our rights and those of others</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Cookies and Tracking Technologies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">What Are Cookies?</h3>
                <p className="text-muted-foreground">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better
                  browsing experience and allow certain features to work properly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Types of Cookies We Use</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Essential Cookies</h4>
                      <Badge variant="default">Always Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      These cookies are necessary for the website to function and cannot be switched off. They include cookies for security,
                      authentication, and basic site functionality.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Analytics Cookies</h4>
                      <Badge variant="secondary">Optional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                      This helps us improve our website and services.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Marketing Cookies</h4>
                      <Badge variant="secondary">Optional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      These cookies are used to track visitors across websites to display ads that are relevant to their interests. They may be
                      set by our advertising partners.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Managing Cookies</h3>
                <p className="text-muted-foreground mb-3">
                  You can control and manage cookies in various ways:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Use our cookie consent banner to accept or reject different types of cookies</li>
                  <li>Adjust your browser settings to block or delete cookies</li>
                  <li>Visit our cookie preferences page to change your settings</li>
                  <li>Note that disabling certain cookies may affect website functionality</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Providers</h4>
                  <p className="text-sm text-muted-foreground">
                    We may share your information with trusted third-party service providers who assist us in operating our platform,
                    processing payments, or providing services. These providers are contractually obligated to protect your data.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Legal Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    We may disclose your information if required by law, court order, or government request, or to protect our rights,
                    property, or safety, or that of our users or the public.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Business Transfers</h4>
                  <p className="text-sm text-muted-foreground">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
                    We will notify you before your information is transferred and becomes subject to a different privacy policy.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">With Your Consent</h4>
                  <p className="text-sm text-muted-foreground">
                    We may share your information with your explicit consent for specific purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Secure password hashing and storage</li>
                    <li>Regular security audits and updates</li>
                    <li>Firewall and intrusion detection systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Organizational Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Limited access to personal data</li>
                    <li>Employee training on data protection</li>
                    <li>Regular backup and disaster recovery</li>
                    <li>Data minimization practices</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Important Notice</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your
                      personal information, we cannot guarantee absolute security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Access and Portability</h4>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of your personal data and information about how it's processed.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rectification</h4>
                    <p className="text-sm text-muted-foreground">
                      Request correction of inaccurate or incomplete personal data.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Erasure</h4>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your personal data under certain circumstances.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Restriction</h4>
                    <p className="text-sm text-muted-foreground">
                      Request limitation of how we process your personal data.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Objection</h4>
                    <p className="text-sm text-muted-foreground">
                      Object to processing of your personal data for certain purposes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Withdraw Consent</h4>
                    <p className="text-sm text-muted-foreground">
                      Withdraw consent for processing based on consent at any time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How to Exercise Your Rights</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  To exercise any of these rights, please contact us using the information provided below. We will respond to your request
                  within 30 days and may ask for verification of your identity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy:
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Account Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Retained while your account is active and for a reasonable period after account closure for legal and regulatory purposes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Course and Progress Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Retained indefinitely to maintain your learning history and certificate validity, unless you request deletion.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Payment Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Retained for 7 years for tax and accounting purposes, after which it is securely deleted.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Analytics Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Aggregated and anonymized data may be retained indefinitely for analytical purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Data Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                TechAge Africa is based in Nigeria, and your information may be transferred to, processed, and stored in countries other than your own.
                We ensure that such transfers comply with applicable data protection laws.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Data Hosting</h4>
                  <p className="text-sm text-muted-foreground">
                    Your data may be hosted on servers located in various countries, including but not limited to Nigeria, the United States,
                    and European Union member states.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Service Providers</h4>
                  <p className="text-sm text-muted-foreground">
                    We use service providers located in different countries who help us operate our platform. These providers are selected
                    for their compliance with data protection standards.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Legal Safeguards</h4>
                  <p className="text-sm text-muted-foreground">
                    Where required, we implement appropriate safeguards such as standard contractual clauses or adequacy decisions
                    to ensure your data is protected during international transfers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
              <p className="text-muted-foreground">
                If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us
                so that we can take necessary action.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Changes to This Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
                and updating the "Last updated" date.
              </p>
              <p className="text-muted-foreground">
                We will also notify you via email or a prominent notice on our platform of any material changes. Your continued use of our services
                after such modifications constitutes acceptance of the updated Privacy Policy.
              </p>
              <p className="text-muted-foreground">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary-200 dark:border-primary-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="font-semibold">Email:</span>
                  </div>
                  <a href="mailto:privacy@techageafrica.com" className="text-primary-600 hover:underline ml-6">
                    privacy@techageafrica.com
                  </a>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="font-semibold">Phone:</span>
                  </div>
                  <a href="tel:+2341234567890" className="text-primary-600 hover:underline ml-6">
                    +234 123 456 7890
                  </a>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="font-semibold">Address:</span>
                  </div>
                  <address className="text-muted-foreground ml-6 not-italic">
                    TechAge Africa<br />
                    123 Innovation Drive<br />
                    Lagos, Nigeria<br />
                    100001
                  </address>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mt-6">
                <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                <p className="text-sm text-muted-foreground">
                  For data protection related inquiries, you can contact our Data Protection Officer at{' '}
                  <a href="mailto:dpo@techageafrica.com" className="text-primary-600 hover:underline">
                    dpo@techageafrica.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-muted-foreground text-sm">
            <p>
              This Privacy Policy is effective as of {lastUpdated} and will remain in effect except with respect to any changes in its provisions
              in the future, which will be in effect immediately after being posted on this page.
            </p>
            <p className="mt-2">
              TechAge Africa is committed to protecting your privacy and ensuring transparency in our data practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;